export const RHEEM_CERTIFICATE_ACCESS_CODE = "CERTIFICATE";
export const RHEEM_CERTIFICATE_ROUTE = "/studio/rheem/certificate";
export const RHEEM_CREDENTIAL_ROUTE_PREFIX = "/studio/rheem/credential";
export const RHEEM_CERTIFICATE_TITLE = "Certificate of Completion";
export const RHEEM_CERTIFICATE_PROGRAM_TITLE = "AI Fluency Training";
export const RHEEM_CERTIFICATE_EVENT_DETAIL =
  "Rheem Australia · Wednesday, 22 April 2026";
export const RHEEM_CERTIFICATE_EVENT_LINE =
  "at RHEEM AUSTRALIA on WEDNESDAY, 22 APRIL 2026";
export const RHEEM_CREDENTIAL_EVENT_KEY = "rheem-ai-fluency-2026";
export const RHEEM_CREDENTIAL_STATUS_ISSUED = "issued";
export const RHEEM_CREDENTIAL_ISSUER_NAME = "What's On! Campus";
export const RHEEM_CREDENTIAL_CONTEXT_LINE =
  "Issued for Rheem Australia on April 22, 2026";
export const RHEEM_CREDENTIAL_ISSUE_MONTH = 4;
export const RHEEM_CREDENTIAL_ISSUE_MONTH_LABEL = "April";
export const RHEEM_CREDENTIAL_ISSUE_YEAR = 2026;
export const RHEEM_CREDENTIAL_STORAGE_KEY = "rheem-digital-credential-claims:v1";
export const RHEEM_CERTIFICATE_COMPLETION_LINE =
  "has successfully completed the";
export const RHEEM_CERTIFICATE_EXPORT_BACKGROUND = "#fbf4e8";
export const RHEEM_CERTIFICATE_PRESENTER_SIGNATURE_URL =
  "/images/certificates/rushi-sign.svg";
export const RHEEM_CERTIFICATE_PRESENTER_NAME = "Rushi Vyas";
export const RHEEM_CERTIFICATE_PRESENTER_TITLE = "CEO & Founder";
export const RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION = "What's On! Campus";
export const RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL =
  "Microsoft Copilot Certified Trainer";
export const RHEEM_CERTIFICATE_EXPORT_WIDTH = 2800;
export const RHEEM_CERTIFICATE_EXPORT_HEIGHT = 1980;
export const RHEEM_CERTIFICATE_MAX_NAME_LENGTH = 48;
export const RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH = 1600;
export const RHEEM_CREDENTIAL_BADGE_EXPORT_HEIGHT = 1600;
export const RHEEM_CREDENTIAL_BADGE_EXPORT_BACKGROUND = "#6f1115";

const normalizeCertificateWhitespace = (value: string) =>
  value.replace(/\s+/g, " ");

export const limitRheemCertificateNameInput = (value: string) =>
  normalizeCertificateWhitespace(value).slice(
    0,
    RHEEM_CERTIFICATE_MAX_NAME_LENGTH + 16
  );

export const normalizeRheemCertificateParticipantName = (value: string) =>
  normalizeCertificateWhitespace(value)
    .trim()
    .slice(0, RHEEM_CERTIFICATE_MAX_NAME_LENGTH);

const buildRheemParticipantSlug = (participantName: string) =>
  normalizeRheemCertificateParticipantName(participantName)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isRheemCertificateAccessCode = (value: string) =>
  value.trim().toUpperCase() === RHEEM_CERTIFICATE_ACCESS_CODE;

export const getRheemCredentialRoute = (code: string) =>
  `${RHEEM_CREDENTIAL_ROUTE_PREFIX}/${encodeURIComponent(code.trim())}`;

export const buildRheemCertificateFilename = (participantName: string) => {
  const slug = buildRheemParticipantSlug(participantName);
  return `rheem-certificate-${slug || "participant"}.png`;
};

export const buildRheemBadgeFilename = (participantName: string) => {
  const slug = buildRheemParticipantSlug(participantName);
  return `rheem-linkedin-badge-${slug || "participant"}.png`;
};
