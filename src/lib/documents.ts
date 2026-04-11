import type { Brochure } from "../types/brochures";
import {
  createRheemProjectDocumentSeed,
  isRheemProjectPublicCode,
} from "../data/rheemProject";
import {
  createRheemPressoProjectDocumentSeed,
  isRheemPressoProjectPublicCode,
} from "../data/rheemPressoProject";
import {
  createTechnetProjectDocumentSeed,
  isTechnetProjectPublicCode,
  isTechnetProjectRetiredCode,
} from "../data/technetProject";
import {
  createUnswCyberSecuritySummitProjectDocumentSeed,
  isUnswCyberSecuritySummitProjectPublicCode,
} from "../data/unswCyberSecuritySummitProject";
import {
  createUnswAssessmentProjectDocumentSeed,
  isUnswAssessmentProjectPublicCode,
} from "../data/unswAssessmentProject";
import {
  createInfs5700KeynoteProjectDocumentSeed,
  isInfs5700KeynoteProjectPublicCode,
} from "../data/infs5700KeynoteProject";
import {
  BROCHURE_SECTION_ORDER,
  type BrochureSectionId,
} from "../types/brochures";
import type {
  BrochureDocumentContent,
  DocumentKind,
  DocumentLibraryMeta,
  ProjectDocumentContent,
  QuoteDocumentContent,
  StudioLibraryCard,
  StudioDocument,
  StudioDocumentContent,
} from "../types/documents";
import type { Quote } from "../types/quotes";
import {
  buildDefaultBrochureSections,
  createEmptyBrochureCta,
  getBrochurePublishErrors,
  normalizeBrochure,
} from "./brochures";
import {
  buildProjectQuote,
  createEmptyProjectContent,
  deriveProjectLibraryMeta,
  isProjectDocument,
  normalizeProjectContent,
} from "./projectDocuments";
import { buildStudioAppUrl } from "./studioAppOrigin";
import {
  createEmptyQuoteItem,
  getQuotePublishErrors,
  normalizeQuote,
} from "./quotes";
import { supabase } from "./supabase";

const emptyString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeBullets = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) => emptyString(item))
        .filter(Boolean)
        .slice(0, 6)
    : [];

const normalizeBoolean = (value: unknown) => Boolean(value);

const parsePriceLabel = (value: string) => {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) || 0 : 0;
};

const LOCAL_STUDIO_RECORDS_KEY = "rushi-personal-studio-admin-records";
const LEGACY_STUDIO_SAMPLE_CODES = new Set(["sample"]);

export const isLegacyStudioSampleCode = (code: string) =>
  LEGACY_STUDIO_SAMPLE_CODES.has(code.trim().toLowerCase());

const buildAutoQuoteIdPrefix = (...values: string[]) => {
  const letters = values
    .join("")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  return (letters || "QTE").padEnd(3, "X").slice(0, 3);
};

const buildAutoQuoteIdSuffix = (seed: string) => {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) % 10000;
  }

  return String(hash).padStart(4, "0");
};

const buildAutoProjectCodePrefix = (...values: string[]) => {
  const letters = values
    .join("")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return (letters || "PROJECT").padEnd(6, "X").slice(0, 6);
};

const buildAutoProjectCode = (document: {
  id?: string;
  clientCompany?: string;
  title?: string;
  createdAt?: string;
}) => {
  const prefix = buildAutoProjectCodePrefix(
    emptyString(document.clientCompany),
    emptyString(document.title)
  );
  const seed =
    [
      emptyString(document.clientCompany),
      emptyString(document.title),
      emptyString(document.id),
      emptyString(document.createdAt),
    ]
      .filter(Boolean)
      .join("|") || prefix;

  return `${prefix}${buildAutoQuoteIdSuffix(seed)}`;
};

const buildAutoProjectQuoteId = (document: {
  id?: string;
  code?: string;
  clientCompany?: string;
  title?: string;
  createdAt?: string;
}) => {
  const prefix = buildAutoQuoteIdPrefix(
    emptyString(document.code),
    emptyString(document.clientCompany),
    emptyString(document.title)
  );
  const seed =
    [
      emptyString(document.code),
      emptyString(document.clientCompany),
      emptyString(document.title),
      emptyString(document.id),
      emptyString(document.createdAt),
    ]
      .filter(Boolean)
      .join("|") || prefix;

  return `${prefix}${buildAutoQuoteIdSuffix(seed)}`;
};

export const createEmptyDocumentLibraryMeta = (): DocumentLibraryMeta => ({
  isListed: false,
  cardCompany: "",
  cardTitle: "",
  cardCategory: "",
  cardStatusLabel: "",
  cardSummary: "",
  cardLogoUrl: "",
});

const normalizeDocumentLibraryMeta = (
  value: unknown
): DocumentLibraryMeta => {
  if (!value || typeof value !== "object") {
    return createEmptyDocumentLibraryMeta();
  }

  const record = value as Record<string, unknown>;

  return {
    isListed: normalizeBoolean(record.isListed),
    cardCompany: emptyString(record.cardCompany),
    cardTitle: emptyString(record.cardTitle),
    cardCategory: emptyString(record.cardCategory),
    cardStatusLabel: emptyString(record.cardStatusLabel),
    cardSummary: emptyString(record.cardSummary),
    cardLogoUrl: emptyString(record.cardLogoUrl),
  };
};

const isBrochureContent = (
  value: StudioDocumentContent
): value is BrochureDocumentContent => "sections" in value && !("mode" in value);

const isQuoteContent = (
  value: StudioDocumentContent
): value is QuoteDocumentContent => "items" in value && !("mode" in value);

export const createEmptyBrochureContent = (): BrochureDocumentContent => ({
  logoUrl: "",
  subtitle: "",
  duration: "",
  deliveryMode: "",
  studyLoad: "",
  priceLabel: "",
  ctas: [createEmptyBrochureCta()],
  sections: buildDefaultBrochureSections(),
  footerComplianceText: "",
  libraryMeta: createEmptyDocumentLibraryMeta(),
});

export const createEmptyQuoteContent = (): QuoteDocumentContent => ({
  quoteId: "",
  introText:
    "Thank you for the opportunity. Below is a proposed scope for the work discussed.",
  issuedOn: "",
  currency: "AUD",
  gstMode: "exclusive",
  validUntil: "",
  notes:
    "Please reply to this quote if you would like any adjustments to scope, sequencing, or delivery format.",
  terms:
    "This quote is valid for the period shown above and may be updated if scope changes.",
  acceptanceLine: "Accepted by:",
  items: [createEmptyQuoteItem(0), createEmptyQuoteItem(1)],
  libraryMeta: createEmptyDocumentLibraryMeta(),
});

export const createEmptyStudioDocument = (
  kind: DocumentKind = "project"
): StudioDocument => ({
  kind,
  code: "",
  status: "draft",
  title: "Brochure Quote",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  ctaLabel: kind === "project" ? "Accept via email" : "Email Rushi",
  adminEmail: "rushi@knowwhatson.com",
  content:
    kind === "project"
      ? createEmptyProjectContent()
      : kind === "quote"
        ? createEmptyQuoteContent()
        : createEmptyBrochureContent(),
});

export const getDocumentKindLabel = (kind: DocumentKind) => {
  if (kind === "project") {
    return "Project";
  }

  return kind === "brochure" ? "Brochure" : "Quote";
};

const normalizeBrochureContent = (
  content: BrochureDocumentContent
): BrochureDocumentContent => {
  const brochure = normalizeBrochure({
    brochureCode: "",
    status: "draft",
    clientName: "",
    logoUrl: content.logoUrl,
    title: "",
    subtitle: content.subtitle,
    duration: content.duration,
    deliveryMode: content.deliveryMode,
    studyLoad: content.studyLoad,
    priceLabel: content.priceLabel,
    ctas: content.ctas,
    sections: content.sections,
    footerComplianceText: content.footerComplianceText,
    adminEmail: "rushi@knowwhatson.com",
  });

  return {
    logoUrl: brochure.logoUrl,
    subtitle: brochure.subtitle,
    duration: brochure.duration,
    deliveryMode: brochure.deliveryMode,
    studyLoad: brochure.studyLoad,
    priceLabel: brochure.priceLabel,
    ctas: brochure.ctas,
    sections: brochure.sections,
    footerComplianceText: brochure.footerComplianceText,
    libraryMeta: normalizeDocumentLibraryMeta(content.libraryMeta),
  };
};

const normalizeQuoteContent = (
  content: QuoteDocumentContent
): QuoteDocumentContent => {
  const quote = normalizeQuote({
    quoteCode: "",
    quoteId: content.quoteId,
    status: "draft",
    title: "",
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    introText: content.introText,
    issuedOn: content.issuedOn,
    currency: content.currency,
    gstMode: content.gstMode,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    validUntil: content.validUntil,
    notes: content.notes,
    terms: content.terms,
    acceptanceLine: content.acceptanceLine,
    ctaLabel: "Email Rushi",
    adminEmail: "rushi@knowwhatson.com",
    items: content.items,
  });

  return {
    quoteId: quote.quoteId,
    introText: quote.introText,
    issuedOn: quote.issuedOn,
    currency: quote.currency,
    gstMode: quote.gstMode,
    validUntil: quote.validUntil,
    notes: quote.notes,
    terms: quote.terms,
    acceptanceLine: quote.acceptanceLine,
    items: quote.items,
    libraryMeta: normalizeDocumentLibraryMeta(content.libraryMeta),
  };
};

const buildProjectContentFromBrochure = (
  document: StudioDocument,
  brochureContent: BrochureDocumentContent
): ProjectDocumentContent => {
  const libraryMeta = normalizeDocumentLibraryMeta(brochureContent.libraryMeta);
  const facts = [
    { label: "Duration", value: brochureContent.duration },
    { label: "Delivery", value: brochureContent.deliveryMode },
    { label: "Study Load", value: brochureContent.studyLoad },
  ].filter((fact) => fact.label || fact.value);
  const highlights =
    brochureContent.sections.find((section) => section.id === "learningOutcomes")
      ?.bullets || [];
  const brochureSections = brochureContent.sections.map((section) => ({
    id: section.id,
    title: section.title,
    column:
      BROCHURE_SECTION_ORDER.find((item) => item.id === section.id)?.column || "left",
    paragraphs: section.body.trim() ? [section.body.trim()] : [],
    bullets: section.bullets.filter(Boolean),
  }));

  const project = normalizeProjectContent({
    mode: "project",
    quoteId: document.code,
    logoUrl: brochureContent.logoUrl,
    introText:
      brochureContent.subtitle ||
      "A brochure and quote in one page.",
    notes: brochureContent.footerComplianceText,
    currency: "AUD",
    defaultSelectedBaseIds: [],
    baseOptions: [
      {
        title: document.title || "Base option",
        subtitle: brochureContent.subtitle,
        description:
          brochureContent.sections.find((section) => section.id === "deliveryMode")
            ?.body || brochureContent.subtitle,
        price: parsePriceLabel(brochureContent.priceLabel),
        facts,
        highlights,
        brochureSections,
      },
    ],
    addOnOptions: [],
    bundleOptions: [],
    libraryMeta,
  });

  return {
    ...project,
    libraryMeta:
      libraryMeta.cardCompany ||
      libraryMeta.cardTitle ||
      libraryMeta.cardSummary
        ? libraryMeta
        : deriveProjectLibraryMeta({
            ...document,
            kind: "project",
            content: project,
          }),
  };
};

const buildProjectContentFromQuote = (
  document: StudioDocument,
  quoteContent: QuoteDocumentContent
): ProjectDocumentContent => {
  const normalizedQuoteValue = normalizeQuote({
    quoteCode: document.code,
    quoteId: quoteContent.quoteId,
    status: document.status,
    title: document.title,
    clientName: document.clientName,
    clientCompany: document.clientCompany,
    clientEmail: document.clientEmail,
    introText: quoteContent.introText,
    issuedOn: quoteContent.issuedOn,
    currency: quoteContent.currency,
    gstMode: quoteContent.gstMode,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    validUntil: quoteContent.validUntil,
    notes: quoteContent.notes,
    terms: quoteContent.terms,
    acceptanceLine: quoteContent.acceptanceLine,
    ctaLabel: document.ctaLabel,
    adminEmail: document.adminEmail,
    items: quoteContent.items,
  });
  const rawLineTotal = normalizedQuoteValue.items.reduce(
    (total, item) => total + item.lineTotal,
    0
  );
  const lineItems = normalizedQuoteValue.items
    .filter((item) => item.description || item.unitPrice > 0)
    .map((item) => `${item.description || "Scope"} - ${item.quantity} x ${item.unitPrice}`);
  const project = normalizeProjectContent({
    mode: "project",
    quoteId: quoteContent.quoteId,
    logoUrl: "",
    issuedOn: quoteContent.issuedOn,
    validUntil: quoteContent.validUntil,
    introText: quoteContent.introText,
    notes: quoteContent.notes,
    terms: quoteContent.terms,
    acceptanceLine: quoteContent.acceptanceLine,
    currency: quoteContent.currency,
    gstMode: quoteContent.gstMode,
    defaultSelectedBaseIds: [],
    baseOptions: [
      {
        title: document.title || "Base option",
        subtitle: normalizedQuoteValue.items[0]?.description || "",
        description: quoteContent.introText,
        price: rawLineTotal,
        facts: [
          { label: "Quote ID", value: quoteContent.quoteId },
          { label: "Issued", value: quoteContent.issuedOn },
          { label: "Valid", value: quoteContent.validUntil },
        ],
        highlights: lineItems.slice(0, 3),
        brochureSections: [
          {
            id: crypto.randomUUID(),
            title: "Overview",
            column: "left",
            paragraphs: quoteContent.introText ? [quoteContent.introText] : [],
            bullets: [],
          },
          {
            id: crypto.randomUUID(),
            title: "Scope",
            column: "right",
            paragraphs: [],
            bullets: lineItems,
          },
          {
            id: crypto.randomUUID(),
            title: "Notes",
            column: "left",
            paragraphs: quoteContent.notes ? [quoteContent.notes] : [],
            bullets: [],
          },
          {
            id: crypto.randomUUID(),
            title: "Terms",
            column: "right",
            paragraphs: quoteContent.terms ? [quoteContent.terms] : [],
            bullets: [],
          },
        ],
      },
    ],
    addOnOptions: [],
    bundleOptions: [],
    libraryMeta: normalizeDocumentLibraryMeta(quoteContent.libraryMeta),
  });

  return {
    ...project,
    libraryMeta: deriveProjectLibraryMeta({
      ...document,
      kind: "project",
      content: project,
    }),
  };
};

export const normalizeStudioDocument = (
  document: StudioDocument
): StudioDocument => {
  const baseDocument = {
    ...document,
    code: emptyString(document.code).toUpperCase(),
    title: emptyString(document.title),
    clientName: emptyString(document.clientName),
    clientCompany: emptyString(document.clientCompany),
    clientEmail: emptyString(document.clientEmail).toLowerCase(),
    ctaLabel: emptyString(document.ctaLabel),
    adminEmail:
      emptyString(document.adminEmail).toLowerCase() || "rushi@knowwhatson.com",
  };

  if (
    document.kind === "project" ||
    (((document.content as unknown) as Record<string, unknown> | undefined)?.mode ===
      "project")
  ) {
    const content = normalizeProjectContent(document.content);
    const code = emptyString(baseDocument.code) || buildAutoProjectCode(baseDocument);
    const quoteId =
      emptyString(content.quoteId) ||
      buildAutoProjectQuoteId({
        ...baseDocument,
        code,
      });
    const normalizedProject: StudioDocument = {
      ...baseDocument,
      kind: "project",
      code,
      ctaLabel: baseDocument.ctaLabel || "Accept via email",
      content: {
        ...content,
        quoteId,
      },
    };

    return {
      ...normalizedProject,
      content: {
        ...normalizedProject.content,
        libraryMeta: deriveProjectLibraryMeta(
          normalizedProject as StudioDocument & { content: ProjectDocumentContent }
        ),
      },
    };
  }

  if (document.kind === "quote" || isQuoteContent(document.content)) {
    const content = normalizeQuoteContent(
      isQuoteContent(document.content)
        ? document.content
        : createEmptyQuoteContent()
    );

    return {
      ...baseDocument,
      kind: "quote",
      ctaLabel: baseDocument.ctaLabel || "Email about this quote",
      content,
    };
  }

  const content = normalizeBrochureContent(
    isBrochureContent(document.content)
      ? document.content
      : createEmptyBrochureContent()
  );

  return {
    ...baseDocument,
    kind: "brochure",
    ctaLabel: baseDocument.ctaLabel || "Email about this brochure",
    content,
  };
};

export const getDocumentLibraryMeta = (
  document: StudioDocument
): DocumentLibraryMeta => {
  const normalized = normalizeStudioDocument(document);

  if (isProjectDocument(normalized)) {
    return deriveProjectLibraryMeta(normalized);
  }

  return normalizeDocumentLibraryMeta(
    (normalized.content as BrochureDocumentContent | QuoteDocumentContent).libraryMeta
  );
};

export const toBrochureDocument = (document: StudioDocument): Brochure => {
  const normalized = normalizeStudioDocument(document);

  if (isProjectDocument(normalized)) {
    const selectedId =
      normalized.content.defaultSelectedBaseIds[0] ||
      normalized.content.baseOptions[0]?.id;
    const option =
      normalized.content.baseOptions.find((item) => item.id === selectedId) ||
      normalized.content.baseOptions[0];

    return normalizeBrochure({
      id: normalized.id,
      engagementId: normalized.engagementId,
      brochureCode: normalized.code,
      status: normalized.status,
      clientName: normalized.clientCompany || normalized.clientName,
      logoUrl: normalized.content.logoUrl,
      title: option?.title || normalized.title,
      subtitle: option?.subtitle || normalized.content.introText,
      duration: option?.facts[0]?.value || "",
      deliveryMode: option?.facts[1]?.value || "",
      studyLoad: option?.facts[2]?.value || "",
      priceLabel: option ? `${option.price}` : "",
      ctas: [createEmptyBrochureCta()],
      sections:
        option?.brochureSections.map((section) => ({
          id: ((section.id as BrochureSectionId) ||
            "deliveryMode") as BrochureSectionId,
          title: section.title || "Section",
          sourceClause: "",
          body: section.paragraphs.join(" ").trim(),
          bullets: section.bullets,
        })) || buildDefaultBrochureSections(),
      footerComplianceText: "",
      adminEmail: normalized.adminEmail,
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt,
    });
  }

  const content = isBrochureContent(normalized.content)
    ? normalized.content
    : createEmptyBrochureContent();

  return normalizeBrochure({
    id: normalized.id,
    engagementId: normalized.engagementId,
    brochureCode: normalized.code,
    status: normalized.status,
    clientName: normalized.clientCompany || normalized.clientName,
    logoUrl: content.logoUrl,
    title: normalized.title,
    subtitle: content.subtitle,
    duration: content.duration,
    deliveryMode: content.deliveryMode,
    studyLoad: content.studyLoad,
    priceLabel: content.priceLabel,
    ctas: content.ctas,
    sections: content.sections,
    footerComplianceText: content.footerComplianceText,
    adminEmail: normalized.adminEmail,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
  });
};

export const toQuoteDocument = (document: StudioDocument): Quote => {
  const normalized = normalizeStudioDocument(document);

  if (isProjectDocument(normalized)) {
    return buildProjectQuote(normalized, {
      selectedBaseIds: normalized.content.defaultSelectedBaseIds,
      selectedAddOnIds: normalized.content.defaultSelectedAddOnIds,
    });
  }

  const content = isQuoteContent(normalized.content)
    ? normalized.content
    : createEmptyQuoteContent();

  return normalizeQuote({
    id: normalized.id,
    engagementId: normalized.engagementId,
    quoteCode: normalized.code,
    quoteId: content.quoteId,
    status: normalized.status,
    title: normalized.title,
    clientName: normalized.clientName,
    clientCompany: normalized.clientCompany,
    clientEmail: normalized.clientEmail,
    introText: content.introText,
    issuedOn: content.issuedOn,
    currency: content.currency,
    gstMode: content.gstMode,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    validUntil: content.validUntil,
    notes: content.notes,
    terms: content.terms,
    acceptanceLine: content.acceptanceLine,
    ctaLabel: normalized.ctaLabel,
    adminEmail: normalized.adminEmail,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    items: content.items,
  });
};

export const switchDocumentKind = (
  document: StudioDocument,
  nextKind: DocumentKind
): StudioDocument => {
  const normalized = normalizeStudioDocument(document);

  if (nextKind === "project") {
    if (isProjectDocument(normalized)) {
      return normalized;
    }

    const projectContent = isQuoteContent(normalized.content)
      ? buildProjectContentFromQuote(normalized, normalized.content)
      : buildProjectContentFromBrochure(
          normalized,
          isBrochureContent(normalized.content)
            ? normalized.content
            : createEmptyBrochureContent()
        );

    return normalizeStudioDocument({
      ...normalized,
      kind: "project",
      ctaLabel: "Accept via email",
      content: projectContent,
    });
  }

  if (nextKind === "quote") {
    return normalizeStudioDocument({
      ...normalized,
      kind: "quote",
      content: createEmptyQuoteContent(),
    });
  }

  return normalizeStudioDocument({
    ...normalized,
    kind: "brochure",
    content: createEmptyBrochureContent(),
  });
};

export const getDocumentPublishErrors = (
  document: StudioDocument,
  options?: { hasOverflow?: boolean }
) => {
  const normalized = normalizeStudioDocument(document);

  if (isProjectDocument(normalized)) {
    const errors: string[] = [];

    if (!normalized.code.trim()) {
      errors.push("Add a project code.");
    }

    if (!normalized.content.quoteId.trim()) {
      errors.push("Add a quote ID.");
    }

    if (!normalized.content.issuedOn.trim()) {
      errors.push("Add the issue date.");
    }

    if (!normalized.title.trim()) {
      errors.push("Add the project title.");
    }

    if (!normalized.content.baseOptions.length) {
      errors.push("Add at least one base option.");
    }

    if (!normalized.content.defaultSelectedBaseIds.length) {
      errors.push("Select at least one default base option.");
    }

    return errors;
  }

  if (normalized.kind === "brochure") {
    return getBrochurePublishErrors(toBrochureDocument(normalized), options);
  }

  return getQuotePublishErrors(toQuoteDocument(normalized));
};

export const getPublicDocumentLink = (
  document: Pick<StudioDocument, "code">
) =>
  document.code.trim()
    ? isLegacyStudioSampleCode(document.code)
      ? `${window.location.origin}/studio/project/sample`
      : `${window.location.origin}/studio/project/${encodeURIComponent(
          document.code.trim()
        )}`
    : "";

const getLocalStudioFallbackDocumentByCode = (
  code: string
): StudioDocument | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LOCAL_STUDIO_RECORDS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const normalizedCode = code.trim().toLowerCase();
    const match = parsed.find((entry) => {
      const document = normalizeStudioDocument(
        (entry as { document?: StudioDocument | null })?.document ??
          createEmptyStudioDocument("project")
      );
      return (
        document.status === "published" &&
        document.code.trim().toLowerCase() === normalizedCode
      );
    });

    if (!match) {
      return null;
    }

    return normalizeStudioDocument(
      (match as { document?: StudioDocument | null })?.document ??
        createEmptyStudioDocument("project")
    );
  } catch {
    return null;
  }
};

const getBuiltInStudioDocumentByCode = (code: string): StudioDocument | null => {
  if (isTechnetProjectRetiredCode(code)) {
    return null;
  }

  if (isTechnetProjectPublicCode(code)) {
    return normalizeStudioDocument(createTechnetProjectDocumentSeed());
  }

  if (isUnswCyberSecuritySummitProjectPublicCode(code)) {
    return normalizeStudioDocument(
      createUnswCyberSecuritySummitProjectDocumentSeed()
    );
  }

  if (isUnswAssessmentProjectPublicCode(code)) {
    return normalizeStudioDocument(createUnswAssessmentProjectDocumentSeed());
  }

  if (isInfs5700KeynoteProjectPublicCode(code)) {
    return normalizeStudioDocument(createInfs5700KeynoteProjectDocumentSeed());
  }

  if (isRheemPressoProjectPublicCode(code)) {
    return normalizeStudioDocument(createRheemPressoProjectDocumentSeed());
  }

  if (!isRheemProjectPublicCode(code)) {
    return null;
  }

  return normalizeStudioDocument(createRheemProjectDocumentSeed());
};

export const buildDocumentMailto = (document: StudioDocument) =>
  `mailto:${document.adminEmail || "rushi@knowwhatson.com"}?subject=${encodeURIComponent(
    `Enquiry about ${document.code || document.title || "studio project"}`
  )}&body=${encodeURIComponent(
    [
      "Hi Rushi,",
      "",
      `I’m writing about ${document.code || document.title || "the studio project"}.`,
      "",
      "Please let me know the next steps.",
      "",
      "Thanks,",
    ].join("\n")
  )}`;

const mapStudioDocumentContent = (
  kind: DocumentKind,
  value: Record<string, unknown> | null | undefined
): StudioDocumentContent => {
  if (value?.mode === "project" || kind === "project") {
    return normalizeProjectContent(value);
  }

  if (kind === "quote") {
    return normalizeQuoteContent({
      quoteId: emptyString(value?.quoteId),
      introText: emptyString(value?.introText),
      issuedOn: emptyString(value?.issuedOn),
      currency: emptyString(value?.currency) || "AUD",
      gstMode:
        value?.gstMode === "inclusive" || value?.gstMode === "none"
          ? value.gstMode
          : "exclusive",
      validUntil: emptyString(value?.validUntil),
      notes: emptyString(value?.notes),
      terms: emptyString(value?.terms),
      acceptanceLine: emptyString(value?.acceptanceLine),
      items: Array.isArray(value?.items)
        ? value.items.map((item, index) => ({
            id: emptyString((item as Record<string, unknown>).id) || crypto.randomUUID(),
            description: emptyString(
              (item as Record<string, unknown>).description
            ),
            quantity: Number((item as Record<string, unknown>).quantity) || 0,
            unitPrice: Number((item as Record<string, unknown>).unitPrice) || 0,
            lineTotal: Number((item as Record<string, unknown>).lineTotal) || 0,
            displayOrder:
              Number((item as Record<string, unknown>).displayOrder) || index,
          }))
        : createEmptyQuoteContent().items,
      libraryMeta: normalizeDocumentLibraryMeta(value?.libraryMeta),
    });
  }

  return normalizeBrochureContent({
    logoUrl: emptyString(value?.logoUrl),
    subtitle: emptyString(value?.subtitle),
    duration: emptyString(value?.duration),
    deliveryMode: emptyString(value?.deliveryMode),
    studyLoad: emptyString(value?.studyLoad),
    priceLabel: emptyString(value?.priceLabel),
    ctas: Array.isArray(value?.ctas)
      ? value.ctas
          .map((cta) => ({
            id:
              emptyString((cta as Record<string, unknown>).id) ||
              crypto.randomUUID(),
            label: emptyString((cta as Record<string, unknown>).label),
            url: emptyString((cta as Record<string, unknown>).url),
          }))
          .slice(0, 2)
      : createEmptyBrochureContent().ctas,
    sections: Array.isArray(value?.sections)
      ? value.sections.map((section) => ({
          id: emptyString((section as Record<string, unknown>).id) as BrochureSectionId,
          title: emptyString((section as Record<string, unknown>).title),
          sourceClause: emptyString(
            (section as Record<string, unknown>).sourceClause
          ),
          body: emptyString((section as Record<string, unknown>).body),
          bullets: normalizeBullets(
            (section as Record<string, unknown>).bullets
          ),
        }))
      : createEmptyBrochureContent().sections,
    footerComplianceText: emptyString(value?.footerComplianceText),
    libraryMeta: normalizeDocumentLibraryMeta(value?.libraryMeta),
  });
};

const mapPublicDocumentPayload = (
  payload: Record<string, unknown>
): StudioDocument => {
  const rawContent =
    ((payload.content as unknown) as Record<string, unknown>) || null;
  const kind: DocumentKind =
    rawContent?.mode === "project"
      ? "project"
      : payload.kind === "quote"
        ? "quote"
        : "brochure";

  return normalizeStudioDocument({
    id: payload.id as string | undefined,
    engagementId: (payload.engagementId as string) || null,
    kind,
    code: (payload.code as string) || "",
    status:
      payload.status === "published" || payload.status === "archived"
        ? payload.status
        : "draft",
    title: (payload.title as string) || "",
    clientName: (payload.clientName as string) || "",
    clientCompany: (payload.clientCompany as string) || "",
    clientEmail: (payload.clientEmail as string) || "",
    ctaLabel: (payload.ctaLabel as string) || "Accept via email",
    adminEmail: (payload.adminEmail as string) || "rushi@knowwhatson.com",
    createdAt: payload.createdAt as string | undefined,
    updatedAt: payload.updatedAt as string | undefined,
    content: mapStudioDocumentContent(kind, rawContent),
  });
};

export const getPublicDocumentByCode = async (
  code: string
): Promise<StudioDocument | null> => {
  const normalizedCode = code.trim();

  if (isTechnetProjectRetiredCode(normalizedCode)) {
    return null;
  }

  const builtInDocument = getBuiltInStudioDocumentByCode(normalizedCode);

  try {
    const response = await fetch(
      buildStudioAppUrl(
        `/api/rushi-personal-documents/${encodeURIComponent(normalizedCode)}`
      )
    );

    if (response.ok) {
      const payload = (await response.json()) as {
        document?: Record<string, unknown> | null;
      };

      if (payload.document) {
        return mapPublicDocumentPayload(payload.document);
      }
    }
  } catch {
    // Fall back to the public RPC path when the API route is unavailable locally.
  }

  try {
    const { data, error } = await supabase.rpc(
      "RUSHI_PERSONAL_GET_DOCUMENT_BY_CODE",
      {
        input_code: normalizedCode,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return builtInDocument || getLocalStudioFallbackDocumentByCode(normalizedCode);
    }

    const payload = Array.isArray(data) ? data[0] : data;
    if (!payload) {
      return builtInDocument || getLocalStudioFallbackDocumentByCode(normalizedCode);
    }

    return mapPublicDocumentPayload(payload);
  } catch (error) {
    if (builtInDocument) {
      return builtInDocument;
    }

    const localFallbackDocument = getLocalStudioFallbackDocumentByCode(normalizedCode);
    if (localFallbackDocument) {
      return localFallbackDocument;
    }

    throw error;
  }
};

const mapStudioLibraryPayload = (
  payload: Record<string, unknown>
): StudioLibraryCard => ({
  id: (payload.id as string) || crypto.randomUUID(),
  engagementId: (payload.engagementId as string) || null,
  code: emptyString(payload.code),
  kind: "project",
  documentStatus:
    payload.documentStatus === "published" || payload.documentStatus === "archived"
      ? payload.documentStatus
      : "draft",
  updatedAt: payload.updatedAt as string | undefined,
  cardCompany: emptyString(payload.cardCompany),
  cardTitle: emptyString(payload.cardTitle),
  cardCategory: emptyString(payload.cardCategory) || "Project",
  cardStatusLabel: emptyString(payload.cardStatusLabel),
  cardSummary: emptyString(payload.cardSummary),
  cardLogoUrl: emptyString(payload.cardLogoUrl),
});

export const listPublicStudioLibrary = async (): Promise<StudioLibraryCard[]> => {
  try {
    const response = await fetch(buildStudioAppUrl("/api/rushi-personal-documents"));

    if (response.ok) {
      const payload = (await response.json()) as {
        documents?: Record<string, unknown>[];
      };

      if (Array.isArray(payload.documents)) {
        return payload.documents
          .map(mapStudioLibraryPayload)
          .filter((card) => !isTechnetProjectRetiredCode(card.code || ""));
      }
    }
  } catch {
    // Fall back to the older public RPC when the API route is unavailable locally.
  }

  const { data, error } = await supabase.rpc("RUSHI_PERSONAL_LIST_STUDIO_LIBRARY");

  if (error) {
    throw new Error(error.message);
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(mapStudioLibraryPayload)
    .filter((card) => !isTechnetProjectRetiredCode(card.code || ""));
};

export const convertLegacyDocumentToProject = (
  document: StudioDocument
): StudioDocument => {
  const normalized = normalizeStudioDocument(document);

  if (isProjectDocument(normalized)) {
    return normalized;
  }

  const content = isQuoteContent(normalized.content)
    ? buildProjectContentFromQuote(normalized, normalized.content)
    : buildProjectContentFromBrochure(
        normalized,
        isBrochureContent(normalized.content)
          ? normalized.content
          : createEmptyBrochureContent()
      );

  return normalizeStudioDocument({
    ...normalized,
    kind: "project",
    ctaLabel: "Accept via email",
    content,
  });
};
