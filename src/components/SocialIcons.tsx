import type { ReactNode } from "react";
import {
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { useEffect } from "react";
import { TbWorldWww } from "react-icons/tb";
import { MdOutlineMail } from "react-icons/md";
import { portfolioContent, SocialLinkKind } from "../data/portfolioContent";

const iconMap: Record<SocialLinkKind, ReactNode> = {
  linkedin: <FaLinkedinIn />,
  website: <TbWorldWww />,
  email: <MdOutlineMail />,
};

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    const cleanupFns: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      cleanupFns.push(() => {
        document.removeEventListener("mousemove", onMouseMove);
      });
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {portfolioContent.socialLinks.map((item) => (
          <span key={item.href}>
            <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
              {iconMap[item.kind]}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SocialIcons;
