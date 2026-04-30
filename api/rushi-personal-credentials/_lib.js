import { randomBytes } from "node:crypto";

export const RHEEM_CREDENTIAL_EVENT_KEY = "rheem-ai-fluency-2026";
export const RHEEM_CREDENTIAL_STATUS_ISSUED = "issued";
export const RHEEM_CREDENTIAL_CLAIM_SOURCE_SELF = "self-claim";
export const RHEEM_CREDENTIAL_NAME_MAX_LENGTH = 48;

const normalizeWhitespace = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, " ") : "";

export const normalizeRheemCredentialParticipantName = (value) =>
  normalizeWhitespace(value).trim().slice(0, RHEEM_CREDENTIAL_NAME_MAX_LENGTH);

const createCredentialCode = () =>
  `RHEEM-${randomBytes(6)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase()}`;

export const mapCredentialRow = (row) => ({
  code: row.code,
  participantName: row.participant_name,
  eventKey: row.event_key,
  status: row.status,
  issuedAt: row.issued_at,
});

export const getCredentialCodeFromRequest = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

export const createCredentialRecord = async (supabase, participantName) => {
  const normalizedName = normalizeRheemCredentialParticipantName(participantName);

  if (!normalizedName) {
    throw new Error("Enter your name exactly as you want it shown on the credential.");
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = createCredentialCode();
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_CREDENTIALS")
      .insert({
        event_key: RHEEM_CREDENTIAL_EVENT_KEY,
        code,
        participant_name: normalizedName,
        claim_source: RHEEM_CREDENTIAL_CLAIM_SOURCE_SELF,
        status: RHEEM_CREDENTIAL_STATUS_ISSUED,
      })
      .select("*")
      .single();

    if (!error && data) {
      return data;
    }

    if (error?.code !== "23505") {
      throw new Error(error?.message || "Unable to create a digital credential right now.");
    }
  }

  throw new Error("Unable to create a unique credential code right now.");
};
