import { Link } from "react-router-dom";
import { portfolioContent } from "../data/portfolioContent";
import QuoteTrustBand from "./quote/QuoteTrustBand";

const PublicFooterBand = () => {
  const briefMailto = `mailto:${portfolioContent.contact.email}?subject=${encodeURIComponent(
    "Document or quote follow-up"
  )}`;

  return (
    <section className="public-footer-band">
      <div className="public-footer-band-inner">
        <QuoteTrustBand compact />
        <div className="public-footer-cta">
          <p className="public-eyebrow">Next step</p>
          <h2>Turn the enquiry into one polished public-facing document.</h2>
          <p>
            Browse live studio work, find your shared project, or submit a new
            brief in one place.
          </p>
          <div className="public-action-row">
            <Link className="public-button" to="/studio/brief">
              Start the brief
            </Link>
            <Link className="public-button public-button--secondary" to="/studio">
              Open the studio
            </Link>
            <a
              className="public-button public-button--ghost"
              href={briefMailto}
            >
              Email Rushi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicFooterBand;
