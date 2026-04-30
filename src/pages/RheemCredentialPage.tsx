import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RheemCredentialBadgeArtwork } from "../components/rheem/RheemCredentialArtworks";
import "../components/styles/RheemCertificate.css";
import {
  buildRheemBadgeFilename,
  buildRheemCertificateFilename,
  RHEEM_CERTIFICATE_PROGRAM_TITLE,
  RHEEM_CREDENTIAL_BADGE_EXPORT_BACKGROUND,
  RHEEM_CREDENTIAL_BADGE_EXPORT_HEIGHT,
  RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH,
  RHEEM_CREDENTIAL_ISSUER_NAME,
} from "../data/rheemCertificate";
import {
  exportRheemArtworkPng,
  exportRheemCertificateCanvasPng,
  prepareRheemArtworkDownloadTransport,
} from "../lib/rheemArtworkExport";
import {
  buildRheemCredentialPublicUrl,
  buildRheemLinkedInAddToProfileUrl,
  getRheemCredentialByCode,
  getRheemCredentialContext,
  getRheemLinkedInFields,
  rememberRheemCredentialCode,
} from "../lib/rheemCredentials";
import type { RheemCredentialRecord } from "../types/rheemCredentials";
import {
  copyStudioText,
  openStudioExternalUrl,
} from "../app-shell/lib/nativeBridge";

const PREVIEW_STAGE_GUTTER = 28;

type RheemCredentialPageProps = {
  studioHref?: string;
};

const RheemCredentialPage = ({
  studioHref = "/studio",
}: RheemCredentialPageProps = {}) => {
  const { code = "" } = useParams();
  const decodedCode = decodeURIComponent(code);
  const badgePreviewStageRef = useRef<HTMLDivElement | null>(null);
  const badgePreviewArtworkRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [credentialRecord, setCredentialRecord] =
    useState<RheemCredentialRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isBadgeExporting, setIsBadgeExporting] = useState(false);
  const [isCertificateExporting, setIsCertificateExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);

  useEffect(() => {
    const node = badgePreviewStageRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const nextWidth = Math.max(0, node.clientWidth - PREVIEW_STAGE_GUTTER * 2);

      if (!nextWidth) {
        setPreviewScale(1);
        return;
      }

      setPreviewScale(Math.min(1, nextWidth / RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH));
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(node);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCredential = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const nextCredential = await getRheemCredentialByCode(decodedCode);

        if (!active) {
          return;
        }

        if (!nextCredential) {
          setCredentialRecord(null);
          setLoadError("This digital credential could not be found.");
          return;
        }

        rememberRheemCredentialCode(
          nextCredential.participantName,
          nextCredential.code
        );
        setCredentialRecord(nextCredential);
      } catch (error) {
        if (!active) {
          return;
        }

        setCredentialRecord(null);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load this credential right now."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadCredential();

    return () => {
      active = false;
    };
  }, [decodedCode]);

  useEffect(() => {
    if (!copiedFieldId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFieldId(null);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedFieldId]);

  const linkedInFields = useMemo(
    () => (credentialRecord ? getRheemLinkedInFields(credentialRecord) : []),
    [credentialRecord]
  );

  const linkedInHref = useMemo(
    () =>
      credentialRecord ? buildRheemLinkedInAddToProfileUrl(credentialRecord) : "",
    [credentialRecord]
  );

  const certificateHref = useMemo(() => {
    if (!credentialRecord) {
      return `${studioHref}/rheem/certificate`;
    }

    return `${studioHref}/rheem/certificate?name=${encodeURIComponent(
      credentialRecord.participantName
    )}`;
  }, [credentialRecord, studioHref]);

  const handleCopyValue = async (fieldId: string, value: string) => {
    try {
      await copyStudioText(value);
      setCopiedFieldId(fieldId);
      setActionError(null);
    } catch {
      setActionError("Copy failed on this device. You can still select the text manually.");
    }
  };

  const handleOpenLinkedIn = async () => {
    try {
      setActionError(null);
      await openStudioExternalUrl(linkedInHref);
    } catch {
      setActionError("Unable to open LinkedIn right now.");
    }
  };

  const handleBadgeDownload = async () => {
    if (!credentialRecord || !badgePreviewArtworkRef.current) {
      setActionError("The badge preview is not ready yet.");
      return;
    }

    try {
      setIsBadgeExporting(true);
      setActionError(null);
      const downloadTransport = prepareRheemArtworkDownloadTransport();

      await exportRheemArtworkPng({
        backgroundColor: RHEEM_CREDENTIAL_BADGE_EXPORT_BACKGROUND,
        downloadTransport,
        filename: buildRheemBadgeFilename(credentialRecord.participantName),
        height: RHEEM_CREDENTIAL_BADGE_EXPORT_HEIGHT,
        sourceArtwork: badgePreviewArtworkRef.current,
        width: RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH,
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to export the badge right now."
      );
    } finally {
      setIsBadgeExporting(false);
    }
  };

  const handleCertificateDownload = async () => {
    if (!credentialRecord) {
      setActionError("The certificate export is not ready yet.");
      return;
    }

    try {
      setIsCertificateExporting(true);
      setActionError(null);
      const downloadTransport = prepareRheemArtworkDownloadTransport();

      await exportRheemCertificateCanvasPng({
        downloadTransport,
        filename: buildRheemCertificateFilename(credentialRecord.participantName),
        participantName: credentialRecord.participantName,
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to export the certificate right now."
      );
    } finally {
      setIsCertificateExporting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="rheem-certificate-page rheem-credential-page">
        <section className="rheem-certificate-intro rheem-credential-status-panel">
          <p className="rheem-certificate-kicker">Digital Credential</p>
          <h1>Loading your credential...</h1>
        </section>
      </main>
    );
  }

  if (!credentialRecord || loadError) {
    return (
      <main className="rheem-certificate-page rheem-credential-page">
        <section className="rheem-certificate-intro rheem-credential-status-panel">
          <div className="rheem-certificate-toolbar">
            <Link className="rheem-certificate-back-link" to={certificateHref}>
              Back to Certificate
            </Link>
          </div>
          <p className="rheem-certificate-kicker">Digital Credential</p>
          <h1>Credential not found.</h1>
          <p className="rheem-certificate-support-text">
            {loadError || "This digital credential could not be found."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="rheem-certificate-page rheem-credential-page">
      <div className="rheem-certificate-layout rheem-credential-layout">
        <section className="rheem-certificate-intro rheem-credential-intro">
          <div className="rheem-certificate-toolbar">
            <Link className="rheem-certificate-back-link" to={certificateHref}>
              Back to Certificate
            </Link>
          </div>

          <p className="rheem-certificate-kicker">{RHEEM_CREDENTIAL_ISSUER_NAME}</p>
          <h1>Your digital credential is ready.</h1>
          <p className="rheem-certificate-support-text">
            Use the verified credential link for LinkedIn, then download the square
            badge or your certificate PNG whenever you need it.
          </p>

          <div className="rheem-certificate-detail-grid">
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Participant</p>
              <strong>{credentialRecord.participantName}</strong>
            </div>
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Credential</p>
              <strong>{RHEEM_CERTIFICATE_PROGRAM_TITLE}</strong>
              <span className="rheem-certificate-detail-note">
                {getRheemCredentialContext()}
              </span>
            </div>
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Credential ID</p>
              <strong>{credentialRecord.code}</strong>
              <span className="rheem-certificate-detail-note">
                {buildRheemCredentialPublicUrl(credentialRecord.code)}
              </span>
            </div>
          </div>

          <div className="rheem-certificate-actions rheem-certificate-actions--stacked">
            <button
              className="rheem-certificate-download-button"
              type="button"
              onClick={() => {
                void handleOpenLinkedIn();
              }}
            >
              Add to LinkedIn
            </button>
            <button
              className="rheem-certificate-secondary-button"
              type="button"
              onClick={handleBadgeDownload}
              disabled={isBadgeExporting || isCertificateExporting}
            >
              {isBadgeExporting ? "Generating Badge..." : "Download Square Badge PNG"}
            </button>
            <button
              className="rheem-certificate-secondary-button"
              type="button"
              onClick={handleCertificateDownload}
              disabled={isBadgeExporting || isCertificateExporting}
            >
              {isCertificateExporting
                ? "Generating Certificate..."
                : "Download Certificate PNG"}
            </button>
          </div>

          <div className="rheem-credential-linkedin-panel">
            <div className="rheem-credential-linkedin-panel__header">
              <div>
                <p className="rheem-certificate-detail-label">LinkedIn helper</p>
                <strong>Licenses & Certifications fields</strong>
              </div>
              <button
                className="rheem-certificate-back-link rheem-certificate-back-link--compact"
                type="button"
                onClick={() =>
                  handleCopyValue(
                    "credential-url-inline",
                    buildRheemCredentialPublicUrl(credentialRecord.code)
                  )
                }
              >
                {copiedFieldId === "credential-url-inline"
                  ? "Copied"
                  : "Copy credential URL"}
              </button>
            </div>

            <div className="rheem-credential-linkedin-fields">
              {linkedInFields.map((field) => (
                <div className="rheem-credential-linkedin-field" key={field.id}>
                  <div className="rheem-credential-linkedin-field__copy">
                    <p className="rheem-certificate-detail-label">{field.label}</p>
                    <strong>{field.value}</strong>
                  </div>
                  <button
                    className="rheem-certificate-back-link rheem-certificate-back-link--compact"
                    type="button"
                    onClick={() => handleCopyValue(field.id, field.value)}
                  >
                    {copiedFieldId === field.id ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {actionError ? (
            <p className="rheem-certificate-export-error">{actionError}</p>
          ) : null}
        </section>

        <section className="rheem-certificate-preview-column">
          <div className="rheem-certificate-preview-meta">
            <span>Badge preview</span>
            <span>Square LinkedIn and social asset</span>
          </div>

          <div className="rheem-certificate-preview-stage" ref={badgePreviewStageRef}>
            <div
              className="rheem-certificate-preview-frame"
              style={{
                width: `${RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH * previewScale}px`,
                minHeight: `${RHEEM_CREDENTIAL_BADGE_EXPORT_HEIGHT * previewScale}px`,
              }}
            >
              <div
                className="rheem-certificate-preview-canvas"
                style={{
                  width: `${RHEEM_CREDENTIAL_BADGE_EXPORT_WIDTH}px`,
                  height: `${RHEEM_CREDENTIAL_BADGE_EXPORT_HEIGHT}px`,
                  transform: `scale(${previewScale})`,
                }}
              >
                <RheemCredentialBadgeArtwork
                  participantName={credentialRecord.participantName}
                  credentialCode={credentialRecord.code}
                  artworkRef={badgePreviewArtworkRef}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
};

export default RheemCredentialPage;
