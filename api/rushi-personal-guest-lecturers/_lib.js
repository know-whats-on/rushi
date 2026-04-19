import {
  clearSessionCookie,
  createSessionCookie,
  createSignedToken,
  emptyString,
  getOptionalEnv,
  getRequiredEnv,
  getSupabaseAdmin,
  matchesSecret,
  parseCookies,
  verifySignedToken,
} from "../_shared.js";
import {
  GUEST_LECTURER_ACTIVE_WEEK_NUMBERS,
  GUEST_LECTURER_CAMPAIGN_KEY,
} from "../../shared/guestLecturers.js";

const ACCESS_COOKIE_NAME = "RUSHI_GUEST_LECTURER_ACCESS";
const ADMIN_COOKIE_NAME = "RUSHI_GUEST_LECTURER_ADMIN";
const ACCESS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTIVE_WEEK_SET = new Set(GUEST_LECTURER_ACTIVE_WEEK_NUMBERS);

const getSessionSecret = () =>
  getOptionalEnv("RUSHI_GUEST_LECTURER_SESSION_SECRET") ||
  getRequiredEnv("RUSHI_PERSONAL_ADMIN_SESSION_SECRET");

const buildSessionCookieValue = (payload, maxAgeSeconds) =>
  createSignedToken(
    {
      ...payload,
      exp: Date.now() + maxAgeSeconds * 1000,
      v: 1,
    },
    getSessionSecret()
  );

const getSignedCookiePayload = (req, name) => {
  const cookies = parseCookies(req.headers.cookie);
  return verifySignedToken(cookies[name], getSessionSecret());
};

const normalizeEmail = (value) => emptyString(value).toLowerCase();

const normalizeWeekSelection = (value) =>
  Array.isArray(value)
    ? [...new Set(value.map((item) => Number(item)).filter((item) => ACTIVE_WEEK_SET.has(item)))].sort(
        (left, right) => left - right
      )
    : [];

export const buildGuestLecturerAccessCookie = () =>
  createSessionCookie({
    name: ACCESS_COOKIE_NAME,
    maxAgeSeconds: ACCESS_SESSION_MAX_AGE_SECONDS,
    value: buildSessionCookieValue(
      {
        campaignKey: GUEST_LECTURER_CAMPAIGN_KEY,
        type: "guest-lecturer-access",
      },
      ACCESS_SESSION_MAX_AGE_SECONDS
    ),
  });

export const clearGuestLecturerAccessCookie = () =>
  clearSessionCookie({
    name: ACCESS_COOKIE_NAME,
  });

export const buildGuestLecturerAdminCookie = () =>
  createSessionCookie({
    name: ADMIN_COOKIE_NAME,
    maxAgeSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
    value: buildSessionCookieValue(
      {
        campaignKey: GUEST_LECTURER_CAMPAIGN_KEY,
        type: "guest-lecturer-admin",
      },
      ADMIN_SESSION_MAX_AGE_SECONDS
    ),
  });

export const clearGuestLecturerAdminCookie = () =>
  clearSessionCookie({
    name: ADMIN_COOKIE_NAME,
  });

const getAccessPayload = (req) => {
  const payload = getSignedCookiePayload(req, ACCESS_COOKIE_NAME);
  if (!payload || payload.type !== "guest-lecturer-access") {
    return null;
  }

  if (payload.campaignKey !== GUEST_LECTURER_CAMPAIGN_KEY) {
    return null;
  }

  return payload;
};

const getAdminPayload = (req) => {
  const payload = getSignedCookiePayload(req, ADMIN_COOKIE_NAME);
  if (!payload || payload.type !== "guest-lecturer-admin") {
    return null;
  }

  if (payload.campaignKey !== GUEST_LECTURER_CAMPAIGN_KEY) {
    return null;
  }

  return payload;
};

export const getGuestLecturerAccessSession = async (req) => {
  const payload = getAccessPayload(req);

  return {
    accessible: Boolean(payload),
    campaignKey: GUEST_LECTURER_CAMPAIGN_KEY,
    expiresAt:
      payload && typeof payload.exp === "number"
        ? new Date(payload.exp).toISOString()
        : null,
  };
};

export const getGuestLecturerAdminSession = async (req) => {
  const payload = getAdminPayload(req);

  return {
    accessible: Boolean(payload),
    campaignKey: GUEST_LECTURER_CAMPAIGN_KEY,
    expiresAt:
      payload && typeof payload.exp === "number"
        ? new Date(payload.exp).toISOString()
        : null,
  };
};

export const verifyGuestLecturerAccessCode = (code) =>
  matchesSecret(
    emptyString(code),
    getRequiredEnv("RUSHI_PERSONAL_GUEST_LECTURER_ACCESS_CODE")
  );

export const verifyGuestLecturerAdminPasscode = (passcode) =>
  matchesSecret(
    emptyString(passcode),
    getRequiredEnv("RUSHI_PERSONAL_GUEST_LECTURER_ADMIN_PASSCODE")
  );

export const requireGuestLecturerAccess = async (req) => {
  const payload = getAccessPayload(req);

  if (!payload) {
    const error = new Error("Enter the guest lecturer access code to continue.");
    error.statusCode = 401;
    throw error;
  }

  return payload;
};

export const requireGuestLecturerAdminAccess = async (req) => {
  const payload = getAdminPayload(req);

  if (!payload) {
    const error = new Error("Enter the admin passcode to review submissions.");
    error.statusCode = 401;
    throw error;
  }

  return payload;
};

export const normalizeLinkedInUrl = (value) => {
  const trimmedValue = emptyString(value);
  if (!trimmedValue) {
    throw new Error("LinkedIn URL is required.");
  }

  const candidate = /^[a-z]+:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  let parsedUrl;

  try {
    parsedUrl = new URL(candidate);
  } catch {
    throw new Error("Enter a valid LinkedIn URL.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const isLinkedInHost =
    hostname === "linkedin.com" ||
    hostname.endsWith(".linkedin.com") ||
    hostname === "lnkd.in" ||
    hostname.endsWith(".lnkd.in");

  if (!isLinkedInHost) {
    throw new Error("Enter a valid LinkedIn URL.");
  }

  parsedUrl.hash = "";
  return parsedUrl.toString();
};

const mapSubmission = (row) => ({
  id: row.id,
  campaignKey: row.campaign_key,
  name: row.name,
  email: row.email,
  linkedinUrl: row.linkedin_url,
  topicPreference: row.topic_preference || "",
  selectedWeeks: normalizeWeekSelection(row.selected_weeks),
  createdAt: row.created_at,
});

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
    // Email delivery is best-effort so the EOI itself still succeeds.
  }
};

export const createGuestLecturerSubmission = async ({
  name,
  email,
  linkedinUrl,
  topicPreference,
  selectedWeeks,
}) => {
  const normalizedName = emptyString(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedLinkedInUrl = normalizeLinkedInUrl(linkedinUrl);
  const normalizedTopicPreference = emptyString(topicPreference);
  const normalizedWeeks = normalizeWeekSelection(selectedWeeks);

  if (!normalizedName) {
    throw new Error("Name is required.");
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  if (!normalizedWeeks.length) {
    throw new Error("Select at least one available week.");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS")
    .insert({
      campaign_key: GUEST_LECTURER_CAMPAIGN_KEY,
      name: normalizedName,
      email: normalizedEmail,
      linkedin_url: normalizedLinkedInUrl,
      topic_preference: normalizedTopicPreference,
      selected_weeks: normalizedWeeks,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const submission = mapSubmission(data);

  await sendNotificationEmail({
    subject: `Guest lecturer EOI - ${submission.name}`,
    text: [
      `${submission.name} shared a guest lecturer EOI.`,
      "",
      `Weeks: ${submission.selectedWeeks.join(", ")}`,
      `Email: ${submission.email}`,
      `LinkedIn: ${submission.linkedinUrl}`,
      submission.topicPreference
        ? `Topic preference: ${submission.topicPreference}`
        : "Topic preference: Not provided",
    ].join("\n"),
  });

  return submission;
};

export const listGuestLecturerSubmissions = async () => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_GUEST_LECTURER_SUBMISSIONS")
    .select("*")
    .eq("campaign_key", GUEST_LECTURER_CAMPAIGN_KEY)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(mapSubmission);
};
