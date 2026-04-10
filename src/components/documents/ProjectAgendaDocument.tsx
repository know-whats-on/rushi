import DocumentPreparedFor from "./DocumentPreparedFor";
import type { ProjectAgendaPageData } from "../../lib/projectDocuments";

interface ProjectAgendaDocumentProps {
  agendaPage: ProjectAgendaPageData;
}

const ProjectAgendaDocument = ({
  agendaPage,
}: ProjectAgendaDocumentProps) => {
  const agendaNoteCount = Number(Boolean(agendaPage.includedValueAdd)) +
    Number(agendaPage.overallOutcomes.length > 0);

  return (
    <article
      className="document-sheet document-sheet--agenda"
      aria-label={agendaPage.title || "Session agenda"}
    >
      <header className="document-mini-header">
        <div className="document-mini-header-copy">
          <p className="document-chip">{agendaPage.chipLabel}</p>
        </div>
        <div className="document-mini-header-brand">
          <p className="document-chip document-chip--muted">
            {agendaPage.chipSecondaryLabel}
          </p>
        </div>
      </header>

      <header className="document-header document-header--agenda">
        <h1>{agendaPage.title}</h1>
        {agendaPage.subtitle ? (
          <p className="document-subtitle">{agendaPage.subtitle}</p>
        ) : null}
      </header>

      <section className="document-agenda-meta" aria-label="Agenda facts">
        <div className="document-agenda-meta-item">
          <span>Duration</span>
          <strong>{agendaPage.duration || "TBD"}</strong>
        </div>
        <div className="document-agenda-meta-item">
          <span>Delivery</span>
          <strong>{agendaPage.deliveryMode || "TBD"}</strong>
        </div>
      </section>

      {agendaPage.contextNote ? (
        <section className="document-agenda-callout">
          <h2>Why this sequence matters</h2>
          <p>{agendaPage.contextNote}</p>
        </section>
      ) : null}

      {agendaPage.whyThisMattersNow ? (
        <section className="document-agenda-callout document-agenda-callout--subtle">
          <h2>Why this matters now</h2>
          <p>{agendaPage.whyThisMattersNow}</p>
          {agendaPage.sources.length ? (
            <ul className="document-agenda-source-list">
              {agendaPage.sources.map((source) => (
                <li key={`${source.label}-${source.url}`}>
                  <strong>{source.label}</strong>
                  <span>{source.url}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="document-agenda-sequence" aria-label="Session agenda">
        {agendaPage.blocks.map((block) => (
          <article className="document-agenda-row" key={block.id}>
            <div className="document-agenda-row-time">
              {block.timeLabel ? (
                <span className="document-agenda-time">{block.timeLabel}</span>
              ) : null}
            </div>

            <div className="document-agenda-row-content">
              <div className="document-agenda-block-top">
                <h2>{block.title}</h2>
              </div>

              {block.focus ? (
                <p className="document-agenda-focus">
                  <strong>Focus:</strong> {block.focus}
                </p>
              ) : null}

              {block.bullets.length ? (
                <ul className="document-bullet-list document-agenda-list">
                  {block.bullets.map((bullet) => (
                    <li key={`${block.id}-${bullet}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {block.examples?.length ? (
                <div className="document-agenda-examples">
                  <strong>{block.examplesLabel || "Examples"}</strong>
                  <ul className="document-bullet-list document-agenda-list">
                    {(block.examples || []).map((example) => (
                      <li key={`${block.id}-${example}`}>{example}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {block.outcome ? (
                <p className="document-agenda-outcome">
                  <strong>Outcome:</strong> {block.outcome}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {agendaPage.includedValueAdd || agendaPage.overallOutcomes.length ? (
        <section
          className={`document-agenda-notes${
            agendaNoteCount === 1 ? " document-agenda-notes--single" : ""
          }`}
        >
          {agendaPage.includedValueAdd ? (
            <article className="document-agenda-note-card document-agenda-note-card--value-add">
              <h2>Included value-add</h2>
              <p>{agendaPage.includedValueAdd}</p>
            </article>
          ) : null}

          {agendaPage.overallOutcomes.length ? (
            <article className="document-agenda-note-card document-agenda-note-card--outcomes">
              <h2>Overall outcomes</h2>
              <ul className="document-bullet-list document-agenda-list">
                {agendaPage.overallOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      {agendaPage.preparedForLogoSrc ? (
        <footer className="document-page-footer">
          <p className="document-footer-note">{agendaPage.footerNote}</p>
          <DocumentPreparedFor
            label={agendaPage.preparedForLabel}
            logoAlt={agendaPage.preparedForLogoAlt}
            logoSrc={agendaPage.preparedForLogoSrc}
          />
        </footer>
      ) : (
        <footer className="document-page-footer">
          <p className="document-footer-note">{agendaPage.footerNote}</p>
        </footer>
      )}
    </article>
  );
};

export default ProjectAgendaDocument;
