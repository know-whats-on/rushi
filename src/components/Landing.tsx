import { PropsWithChildren } from "react";
import Marquee from "react-fast-marquee";
import "./styles/Landing.css";
import { portfolioContent } from "../data/portfolioContent";

const splitLogoRows = <T,>(items: T[]) => {
  const firstRow = items.filter((_, index) => index % 2 === 0);
  const secondRow = items.filter((_, index) => index % 2 === 1);

  return [
    firstRow.length ? firstRow : items,
    secondRow.length ? secondRow : items,
  ] as const;
};

const Landing = ({ children }: PropsWithChildren) => {
  const { hero, logoMarquee, meta } = portfolioContent;
  const heroMarqueeLogos = logoMarquee.filter((item) => item.logo);
  const [heroMarqueeTop, heroMarqueeBottom] = splitLogoRows(heroMarqueeLogos);
  const heroBadges = hero.badges ?? [];
  const heroBadgesLeft = heroBadges.slice(0, 2);
  const heroBadgesRight = heroBadges.slice(2, 4);
  const mobileAiBand = meta.loaderBands[1]?.join(" • ") ?? "";
  const mobileInnovationBand = meta.loaderBands[2]?.join(" • ") ?? "";

  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-brand-marquee" aria-hidden="true">
          <div className="landing-brand-marquee-row">
            <Marquee gradient={false} speed={36} autoFill direction="right">
              {heroMarqueeTop.map((item) => (
                <div className="landing-brand-logo" key={`hero-top-${item.name}`}>
                  <img src={item.logo} alt="" />
                </div>
              ))}
            </Marquee>
          </div>
          <div className="landing-brand-marquee-row">
            <Marquee gradient={false} speed={42} autoFill>
              {heroMarqueeBottom.map((item) => (
                <div
                  className="landing-brand-logo"
                  key={`hero-bottom-${item.name}`}
                >
                  <img src={item.logo} alt="" />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
        <div className="landing-intro">
          <h2>{hero.greeting}</h2>
          <h1 className={hero.lastName ? "" : "landing-single-name"}>
            {hero.firstName}
            {hero.lastName ? (
              <>
                <br />
                <span>{hero.lastName}</span>
              </>
            ) : null}
          </h1>
        </div>
        <div className="landing-info">
          <h3>{hero.eyebrow}</h3>
          <h2 className="landing-supporting">
            <span>{hero.supportingPrimary}</span>
            {hero.supportingSecondary ? (
              <span>{hero.supportingSecondary}</span>
            ) : null}
          </h2>
          <h2 className="landing-info-h2">
            <span>{hero.accent}</span>
          </h2>
        </div>
        <div className="landing-mobile-topic-marquees" aria-hidden="true">
          <div className="landing-mobile-topic-row landing-mobile-topic-row-ai">
            <Marquee gradient={false} speed={22} autoFill>
              <span className="landing-mobile-topic-track">{mobileAiBand}</span>
            </Marquee>
          </div>
          <div className="landing-mobile-topic-row landing-mobile-topic-row-innovation">
            <Marquee gradient={false} speed={18} autoFill direction="right">
              <span className="landing-mobile-topic-track">
                {mobileInnovationBand}
              </span>
            </Marquee>
          </div>
        </div>
        <a
          href="#about"
          className="landing-scroll-indicator"
          data-cursor="disable"
          aria-label="Scroll to About"
        >
          <span className="landing-scroll-chevron" aria-hidden="true"></span>
        </a>
      </div>
      {heroBadges.length ? (
        <div className="hero-badge-pairs" aria-hidden="true">
          <div className="hero-badge-column hero-badge-column--left">
            {heroBadgesLeft.map((badge) => (
              <div className="hero-badge-item" key={badge.src}>
                <img src={badge.src} alt="" />
              </div>
            ))}
          </div>
          <div className="hero-badge-column hero-badge-column--right">
            {heroBadgesRight.map((badge) => (
              <div className="hero-badge-item" key={badge.src}>
                <img src={badge.src} alt="" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default Landing;
