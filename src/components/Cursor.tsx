import { useEffect, useRef, useState } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 600px)"
    );

    const updateEnabled = () => {
      setEnabled(mediaQuery.matches);
    };

    updateEnabled();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateEnabled);
      return () => {
        mediaQuery.removeEventListener("change", updateEnabled);
      };
    }

    mediaQuery.addListener(updateEnabled);
    return () => {
      mediaQuery.removeListener(updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let hover = false;
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mousePos.x = event.clientX;
      mousePos.y = event.clientY;
    };

    let animationFrameId = 0;

    const loop = () => {
      animationFrameId = window.requestAnimationFrame(loop);
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
      }
    };

    const hoverTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]")
    );

    const listeners = hoverTargets.map((element) => {
      const handleMouseOver = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }

        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const handleMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);

      return {
        element,
        handleMouseOver,
        handleMouseOut,
      };
    });

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", handleMouseMove);
      listeners.forEach(({ element, handleMouseOver, handleMouseOut }) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
      });
      gsap.killTweensOf(cursor);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
