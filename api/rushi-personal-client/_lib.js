import {
  clearSessionCookie,
  createSessionCookie,
  createSignedToken,
  emptyString,
  getOptionalEnv,
  getRequiredEnv,
  getSupabaseAdmin,
  normalizeProjectCode,
  parseCookies,
  verifyPasswordHash,
  verifySignedToken,
} from "../_shared.js";

const ACCESS_COOKIE_NAME = "RUSHI_CLIENT_PROJECT_ACCESS";
const PARTICIPANT_COOKIE_NAME = "RUSHI_CLIENT_PROJECT_PARTICIPANT";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

const mapProjectDocument = (row) => ({
  id: row.id,
  engagementId: row.engagement_id,
  kind:
    row.content && typeof row.content === "object" && row.content.mode === "project"
      ? "project"
      : row.kind,
  code: row.code,
  status: row.status,
  title: row.title,
  clientName: row.client_name,
  clientCompany: row.client_company,
  clientEmail: row.client_email,
  ctaLabel: row.cta_label,
  adminEmail: row.admin_email,
  content: row.content || {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapParticipant = (row) => ({
  id: row.id,
  code: normalizeProjectCode(row.code),
  name: row.name,
  email: row.email,
  createdAt: row.created_at,
  lastSeenAt: row.last_seen_at || row.updated_at || row.created_at,
});

const mapMessage = (row) => ({
  id: row.id,
  code: normalizeProjectCode(row.code),
  role: row.author_role,
  authorName: row.author_name,
  authorEmail: row.author_email,
  body: row.body,
  createdAt: row.created_at,
});

const mapAction = (row) => ({
  id: row.id,
  code: normalizeProjectCode(row.code),
  kind: row.kind,
  authorName: row.author_name,
  authorEmail: row.author_email,
  note: row.note || "",
  createdAt: row.created_at,
});

const getSessionSecret = () =>
  getOptionalEnv("RUSHI_CLIENT_PROJECT_SESSION_SECRET") ||
  getRequiredEnv("RUSHI_PERSONAL_ADMIN_SESSION_SECRET");

const buildSessionCookieValue = (payload) =>
  createSignedToken(
    {
      ...payload,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
      v: 1,
    },
    getSessionSecret()
  );

export const buildProjectAccessCookie = (code) =>
  createSessionCookie({
    name: ACCESS_COOKIE_NAME,
    maxAgeSeconds: SESSION_MAX_AGE_SECONDS,
    value: buildSessionCookieValue({
      code: normalizeProjectCode(code),
      type: "project-access",
    }),
  });

export const buildProjectParticipantCookie = (participant) =>
  createSessionCookie({
    name: PARTICIPANT_COOKIE_NAME,
    maxAgeSeconds: SESSION_MAX_AGE_SECONDS,
    value: buildSessionCookieValue({
      code: normalizeProjectCode(participant.code),
      participantId: participant.id,
      type: "project-participant",
    }),
  });

export const clearProjectAccessCookie = () =>
  clearSessionCookie({
    name: ACCESS_COOKIE_NAME,
  });

export const clearProjectParticipantCookie = () =>
  clearSessionCookie({
    name: PARTICIPANT_COOKIE_NAME,
  });

const getSignedCookiePayload = (req, name) => {
  const cookies = parseCookies(req.headers.cookie);
  return verifySignedToken(cookies[name], getSessionSecret());
};

export const getProjectAccessPayload = (req, code) => {
  const payload = getSignedCookiePayload(req, ACCESS_COOKIE_NAME);

  if (!payload || payload.type !== "project-access") {
    return null;
  }

  const normalizedCode = normalizeProjectCode(code);
  if (normalizedCode && normalizeProjectCode(payload.code) !== normalizedCode) {
    return null;
  }

  return payload;
};

export const getProjectParticipantPayload = (req, code) => {
  const payload = getSignedCookiePayload(req, PARTICIPANT_COOKIE_NAME);

  if (!payload || payload.type !== "project-participant") {
    return null;
  }

  const normalizedCode = normalizeProjectCode(code);
  if (normalizedCode && normalizeProjectCode(payload.code) !== normalizedCode) {
    return null;
  }

  return payload;
};

export const getPublishedProjectByCode = async (code) => {
  const normalizedCode = normalizeProjectCode(code);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_DOCUMENTS")
    .select("*")
    .eq("status", "published")
    .ilike("code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProjectDocument(data) : null;
};

const getAccessCredential = async (code) => {
  const normalizedCode = normalizeProjectCode(code);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_ACCESS")
    .select("*")
    .eq("is_active", true)
    .ilike("code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data || null;
};

export const verifyProjectPassword = async (code, password) => {
  const credential = await getAccessCredential(code);

  if (!credential) {
    return false;
  }

  return verifyPasswordHash(password, credential.password_hash);
};

export const getProjectParticipant = async (req, code) => {
  const payload = getProjectParticipantPayload(req, code);
  if (!payload?.participantId) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_PARTICIPANTS")
    .select("*")
    .eq("id", payload.participantId)
    .ilike("code", normalizeProjectCode(code))
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapParticipant(data) : null;
};

export const upsertProjectParticipant = async ({
  code,
  name,
  email,
}) => {
  const normalizedCode = normalizeProjectCode(code);
  const normalizedName = emptyString(name);
  const normalizedEmail = emptyString(email).toLowerCase();

  if (!normalizedName) {
    throw new Error("Name is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  const project = await getPublishedProjectByCode(normalizedCode);
  if (!project?.id) {
    throw new Error("Project not found.");
  }

  const supabase = getSupabaseAdmin();
  const { data: existingParticipant, error: existingError } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_PARTICIPANTS")
    .select("*")
    .eq("document_id", project.id)
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingParticipant?.id) {
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_PROJECT_PARTICIPANTS")
      .update({
        name: normalizedName,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", existingParticipant.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapParticipant(data);
  }

  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_PARTICIPANTS")
    .insert({
      code: normalizedCode,
      document_id: project.id,
      name: normalizedName,
      email: normalizedEmail,
      last_seen_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapParticipant(data);
};

export const listProjectActivity = async (code) => {
  const project = await getPublishedProjectByCode(code);
  if (!project?.id) {
    throw new Error("Project not found.");
  }

  const supabase = getSupabaseAdmin();
  const [{ data: messages, error: messagesError }, { data: actions, error: actionsError }] =
    await Promise.all([
      supabase
        .from("RUSHI_PERSONAL_PROJECT_MESSAGES")
        .select("*")
        .eq("document_id", project.id)
        .eq("visible_to_client", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("RUSHI_PERSONAL_PROJECT_ACTIONS")
        .select("*")
        .eq("document_id", project.id)
        .order("created_at", { ascending: true }),
    ]);

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  if (actionsError) {
    throw new Error(actionsError.message);
  }

  return {
    messages: (messages || []).map(mapMessage),
    actions: (actions || []).map(mapAction),
  };
};

const getNotificationSettings = () => ({
  apiKey: getOptionalEnv("RESEND_API_KEY"),
  from: getOptionalEnv("RUSHI_CLIENT_NOTIFICATION_FROM"),
  to: getOptionalEnv("RUSHI_CLIENT_NOTIFICATION_TO") || "rushi@knowwhatson.com",
});

const sendNotificationEmail = async ({ subject, text }) => {
  const { apiKey, from, to } = getNotificationSettings();

  if (!apiKey || !from || !to) {
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
      }),
    });
  } catch {
    // Notification delivery is best-effort so the client action itself still succeeds.
  }
};

export const createProjectMessage = async ({ code, participant, body }) => {
  const normalizedBody = emptyString(body);
  if (!normalizedBody) {
    throw new Error("Message is required.");
  }

  const project = await getPublishedProjectByCode(code);
  if (!project?.id) {
    throw new Error("Project not found.");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_MESSAGES")
    .insert({
      code: normalizeProjectCode(code),
      document_id: project.id,
      participant_id: participant.id,
      author_role: "client",
      author_name: participant.name,
      author_email: participant.email,
      body: normalizedBody,
      visible_to_client: true,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await sendNotificationEmail({
    subject: `Studio message — ${project.code} — ${participant.name}`,
    text: [
      `${participant.name} sent a new studio message for ${project.code}.`,
      "",
      `Email: ${participant.email}`,
      `Project: ${project.title || project.code}`,
      "",
      normalizedBody,
    ].join("\n"),
  });

  return mapMessage(data);
};

export const createProjectAction = async ({
  code,
  participant,
  kind,
  note,
}) => {
  const normalizedKind = emptyString(kind);
  const normalizedNote = emptyString(note);

  if (normalizedKind !== "approve" && normalizedKind !== "request_changes") {
    throw new Error("Unsupported action.");
  }

  if (normalizedKind === "request_changes" && !normalizedNote) {
    throw new Error("Add a note so Rushi knows what should change.");
  }

  const project = await getPublishedProjectByCode(code);
  if (!project?.id) {
    throw new Error("Project not found.");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_PROJECT_ACTIONS")
    .insert({
      code: normalizeProjectCode(code),
      document_id: project.id,
      participant_id: participant.id,
      kind: normalizedKind,
      author_name: participant.name,
      author_email: participant.email,
      note: normalizedNote || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await sendNotificationEmail({
    subject: `Studio action — ${project.code} — ${normalizedKind.replace("_", " ")}`,
    text: [
      `${participant.name} submitted a ${normalizedKind.replace("_", " ")} action for ${project.code}.`,
      "",
      `Email: ${participant.email}`,
      `Project: ${project.title || project.code}`,
      normalizedNote ? "" : undefined,
      normalizedNote || undefined,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return mapAction(data);
};

export const getProjectAccessSession = async (req, code) => ({
  accessible: Boolean(getProjectAccessPayload(req, code)),
  code: normalizeProjectCode(code),
  expiresAt: getProjectAccessPayload(req, code)?.exp
    ? new Date(getProjectAccessPayload(req, code).exp).toISOString()
    : null,
  participant: await getProjectParticipant(req, code),
});

export const requireProjectAccess = async (req, code) => {
  const project = await getPublishedProjectByCode(code);

  if (!project) {
    throw new Error("Project not found.");
  }

  const accessPayload = getProjectAccessPayload(req, code);
  if (!accessPayload) {
    const error = new Error("Project access required.");
    error.statusCode = 401;
    throw error;
  }

  return project;
};

export const requireProjectParticipant = async (req, code) => {
  const participant = await getProjectParticipant(req, code);

  if (!participant) {
    const error = new Error("Participant details are required.");
    error.statusCode = 401;
    throw error;
  }

  return participant;
};
