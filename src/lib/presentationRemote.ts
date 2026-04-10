export type PresentationRemoteCommandType =
  | "prev"
  | "next"
  | "prevSlide"
  | "nextSlide"
  | "goToSlide"
  | "goToCard"
  | "clearCard";

export interface PresentationRevealableCardState {
  id: string;
  label: string;
}

export interface PresentationBuildProgressState {
  current: number;
  total: number;
}

export type PresentationParticipantRole = "screen" | "presenter";

export type PresentationCommandSenderRole =
  | PresentationParticipantRole
  | "remote";

export interface PresentationHostIdentity {
  clientId: string;
  role: PresentationParticipantRole;
}

export interface PresentationParticipantPresence
  extends PresentationHostIdentity {
  joinedAt: string;
}

export interface PresentationSessionState {
  code: string;
  sessionId: string;
  slideIndex: number;
  totalSlides: number;
  title: string;
  updatedAt: string;
  sourceClientId?: string;
  sourceRole?: PresentationParticipantRole;
  hostClientId?: string;
  hostRole?: PresentationParticipantRole;
  activeCardIndex?: number | null;
  activeCardId?: string | null;
  revealableCards?: PresentationRevealableCardState[];
  buildProgress?: PresentationBuildProgressState;
}

export interface PresentationRemoteCommand {
  code: string;
  sessionId: string;
  command: PresentationRemoteCommandType;
  slideIndex?: number;
  cardIndex?: number;
  cardId?: string;
  sentAt: string;
  senderClientId?: string;
  senderRole?: PresentationCommandSenderRole;
}

export const PRESENTATION_STATE_EVENT = "presentation-state";
export const PRESENTATION_REMOTE_COMMAND_EVENT = "remote-command";
export const PRESENTATION_JOIN_REQUEST_EVENT = "join-request";

export const normalizePresentationCode = (value: string) =>
  value.trim().toUpperCase();

export const normalizePresentationSessionId = (value: string) =>
  value.trim().toUpperCase();

export type PresentationSessionSource = "explicit" | "public" | "generated";

const comparePresentationParticipants = (
  left: PresentationParticipantPresence,
  right: PresentationParticipantPresence
) => {
  const leftTime = Date.parse(left.joinedAt);
  const rightTime = Date.parse(right.joinedAt);
  const normalizedLeftTime = Number.isNaN(leftTime)
    ? Number.MAX_SAFE_INTEGER
    : leftTime;
  const normalizedRightTime = Number.isNaN(rightTime)
    ? Number.MAX_SAFE_INTEGER
    : rightTime;

  if (normalizedLeftTime !== normalizedRightTime) {
    return normalizedLeftTime - normalizedRightTime;
  }

  return left.clientId.localeCompare(right.clientId);
};

const normalizePresentationParticipantRole = (
  value: unknown
): PresentationParticipantRole | null => {
  if (value === "screen" || value === "presenter") {
    return value;
  }

  return null;
};

export const arePresentationHostsEqual = (
  left: PresentationHostIdentity | null,
  right: PresentationHostIdentity | null
) =>
  left?.clientId === right?.clientId && left?.role === right?.role;

export const listPresentationParticipants = (
  presenceState: Record<
    string,
    Array<
      {
        presence_ref?: string;
        clientId?: string;
        role?: string;
        joinedAt?: string;
      }
    >
  >
): PresentationParticipantPresence[] => {
  const participantsByClientId = new Map<string, PresentationParticipantPresence>();

  Object.values(presenceState).forEach((entries) => {
    entries.forEach((entry) => {
      const clientId = normalizePresentationSessionId(entry.clientId || "");
      const role = normalizePresentationParticipantRole(entry.role);
      const joinedAt =
        typeof entry.joinedAt === "string" && entry.joinedAt.trim()
          ? entry.joinedAt
          : new Date(0).toISOString();

      if (!clientId || !role) {
        return;
      }

      const nextParticipant: PresentationParticipantPresence = {
        clientId,
        role,
        joinedAt,
      };
      const currentParticipant = participantsByClientId.get(clientId);

      if (
        !currentParticipant ||
        comparePresentationParticipants(nextParticipant, currentParticipant) < 0
      ) {
        participantsByClientId.set(clientId, nextParticipant);
      }
    });
  });

  return Array.from(participantsByClientId.values()).sort(
    comparePresentationParticipants
  );
};

export const getPresentationActiveHost = (
  participants: PresentationParticipantPresence[]
): PresentationHostIdentity | null => {
  const screenHost = participants.find(
    (participant) => participant.role === "screen"
  );
  if (screenHost) {
    return {
      clientId: screenHost.clientId,
      role: screenHost.role,
    };
  }

  const presenterHost = participants.find(
    (participant) => participant.role === "presenter"
  );
  if (presenterHost) {
    return {
      clientId: presenterHost.clientId,
      role: presenterHost.role,
    };
  }

  return null;
};

export const resolvePresentationSession = ({
  explicitSessionId,
  publicSessionId,
  fallbackSessionId,
}: {
  explicitSessionId?: string | null;
  publicSessionId?: string | null;
  fallbackSessionId?: string | null;
}): {
  sessionId: string;
  source: PresentationSessionSource;
} => {
  const normalizedExplicitSessionId = normalizePresentationSessionId(
    explicitSessionId || ""
  );
  if (normalizedExplicitSessionId) {
    return {
      sessionId: normalizedExplicitSessionId,
      source: "explicit",
    };
  }

  const normalizedPublicSessionId = normalizePresentationSessionId(
    publicSessionId || ""
  );
  if (normalizedPublicSessionId) {
    return {
      sessionId: normalizedPublicSessionId,
      source: "public",
    };
  }

  return {
    sessionId: normalizePresentationSessionId(fallbackSessionId || ""),
    source: "generated",
  };
};

export const createPresentationSessionId = () =>
  crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();

export const createPresentationClientId = () =>
  crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();

export const createPresentationChannelName = (
  code: string,
  sessionId: string
) =>
  `presentation:${normalizePresentationCode(code)}:${normalizePresentationSessionId(sessionId)}`;
