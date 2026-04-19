import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { portfolioContent } from "../../data/portfolioContent";
import { NETWORKING_URL } from "../lib/clientApi";
import {
  canShareStudioLink,
  copyStudioText,
  openStudioExternalUrl,
  shareStudioLink,
} from "../lib/nativeBridge";

type QrCardProps = {
  title: string;
  eyebrow: string;
  value: string;
  shareText: string;
};

const QrCard = ({ title, eyebrow, value, shareText }: QrCardProps) => {
  const [copyState, setCopyState] = useState("Copy");
  const canShare = canShareStudioLink();

  const handleCopy = async () => {
    try {
      await copyStudioText(value);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy"), 1800);
    } catch {
      setCopyState("Retry");
      window.setTimeout(() => setCopyState("Copy"), 1800);
    }
  };

  const handleShare = async () => {
    if (!canShare) {
      return;
    }

    try {
      await shareStudioLink({
        title,
        text: shareText,
        url: value,
      });
    } catch {
      // The user dismissed share; no extra handling needed.
    }
  };

  return (
    <article className="studio-app-qr-card studio-app-qr-card--network">
      <div>
        <p className="studio-app-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
      </div>

      <div className="studio-app-qr-plate">
        <QRCodeSVG
          value={value}
          size={208}
          bgColor="transparent"
          fgColor="#101010"
          marginSize={1}
        />
      </div>

      <p className="studio-app-link-copy">{value}</p>

      <div className="studio-app-sheet-actions studio-app-qr-actions">
        <button
          type="button"
          className="studio-app-button"
          onClick={() => {
            void handleCopy();
          }}
        >
          {copyState}
        </button>
        <button
          type="button"
          className="studio-app-button studio-app-button--ghost"
          onClick={() => {
            void openStudioExternalUrl(value);
          }}
        >
          Open
        </button>
        {canShare ? (
          <button
            type="button"
            className="studio-app-button studio-app-button--ghost"
            onClick={() => {
              void handleShare();
            }}
          >
            Share
          </button>
        ) : null}
      </div>
    </article>
  );
};

const QrPage = () => (
  <section className="studio-app-page studio-app-page--qr">
    <div className="studio-app-about-top studio-app-about-top--qr">
      <header className="studio-app-qr-header">
        <p className="studio-app-kicker">Networking</p>
        <h1>Scan, share, connect.</h1>
        <p>
          Keep Rushi&apos;s website and LinkedIn ready in one clean client-facing view.
        </p>
      </header>
      <div className="studio-app-qr-grid">
        <QrCard
          eyebrow="Website"
          title="Scan for rushi.knowwhatson.com"
          value={NETWORKING_URL}
          shareText="Open Rushi's website"
        />
        <QrCard
          eyebrow="LinkedIn"
          title="Scan for Rushi's LinkedIn"
          value={portfolioContent.contact.linkedin}
          shareText="Open Rushi's LinkedIn"
        />
      </div>
    </div>
  </section>
);

export default QrPage;
