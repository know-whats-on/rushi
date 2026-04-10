import { Quote } from "../../types/quotes";
import { formatCurrency } from "../../lib/quotes";
import DocumentPreparedFor from "./DocumentPreparedFor";
import DocumentInlineField from "./DocumentInlineField";

interface QuoteDocumentAdjustment {
  id: string;
  title: string;
  amount: number;
}

interface QuoteDocumentProps {
  preparedForLabel?: string;
  preparedForLogoAlt?: string;
  preparedForLogoSrc?: string;
  quote: Quote;
  totalsAdjustments?: QuoteDocumentAdjustment[];
  previewMode?: boolean;
  editable?: boolean;
  onAcceptanceCommit?: (value: string) => void;
  onClientCompanyCommit?: (value: string) => void;
  onClientNameCommit?: (value: string) => void;
  onIntroCommit?: (value: string) => void;
  onIssuedOnCommit?: (value: string) => void;
  onItemDescriptionCommit?: (itemId: string, value: string) => void;
  onItemQuantityCommit?: (itemId: string, value: number) => void;
  onItemUnitPriceCommit?: (itemId: string, value: number) => void;
  onNotesCommit?: (value: string) => void;
  onQuoteIdCommit?: (value: string) => void;
  onTermsCommit?: (value: string) => void;
  onTitleCommit?: (value: string) => void;
  onValidUntilCommit?: (value: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  dateStyle: "medium",
});

const formatDocumentDate = (value: string) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return dateFormatter.format(parsed);
};

const QuoteDocument = ({
  preparedForLabel,
  preparedForLogoAlt,
  preparedForLogoSrc,
  quote,
  totalsAdjustments = [],
  previewMode = false,
  editable = false,
  onAcceptanceCommit,
  onClientCompanyCommit,
  onClientNameCommit,
  onIntroCommit,
  onIssuedOnCommit,
  onItemDescriptionCommit,
  onItemQuantityCommit,
  onItemUnitPriceCommit,
  onNotesCommit,
  onQuoteIdCommit,
  onTermsCommit,
  onTitleCommit,
  onValidUntilCommit,
}: QuoteDocumentProps) => {
  const visibleItems = quote.items.filter(
    (item) =>
      item.description.trim() || item.quantity > 0 || item.unitPrice > 0
  );
  const items =
    visibleItems.length || !editable
      ? visibleItems.length
        ? visibleItems
        : previewMode
          ? quote.items
          : []
      : quote.items;
  const discountItems = items.filter((item) => item.lineTotal < 0).map((item) => ({
    id: item.id,
    title: item.description,
    value: item.lineTotal,
  }));
  const supplementalAdjustmentRows = totalsAdjustments.map((adjustment) => ({
    id: adjustment.id,
    title: adjustment.title,
    value: -adjustment.amount,
  }));
  const totalAdjustmentRows = [...supplementalAdjustmentRows, ...discountItems];
  const serviceTotal = items
    .filter((item) => item.lineTotal > 0)
    .reduce((sum, item) => sum + item.lineTotal, 0) +
    totalsAdjustments.reduce((sum, adjustment) => sum + adjustment.amount, 0);

  return (
    <article
      className="document-sheet document-sheet--quote"
      aria-label={quote.title || "Project quote"}
    >
      <header className="document-mini-header">
        <div className="document-mini-header-copy">
          <p className="document-chip">Project Quote</p>
        </div>
        <div className="document-mini-header-brand">
          <p className="document-chip document-chip--muted">
            {quote.status === "published" ? "Live" : "Draft"}
          </p>
        </div>
      </header>

      <header className="document-header document-header--quote">
        <div>
          <DocumentInlineField
            as="h1"
            className="document-inline-field--block"
            displayValue={quote.title || "Project Quote"}
            editValue={quote.title}
            editable={editable}
            onCommit={onTitleCommit}
            placeholder="Add quote title"
          />
          {quote.introText || editable ? (
            <DocumentInlineField
              as="p"
              className="document-subtitle document-inline-field--block"
              displayValue={quote.introText}
              editable={editable}
              multiline
              onCommit={onIntroCommit}
              placeholder="Add intro"
            />
          ) : null}
        </div>
        {quote.validUntil || editable ? (
          <p className="document-quote-validity">
            Valid until{" "}
            <DocumentInlineField
              as="span"
              displayValue={formatDocumentDate(quote.validUntil)}
              editValue={quote.validUntil}
              editable={editable}
              onCommit={onValidUntilCommit}
              placeholder="Add validity date"
            />
          </p>
        ) : null}
      </header>

      <section className="document-facts-grid" aria-label="Quote details">
        <div className="document-fact">
          <span>Client</span>
          <DocumentInlineField
            as="strong"
            displayValue={quote.clientName}
            editable={editable}
            onCommit={onClientNameCommit}
            placeholder="Add client name"
          />
        </div>
        <div className="document-fact">
          <span>Organisation</span>
          <DocumentInlineField
            as="strong"
            displayValue={quote.clientCompany}
            editable={editable}
            onCommit={onClientCompanyCommit}
            placeholder="Add organisation"
          />
        </div>
        <div className="document-fact">
          <span>Quote ID</span>
          <DocumentInlineField
            as="strong"
            displayValue={quote.quoteId || quote.quoteCode}
            editValue={quote.quoteId}
            editable={editable}
            onCommit={onQuoteIdCommit}
            placeholder="Add quote ID"
          />
        </div>
        <div className="document-fact">
          <span>Date</span>
          <DocumentInlineField
            as="strong"
            displayValue={formatDocumentDate(quote.issuedOn)}
            editValue={quote.issuedOn}
            editable={editable}
            onCommit={onIssuedOnCommit}
            placeholder="Add issued date"
          />
        </div>
      </section>

      <section className="document-section document-section--table">
        <table className="document-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <DocumentInlineField
                    as="span"
                    displayValue={item.description}
                    editable={editable}
                    onCommit={(value) => onItemDescriptionCommit?.(item.id, value)}
                    placeholder="Add a scoped line item"
                  />
                </td>
                <td>
                  <DocumentInlineField
                    as="span"
                    displayValue={String(item.quantity)}
                    editValue={String(item.quantity)}
                    editable={editable}
                    inputMode="numeric"
                    inputType="number"
                    onCommit={(value) =>
                      onItemQuantityCommit?.(item.id, Number(value) || 1)
                    }
                    placeholder="1"
                  />
                </td>
                <td>
                  <DocumentInlineField
                    as="span"
                    displayValue={formatCurrency(item.unitPrice, quote.currency)}
                    editValue={String(item.unitPrice)}
                    editable={editable}
                    inputMode="decimal"
                    inputType="number"
                    onCommit={(value) =>
                      onItemUnitPriceCommit?.(item.id, Number(value) || 0)
                    }
                    placeholder="0"
                  />
                </td>
                <td>{formatCurrency(item.lineTotal, quote.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="document-quote-lower">
        <div className="document-quote-text">
          {quote.notes || editable ? (
            <section className="document-section">
              <h2>Notes</h2>
              <DocumentInlineField
                as="p"
                className="document-inline-field--block"
                displayValue={quote.notes}
                editable={editable}
                multiline
                onCommit={onNotesCommit}
                placeholder="Add quote notes"
              />
            </section>
          ) : null}

          {quote.terms || editable ? (
            <section className="document-section">
              <h2>Terms</h2>
              <DocumentInlineField
                as="p"
                className="document-inline-field--block"
                displayValue={quote.terms}
                editable={editable}
                multiline
                onCommit={onTermsCommit}
                placeholder="Add quote terms"
              />
            </section>
          ) : null}

          {quote.acceptanceLine || editable ? (
            <section className="document-section">
              <h2>Acceptance</h2>
              <DocumentInlineField
                as="p"
                className="document-acceptance-line document-inline-field--block"
                displayValue={quote.acceptanceLine}
                editable={editable}
                onCommit={onAcceptanceCommit}
                placeholder="Add acceptance line"
              />
            </section>
          ) : null}
        </div>

        <aside className="document-total-box" aria-label="Totals">
          {totalAdjustmentRows.length ? (
            <div className="document-total-row">
              <span>Services</span>
              <strong>{formatCurrency(serviceTotal, quote.currency)}</strong>
            </div>
          ) : null}
          {totalAdjustmentRows.map((item) => (
            <div
              key={item.id}
              className="document-total-row document-total-row--discount"
            >
              <span>{item.title}</span>
              <strong>{formatCurrency(item.value, quote.currency)}</strong>
            </div>
          ))}
          {totalAdjustmentRows.length ? <div className="document-divider" /> : null}
          <div className="document-total-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(quote.subtotal, quote.currency)}</strong>
          </div>
          {quote.gstMode !== "none" ? (
            <div className="document-total-row">
              <span>GST</span>
              <strong>{formatCurrency(quote.gstAmount, quote.currency)}</strong>
            </div>
          ) : null}
          <div className="document-divider" />
          <div className="document-total-row document-total-row--grand">
            <span>Total</span>
            <strong>{formatCurrency(quote.total, quote.currency)}</strong>
          </div>
        </aside>
      </section>

      {preparedForLogoSrc ? (
        <footer className="document-page-footer document-page-footer--end">
          <DocumentPreparedFor
            label={preparedForLabel}
            logoAlt={preparedForLogoAlt}
            logoSrc={preparedForLogoSrc}
          />
        </footer>
      ) : null}
    </article>
  );
};

export default QuoteDocument;
