import Marquee from "react-fast-marquee";
import { portfolioContent } from "../../data/portfolioContent";

const splitLogoRows = <T,>(items: T[]) => {
  const firstRow = items.filter((_, index) => index % 2 === 0);
  const secondRow = items.filter((_, index) => index % 2 === 1);

  return [
    firstRow.length ? firstRow : items,
    secondRow.length ? secondRow : items,
  ] as const;
};

interface QuoteTrustBandProps {
  heading?: string;
  kicker?: string;
  compact?: boolean;
  hero?: boolean;
}

const QuoteTrustBand = ({
  heading = "We have partnered with",
  kicker = "Now it’s your turn!",
  compact = false,
  hero = false,
}: QuoteTrustBandProps) => {
  const logoItems = portfolioContent.logoMarquee.filter((item) => item.logo);
  const [firstRow, secondRow] = splitLogoRows(logoItems);

  return (
    <section
      className={`quote-trust-band${compact ? " quote-trust-band-compact" : ""}${hero ? " quote-trust-band-hero" : ""}`}
      aria-label="Partner logos"
    >
      <p className="quote-trust-heading">{heading}</p>
      <div className="quote-trust-marquee quote-trust-marquee-top">
        <Marquee gradient={false} speed={36} autoFill direction="right">
          {firstRow.map((item) => (
            <div className="quote-trust-logo-chip" key={`quote-top-${item.name}`}>
              <img src={item.logo} alt={item.name} />
            </div>
          ))}
        </Marquee>
      </div>
      <div className="quote-trust-marquee quote-trust-marquee-bottom">
        <Marquee gradient={false} speed={42} autoFill>
          {secondRow.map((item) => (
            <div
              className="quote-trust-logo-chip"
              key={`quote-bottom-${item.name}`}
            >
              <img src={item.logo} alt={item.name} />
            </div>
          ))}
        </Marquee>
      </div>
      {kicker ? <p className="quote-trust-kicker">{kicker}</p> : null}
    </section>
  );
};

export default QuoteTrustBand;
