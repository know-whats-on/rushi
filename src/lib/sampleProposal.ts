import { SampleProposal, SampleProposalBundleOption } from "../data/documentSamples";
import { Quote, QuoteItem } from "../types/quotes";
import { formatCurrency, normalizeQuote } from "./quotes";

export interface SampleProposalSelection {
  selectedBaseIds: string[];
  selectedAddOnIds: string[];
}

const uniqueIds = (ids: string[]) => Array.from(new Set(ids));

const matchesExactIds = (selectedIds: string[], optionIds: string[]) => {
  const left = uniqueIds(selectedIds);
  const right = uniqueIds(optionIds);

  return left.length === right.length && left.every((id) => right.includes(id));
};

const parseSelectedIds = (
  value: string | null,
  allowedIds: string[],
  fallback: string[]
) => {
  const selectedIds = (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => allowedIds.includes(item));

  return uniqueIds(selectedIds.length ? selectedIds : fallback);
};

const createQuoteItem = (
  id: string,
  description: string,
  unitPrice: number,
  displayOrder: number
): QuoteItem => ({
  id,
  description,
  quantity: 1,
  unitPrice,
  lineTotal: unitPrice,
  displayOrder,
});

export const getSampleProposalSelectionFromParams = (
  proposal: SampleProposal,
  searchParams: URLSearchParams
): SampleProposalSelection => {
  const baseIds = proposal.baseOptions.map((option) => option.id);
  const addOnIds = proposal.addOnOptions.map((option) => option.id);

  return {
    selectedBaseIds: parseSelectedIds(
      searchParams.get("bases"),
      baseIds,
      proposal.defaultSelectedBaseIds
    ),
    selectedAddOnIds: parseSelectedIds(
      searchParams.get("addons"),
      addOnIds,
      proposal.defaultSelectedAddOnIds
    ),
  };
};

export const buildSampleProposalSearchParams = (
  selection: SampleProposalSelection,
  options?: {
    printMode?: boolean;
  }
) => {
  const searchParams = new URLSearchParams();

  searchParams.set("bases", uniqueIds(selection.selectedBaseIds).join(","));

  if (selection.selectedAddOnIds.length) {
    searchParams.set("addons", uniqueIds(selection.selectedAddOnIds).join(","));
  }

  if (options?.printMode) {
    searchParams.set("print", "1");
  }

  return searchParams;
};

export const getSelectedBaseOptions = (
  proposal: SampleProposal,
  selection: SampleProposalSelection
) =>
  proposal.baseOptions.filter((option) =>
    selection.selectedBaseIds.includes(option.id)
  );

export const getSelectedAddOnOptions = (
  proposal: SampleProposal,
  selection: SampleProposalSelection
) =>
  proposal.addOnOptions.filter((option) =>
    selection.selectedAddOnIds.includes(option.id)
  );

export const getActiveSampleBundle = (
  bundleOptions: SampleProposalBundleOption[],
  selection: SampleProposalSelection
) =>
  bundleOptions.find(
    (bundleOption) =>
      matchesExactIds(selection.selectedBaseIds, bundleOption.baseIds) &&
      matchesExactIds(selection.selectedAddOnIds, bundleOption.addOnIds)
  ) || null;

export const buildSampleProposalItems = (
  proposal: SampleProposal,
  selection: SampleProposalSelection
) => {
  const selectedBases = getSelectedBaseOptions(proposal, selection);
  const selectedAddOns = getSelectedAddOnOptions(proposal, selection);
  const activeBundle = getActiveSampleBundle(proposal.bundleOptions, selection);
  const items: QuoteItem[] = [];

  if (activeBundle) {
    items.push(
      createQuoteItem(
        `bundle-${activeBundle.id}`,
        `${activeBundle.title} | ${activeBundle.description}`,
        activeBundle.price,
        0
      )
    );
  } else {
    selectedBases.forEach((option, index) => {
      items.push(
        createQuoteItem(
          `base-${option.id}`,
          `${option.title} | ${option.subtitle}`,
          option.price,
          index
        )
      );
    });

    selectedAddOns.forEach((option) => {
      items.push(
        createQuoteItem(
          `addon-${option.id}`,
          `${option.title} | ${option.subtitle}`,
          option.price,
          items.length
        )
      );
    });
  }

  return {
    items,
    bundleActive: Boolean(activeBundle),
    activeBundle,
    selectedBases,
    selectedAddOns,
  };
};

export const buildSampleProposalQuote = (
  proposal: SampleProposal,
  selection: SampleProposalSelection
): Quote => {
  const { items } = buildSampleProposalItems(proposal, selection);

  return normalizeQuote({
    quoteCode: proposal.quoteCode,
    quoteId: proposal.quoteId,
    status: "published",
    title: proposal.title,
    clientName: proposal.clientName,
    clientCompany: proposal.clientCompany,
    clientEmail: proposal.clientEmail,
    introText: proposal.introText,
    issuedOn: proposal.issuedOn,
    currency: proposal.currency,
    gstMode: "exclusive",
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    validUntil: proposal.validUntil,
    notes: proposal.notes,
    terms: proposal.terms,
    acceptanceLine: proposal.acceptanceLine,
    ctaLabel: "Accept via email",
    adminEmail: proposal.recipientEmail,
    items,
  });
};

export const buildSampleProposalPdfUrl = (
  proposal: SampleProposal,
  selection: SampleProposalSelection,
  origin: string
) =>
  `${origin}${proposal.pdfBasePath}?${buildSampleProposalSearchParams(selection, {
    printMode: true,
  }).toString()}`;

export const buildSampleProposalMailto = (
  proposal: SampleProposal,
  selection: SampleProposalSelection,
  origin: string
) => {
  const quote = buildSampleProposalQuote(proposal, selection);
  const { selectedBases, selectedAddOns, activeBundle } =
    buildSampleProposalItems(proposal, selection);
  const pdfUrl = buildSampleProposalPdfUrl(proposal, selection, origin);

  const baseLines = selectedBases.length
    ? selectedBases.map(
        (option) => `- ${option.title} (${option.priceLabel})`
      )
    : ["- None selected"];

  const addOnLines = activeBundle
    ? [`- ${activeBundle.title} (${activeBundle.priceLabel})`]
    : selectedAddOns.length
      ? selectedAddOns.map(
          (option) => `- ${option.title} (${option.priceLabel})`
        )
      : ["- None selected"];

  const subject = `Acceptance for quote ${proposal.quoteId} (${proposal.quoteCode})`;
  const body = [
    "Hi Rushi,",
    "",
    `I'd like to accept quote ${proposal.quoteId} (${proposal.quoteCode}).`,
    "",
    "Selected base sessions:",
    ...baseLines,
    "",
    "Selected add-ons:",
    ...addOnLines,
    "",
    "Pricing summary:",
    `- Subtotal: ${formatCurrency(quote.subtotal, quote.currency)}`,
    `- GST: ${formatCurrency(quote.gstAmount, quote.currency)}`,
    `- Total: ${formatCurrency(quote.total, quote.currency)}`,
    "",
    `Print-ready PDF link: ${pdfUrl}`,
    "",
    "Please send through the next steps.",
    "",
    "Thanks,",
  ].join("\n");

  return `mailto:${proposal.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const buildSelectedSummaryLines = (
  proposal: SampleProposal,
  selection: SampleProposalSelection
) => {
  const { selectedBases, selectedAddOns, bundleActive, activeBundle } =
    buildSampleProposalItems(proposal, selection);

  return {
    baseLines: selectedBases.map((option) => ({
      id: option.id,
      title: option.title,
      priceLabel: option.priceLabel,
    })),
    addOnLines: activeBundle
      ? [
          {
            id: activeBundle.id,
            title: activeBundle.title,
            priceLabel: activeBundle.priceLabel,
          },
        ]
      : selectedAddOns.map((option) => ({
          id: option.id,
          title: option.title,
          priceLabel: option.priceLabel,
        })),
    bundleActive,
  };
};

export const toggleSelectionId = (selectedIds: string[], id: string) =>
  selectedIds.includes(id)
    ? selectedIds.filter((item) => item !== id)
    : [...selectedIds, id];
