import { supabase } from "./supabase";
import { Quote, QuoteGstMode, QuoteItem, QuoteListItem } from "../types/quotes";

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const toNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value: number, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const createEmptyQuoteItem = (displayOrder = 0): QuoteItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
  lineTotal: 0,
  displayOrder,
});

export const createEmptyQuote = (): Quote => ({
  quoteCode: "",
  quoteId: "",
  status: "draft",
  title: "AI Capability Engagement",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  introText:
    "Thank you for the opportunity. Below is a proposed scope for the work discussed.",
  issuedOn: "",
  currency: "AUD",
  gstMode: "exclusive",
  subtotal: 0,
  gstAmount: 0,
  total: 0,
  validUntil: "",
  notes:
    "Please reply to this quote if you would like any adjustments to scope, sequencing, or workshop format.",
  terms:
    "This quote is valid for the period shown above and may be updated if scope changes.",
  acceptanceLine: "Accepted by:",
  ctaLabel: "Email about this quote",
  adminEmail: "rushi@knowwhatson.com",
  items: [
    createEmptyQuoteItem(0),
    createEmptyQuoteItem(1),
  ],
});

const calculateLineTotal = (item: QuoteItem) =>
  roundCurrency(toNumber(item.quantity) * toNumber(item.unitPrice));

export const normalizeQuote = (quote: Quote): Quote => {
  const items = quote.items.map((item, index) => {
    const normalizedItem = {
      ...item,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      displayOrder: index,
    };

    return {
      ...normalizedItem,
      lineTotal: calculateLineTotal(normalizedItem),
    };
  });

  const subtotalBase = roundCurrency(
    items.reduce((sum, item) => sum + item.lineTotal, 0)
  );

  let subtotal = subtotalBase;
  let gstAmount = 0;
  let total = subtotalBase;

  if (quote.gstMode === "exclusive") {
    gstAmount = roundCurrency(subtotalBase * 0.1);
    total = roundCurrency(subtotalBase + gstAmount);
  }

  if (quote.gstMode === "inclusive") {
    gstAmount = roundCurrency(subtotalBase / 11);
    subtotal = roundCurrency(subtotalBase - gstAmount);
    total = subtotalBase;
  }

  return {
    ...quote,
    items,
    subtotal,
    gstAmount,
    total,
  };
};

const mapQuoteRow = (row: Record<string, unknown>, items: QuoteItem[]): Quote =>
  normalizeQuote({
    id: row.id as string,
    quoteCode: (row.quote_code as string) || "",
    quoteId: (row.quote_id as string) || "",
    status: (row.status as Quote["status"]) || "draft",
    title: (row.title as string) || "",
    clientName: (row.client_name as string) || "",
    clientCompany: (row.client_company as string) || "",
    clientEmail: (row.client_email as string) || "",
    introText: (row.intro_text as string) || "",
    issuedOn: (row.issued_on as string) || "",
    currency: ((row.currency as string) || "AUD").toUpperCase(),
    gstMode: (row.gst_mode as QuoteGstMode) || "exclusive",
    subtotal: toNumber(row.subtotal as number),
    gstAmount: toNumber(row.gst_amount as number),
    total: toNumber(row.total as number),
    validUntil: (row.valid_until as string) || "",
    notes: (row.notes as string) || "",
    terms: (row.terms as string) || "",
    acceptanceLine: (row.acceptance_line as string) || "",
    ctaLabel: (row.cta_label as string) || "Email about this quote",
    adminEmail: (row.admin_email as string) || "rushi@knowwhatson.com",
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
    items,
  });

const mapItemRow = (row: Record<string, unknown>): QuoteItem => ({
  id: (row.id as string) || crypto.randomUUID(),
  description: (row.description as string) || "",
  quantity: toNumber(row.quantity as number),
  unitPrice: toNumber(row.unit_price as number),
  lineTotal: toNumber(row.line_total as number),
  displayOrder: toNumber(row.display_order as number),
});

export const listAdminQuotes = async (): Promise<QuoteListItem[]> => {
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_QUOTES")
    .select("id, quote_code, status, title, client_company, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    quoteCode: row.quote_code,
    status: row.status,
    title: row.title,
    clientCompany: row.client_company || "",
    updatedAt: row.updated_at || undefined,
  }));
};

export const getAdminQuote = async (quoteId: string): Promise<Quote> => {
  const { data: quoteRow, error: quoteError } = await supabase
    .from("RUSHI_PERSONAL_QUOTES")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (quoteError) {
    throw new Error(quoteError.message);
  }

  const { data: itemRows, error: itemError } = await supabase
    .from("RUSHI_PERSONAL_QUOTE_ITEMS")
    .select("*")
    .eq("quote_id", quoteId)
    .order("display_order", { ascending: true });

  if (itemError) {
    throw new Error(itemError.message);
  }

  return mapQuoteRow(quoteRow, (itemRows || []).map(mapItemRow));
};

export const saveAdminQuote = async (input: Quote): Promise<Quote> => {
  const normalized = normalizeQuote(input);
  const quotePayload = {
    quote_code: normalized.quoteCode.trim(),
    quote_id: normalized.quoteId.trim(),
    status: normalized.status,
    title: normalized.title.trim(),
    client_name: normalized.clientName.trim(),
    client_company: normalized.clientCompany.trim(),
    client_email: normalized.clientEmail.trim(),
    intro_text: normalized.introText.trim(),
    issued_on: normalized.issuedOn || null,
    currency: normalized.currency.toUpperCase(),
    gst_mode: normalized.gstMode,
    subtotal: normalized.subtotal,
    gst_amount: normalized.gstAmount,
    total: normalized.total,
    valid_until: normalized.validUntil || null,
    notes: normalized.notes.trim() || null,
    terms: normalized.terms.trim() || null,
    acceptance_line: normalized.acceptanceLine.trim() || null,
    cta_label: normalized.ctaLabel.trim() || "Email about this quote",
    admin_email: normalized.adminEmail.trim().toLowerCase(),
  };

  let quoteId = normalized.id;

  if (quoteId) {
    const { error } = await supabase
      .from("RUSHI_PERSONAL_QUOTES")
      .update(quotePayload)
      .eq("id", quoteId);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_QUOTES")
      .insert(quotePayload)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    quoteId = data.id;
  }

  const { error: deleteError } = await supabase
    .from("RUSHI_PERSONAL_QUOTE_ITEMS")
    .delete()
    .eq("quote_id", quoteId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const preparedItems = normalized.items
    .filter(
      (item) =>
        item.description.trim() || item.quantity > 0 || item.unitPrice > 0
    )
    .map((item, index) => ({
      quote_id: quoteId,
      description: item.description.trim(),
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
      display_order: index,
    }));

  if (preparedItems.length) {
    const { error: insertError } = await supabase
      .from("RUSHI_PERSONAL_QUOTE_ITEMS")
      .insert(preparedItems);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  if (!quoteId) {
    throw new Error("A quote ID was not returned after saving.");
  }

  return getAdminQuote(quoteId);
};

export const deleteAdminQuote = async (quoteId: string): Promise<void> => {
  const { error } = await supabase
    .from("RUSHI_PERSONAL_QUOTES")
    .delete()
    .eq("id", quoteId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getPublicQuoteByCode = async (
  code: string
): Promise<Quote | null> => {
  const { data, error } = await supabase.rpc("RUSHI_PERSONAL_GET_QUOTE_BY_CODE", {
    input_code: code.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const payload = Array.isArray(data) ? data[0] : data;
  if (!payload) {
    return null;
  }

  return normalizeQuote({
    id: payload.id,
    quoteCode: payload.quoteCode,
    quoteId: payload.quoteId || "",
    status: payload.status,
    title: payload.title,
    clientName: payload.clientName,
    clientCompany: payload.clientCompany,
    clientEmail: payload.clientEmail,
    introText: payload.introText || "",
    issuedOn: payload.issuedOn || "",
    currency: payload.currency || "AUD",
    gstMode: payload.gstMode || "exclusive",
    subtotal: toNumber(payload.subtotal),
    gstAmount: toNumber(payload.gstAmount),
    total: toNumber(payload.total),
    validUntil: payload.validUntil || "",
    notes: payload.notes || "",
    terms: payload.terms || "",
    acceptanceLine: payload.acceptanceLine || "",
    ctaLabel: payload.ctaLabel || "Email about this quote",
    adminEmail: payload.adminEmail || "rushi@knowwhatson.com",
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    items: (payload.items || []).map((item: Record<string, unknown>) => ({
      id: (item.id as string) || crypto.randomUUID(),
      description: (item.description as string) || "",
      quantity: toNumber(item.quantity as number),
      unitPrice: toNumber(item.unitPrice as number),
      lineTotal: toNumber(item.lineTotal as number),
      displayOrder: toNumber(item.displayOrder as number),
    })),
  });
};

export const getQuotePublicLink = (quote: Quote) =>
  quote.quoteCode.trim()
    ? `${window.location.origin}/studio/project/${encodeURIComponent(
        quote.quoteCode.trim()
      )}`
    : "";

export const getQuotePublishErrors = (quote: Quote) => {
  const errors: string[] = [];
  const hasItems = quote.items.some(
    (item) =>
      item.description.trim() && item.quantity > 0 && item.unitPrice >= 0
  );

  if (!quote.quoteCode.trim()) {
    errors.push("Quote code is required before publishing.");
  }

  if (!quote.quoteId.trim()) {
    errors.push("Quote ID is required before publishing.");
  }

  if (!quote.title.trim()) {
    errors.push("Quote title is required before publishing.");
  }

  if (!quote.issuedOn.trim()) {
    errors.push("Issued date is required before publishing.");
  }

  if (!hasItems) {
    errors.push("Add at least one priced line item before publishing.");
  }

  return errors;
};

export const buildQuoteMailto = (quote: Quote) => {
  const subject = `Enquiry about quote ${quote.quoteCode}`;
  const body = [
    "Hi Rushi,",
    "",
    `I’m writing about quote ${quote.quoteCode}.`,
    "",
    "Please let me know the next steps.",
    "",
    "Thanks,",
  ].join("\n");

  return `mailto:rushi@knowwhatson.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
