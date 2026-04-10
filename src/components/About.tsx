import "./styles/About.css";
import Marquee from "react-fast-marquee";
import { portfolioContent } from "../data/portfolioContent";

const About = () => {
  const marqueeLogos = portfolioContent.logoMarquee.filter((item) => item.logo);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="about-copy">{portfolioContent.about}</p>
        <div className="about-marquee-shell">
          <div className="about-marquee-heading">
            <span>Trusted by Innovators</span>
            <div className="about-marquee-line"></div>
          </div>
          <div className="about-marquee">
            <Marquee gradient={false} speed={48} pauseOnHover autoFill>
              {marqueeLogos.map((item) => (
                <div className="about-logo-chip" key={item.name}>
                  <img src={item.logo} alt={item.name} />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
