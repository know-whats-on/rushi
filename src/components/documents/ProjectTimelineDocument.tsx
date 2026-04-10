import DocumentPreparedFor from "./DocumentPreparedFor";
import type { ProjectTimelineDisplayData } from "../../lib/projectDocuments";

interface ProjectTimelineDocumentProps {
  timeline: ProjectTimelineDisplayData;
}

const ProjectTimelineDocument = ({
  timeline,
}: ProjectTimelineDocumentProps) => {
  return (
    <article
      className="document-sheet document-sheet--timeline"
      aria-label={timeline.heading || "Suggested timeline"}
    >
      <header className="document-mini-header">
        <div className="document-mini-header-copy">
          <p className="document-chip">{timeline.chipLabel}</p>
        </div>
        <div className="document-mini-header-brand">
          <p className="document-chip document-chip--muted">
            {timeline.chipSecondaryLabel}
          </p>
        </div>
      </header>

      <header className="document-header document-header--timeline">
        {timeline.eyebrow ? (
          <p className="document-timeline-eyebrow">{timeline.eyebrow}</p>
        ) : null}
        <h1>{timeline.heading}</h1>
        {timeline.intro ? (
          <p className="document-subtitle">{timeline.intro}</p>
        ) : null}
      </header>

      <section className="document-timeline-flow">
        <div className="document-timeline-track" aria-hidden="true" />
        {timeline.phases.map((phase) => (
          <article
            key={phase.id}
            className={`document-timeline-step${
              phase.includedInCurrentScope ? " is-included" : ""
            }`}
          >
            <div className="document-timeline-step-left">
              <p className="document-timeline-phase-label">{phase.label}</p>
              {phase.timing ? (
                <p className="document-timeline-phase-timing">{phase.timing}</p>
              ) : null}
              {phase.timingNote ? (
                <p className="document-timeline-phase-note">
                  {phase.timingNote}
                </p>
              ) : null}
            </div>

            <div className="document-timeline-marker" aria-hidden="true">
              <span className="document-timeline-marker-dot" />
            </div>

            <div className="document-timeline-step-right">
              <div className="document-timeline-step-top">
                <div className="document-timeline-title-row">
                  <span
                    className="document-timeline-selection-indicator"
                    aria-hidden="true"
                  />
                  <h2>{phase.title || phase.label}</h2>
                </div>
                {phase.statusLabel ? (
                  <span
                    className={`document-timeline-status${
                      phase.includedInCurrentScope ? " is-included" : ""
                    }`}
                  >
                    {phase.statusLabel}
                  </span>
                ) : null}
              </div>

              {phase.summary ? (
                <p className="document-timeline-summary">{phase.summary}</p>
              ) : null}

              {phase.helperText ? (
                <p className="document-timeline-helper">{phase.helperText}</p>
              ) : null}

              {phase.deliverables.length ? (
                <ul className="document-bullet-list document-timeline-deliverables">
                  {phase.deliverables.map((deliverable) => (
                    <li key={`${phase.id}-${deliverable}`}>{deliverable}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {timeline.closingNote ? (
        <p className="document-timeline-closing">{timeline.closingNote}</p>
      ) : null}

      {timeline.preparedForLogoSrc ? (
        <footer className="document-page-footer document-page-footer--end">
          <DocumentPreparedFor
            label={timeline.preparedForLabel}
            logoAlt={timeline.preparedForLogoAlt}
            logoSrc={timeline.preparedForLogoSrc}
          />
        </footer>
      ) : null}
    </article>
  );
};

export default ProjectTimelineDocument;
