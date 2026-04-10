import {
  SampleProposalBrochureSection,
  SampleProposalFact,
} from "../../data/documentSamples";
import DocumentPreparedFor from "./DocumentPreparedFor";
import DocumentInlineField from "./DocumentInlineField";

export interface ProposalBrochureDocumentData {
  chipLabel: string;
  chipSecondaryLabel?: string;
  footerNote?: string;
  preparedForLabel?: string;
  preparedForLogoAlt?: string;
  preparedForLogoSrc?: string;
  title: string;
  subtitle: string;
  facts: SampleProposalFact[];
  sections: SampleProposalBrochureSection[];
}

interface ProposalBrochureDocumentProps {
  brochure: ProposalBrochureDocumentData;
  editable?: boolean;
  onFactCommit?: (label: string, value: string) => void;
  onFooterNoteCommit?: (value: string) => void;
  onSectionBulletCommit?: (
    sectionId: string | undefined,
    bulletIndex: number,
    value: string
  ) => void;
  onSectionParagraphCommit?: (
    sectionId: string | undefined,
    paragraphIndex: number,
    value: string
  ) => void;
  onSectionTitleCommit?: (sectionId: string | undefined, value: string) => void;
  onSubtitleCommit?: (value: string) => void;
  onTitleCommit?: (value: string) => void;
}

const getSectionWeight = (section: SampleProposalBrochureSection) => {
  const paragraphs = section.paragraphs?.filter((item) => item.trim()) || [];
  const bullets = section.bullets?.filter((item) => item.trim()) || [];
  const paragraphWeight = paragraphs.reduce(
    (total, paragraph) => total + Math.ceil(paragraph.length / 92),
    0
  );
  const bulletWeight = bullets.reduce(
    (total, bullet) => total + Math.ceil(bullet.length / 70),
    0
  );

  return 1 + paragraphWeight + bulletWeight + paragraphs.length * 0.8 + bullets.length * 0.6;
};

const distributeSections = (sections: SampleProposalBrochureSection[]) => {
  const left: SampleProposalBrochureSection[] = [];
  const right: SampleProposalBrochureSection[] = [];
  let leftWeight = 0;
  let rightWeight = 0;

  sections.forEach((section, index) => {
    const weight = getSectionWeight(section);

    if (index === 0) {
      left.push(section);
      leftWeight += weight;
      return;
    }

    if (index === 1) {
      right.push(section);
      rightWeight += weight;
      return;
    }

    const preferredSide = section.column;
    const alternateSide = preferredSide === "left" ? "right" : "left";
    const preferredDiff = Math.abs(
      (preferredSide === "left" ? leftWeight + weight : leftWeight) -
        (preferredSide === "right" ? rightWeight + weight : rightWeight)
    );
    const alternateDiff = Math.abs(
      (alternateSide === "left" ? leftWeight + weight : leftWeight) -
        (alternateSide === "right" ? rightWeight + weight : rightWeight)
    );
    const targetSide = alternateDiff < preferredDiff ? alternateSide : preferredSide;

    if (targetSide === "left") {
      left.push(section);
      leftWeight += weight;
      return;
    }

    right.push(section);
    rightWeight += weight;
  });

  return {
    left,
    right,
  };
};

const renderSection = (
  section: SampleProposalBrochureSection,
  options: Omit<ProposalBrochureDocumentProps, "brochure">
) => {
  const paragraphs = section.paragraphs?.filter((item) => item.trim()) || [];
  const bullets = section.bullets?.filter((item) => item.trim()) || [];
  const editableParagraphs = options.editable && !paragraphs.length ? [""] : paragraphs;
  const editableBullets = options.editable && !bullets.length ? [""] : bullets;

  if (!options.editable && !paragraphs.length && !bullets.length) {
    return null;
  }

  return (
    <section
      className="document-section"
      key={`${section.id || section.column}-${section.title}`}
    >
      <DocumentInlineField
        as="h2"
        className="document-inline-field--block"
        displayValue={section.title}
        editable={options.editable}
        onCommit={(value) => options.onSectionTitleCommit?.(section.id, value)}
        placeholder="Add section title"
      />
      {editableParagraphs.map((paragraph, index) => (
        <DocumentInlineField
          key={`${section.id || section.title}-paragraph-${index}`}
          as="p"
          className="document-inline-field--block"
          displayValue={paragraph}
          editable={options.editable}
          multiline
          onCommit={(value) =>
            options.onSectionParagraphCommit?.(section.id, index, value)
          }
          placeholder="Add paragraph"
        />
      ))}
      {editableBullets.length ? (
        <ul className="document-bullet-list">
          {editableBullets.map((bullet, index) => (
            <li key={`${section.id || section.title}-bullet-${index}`}>
              <DocumentInlineField
                as="span"
                displayValue={bullet}
                editable={options.editable}
                multiline
                onCommit={(value) =>
                  options.onSectionBulletCommit?.(section.id, index, value)
                }
                placeholder="Add bullet"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

const ProposalBrochureDocument = ({
  brochure,
  editable = false,
  onFactCommit,
  onFooterNoteCommit,
  onSectionBulletCommit,
  onSectionParagraphCommit,
  onSectionTitleCommit,
  onSubtitleCommit,
  onTitleCommit,
}: ProposalBrochureDocumentProps) => {
  const { left: leftColumn, right: rightColumn } = distributeSections(
    brochure.sections
  );

  return (
    <article
      className="document-sheet document-sheet--brochure"
      aria-label={brochure.title || "Project brochure"}
    >
      <header className="document-mini-header">
        <div className="document-mini-header-copy">
          <p className="document-chip">{brochure.chipLabel}</p>
        </div>
        <div className="document-mini-header-brand">
          {brochure.chipSecondaryLabel ? (
            <p className="document-chip document-chip--muted">
              {brochure.chipSecondaryLabel}
            </p>
          ) : null}
        </div>
      </header>

      <header className="document-header">
        <DocumentInlineField
          as="h1"
          className="document-inline-field--block"
          displayValue={brochure.title}
          editable={editable}
          onCommit={onTitleCommit}
          placeholder="Add brochure title"
        />
        {brochure.subtitle || editable ? (
          <DocumentInlineField
            as="p"
            className="document-subtitle document-inline-field--block"
            displayValue={brochure.subtitle}
            editable={editable}
            multiline
            onCommit={onSubtitleCommit}
            placeholder="Add brochure subtitle"
          />
        ) : null}
      </header>

      <section className="document-facts-grid" aria-label="Workshop facts">
        {brochure.facts.map((fact) => (
          <div className="document-fact" key={`${brochure.title}-${fact.label}`}>
            <span>{fact.label}</span>
            <DocumentInlineField
              as="strong"
              displayValue={fact.value}
              editable={editable}
              onCommit={(value) => onFactCommit?.(fact.label, value)}
              placeholder={`Add ${fact.label.toLowerCase()}`}
            />
          </div>
        ))}
      </section>

      <section className="brochure-columns">
        <div className="brochure-column">
          {leftColumn.map((section) =>
            renderSection(section, {
              editable,
              onFactCommit,
              onFooterNoteCommit,
              onSectionBulletCommit,
              onSectionParagraphCommit,
              onSectionTitleCommit,
              onSubtitleCommit,
              onTitleCommit,
            })
          )}
        </div>

        <div className="brochure-column">
          {rightColumn.map((section) =>
            renderSection(section, {
              editable,
              onFactCommit,
              onFooterNoteCommit,
              onSectionBulletCommit,
              onSectionParagraphCommit,
              onSectionTitleCommit,
              onSubtitleCommit,
              onTitleCommit,
            })
          )}
        </div>
      </section>

      {brochure.footerNote || brochure.preparedForLogoSrc || editable ? (
        <footer
          className={`document-page-footer${
            brochure.footerNote ? "" : " document-page-footer--end"
          }`}
        >
          {brochure.footerNote || editable ? (
            <DocumentInlineField
              as="p"
              className="document-footer-note document-inline-field--block"
              displayValue={brochure.footerNote || ""}
              editable={editable}
              multiline
              onCommit={onFooterNoteCommit}
              placeholder="Add footer note"
            />
          ) : null}
          <DocumentPreparedFor
            label={brochure.preparedForLabel}
            logoAlt={brochure.preparedForLogoAlt}
            logoSrc={brochure.preparedForLogoSrc}
          />
        </footer>
      ) : null}
    </article>
  );
};

export default ProposalBrochureDocument;
