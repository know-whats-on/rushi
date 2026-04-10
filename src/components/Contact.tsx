import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import "./styles/Contact.css";
import { portfolioContent } from "../data/portfolioContent";

const sitemapLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
  { label: "Studio", href: "/studio" },
  { label: "Submit a brief", href: "/studio" },
];

const Contact = () => {
  const { contact } = portfolioContent;

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — therushivyas
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} data-cursor="disable">
                {contact.email}
              </a>
            </p>
            <p>{contact.location}</p>
            <Link to="/studio" data-cursor="disable" className="contact-social">
              Start a brief <MdArrowOutward />
            </Link>
            <Link to="/studio" data-cursor="disable" className="contact-social">
              Open the studio <MdArrowOutward />
            </Link>
          </div>
          <div className="contact-box">
            <h4>Education</h4>
            {contact.education.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="contact-box">
            <h4>Rushi's Portfolio</h4>
            <a
              href={contact.website}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              What's On! <MdArrowOutward />
            </a>
            <a
              href="https://www.knowwhatson.com/work"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Public case studies <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h4>Sitemap</h4>
            <nav className="contact-sitemap" aria-label="Footer sitemap">
              {sitemapLinks.map((item) =>
                item.href.startsWith("/#") ? (
                  <a key={item.href} href={item.href} data-cursor="disable">
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    data-cursor="disable"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>
          <div className="contact-box">
            <h5>&copy; 2026 Rushi Vyas</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
