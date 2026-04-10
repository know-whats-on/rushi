import {
  startTransition,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link } from "react-router-dom";
import "./styles/WhatIDo.css";
import { portfolioContent, type Capability } from "../data/portfolioContent";

const getWhatIViewState = () => {
  if (typeof window === "undefined") {
    return {
      isTouchMode: false,
      isPortraitMobile: false,
    };
  }

  const isTouchMode = window.matchMedia("(hover: none), (pointer: coarse)")
    .matches;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isSmallDevice =
    isTouchMode && Math.max(window.innerWidth, window.innerHeight) <= 1180;
  const isLandscapeDesktopMode = isSmallDevice && isLandscape;
  const isDesktopLike = window.innerWidth > 1024 || isLandscapeDesktopMode;

  return {
    isTouchMode,
    isPortraitMobile: !isDesktopLike,
  };
};

const getCapabilityBannerSequence = (capability: Capability) => {
  if (capability.mobileBannerSequence?.length) {
    return capability.mobileBannerSequence;
  }

  if (capability.mobileBannerUrls?.length) {
    return capability.mobileBannerUrls.map((src) => ({
      src,
      durationMs: 4200,
      fit: "cover" as const,
    }));
  }

  return capability.mobileBannerUrl
    ? [
        {
          src: capability.mobileBannerUrl,
          durationMs: 4200,
          fit: "cover" as const,
        },
      ]
    : [];
};

const WhatIDo = () => {
  const { capabilities, hero } = portfolioContent;
  const [viewState, setViewState] = useState(getWhatIViewState);
  const [mobileBannerState, setMobileBannerState] = useState<
    Record<string, { index: number; restartKey: number }>
  >({});
  const { isTouchMode, isPortraitMobile } = viewState;
  const heroBadges = hero.badges ?? [];
  const cardsAlwaysOpen = isTouchMode;
  const isDesktopHoverMode = !isTouchMode && !isPortraitMobile;
  const [hoveredCapabilityTitle, setHoveredCapabilityTitle] = useState<
    string | null
  >(null);

  useEffect(() => {
    const handleResize = () => {
      setViewState(getWhatIViewState());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const rotatingCapabilities = capabilities.filter(
      (capability) => getCapabilityBannerSequence(capability).length > 1
    );

    if (!rotatingCapabilities.length) {
      return;
    }

    const timeoutIds = rotatingCapabilities.map((capability) => {
      const sequence = getCapabilityBannerSequence(capability);
      const currentState = mobileBannerState[capability.title] || {
        index: 0,
        restartKey: 0,
      };
      const currentFrame = sequence[currentState.index] || sequence[0];
      const durationMs =
        typeof currentFrame?.durationMs === "number" && currentFrame.durationMs > 0
          ? currentFrame.durationMs
          : 4200;

      return window.setTimeout(() => {
        startTransition(() => {
          setMobileBannerState((current) => {
            const existingState = current[capability.title] || {
              index: 0,
              restartKey: 0,
            };

            return {
              ...current,
              [capability.title]: {
                index: (existingState.index + 1) % sequence.length,
                restartKey: existingState.restartKey + 1,
              },
            };
          });
        });
      }, durationMs);
    });

    return () => timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, [capabilities, mobileBannerState]);

  useEffect(() => {
    if (!isDesktopHoverMode && hoveredCapabilityTitle !== null) {
      setHoveredCapabilityTitle(null);
    }
  }, [hoveredCapabilityTitle, isDesktopHoverMode]);

  const createEnquiryLink = () => "/studio";

  const handleDesktopCardEnter = (title: string) => {
    if (!isDesktopHoverMode) {
      return;
    }

    setHoveredCapabilityTitle(title);
  };

  const handleDesktopCardLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDesktopHoverMode) {
      return;
    }

    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Element && nextTarget.closest(".what-content")) {
      return;
    }

    setHoveredCapabilityTitle(null);
  };

  return (
    <div
      className={`whatIDO ${
        cardsAlwaysOpen ? "what-touch-mode" : "what-hover-mode"
      }${isPortraitMobile ? " what-mobile-portrait" : ""}`}
      id="services"
    >
      <div className="what-box">
        <h2 className="title">
          {isPortraitMobile ? (
            <span className="what-title-line">
              <span className="what-title-word">
                Serv<span className="do-h2">ices</span>
              </span>
            </span>
          ) : (
            <>
              <span className="what-title-line">WHAT</span>
              <span className="what-title-line">
                I <span className="do-h2">OFFER</span>
              </span>
            </>
          )}
        </h2>
        {isPortraitMobile && heroBadges.length ? (
          <div className="what-mobile-badges" aria-label="AI certifications">
            {heroBadges.map((badge) => (
              <div className="what-mobile-badge" key={badge.src}>
                <img src={badge.src} alt={badge.alt} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="what-box">
        <div
          className={`what-box-in${
            isDesktopHoverMode ? " what-box-in--desktop-hover" : ""
          }${
            isDesktopHoverMode && hoveredCapabilityTitle
              ? " what-box-in--desktop-hovering"
              : ""
          }`}
        >
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          {capabilities.slice(0, 2).map((capability, index) => {
            const bannerSequence = getCapabilityBannerSequence(capability);
            const currentBannerState = mobileBannerState[capability.title] || {
              index: 0,
              restartKey: 0,
            };
            const currentBannerFrame = bannerSequence.length
              ? bannerSequence[currentBannerState.index] || bannerSequence[0]
              : null;
            const currentBannerUrl = currentBannerFrame?.src || "";
            const currentBannerFit = currentBannerFrame?.fit || "cover";
            const desktopHoverState = isDesktopHoverMode
              ? hoveredCapabilityTitle === capability.title
                ? "expanded"
                : hoveredCapabilityTitle
                  ? "collapsed"
                  : "resting"
              : null;

            return (
              <div
                className={`what-content${
                  cardsAlwaysOpen ? " what-content-active" : " what-noTouch"
                }${bannerSequence.length ? " what-content--with-banner" : ""}${
                  desktopHoverState
                    ? ` what-content--desktop-${desktopHoverState}`
                    : ""
                }`}
                key={capability.title}
                onMouseEnter={() => handleDesktopCardEnter(capability.title)}
                onMouseLeave={handleDesktopCardLeave}
              >
                <div className="what-border1">
                  <svg height="100%">
                    {index === 0 ? (
                      <>
                        <line
                          x1="0"
                          y1="0"
                          x2="100%"
                          y2="0"
                          stroke="white"
                          strokeWidth="2"
                          strokeDasharray="6,6"
                        />
                        <line
                          x1="0"
                          y1="100%"
                          x2="100%"
                          y2="100%"
                          stroke="white"
                          strokeWidth="2"
                          strokeDasharray="6,6"
                        />
                      </>
                    ) : (
                      <line
                        x1="0"
                        y1="100%"
                        x2="100%"
                        y2="100%"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="6,6"
                      />
                    )}
                  </svg>
                </div>
                <div className="what-corner"></div>

                <div className="what-content-in">
                  <div className="what-heading-row">
                    <h3>{capability.title}</h3>
                    <Link
                      to={createEnquiryLink()}
                      data-cursor="disable"
                      className="what-enquire"
                    >
                      Enquire Now
                    </Link>
                  </div>

                  {currentBannerUrl ? (
                    <div
                      className={`what-service-banner${
                        currentBannerFit === "contain" ? " is-contain" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <img
                        key={`${currentBannerUrl}-${currentBannerState.restartKey}`}
                        src={currentBannerUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}

                  <div className="what-service-details">
                    <h4>{capability.subtitle}</h4>
                    <p>{capability.description}</p>
                  </div>

                  <div className="what-service-meta">
                    <h5>Skillset & tools</h5>
                    <div className="what-content-flex">
                      {capability.tags.map((tag) => (
                        <div className="what-tags" key={tag}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!cardsAlwaysOpen ? (
                    <div className="what-card-actions">
                      <div className="what-toggle" aria-hidden="true">
                        <span className="what-see-more">See more</span>
                        <span className="what-arrow" aria-hidden="true"></span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
