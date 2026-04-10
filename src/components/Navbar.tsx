import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";
import { portfolioContent } from "../data/portfolioContent";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(".header ul a[data-href]");
    const clickHandlers = new Map<HTMLAnchorElement, EventListener>();
    links.forEach((elem) => {
      const handler: EventListener = (e) => {
        e.preventDefault();
        const currentLink = e.currentTarget as HTMLAnchorElement;
        const section = currentLink.getAttribute("data-href");
        if (section) {
          const target = document.querySelector(section);
          if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      };
      clickHandlers.set(elem, handler);
      elem.addEventListener("click", handler);
    });

    return () => {
      clickHandlers.forEach((handler, element) => {
        element.removeEventListener("click", handler);
      });
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          {portfolioContent.meta.initials}
        </a>
        <a
          href={portfolioContent.contact.linkedin}
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          {portfolioContent.meta.linkedinDisplay}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#services" href="#services">
              <HoverLinks text="SERVICES" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
