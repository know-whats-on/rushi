import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Landing from "./Landing";
import Testimonials from "./Testimonials";
import WhatIDo from "./WhatIDo";
import setSplitText from "./utils/splitText";

const getViewState = () => {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isSmallDevice = isTouch && Math.max(window.innerWidth, window.innerHeight) <= 1180;
  const isLandscapeDesktopMode = isSmallDevice && isLandscape;

  return {
    isDesktopLike: window.innerWidth > 1024 || isLandscapeDesktopMode,
    isLandscapeDesktopMode,
  };
};

const MainContainer = ({ children }: PropsWithChildren) => {
  const initialViewState = getViewState();
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    initialViewState.isDesktopLike
  );

  useEffect(() => {
    const resizeHandler = () => {
      const viewState = getViewState();
      setSplitText();
      setIsDesktopView(viewState.isDesktopLike);
      document.body.classList.toggle(
        "landscape-desktop-mode",
        viewState.isLandscapeDesktopMode
      );
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      document.body.classList.remove("landscape-desktop-mode");
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Testimonials />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
