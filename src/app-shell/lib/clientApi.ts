import { normalizeProjectContent } from "../../lib/projectDocuments";
import { normalizeStudioDocument, toQuoteDocument } from "../../lib/documents";
import type { StudioDocument } from "../../types/documents";
import type {
  ClientProjectCard,
  InvoiceViewModel,
  ProjectAccessSession,
  ProjectActivityFeed,
  ProjectAction,
  ProjectActionKind,
  ProjectMessage,
  ProjectParticipant,
} from "../../types/clientApp";
import {
  buildStudioAppUrl,
  getStudioAppOrigin,
  NETWORKING_URL,
} from "../../lib/studioAppOrigin";

export { getStudioAppOrigin, NETWORKING_URL };

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildStudioAppUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to complete this request right now."
    );
  }

  return payload as T;
};

const mapProjectCard = (payload: Record<string, unknown>): ClientProjectCard => ({
  id: (payload.id as string) || crypto.randomUUID(),
  code: typeof payload.code === "string" ? payload.code : "",
  title: typeof payload.cardTitle === "string" ? payload.cardTitle : "Untitled project",
  company:
    typeof payload.cardCompany === "string" ? payload.cardCompany : "Studio Project",
  summary:
    typeof payload.cardSummary === "string"
      ? payload.cardSummary
      : "A live studio project.",
  logoUrl: typeof payload.cardLogoUrl === "string" ? payload.cardLogoUrl : "",
  updatedAt: payload.updatedAt as string | undefined,
  statusLabel:
    typeof payload.cardStatusLabel === "string" ? payload.cardStatusLabel : "Live",
});

const mapParticipant = (payload: Record<string, unknown>): ProjectParticipant => ({
  id: (payload.id as string) || crypto.randomUUID(),
  code: typeof payload.code === "string" ? payload.code : "",
  name: typeof payload.name === "string" ? payload.name : "",
  email: typeof payload.email === "string" ? payload.email : "",
  createdAt: payload.createdAt as string | undefined,
  lastSeenAt: payload.lastSeenAt as string | undefined,
});

const mapAccessSession = (payload: Record<string, unknown>): ProjectAccessSession => ({
  accessible: Boolean(payload.accessible),
  code: typeof payload.code === "string" ? payload.code : "",
  expiresAt: typeof payload.expiresAt === "string" ? payload.expiresAt : null,
  participant:
    payload.participant && typeof payload.participant === "object"
      ? mapParticipant(payload.participant as Record<string, unknown>)
      : null,
});

const mapMessage = (payload: Record<string, unknown>): ProjectMessage => ({
  id: (payload.id as string) || crypto.randomUUID(),
  code: typeof payload.code === "string" ? payload.code : "",
  role: payload.role === "studio" ? "studio" : "client",
  authorName: typeof payload.authorName === "string" ? payload.authorName : "",
  authorEmail: typeof payload.authorEmail === "string" ? payload.authorEmail : "",
  body: typeof payload.body === "string" ? payload.body : "",
  createdAt: typeof payload.createdAt === "string" ? payload.createdAt : new Date().toISOString(),
});

const mapAction = (payload: Record<string, unknown>): ProjectAction => ({
  id: (payload.id as string) || crypto.randomUUID(),
  code: typeof payload.code === "string" ? payload.code : "",
  kind: payload.kind === "request_changes" ? "request_changes" : "approve",
  authorName: typeof payload.authorName === "string" ? payload.authorName : "",
  authorEmail: typeof payload.authorEmail === "string" ? payload.authorEmail : "",
  note: typeof payload.note === "string" ? payload.note : "",
  createdAt: typeof payload.createdAt === "string" ? payload.createdAt : new Date().toISOString(),
});

export const listClientProjectCards = async (): Promise<ClientProjectCard[]> => {
  const payload = await fetchJson<{ documents?: Record<string, unknown>[] }>(
    "/api/rushi-personal-documents"
  );

  return Array.isArray(payload.documents)
    ? payload.documents
        .map(mapProjectCard)
        .filter((card) => card.code)
        .sort((left, right) =>
          left.title.localeCompare(right.title, undefined, { numeric: true })
        )
    : [];
};

export const getProjectAccess = async (code: string) =>
  mapAccessSession(
    await fetchJson<Record<string, unknown>>(
      `/api/rushi-personal-client/projects/${encodeURIComponent(code)}/access`
    )
  );

export const unlockClientProject = async (code: string, password: string) =>
  mapAccessSession(
    await fetchJson<Record<string, unknown>>(
      `/api/rushi-personal-client/projects/${encodeURIComponent(code)}/unlock`,
      {
        method: "POST",
        body: JSON.stringify({ password }),
      }
    )
  );

export const saveClientParticipant = async (
  code: string,
  name: string,
  email: string
) =>
  mapAccessSession(
    await fetchJson<Record<string, unknown>>(
      `/api/rushi-personal-client/projects/${encodeURIComponent(code)}/participant`,
      {
        method: "POST",
        body: JSON.stringify({ name, email }),
      }
    )
  );

export const getClientProjectDocument = async (code: string): Promise<StudioDocument> => {
  const payload = await fetchJson<{ document?: StudioDocument | null }>(
    `/api/rushi-personal-client/projects/${encodeURIComponent(code)}`
  );

  if (!payload.document) {
    throw new Error("Project not found.");
  }

  return normalizeStudioDocument(payload.document);
};

export const getProjectActivity = async (code: string): Promise<ProjectActivityFeed> => {
  const payload = await fetchJson<{
    participant?: Record<string, unknown> | null;
    messages?: Record<string, unknown>[];
    actions?: Record<string, unknown>[];
  }>(`/api/rushi-personal-client/projects/${encodeURIComponent(code)}/activity`);

  return {
    participant:
      payload.participant && typeof payload.participant === "object"
        ? mapParticipant(payload.participant)
        : null,
    messages: Array.isArray(payload.messages) ? payload.messages.map(mapMessage) : [],
    actions: Array.isArray(payload.actions) ? payload.actions.map(mapAction) : [],
  };
};

export const postClientProjectMessage = async (code: string, body: string) => {
  const payload = await fetchJson<{ message?: Record<string, unknown> }>(
    `/api/rushi-personal-client/projects/${encodeURIComponent(code)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    }
  );

  if (!payload.message) {
    throw new Error("Message not returned.");
  }

  return mapMessage(payload.message);
};

export const postClientProjectAction = async (
  code: string,
  kind: ProjectActionKind,
  note: string
) => {
  const payload = await fetchJson<{ action?: Record<string, unknown> }>(
    `/api/rushi-personal-client/projects/${encodeURIComponent(code)}/actions`,
    {
      method: "POST",
      body: JSON.stringify({ kind, note }),
    }
  );

  if (!payload.action) {
    throw new Error("Action not returned.");
  }

  return mapAction(payload.action);
};

export const buildInvoiceViewModel = (
  document: StudioDocument
): InvoiceViewModel => ({
  quote: toQuoteDocument(document),
});

export const getProjectOverviewSummary = (document: StudioDocument) => {
  const normalizedContent = normalizeProjectContent(document.content);

  return {
    intro: normalizedContent.introText,
    supportingDownloads: normalizedContent.supportingDownloads || [],
    variant: normalizedContent.projectVariant,
  };
};
