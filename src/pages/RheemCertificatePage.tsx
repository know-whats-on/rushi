import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CertificateArtwork } from "../components/rheem/RheemCredentialArtworks";
import "../components/styles/RheemCertificate.css";
import {
  buildRheemCertificateFilename,
  getRheemCredentialRoute,
  limitRheemCertificateNameInput,
  normalizeRheemCertificateParticipantName,
  RHEEM_CERTIFICATE_EVENT_DETAIL,
  RHEEM_CERTIFICATE_EXPORT_HEIGHT,
  RHEEM_CERTIFICATE_EXPORT_WIDTH,
  RHEEM_CERTIFICATE_MAX_NAME_LENGTH,
  RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL,
  RHEEM_CERTIFICATE_PRESENTER_NAME,
  RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION,
  RHEEM_CERTIFICATE_PRESENTER_TITLE,
  RHEEM_CERTIFICATE_PROGRAM_TITLE,
} from "../data/rheemCertificate";
import {
  exportRheemCertificateCanvasPng,
  prepareRheemArtworkDownloadTransport,
} from "../lib/rheemArtworkExport";
import {
  claimRheemCredential,
  getRememberedRheemCredentialCode,
  rememberRheemCredentialCode,
} from "../lib/rheemCredentials";

const PREVIEW_STAGE_GUTTER = 28;

type RheemCertificatePageProps = {
  studioHref?: string;
};

const RheemCertificatePage = ({
  studioHref = "/studio",
}: RheemCertificatePageProps = {}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewStageRef = useRef<HTMLDivElement | null>(null);
  const previewArtworkRef = useRef<HTMLDivElement | null>(null);
  const [participantNameInput, setParticipantNameInput] = useState(() =>
    limitRheemCertificateNameInput(searchParams.get("name") || "")
  );
  const [previewScale, setPreviewScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rememberedCredentialCode, setRememberedCredentialCode] = useState<
    string | null
  >(null);
  const normalizedParticipantName = useMemo(
    () => normalizeRheemCertificateParticipantName(participantNameInput),
    [participantNameInput]
  );
  const isNameReady = normalizedParticipantName.length > 0;

  useEffect(() => {
    const node = previewStageRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const nextWidth = Math.max(0, node.clientWidth - PREVIEW_STAGE_GUTTER * 2);

      if (!nextWidth) {
        setPreviewScale(1);
        return;
      }

      setPreviewScale(
        Math.min(1, nextWidth / RHEEM_CERTIFICATE_EXPORT_WIDTH)
      );
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
    if (!normalizedParticipantName) {
      setRememberedCredentialCode(null);
      return;
    }

    setRememberedCredentialCode(
      getRememberedRheemCredentialCode(normalizedParticipantName)
    );
  }, [normalizedParticipantName]);

  const handleDownload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNameReady) {
      setActionError(
        "Enter your name exactly as you want it shown on the certificate."
      );
      return;
    }

    const previewArtwork = previewArtworkRef.current;
    if (!previewArtwork) {
      setActionError("The certificate preview is not ready yet.");
      return;
    }

    try {
      setIsExporting(true);
      setActionError(null);
      const downloadTransport = prepareRheemArtworkDownloadTransport();

      await exportRheemCertificateCanvasPng({
        downloadTransport,
        filename: buildRheemCertificateFilename(normalizedParticipantName),
        participantName: normalizedParticipantName,
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to export the certificate right now."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateCredential = async () => {
    if (!isNameReady) {
      setActionError(
        "Enter your name exactly as you want it shown on the digital credential."
      );
      return;
    }

    if (rememberedCredentialCode) {
      navigate(getRheemCredentialRoute(rememberedCredentialCode));
      return;
    }

    try {
      setIsClaiming(true);
      setActionError(null);

      const credential = await claimRheemCredential(normalizedParticipantName);
      rememberRheemCredentialCode(normalizedParticipantName, credential.code);
      navigate(getRheemCredentialRoute(credential.code));
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to create a digital credential right now."
      );
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <main className="rheem-certificate-page">
      <div className="rheem-certificate-layout">
        <section className="rheem-certificate-intro">
          <div className="rheem-certificate-toolbar">
            <Link className="rheem-certificate-back-link" to={studioHref}>
              Back to Studio
            </Link>
          </div>

          <p className="rheem-certificate-kicker">Rheem Australia</p>
          <h1>Create your event certificate.</h1>

          <div className="rheem-certificate-detail-grid">
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Session</p>
              <strong>{RHEEM_CERTIFICATE_PROGRAM_TITLE}</strong>
            </div>
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Event</p>
              <strong>{RHEEM_CERTIFICATE_EVENT_DETAIL}</strong>
            </div>
            <div className="rheem-certificate-detail-item">
              <p className="rheem-certificate-detail-label">Presented by</p>
              <strong>{RHEEM_CERTIFICATE_PRESENTER_NAME}</strong>
              <span className="rheem-certificate-detail-note">
                {RHEEM_CERTIFICATE_PRESENTER_TITLE}
              </span>
              <span className="rheem-certificate-detail-note">
                {RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION}
              </span>
              <span className="rheem-certificate-detail-note">
                {RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL}
              </span>
            </div>
          </div>

          <form className="rheem-certificate-form" onSubmit={handleDownload}>
            <label>
              <span>Name on certificate</span>
              <input
                value={participantNameInput}
                onChange={(event) => {
                  setParticipantNameInput(
                    limitRheemCertificateNameInput(event.target.value)
                  );
                  setActionError(null);
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                inputMode="text"
                maxLength={RHEEM_CERTIFICATE_MAX_NAME_LENGTH + 16}
              />
            </label>

            <div className="rheem-certificate-field-meta">
              <span className="rheem-certificate-field-note">
                Shown exactly as it appears in the live preview
              </span>
              <span className="rheem-certificate-field-note">
                {normalizedParticipantName.length}/
                {RHEEM_CERTIFICATE_MAX_NAME_LENGTH}
              </span>
            </div>

            <div className="rheem-certificate-actions rheem-certificate-actions--stacked">
              <button
                className="rheem-certificate-download-button"
                type="submit"
                disabled={isExporting || isClaiming || !isNameReady}
              >
                {isExporting ? "Generating PNG..." : "Download High-Quality PNG"}
              </button>
              <button
                className="rheem-certificate-secondary-button"
                type="button"
                onClick={handleCreateCredential}
                disabled={isExporting || isClaiming || !isNameReady}
              >
                {isClaiming
                  ? "Preparing Digital Credential..."
                  : rememberedCredentialCode
                    ? "Open Digital Credential"
                    : "Create Digital Credential"}
              </button>
            </div>

            {actionError ? (
              <p className="rheem-certificate-export-error">{actionError}</p>
            ) : null}

            <p className="rheem-certificate-support-text">
              Create the digital credential to get a LinkedIn-ready verification
              page plus a square badge for posts and event recaps.
            </p>
          </form>
        </section>

        <section className="rheem-certificate-preview-column">
          <div className="rheem-certificate-preview-meta">
            <span>Live preview</span>
            <span>A4 landscape certificate</span>
          </div>

          <div className="rheem-certificate-preview-stage" ref={previewStageRef}>
            <div
              className="rheem-certificate-preview-frame"
              style={{
                width: `${RHEEM_CERTIFICATE_EXPORT_WIDTH * previewScale}px`,
                minHeight: `${RHEEM_CERTIFICATE_EXPORT_HEIGHT * previewScale}px`,
              }}
            >
              <div
                className="rheem-certificate-preview-canvas"
                style={{
                  width: `${RHEEM_CERTIFICATE_EXPORT_WIDTH}px`,
                  height: `${RHEEM_CERTIFICATE_EXPORT_HEIGHT}px`,
                  transform: `scale(${previewScale})`,
                }}
              >
                <CertificateArtwork
                  participantName={normalizedParticipantName}
                  artworkRef={previewArtworkRef}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RheemCertificatePage;
