import {
  getRheemCredentialRoute,
  normalizeRheemCertificateParticipantName,
  RHEEM_CERTIFICATE_PROGRAM_TITLE,
  RHEEM_CREDENTIAL_CONTEXT_LINE,
  RHEEM_CREDENTIAL_EVENT_KEY,
  RHEEM_CREDENTIAL_ISSUER_NAME,
  RHEEM_CREDENTIAL_ISSUE_MONTH,
  RHEEM_CREDENTIAL_ISSUE_MONTH_LABEL,
  RHEEM_CREDENTIAL_ISSUE_YEAR,
  RHEEM_CREDENTIAL_STORAGE_KEY,
} from "../data/rheemCertificate";
import { buildStudioAppUrl } from "./studioAppOrigin";
import type { RheemCredentialRecord } from "../types/rheemCredentials";

type FetchErrorPayload = {
  message?: string;
};

type CredentialPayload = {
  code?: unknown;
  participantName?: unknown;
  eventKey?: unknown;
  status?: unknown;
  issuedAt?: unknown;
};

const mapRheemCredentialRecord = (
  payload: CredentialPayload
): RheemCredentialRecord => ({
  code: typeof payload.code === "string" ? payload.code : "",
  participantName:
    typeof payload.participantName === "string" ? payload.participantName : "",
  eventKey: typeof payload.eventKey === "string" ? payload.eventKey : "",
  status: typeof payload.status === "string" ? payload.status : "",
  issuedAt: typeof payload.issuedAt === "string" ? payload.issuedAt : "",
});

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildStudioAppUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? ((await response.json()) as FetchErrorPayload | T)
    : null;

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === "object" && "message" in payload
        ? (payload as FetchErrorPayload).message ||
            "Unable to complete this request right now."
        : "Unable to complete this request right now."
    );
  }

  return payload as T;
};

const readStoredClaimMap = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(RHEEM_CREDENTIAL_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
};

const writeStoredClaimMap = (nextValue: Record<string, string>) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      RHEEM_CREDENTIAL_STORAGE_KEY,
      JSON.stringify(nextValue)
    );
  } catch {
    // Ignore local storage failures so claim/download actions still work.
  }
};

const buildStoredClaimKey = (participantName: string) =>
  `${RHEEM_CREDENTIAL_EVENT_KEY}:${normalizeRheemCertificateParticipantName(
    participantName
  )}`;

export const claimRheemCredential = async (
  participantName: string
): Promise<RheemCredentialRecord> => {
  const payload = await fetchJson<{ credential?: CredentialPayload }>(
    "/api/rushi-personal-credentials/claim",
    {
      method: "POST",
      body: JSON.stringify({
        participantName,
      }),
    }
  );

  if (!payload.credential) {
    throw new Error("Credential not returned.");
  }

  return mapRheemCredentialRecord(payload.credential);
};

export const getRheemCredentialByCode = async (
  code: string
): Promise<RheemCredentialRecord | null> => {
  const response = await fetch(
    buildStudioAppUrl(
      `/api/rushi-personal-credentials/${encodeURIComponent(code.trim())}`
    )
  );

  if (response.status === 404) {
    return null;
  }

  const payload = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? ((await response.json()) as
        | { credential?: CredentialPayload | null; message?: string }
        | null)
    : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Unable to load this credential right now.");
  }

  if (!payload?.credential) {
    return null;
  }

  return mapRheemCredentialRecord(payload.credential);
};

export const rememberRheemCredentialCode = (
  participantName: string,
  code: string
) => {
  const normalizedName = normalizeRheemCertificateParticipantName(participantName);
  const normalizedCode = code.trim();

  if (!normalizedName || !normalizedCode) {
    return;
  }

  const nextValue = readStoredClaimMap();
  nextValue[buildStoredClaimKey(normalizedName)] = normalizedCode;
  writeStoredClaimMap(nextValue);
};

export const getRememberedRheemCredentialCode = (participantName: string) => {
  const normalizedName = normalizeRheemCertificateParticipantName(participantName);
  if (!normalizedName) {
    return null;
  }

  const claimMap = readStoredClaimMap();
  return claimMap[buildStoredClaimKey(normalizedName)] || null;
};

export const buildRheemCredentialPublicUrl = (code: string) =>
  buildStudioAppUrl(getRheemCredentialRoute(code));

export const buildRheemLinkedInAddToProfileUrl = (
  credential: Pick<RheemCredentialRecord, "code">
) => {
  const searchParams = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: RHEEM_CERTIFICATE_PROGRAM_TITLE,
    organizationName: RHEEM_CREDENTIAL_ISSUER_NAME,
    issueYear: `${RHEEM_CREDENTIAL_ISSUE_YEAR}`,
    issueMonth: `${RHEEM_CREDENTIAL_ISSUE_MONTH}`,
    certId: credential.code,
    certUrl: buildRheemCredentialPublicUrl(credential.code),
  });

  return `https://www.linkedin.com/profile/add?${searchParams.toString()}`;
};

export const getRheemLinkedInFields = (credential: RheemCredentialRecord) => [
  {
    id: "credential-name",
    label: "Credential name",
    value: RHEEM_CERTIFICATE_PROGRAM_TITLE,
  },
  {
    id: "issuer-name",
    label: "Issuing organization",
    value: RHEEM_CREDENTIAL_ISSUER_NAME,
  },
  {
    id: "issue-month",
    label: "Issue month",
    value: RHEEM_CREDENTIAL_ISSUE_MONTH_LABEL,
  },
  {
    id: "issue-year",
    label: "Issue year",
    value: `${RHEEM_CREDENTIAL_ISSUE_YEAR}`,
  },
  {
    id: "credential-id",
    label: "Credential ID",
    value: credential.code,
  },
  {
    id: "credential-url",
    label: "Credential URL",
    value: buildRheemCredentialPublicUrl(credential.code),
  },
];

export const getRheemCredentialContext = () => RHEEM_CREDENTIAL_CONTEXT_LINE;
