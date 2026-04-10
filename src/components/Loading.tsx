import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/loadingContext";

import Marquee from "react-fast-marquee";
import { portfolioContent } from "../data/portfolioContent";

const splitLogoRows = <T,>(items: T[]) => {
  const firstRow = items.filter((_, index) => index % 2 === 0);
  const secondRow = items.filter((_, index) => index % 2 === 1);

  return [
    firstRow.length ? firstRow : items,
    secondRow.length ? secondRow : items,
  ] as const;
};

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const loadedTimerRef = useRef<number | null>(null);
  const clickedTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const exitSequenceStartedRef = useRef(false);
  const loadingLogoMarquee = portfolioContent.logoMarquee.filter(
    (item) => item.logo
  );
  const [loadingLogoTop, loadingLogoBottom] = splitLogoRows(loadingLogoMarquee);

  useEffect(() => {
    if (percent < 100 || exitSequenceStartedRef.current) {
      return;
    }

    exitSequenceStartedRef.current = true;

    loadedTimerRef.current = window.setTimeout(() => {
      setLoaded(true);
    }, 220);
    clickedTimerRef.current = window.setTimeout(() => {
      setClicked(true);
    }, 520);
    finishTimerRef.current = window.setTimeout(async () => {
      try {
        const module = await import("./utils/initialFX");
        module.initialFX?.();
      } catch (error) {
        console.error("Loader transition failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 880);
  }, [percent, setIsLoading]);

  useEffect(() => {
    return () => {
      if (loadedTimerRef.current) {
        window.clearTimeout(loadedTimerRef.current);
      }
      if (clickedTimerRef.current) {
        window.clearTimeout(clickedTimerRef.current);
      }
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          {portfolioContent.meta.initials}
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div
          className="loading-logo-marquee-shell loading-logo-marquee-top"
          aria-hidden="true"
        >
          <Marquee gradient={false} speed={30} autoFill direction="right">
            {loadingLogoTop.map((item) => (
              <div
                className="loading-logo-chip"
                key={`loading-logo-top-${item.name}`}
              >
                <img src={item.logo} alt="" />
              </div>
            ))}
          </Marquee>
        </div>
        <div
          className="loading-logo-marquee-shell loading-logo-marquee-bottom"
          aria-hidden="true"
        >
          <Marquee gradient={false} speed={34} autoFill>
            {loadingLogoBottom.map((item) => (
              <div
                className="loading-logo-chip"
                key={`loading-logo-bottom-${item.name}`}
              >
                <img src={item.logo} alt="" />
              </div>
            ))}
          </Marquee>
        </div>
        <div className="loading-marquee-stack">
          {portfolioContent.meta.loaderBands.map((band, index) => (
            <div className={`loading-marquee loading-marquee-${index + 1}`} key={`band-${index}`}>
              <Marquee
                autoFill
                speed={index === 1 ? 28 : index === 2 ? 22 : 34}
                direction={index === 1 ? "right" : "left"}
              >
                {band.map((role) => (
                  <span key={`${role}-${index}`}>{role}</span>
                ))}
              </Marquee>
            </div>
          ))}
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
