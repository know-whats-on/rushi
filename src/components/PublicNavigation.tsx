import { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { portfolioContent } from "../data/portfolioContent";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const homeSections = [
  { label: "ABOUT", target: "#about" },
  { label: "SERVICES", target: "#services" },
  { label: "WORK", target: "#work" },
  { label: "CONTACT", target: "#contact" },
];

const PublicNavigation = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isStudioProjectRoute = location.pathname.startsWith("/studio/project/");

  const handleHomeAnchorClick =
    (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const element = document.querySelector(target);
      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  return (
    <>
      <div className="header">
        <Link to="/" className="navbar-title" data-cursor="disable">
          {portfolioContent.meta.initials}
        </Link>
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
          {isHome
            ? homeSections.map((item) => (
                <li key={item.target}>
                  <a
                    data-href={item.target}
                    href={item.target}
                    onClick={handleHomeAnchorClick(item.target)}
                  >
                    <HoverLinks text={item.label} />
                  </a>
                </li>
              ))
            : [
                ...(isStudioProjectRoute ? [] : [{ label: "PORTFOLIO", to: "/" }]),
                { label: "STUDIO", to: "/studio" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>
                    <HoverLinks text={item.label} />
                  </Link>
                </li>
              ))}
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default PublicNavigation;
