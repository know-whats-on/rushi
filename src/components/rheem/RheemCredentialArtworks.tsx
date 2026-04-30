import type { Ref } from "react";
import {
  RHEEM_CERTIFICATE_COMPLETION_LINE,
  RHEEM_CERTIFICATE_EVENT_LINE,
  RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL,
  RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION,
  RHEEM_CERTIFICATE_PRESENTER_SIGNATURE_URL,
  RHEEM_CERTIFICATE_PRESENTER_TITLE,
  RHEEM_CERTIFICATE_PROGRAM_TITLE,
  RHEEM_CERTIFICATE_TITLE,
  RHEEM_CREDENTIAL_CONTEXT_LINE,
  RHEEM_CREDENTIAL_ISSUER_NAME,
} from "../../data/rheemCertificate";
import { RHEEM_PROJECT_PDF_LOGO_URL } from "../../data/rheemProject";

const resolveParticipantName = (participantName: string, fallbackLabel: string) =>
  participantName || fallbackLabel;

export const CertificateArtwork = ({
  participantName,
  artworkRef,
}: {
  participantName: string;
  artworkRef?: Ref<HTMLDivElement>;
}) => {
  const hasParticipantName = Boolean(participantName);

  return (
    <div className="rheem-certificate-artwork" ref={artworkRef}>
      <div className="rheem-certificate-artwork__frame rheem-certificate-artwork__frame--outer" />
      <div className="rheem-certificate-artwork__frame rheem-certificate-artwork__frame--middle" />
      <div className="rheem-certificate-artwork__frame rheem-certificate-artwork__frame--inner" />
      <div className="rheem-certificate-artwork__ribbon" />

      <div className="rheem-certificate-artwork__content">
        <div className="rheem-certificate-artwork__body">
          <p className="rheem-certificate-artwork__title">
            {RHEEM_CERTIFICATE_TITLE}
          </p>

          <div className="rheem-certificate-artwork__nameplate">
            <span
              key={participantName || "placeholder"}
              className={`rheem-certificate-artwork__name${
                hasParticipantName ? "" : " is-placeholder"
              }`}
            >
              {resolveParticipantName(participantName, "Your name here")}
            </span>
          </div>

          <p className="rheem-certificate-artwork__support rheem-certificate-artwork__support--completion">
            {RHEEM_CERTIFICATE_COMPLETION_LINE}
          </p>
          <h2 className="rheem-certificate-artwork__program">
            {RHEEM_CERTIFICATE_PROGRAM_TITLE}
          </h2>
          <p className="rheem-certificate-artwork__event">
            {RHEEM_CERTIFICATE_EVENT_LINE}
          </p>
        </div>

        <footer className="rheem-certificate-artwork__footer">
          <div className="rheem-certificate-artwork__credential">
            <img
              className="rheem-certificate-artwork__signature"
              src={RHEEM_CERTIFICATE_PRESENTER_SIGNATURE_URL}
              alt=""
            />
            <p className="rheem-certificate-artwork__credential-role">
              {RHEEM_CERTIFICATE_PRESENTER_TITLE}
            </p>
            <p className="rheem-certificate-artwork__credential-role">
              {RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION}
            </p>
            <p className="rheem-certificate-artwork__credential-role rheem-certificate-artwork__credential-role--emphasis">
              {RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL}
            </p>
          </div>

          <img
            className="rheem-certificate-artwork__mark"
            src={RHEEM_PROJECT_PDF_LOGO_URL}
            alt="Rheem Australia"
          />
        </footer>
      </div>
    </div>
  );
};

export const RheemCredentialBadgeArtwork = ({
  participantName,
  credentialCode,
  artworkRef,
}: {
  participantName: string;
  credentialCode: string;
  artworkRef?: Ref<HTMLDivElement>;
}) => (
  <div className="rheem-badge-artwork" ref={artworkRef}>
    <div className="rheem-badge-artwork__panel">
      <div className="rheem-badge-artwork__topbar">
        <span className="rheem-badge-artwork__eyebrow">Digital Credential</span>
        <img
          className="rheem-badge-artwork__logo"
          src={RHEEM_PROJECT_PDF_LOGO_URL}
          alt="Rheem Australia"
        />
      </div>

      <div className="rheem-badge-artwork__body">
        <p className="rheem-badge-artwork__issuer">{RHEEM_CREDENTIAL_ISSUER_NAME}</p>
        <h2 className="rheem-badge-artwork__title">
          {RHEEM_CERTIFICATE_PROGRAM_TITLE}
        </h2>
        <p className="rheem-badge-artwork__recipient-label">Awarded to</p>
        <p className="rheem-badge-artwork__name">
          {resolveParticipantName(participantName, "Participant")}
        </p>
        <p className="rheem-badge-artwork__context">
          {RHEEM_CREDENTIAL_CONTEXT_LINE}
        </p>
      </div>

      <div className="rheem-badge-artwork__footer">
        <div className="rheem-badge-artwork__footer-copy">
          <span>Credential ID</span>
          <strong>{credentialCode}</strong>
        </div>
        <div className="rheem-badge-artwork__footer-copy rheem-badge-artwork__footer-copy--subtle">
          <span>Certificate wording</span>
          <strong>{RHEEM_CERTIFICATE_EVENT_LINE}</strong>
        </div>
      </div>
    </div>
  </div>
);
