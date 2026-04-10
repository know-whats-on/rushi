import type { CSSProperties } from "react";
import "./styles/Testimonials.css";
import { portfolioContent } from "../data/portfolioContent";

const chunkTestimonials = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const getInitials = (label: string) =>
  label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

type TestimonialsColumnProps = {
  items: typeof portfolioContent.testimonials;
  duration: number;
  className?: string;
};

const TestimonialsColumn = ({
  items,
  duration,
  className = "",
}: TestimonialsColumnProps) => {
  const loopedItems = [...items, ...items];
  const style = {
    "--column-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div className={`testimonials-column ${className}`.trim()}>
      <ul className="testimonials-track" style={style}>
        {loopedItems.map((item, index) => (
          <li
            className="testimonial-card"
            key={`${item.name}-${index}`}
            aria-hidden={index >= items.length ? "true" : "false"}
          >
            <blockquote className="testimonial-quote">{item.text}</blockquote>
            <div className="testimonial-meta">
              <div className="testimonial-avatar" aria-hidden="true">
                {getInitials(item.name)}
              </div>
              <div>
                <p className="testimonial-name">{item.name}</p>
                <p className="testimonial-role">{item.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Testimonials = () => {
  const columns = chunkTestimonials(portfolioContent.testimonials, 3);

  return (
    <section className="testimonials-section">
      <div className="testimonials-shell">
        <div className="testimonials-heading">
          <h2>Client Feedback</h2>
          <p>
            Selected feedback from collaborators across higher education,
            government, community technology, and market-facing programs.
          </p>
          <small>Anonymised for privacy.</small>
        </div>

        <div className="testimonials-grid" aria-label="Scrolling testimonials">
          <TestimonialsColumn items={columns[0] ?? []} duration={18} />
          <TestimonialsColumn
            items={columns[1] ?? []}
            duration={22}
            className="testimonials-column-tablet"
          />
          <TestimonialsColumn
            items={columns[2] ?? []}
            duration={20}
            className="testimonials-column-desktop"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
