import type { Quote } from "./quotes";

export interface ClientProjectCard {
  id: string;
  code: string;
  title: string;
  company: string;
  summary: string;
  logoUrl: string;
  updatedAt?: string;
  statusLabel: string;
}

export interface ProjectAccessSession {
  accessible: boolean;
  code: string;
  expiresAt?: string | null;
  participant: ProjectParticipant | null;
}

export interface ProjectParticipant {
  id: string;
  code: string;
  name: string;
  email: string;
  createdAt?: string;
  lastSeenAt?: string;
}

export type ProjectMessageRole = "client" | "studio";

export interface ProjectMessage {
  id: string;
  code: string;
  role: ProjectMessageRole;
  authorName: string;
  authorEmail: string;
  body: string;
  createdAt: string;
}

export type ProjectActionKind = "approve" | "request_changes";

export interface ProjectAction {
  id: string;
  code: string;
  kind: ProjectActionKind;
  authorName: string;
  authorEmail: string;
  note: string;
  createdAt: string;
}

export interface ProjectActivityFeed {
  participant: ProjectParticipant | null;
  messages: ProjectMessage[];
  actions: ProjectAction[];
}

export interface InvoiceViewModel {
  quote: Quote;
}
