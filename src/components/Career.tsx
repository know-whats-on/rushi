import "./styles/Career.css";
import { portfolioContent } from "../data/portfolioContent";

const Career = () => {
  const experienceTimeline = [...portfolioContent.experience].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <div className="career-section section-container" id="work">
      <div className="career-container">
        <h2>A Decade of Success</h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experienceTimeline.map((item) => {
            return (
              <div className="career-info-box" key={`${item.year}-${item.company}`}>
                <div className="career-left">
                  <div className="career-year">
                    <span className="career-year-value">{item.year}</span>
                  </div>
                  <div className="career-left-copy">
                    <div
                      className={`career-logo-row${
                        item.logoLayout === "grid-2x2"
                          ? " career-logo-row-awards"
                          : ""
                      }`}
                    >
                      {item.logos.map((logo) =>
                        logo.src ? (
                          <div
                            className="career-logo-wrap"
                            key={`${item.year}-${logo.alt}`}
                          >
                            <img src={logo.src} alt={logo.alt} />
                          </div>
                        ) : (
                          <div
                            className="career-logo-badge"
                            key={`${item.year}-${logo.alt}`}
                          >
                            {logo.label ?? logo.alt}
                          </div>
                        )
                      )}
                    </div>
                    <h5>{item.highlight}</h5>
                  </div>
                </div>
                <div className="career-marker">
                  <div className="career-marker-dot"></div>
                </div>
                <div className="career-right">
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={`${item.year}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
