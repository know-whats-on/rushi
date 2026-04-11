import type {
  DocumentLibraryMeta,
  ProjectBrochureSection,
  ProjectBundleOption,
  ProjectPresentationCountdown,
  ProjectPresentationCallout,
  ProjectDocumentContent,
  ProjectPresentationBranding,
  ProjectPresentationContent,
  ProjectPresentationFooterMode,
  ProjectPresentationSlide,
  ProjectPresentationSlideLayout,
  ProjectPresentationSlideSection,
  ProjectPresentationStageDisplay,
  ProjectPresentationTheme,
  ProjectPresentationVisual,
  ProjectPresentationVisualItem,
  ProjectOptionAgenda,
  ProjectOptionAgendaBlock,
  ProjectOptionAgendaSource,
  ProjectOption,
  ProjectOptionFact,
  ProjectQuoteLineOverride,
  ProjectRecommendedTimeline,
  ProjectRecommendedTimelinePhase,
  ProjectRecommendedTimelinePhaseTimingVariant,
  ProjectSupportingDownload,
  StudioDocument,
} from "../types/documents";
import type { Quote, QuoteItem } from "../types/quotes";
import { formatCurrency, normalizeQuote } from "./quotes";
import { RHEEM_PROJECT_CODE } from "../data/rheemProject";

export interface ProjectSelection {
  selectedBaseIds: string[];
  selectedAddOnIds: string[];
}

export interface ProjectTimelinePhaseToggleTarget {
  type: "base" | "addon";
  id: string;
}

export interface ProjectTimelinePhaseDisplay
  extends ProjectRecommendedTimelinePhase {
  includedInCurrentScope: boolean;
  statusLabel: string;
  helperText: string;
  timingNote: string;
  toggleTarget?: ProjectTimelinePhaseToggleTarget;
  linkedOptionId?: string;
  agenda?: ProjectOptionAgenda;
}

export interface ProjectTimelineDisplayData {
  chipLabel: string;
  chipSecondaryLabel: string;
  preparedForLabel: string;
  preparedForLogoAlt: string;
  preparedForLogoSrc?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  closingNote: string;
  phases: ProjectTimelinePhaseDisplay[];
}

export interface ProjectAgendaPageData {
  chipLabel: string;
  chipSecondaryLabel: string;
  footerNote: string;
  preparedForLabel: string;
  preparedForLogoAlt: string;
  preparedForLogoSrc?: string;
  title: string;
  subtitle: string;
  duration: string;
  deliveryMode: string;
  whyThisMattersNow?: string;
  sources: ProjectOptionAgendaSource[];
  blocks: ProjectOptionAgendaBlock[];
  includedValueAdd?: string;
  overallOutcomes: string[];
  contextNote?: string;
}

const RHEEM_REQUIRED_BASE_IDS = ["f2f-session"];

const emptyString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const uniqueIds = (ids: string[]) => Array.from(new Set(ids));

const matchesExactIds = (selectedIds: string[], optionIds: string[]) => {
  const left = uniqueIds(selectedIds);
  const right = uniqueIds(optionIds);

  return left.length === right.length && left.every((id) => right.includes(id));
};

const normalizeFacts = (facts: unknown): ProjectOptionFact[] => {
  if (!Array.isArray(facts)) {
    return [];
  }

  return facts
    .map((fact) => ({
      label: emptyString((fact as Record<string, unknown>)?.label),
      value: emptyString((fact as Record<string, unknown>)?.value),
    }))
    .filter((fact) => fact.label || fact.value)
    .slice(0, 3);
};

const normalizeProjectSupportingDownload = (
  value: unknown,
  index: number
): ProjectSupportingDownload | null => {
  const record = (value || {}) as Record<string, unknown>;
  const url = emptyString(record.url);

  if (!url) {
    return null;
  }

  return {
    id: emptyString(record.id) || `supporting-download-${index + 1}`,
    label: emptyString(record.label) || `Supporting download ${index + 1}`,
    url,
    metaText: emptyString(record.metaText),
  };
};

const normalizeTextList = (value: unknown, limit: number) =>
  Array.isArray(value)
    ? value
        .map((item) => emptyString(item))
        .filter(Boolean)
        .slice(0, limit)
    : [];

const normalizeProjectAgendaSource = (
  value: unknown
): ProjectOptionAgendaSource | null => {
  const record = (value || {}) as Record<string, unknown>;
  const url = emptyString(record.url);

  if (!url) {
    return null;
  }

  return {
    label: emptyString(record.label) || url,
    url,
  };
};

const normalizeProjectAgendaBlock = (
  value: unknown,
  index: number
): ProjectOptionAgendaBlock => {
  const record = (value || {}) as Record<string, unknown>;

  return {
    id: emptyString(record.id) || `agenda-block-${index + 1}`,
    timeLabel: emptyString(record.timeLabel),
    title: emptyString(record.title) || `Agenda block ${index + 1}`,
    focus: emptyString(record.focus),
    bullets: normalizeTextList(record.bullets, 8),
    examplesLabel: emptyString(record.examplesLabel),
    examples: normalizeTextList(record.examples, 8),
    outcome: emptyString(record.outcome),
  };
};

const normalizeProjectAgenda = (value: unknown): ProjectOptionAgenda | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const blocks = Array.isArray(record.blocks)
    ? record.blocks
        .map((block, index) => normalizeProjectAgendaBlock(block, index))
        .filter(
          (block) =>
            block.timeLabel ||
            block.title ||
            block.focus ||
            block.bullets.length ||
            (block.examples || []).length ||
            block.outcome
        )
    : [];

  if (!blocks.length) {
    return undefined;
  }

  return {
    heading: emptyString(record.heading) || "Session-wise agenda",
    subtitle: emptyString(record.subtitle),
    duration: emptyString(record.duration),
    deliveryMode: emptyString(record.deliveryMode),
    whyThisMattersNow: emptyString(record.whyThisMattersNow),
    sources: Array.isArray(record.sources)
      ? record.sources
          .map((source) => normalizeProjectAgendaSource(source))
          .filter((source): source is ProjectOptionAgendaSource => Boolean(source))
      : [],
    blocks,
    includedValueAdd: emptyString(record.includedValueAdd),
    overallOutcomes: normalizeTextList(record.overallOutcomes, 12),
    contextNote: emptyString(record.contextNote),
  };
};

const joinNaturalLanguageList = (items: string[]) => {
  if (!items.length) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const normalizeProjectRecommendedTimelinePhase = (
  phase: unknown,
  index: number,
  allowedOptionIds: string[]
): ProjectRecommendedTimelinePhase => {
  const value = (phase || {}) as Record<string, unknown>;
  const timingVariants = Array.isArray(value.timingVariants)
    ? value.timingVariants
        .map((variant) =>
          normalizeProjectRecommendedTimelineTimingVariant(
            variant,
            allowedOptionIds
          )
        )
        .filter((variant) => variant.timing && variant.optionIds.length)
    : [];

  return {
    id: emptyString(value.id) || crypto.randomUUID(),
    label: emptyString(value.label) || `Phase ${index + 1}`,
    timing: emptyString(value.timing),
    title: emptyString(value.title),
    summary: emptyString(value.summary),
    deliverables: normalizeTextList(value.deliverables, 6),
    relatedOptionIds: uniqueIds(
      normalizeTextList(value.relatedOptionIds, 12).filter((id) =>
        allowedOptionIds.includes(id)
      )
    ),
    relatedOptionMatch: value.relatedOptionMatch === "all" ? "all" : "any",
    timingVariants,
  };
};

const normalizeProjectRecommendedTimelineTimingVariant = (
  variant: unknown,
  allowedOptionIds: string[]
): ProjectRecommendedTimelinePhaseTimingVariant => {
  const value = (variant || {}) as Record<string, unknown>;

  return {
    optionIds: uniqueIds(
      normalizeTextList(value.optionIds, 12).filter((id) =>
        allowedOptionIds.includes(id)
      )
    ),
    optionMatch: value.optionMatch === "all" ? "all" : "any",
    timing: emptyString(value.timing),
  };
};

const matchesTimelineVariantSelection = (
  optionIds: string[],
  optionMatch: "any" | "all",
  selectedIds: Set<string>
) => {
  if (!optionIds.length) {
    return false;
  }

  if (optionMatch === "all") {
    return optionIds.every((id) => selectedIds.has(id));
  }

  return optionIds.some((id) => selectedIds.has(id));
};

const resolveProjectTimelinePhaseTimingVariant = (
  phase: ProjectRecommendedTimelinePhase,
  selectedIds: Set<string>
) =>
  phase.timingVariants?.find((variant) =>
    matchesTimelineVariantSelection(
      variant.optionIds,
      variant.optionMatch,
      selectedIds
    )
  );

const normalizeProjectRecommendedTimeline = (
  timeline: unknown,
  allowedOptionIds: string[]
): ProjectRecommendedTimeline | undefined => {
  if (!timeline || typeof timeline !== "object") {
    return undefined;
  }

  const value = timeline as Record<string, unknown>;
  const phases = Array.isArray(value.phases)
    ? value.phases
        .map((phase, index) =>
          normalizeProjectRecommendedTimelinePhase(
            phase,
            index,
            allowedOptionIds
          )
        )
        .filter(
          (phase) =>
            phase.title ||
            phase.summary ||
            phase.deliverables.length ||
            phase.relatedOptionIds.length
        )
    : [];

  if (!phases.length) {
    return undefined;
  }

  return {
    eyebrow: emptyString(value.eyebrow) || "Suggested timeline",
    heading: emptyString(value.heading) || "Suggested timeline",
    intro: emptyString(value.intro),
    closingNote: emptyString(value.closingNote),
    phases,
  };
};

export const createEmptyProjectSection = (
  column: "left" | "right" = "left"
): ProjectBrochureSection => ({
  id: crypto.randomUUID(),
  title: "",
  column,
  paragraphs: [],
  bullets: [],
});

const defaultProjectSections = () => [
  {
    title: "Overview",
    column: "left" as const,
  },
  {
    title: "Focus Areas",
    column: "right" as const,
  },
  {
    title: "Typical Activities",
    column: "left" as const,
  },
  {
    title: "Outputs",
    column: "right" as const,
  },
  {
    title: "Included",
    column: "right" as const,
  },
].map((section) => ({
  ...createEmptyProjectSection(section.column),
  title: section.title,
}));

export const createEmptyProjectOption = (label = "Option"): ProjectOption => ({
  id: crypto.randomUUID(),
  title: label,
  subtitle: "",
  description: "",
  imageUrl: "",
  price: 0,
  compareAtPrice: undefined,
  facts: [
    { label: "Duration", value: "" },
    { label: "Delivery", value: "" },
    { label: "Best for", value: "" },
  ],
  highlights: ["", "", ""],
  brochureSections: defaultProjectSections(),
  agenda: undefined,
});

export const createEmptyProjectBundleOption = (
  title = "Bundle option"
): ProjectBundleOption => ({
  id: crypto.randomUUID(),
  title,
  description: "",
  imageUrl: "",
  baseIds: [],
  addOnIds: [],
  price: 0,
});

export const createEmptyProjectContent = (): ProjectDocumentContent => ({
  mode: "project",
  projectVariant: "proposal",
  quoteId: "",
  logoUrl: "",
  issuedOn: "",
  validUntil: "",
  introText:
    "A brochure and quote in one page. Clients can review the scope, select options, and export the PDF from the same screen.",
  notes:
    "Reply if you want any change to scope, sequencing, or delivery format before approval.",
  terms:
    "This quote is valid for the period shown and may be updated if scope changes.",
  acceptanceLine: "Accepted by:",
  currency: "AUD",
  gstMode: "exclusive",
  brochureFooterNote: "",
  supportingDocsText: "",
  supportingDownloads: [],
  referenceBrochureMarkdown: "",
  generatedBrochureMarkdown: "",
  lastGeneratedAt: "",
  referenceSource: "fallback",
  presentation: {
    remoteEnabled: false,
    theme: "default",
    branding: {
      speakerName: "",
      website: "",
      tagline: "",
      footerMode: "none",
    },
    slides: [],
  },
  defaultSelectedBaseIds: [],
  defaultSelectedAddOnIds: [],
  recommendedTimeline: undefined,
  baseOptions: [createEmptyProjectOption("Base option")],
  addOnOptions: [],
  bundleOptions: [],
  quoteLineOverrides: [],
  libraryMeta: {
    isListed: false,
    cardCompany: "",
    cardTitle: "",
    cardCategory: "",
    cardStatusLabel: "",
    cardSummary: "",
    cardLogoUrl: "",
  },
});

export const normalizeProjectSection = (
  section: unknown,
  fallbackColumn: "left" | "right" = "left"
): ProjectBrochureSection => {
  const value = (section || {}) as Record<string, unknown>;

  return {
    id: emptyString(value.id) || crypto.randomUUID(),
    title: emptyString(value.title),
    column: value.column === "right" ? "right" : fallbackColumn,
    paragraphs: normalizeTextList(value.paragraphs, 4),
    bullets: normalizeTextList(value.bullets, 6),
  };
};

export const normalizeProjectOption = (
  option: unknown,
  fallbackLabel = "Option"
): ProjectOption => {
  const value = (option || {}) as Record<string, unknown>;
  const brochureSections = Array.isArray(value.brochureSections)
    ? value.brochureSections.map((section, index) =>
        normalizeProjectSection(section, index % 2 === 0 ? "left" : "right")
      )
    : defaultProjectSections();

  return {
    id: emptyString(value.id) || crypto.randomUUID(),
    title: emptyString(value.title) || fallbackLabel,
    subtitle: emptyString(value.subtitle),
    description: emptyString(value.description),
    imageUrl: emptyString(value.imageUrl),
    price: Number(value.price) || 0,
    compareAtPrice: (() => {
      const compareAtPrice = Number(value.compareAtPrice);
      return Number.isFinite(compareAtPrice) && compareAtPrice > (Number(value.price) || 0)
        ? compareAtPrice
        : undefined;
    })(),
    facts: (() => {
      const facts = normalizeFacts(value.facts);
      return facts.length
        ? facts
        : [
            { label: "Duration", value: "" },
            { label: "Delivery", value: "" },
            { label: "Best for", value: "" },
          ];
    })(),
    highlights: (() => {
      const highlights = normalizeTextList(value.highlights, 6);
      return highlights.length ? highlights : ["", "", ""];
    })(),
    brochureSections,
    agenda: normalizeProjectAgenda(value.agenda),
  };
};

export const normalizeProjectBundleOption = (
  bundleOption: unknown,
  baseOptions: ProjectOption[],
  addOnOptions: ProjectOption[],
  fallbackLabel = "Bundle option"
): ProjectBundleOption => {
  const value = (bundleOption || {}) as Record<string, unknown>;
  const allowedBaseIds = baseOptions.map((option) => option.id);
  const allowedAddOnIds = addOnOptions.map((option) => option.id);

  return {
    id: emptyString(value.id) || crypto.randomUUID(),
    title: emptyString(value.title) || fallbackLabel,
    description: emptyString(value.description),
    imageUrl: emptyString(value.imageUrl),
    baseIds: uniqueIds(
      normalizeTextList(value.baseIds, 12).filter((id) => allowedBaseIds.includes(id))
    ),
    addOnIds: uniqueIds(
      normalizeTextList(value.addOnIds, 12).filter((id) => allowedAddOnIds.includes(id))
    ),
    price: Number(value.price) || 0,
  };
};

const normalizeLegacyBundleOptions = (
  bundleRule: unknown,
  baseOptions: ProjectOption[],
  addOnOptions: ProjectOption[]
): ProjectBundleOption[] => {
  if (!bundleRule || typeof bundleRule !== "object") {
    return [];
  }

  const value = bundleRule as Record<string, unknown>;
  const title = emptyString(value.title) || "Bundle";
  const description = emptyString(value.description);
  const addOnIds = uniqueIds(
    normalizeTextList(value.addOnIds, 12).filter((id) =>
      addOnOptions.some((option) => option.id === id)
    )
  );
  const price = Number(value.price) || 0;

  if (!addOnIds.length) {
    return [];
  }

  if (!baseOptions.length) {
    return [
      {
        ...createEmptyProjectBundleOption(title),
        description,
        addOnIds,
        price,
      },
    ];
  }

  return baseOptions.map((baseOption) => ({
    ...createEmptyProjectBundleOption(`${baseOption.title} + ${title}`),
    description,
    baseIds: [baseOption.id],
    addOnIds,
    price: baseOption.price + price,
  }));
};

const normalizeProjectQuoteLineOverrides = (
  value: unknown
): ProjectQuoteLineOverride[] =>
  Array.isArray(value)
    ? value
        .map((override) => ({
          id: emptyString((override as Record<string, unknown>)?.id),
          description: emptyString(
            (override as Record<string, unknown>)?.description
          ),
          quantity: Math.max(
            0,
            Number((override as Record<string, unknown>)?.quantity) || 0
          ),
          unitPrice: Number((override as Record<string, unknown>)?.unitPrice) || 0,
        }))
        .filter((override) => override.id)
    : [];

const normalizeProjectPresentationSlideSection = (
  value: unknown,
  index: number
): ProjectPresentationSlideSection => {
  const record = (value || {}) as Record<string, unknown>;

  return {
    id: emptyString(record.id) || `presentation-section-${index + 1}`,
    heading: emptyString(record.heading) || `Section ${index + 1}`,
    bullets: normalizeTextList(record.bullets, 8),
  };
};

const normalizeProjectPresentationTheme = (
  value: unknown
): ProjectPresentationTheme => {
  if (value === "breathing-hue" || value === "rheem-red") {
    return value;
  }

  return "default";
};

const normalizeProjectPresentationFooterMode = (
  value: unknown
): ProjectPresentationFooterMode => {
  if (value === "all" || value === "non-title") {
    return value;
  }

  return "none";
};

const inferProjectPresentationSlideLayout = (
  sections: ProjectPresentationSlideSection[],
  bullets: string[],
  subtitle: string
): ProjectPresentationSlideLayout => {
  if (!subtitle && !bullets.length && !sections.length) {
    return "question";
  }

  if (sections.length >= 3) {
    return "split-3";
  }

  if (sections.length === 2) {
    return "split-2";
  }

  if (subtitle && bullets.length) {
    return "overview";
  }

  return "bullets";
};

const normalizeProjectPresentationSlideLayout = (
  value: unknown,
  sections: ProjectPresentationSlideSection[],
  bullets: string[],
  subtitle: string
): ProjectPresentationSlideLayout => {
  if (
    value === "countdown" ||
    value === "title" ||
    value === "intro" ||
    value === "question" ||
    value === "overview" ||
    value === "evidence" ||
    value === "capabilities" ||
    value === "bullets" ||
    value === "split-2" ||
    value === "split-3" ||
    value === "closing" ||
    value === "statement" ||
    value === "qr"
  ) {
    return value;
  }

  return inferProjectPresentationSlideLayout(sections, bullets, subtitle);
};

const normalizeProjectPresentationCountdown = (
  value: unknown
): ProjectPresentationCountdown | undefined => {
  const record = (value || {}) as Record<string, unknown>;
  const targetAt = emptyString(record.targetAt);
  const timeZone = emptyString(record.timeZone);
  const autoAdvance = Boolean(record.autoAdvance);

  if (!targetAt && !timeZone && !autoAdvance) {
    return undefined;
  }

  return {
    targetAt,
    timeZone,
    autoAdvance,
  };
};

const normalizeProjectPresentationBranding = (
  value: unknown
): ProjectPresentationBranding => {
  const record = (value || {}) as Record<string, unknown>;

  return {
    speakerName: emptyString(record.speakerName),
    website: emptyString(record.website),
    tagline: emptyString(record.tagline),
    footerMode: normalizeProjectPresentationFooterMode(record.footerMode),
  };
};

const normalizeProjectPresentationCallout = (
  value: unknown
): ProjectPresentationCallout | null => {
  const record = (value || {}) as Record<string, unknown>;
  const callout = {
    value: emptyString(record.value),
    label: emptyString(record.label),
    note: emptyString(record.note),
  };

  if (!callout.value && !callout.label && !callout.note) {
    return null;
  }

  return callout;
};

const normalizeProjectPresentationVisualItem = (
  value: unknown
): ProjectPresentationVisualItem | null => {
  const record = (value || {}) as Record<string, unknown>;
  const metricValue =
    typeof record.metric === "number"
      ? record.metric
      : Number.parseFloat(emptyString(record.metric));
  const answerState: ProjectPresentationVisualItem["answerState"] =
    record.answerState === "correct" ||
    record.answerState === "neutral" ||
    record.answerState === "supporting"
      ? record.answerState
      : undefined;
  const item = {
    label: emptyString(record.label),
    value: emptyString(record.value),
    note: emptyString(record.note),
    detail: emptyString(record.detail),
    group: emptyString(record.group),
    metric: Number.isFinite(metricValue) ? metricValue : undefined,
    audienceLabel: emptyString(record.audienceLabel),
    audienceEyebrow: emptyString(record.audienceEyebrow),
    answerLabel: emptyString(record.answerLabel),
    answerState,
    answerOnly: record.answerOnly === true,
  };

  if (
    !item.label &&
    !item.value &&
    !item.note &&
    !item.detail &&
    !item.group &&
    item.metric === undefined &&
    !item.audienceLabel &&
    !item.audienceEyebrow &&
    !item.answerLabel &&
    !item.answerState &&
    !item.answerOnly
  ) {
    return null;
  }

  return item;
};

const normalizeProjectPresentationVisual = (
  value: unknown
): ProjectPresentationVisual | undefined => {
  const record = (value || {}) as Record<string, unknown>;
  const variant = emptyString(record.variant);
  const items = Array.isArray(record.items)
    ? record.items
        .map((item) => normalizeProjectPresentationVisualItem(item))
        .filter((item): item is ProjectPresentationVisualItem => Boolean(item))
    : [];

  if (!variant && !items.length) {
    return undefined;
  }

  return {
    variant,
    items,
  };
};

const normalizeProjectPresentationStageDisplay = (
  value: unknown
): ProjectPresentationStageDisplay | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const stageDisplay: ProjectPresentationStageDisplay = {};

  if (typeof record.showCapabilitySummary === "boolean") {
    stageDisplay.showCapabilitySummary = record.showCapabilitySummary;
  }

  if (
    record.cardState === "default" ||
    record.cardState === "question" ||
    record.cardState === "answer"
  ) {
    stageDisplay.cardState = record.cardState;
  }

  if (typeof record.disableCardReveal === "boolean") {
    stageDisplay.disableCardReveal = record.disableCardReveal;
  }

  return Object.keys(stageDisplay).length ? stageDisplay : undefined;
};

const normalizeProjectPresentationSlide = (
  value: unknown,
  index: number
): ProjectPresentationSlide => {
  const record = (value || {}) as Record<string, unknown>;
  const sections = Array.isArray(record.sections)
    ? record.sections
        .map((section, sectionIndex) =>
          normalizeProjectPresentationSlideSection(section, sectionIndex)
        )
        .filter((section) => section.heading || section.bullets.length)
    : [];
  const subtitle = emptyString(record.subtitle);
  const bullets = normalizeTextList(record.bullets, 10);
  const titleLines = normalizeTextList(record.titleLines, 8);
  const callouts = Array.isArray(record.callouts)
    ? record.callouts
        .map((callout) => normalizeProjectPresentationCallout(callout))
        .filter((callout): callout is ProjectPresentationCallout => Boolean(callout))
    : [];
  const visual = normalizeProjectPresentationVisual(record.visual);
  const countdown = normalizeProjectPresentationCountdown(record.countdown);

  return {
    id: emptyString(record.id) || `presentation-slide-${index + 1}`,
    layout: normalizeProjectPresentationSlideLayout(
      record.layout,
      sections,
      bullets,
      subtitle
    ),
    countdown,
    kicker: emptyString(record.kicker),
    title: emptyString(record.title) || `Slide ${index + 1}`,
    titleLines,
    subtitle,
    mediaUrl: emptyString(record.mediaUrl),
    qrValue: emptyString(record.qrValue),
    qrLabel: emptyString(record.qrLabel),
    bullets,
    sections,
    caption: emptyString(record.caption),
    sourceLabel: emptyString(record.sourceLabel),
    callouts,
    visual,
    stageDisplay: normalizeProjectPresentationStageDisplay(record.stageDisplay),
    takeaway: emptyString(record.takeaway),
    speakerNotes: normalizeTextList(record.speakerNotes, 24),
  };
};

const normalizeProjectPresentation = (
  value: unknown
): ProjectPresentationContent => {
  const record = (value || {}) as Record<string, unknown>;
  const slides = Array.isArray(record.slides)
    ? record.slides
        .map((slide, index) => normalizeProjectPresentationSlide(slide, index))
        .filter(
          (slide) =>
            slide.title ||
            slide.titleLines?.length ||
            slide.subtitle ||
            slide.mediaUrl ||
            slide.qrValue ||
            slide.qrLabel ||
            slide.bullets.length ||
            slide.sections.length ||
            slide.caption ||
            slide.sourceLabel ||
            slide.callouts?.length ||
            slide.countdown ||
            slide.visual ||
            slide.takeaway ||
            slide.speakerNotes.length
        )
    : [];

  return {
    remoteEnabled: Boolean(record.remoteEnabled),
    publicSessionId: emptyString(record.publicSessionId) || undefined,
    theme: normalizeProjectPresentationTheme(record.theme),
    branding: normalizeProjectPresentationBranding(record.branding),
    slides,
  };
};

export const normalizeProjectContent = (
  content: unknown
): ProjectDocumentContent => {
  const value = (content || {}) as Record<string, unknown>;
  const defaultContent = createEmptyProjectContent();
  const presentation = normalizeProjectPresentation(value.presentation);
  const baseOptions = Array.isArray(value.baseOptions)
    ? value.baseOptions.map((option, index) =>
        normalizeProjectOption(option, `Base option ${index + 1}`)
      )
    : defaultContent.baseOptions;
  const addOnOptions = Array.isArray(value.addOnOptions)
    ? value.addOnOptions.map((option, index) =>
        normalizeProjectOption(option, `Add-on ${index + 1}`)
      )
    : defaultContent.addOnOptions;

  const defaultSelectedBaseIds = uniqueIds(
    normalizeTextList(value.defaultSelectedBaseIds, 12).filter((id) =>
      baseOptions.some((option) => option.id === id)
    )
  );
  const safeDefaultBaseIds =
    defaultSelectedBaseIds.length > 0
      ? defaultSelectedBaseIds
      : baseOptions[0]
        ? [baseOptions[0].id]
        : [];
  const bundleOptions = Array.isArray(value.bundleOptions)
    ? value.bundleOptions
        .map((bundleOption, index) =>
          normalizeProjectBundleOption(
            bundleOption,
            baseOptions,
            addOnOptions,
            `Bundle option ${index + 1}`
          )
        )
        .filter(
          (bundleOption) =>
            bundleOption.baseIds.length > 0 || bundleOption.addOnIds.length > 0
        )
    : normalizeLegacyBundleOptions(value.bundleRule, baseOptions, addOnOptions);
  const recommendedTimeline = normalizeProjectRecommendedTimeline(value.recommendedTimeline, [
    ...baseOptions.map((option) => option.id),
    ...addOnOptions.map((option) => option.id),
  ]);
  const supportingDownloads = Array.isArray(value.supportingDownloads)
    ? value.supportingDownloads
        .map((download, index) =>
          normalizeProjectSupportingDownload(download, index)
        )
        .filter((download): download is ProjectSupportingDownload => Boolean(download))
    : defaultContent.supportingDownloads || [];

  return {
    mode: "project",
    projectVariant:
      value.projectVariant === "presentation" ? "presentation" : "proposal",
    quoteId: emptyString(value.quoteId),
    logoUrl: emptyString(value.logoUrl),
    issuedOn: emptyString(value.issuedOn),
    validUntil: emptyString(value.validUntil),
    introText: emptyString(value.introText) || defaultContent.introText,
    notes: emptyString(value.notes) || defaultContent.notes,
    terms: emptyString(value.terms) || defaultContent.terms,
    acceptanceLine:
      emptyString(value.acceptanceLine) || defaultContent.acceptanceLine,
    currency: emptyString(value.currency).toUpperCase() || "AUD",
    gstMode:
      value.gstMode === "inclusive" || value.gstMode === "none"
        ? value.gstMode
        : "exclusive",
    brochureFooterNote:
      emptyString(value.brochureFooterNote) || defaultContent.brochureFooterNote,
    supportingDocsText:
      emptyString(value.supportingDocsText) || defaultContent.supportingDocsText,
    supportingDownloads,
    referenceBrochureMarkdown:
      emptyString(value.referenceBrochureMarkdown) ||
      defaultContent.referenceBrochureMarkdown,
    generatedBrochureMarkdown:
      emptyString(value.generatedBrochureMarkdown) ||
      defaultContent.generatedBrochureMarkdown,
    lastGeneratedAt:
      emptyString(value.lastGeneratedAt) || defaultContent.lastGeneratedAt,
    referenceSource:
      value.referenceSource === "override" ? "override" : "fallback",
    presentation,
    defaultSelectedBaseIds: safeDefaultBaseIds,
    defaultSelectedAddOnIds: uniqueIds(
      normalizeTextList(value.defaultSelectedAddOnIds, 12).filter((id) =>
        addOnOptions.some((option) => option.id === id)
      )
    ),
    recommendedTimeline,
    baseOptions,
    addOnOptions,
    bundleOptions,
    quoteLineOverrides: normalizeProjectQuoteLineOverrides(value.quoteLineOverrides),
    libraryMeta: {
      ...defaultContent.libraryMeta,
      ...(value.libraryMeta as DocumentLibraryMeta | undefined),
    },
  };
};

export const isProjectDocument = (
  document: Pick<StudioDocument, "kind" | "content">
): document is StudioDocument & { content: ProjectDocumentContent } =>
  document.kind === "project" ||
  ((((document.content as unknown) as Record<string, unknown> | undefined)?.mode) ===
    "project");

export const getProjectSelectionFromParams = (
  document: Pick<StudioDocument, "code" | "content"> & { content: ProjectDocumentContent },
  searchParams: URLSearchParams
): ProjectSelection => {
  const content = normalizeProjectContent(document.content);
  const parseIds = (value: string | null, allowedIds: string[], fallback: string[]) => {
    const selectedIds = (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => allowedIds.includes(item));

    return uniqueIds(selectedIds.length ? selectedIds : fallback);
  };

  const selection = {
    selectedBaseIds: parseIds(
      searchParams.get("bases"),
      content.baseOptions.map((option) => option.id),
      content.defaultSelectedBaseIds
    ),
    selectedAddOnIds: parseIds(
      searchParams.get("addons"),
      content.addOnOptions.map((option) => option.id),
      content.defaultSelectedAddOnIds
    ),
  };

  const requiredBaseIds =
    document.code.trim().toUpperCase() === RHEEM_PROJECT_CODE
      ? RHEEM_REQUIRED_BASE_IDS.filter((id) =>
          content.baseOptions.some((option) => option.id === id)
        )
      : [];

  return {
    selectedBaseIds: uniqueIds([
      ...selection.selectedBaseIds,
      ...requiredBaseIds,
    ]),
    selectedAddOnIds: selection.selectedAddOnIds,
  };
};

export const buildProjectSearchParams = (
  selection: ProjectSelection,
  options?: { printMode?: boolean }
) => {
  const params = new URLSearchParams();
  params.set("bases", uniqueIds(selection.selectedBaseIds).join(","));

  if (selection.selectedAddOnIds.length) {
    params.set("addons", uniqueIds(selection.selectedAddOnIds).join(","));
  }

  if (options?.printMode) {
    params.set("print", "1");
  }

  return params;
};

export const toggleSelectionId = (selectedIds: string[], id: string) =>
  selectedIds.includes(id)
    ? selectedIds.filter((item) => item !== id)
    : [...selectedIds, id];

export const getSelectedBaseOptions = (
  content: ProjectDocumentContent,
  selection: ProjectSelection
) =>
  content.baseOptions.filter((option) =>
    selection.selectedBaseIds.includes(option.id)
  );

export const getSelectedAddOnOptions = (
  content: ProjectDocumentContent,
  selection: ProjectSelection
) =>
  content.addOnOptions.filter((option) =>
    selection.selectedAddOnIds.includes(option.id)
  );

const getBundleOptionItemizedSubtotal = (
  content: ProjectDocumentContent,
  bundleOption: ProjectBundleOption
) =>
  content.baseOptions.reduce(
    (total, option) =>
      bundleOption.baseIds.includes(option.id) ? total + option.price : total,
    0
  ) +
  content.addOnOptions.reduce(
    (total, option) =>
      bundleOption.addOnIds.includes(option.id) ? total + option.price : total,
    0
  );

export const getActiveProjectBundleOption = (
  content: ProjectDocumentContent,
  selection: ProjectSelection
) =>
  content.bundleOptions.find(
    (bundleOption) =>
      (bundleOption.baseIds.length
        ? matchesExactIds(selection.selectedBaseIds, bundleOption.baseIds)
        : selection.selectedBaseIds.length > 0) &&
      matchesExactIds(selection.selectedAddOnIds, bundleOption.addOnIds)
  ) || null;

export const isProjectBundleActive = (
  content: ProjectDocumentContent,
  selection: ProjectSelection
) => Boolean(getActiveProjectBundleOption(content, selection));

export const getProjectSelectionItemizedSubtotal = (
  content: ProjectDocumentContent,
  selection: ProjectSelection
) =>
  getSelectedBaseOptions(content, selection).reduce(
    (total, option) => total + option.price,
    0
  ) +
  getSelectedAddOnOptions(content, selection).reduce(
    (total, option) => total + option.price,
    0
  );

const createQuoteItem = (
  id: string,
  description: string,
  unitPrice: number,
  displayOrder: number,
  override?: ProjectQuoteLineOverride
): QuoteItem => ({
  id,
  description: override?.description || description,
  quantity: Math.max(1, override?.quantity || 1),
  unitPrice:
    override && Number.isFinite(override.unitPrice) ? override.unitPrice : unitPrice,
  lineTotal:
    Math.max(1, override?.quantity || 1) *
    (override && Number.isFinite(override.unitPrice) ? override.unitPrice : unitPrice),
  displayOrder,
});

const getProjectAdjustmentLines = (
  selectedBases: ProjectOption[],
  activeBundleOption: ProjectBundleOption | null,
  currency: string
) => {
  if (activeBundleOption?.baseIds.length) {
    return [];
  }

  const amount = selectedBases.reduce((sum, option) => {
    const compareAtPrice =
      typeof option.compareAtPrice === "number" ? option.compareAtPrice : option.price;

    return sum + Math.max(0, compareAtPrice - option.price);
  }, 0);

  if (!amount) {
    return [];
  }

  return [
    {
      id: "adjustment-base-discount",
      title: "Discount",
      amount,
      priceLabel: formatCurrency(-amount, currency),
    },
  ];
};

const getProjectBundleDiscountLine = (
  content: ProjectDocumentContent,
  activeBundleOption: ProjectBundleOption | null
) => {
  if (!activeBundleOption) {
    return null;
  }

  const amount = Math.max(
    0,
    getBundleOptionItemizedSubtotal(content, activeBundleOption) -
      activeBundleOption.price
  );

  if (!amount) {
    return null;
  }

  return {
    id: `${activeBundleOption.id}-bundle-discount`,
    title: "Bundle discount",
    amount,
    priceLabel: formatCurrency(-amount, content.currency),
  };
};

export const buildProjectQuote = (
  document: StudioDocument & { content: ProjectDocumentContent },
  selection: ProjectSelection
): Quote => {
  const content = normalizeProjectContent(document.content);
  const selectedBases = getSelectedBaseOptions(content, selection);
  const selectedAddOns = getSelectedAddOnOptions(content, selection);
  const activeBundleOption = getActiveProjectBundleOption(content, selection);
  const quoteLineOverrides = new Map(
    content.quoteLineOverrides.map((override) => [override.id, override])
  );
  const adjustmentLines = getProjectAdjustmentLines(
    selectedBases,
    activeBundleOption,
    content.currency
  );
  const bundleReplacesBaseSelection = Boolean(activeBundleOption?.baseIds.length);
  const items: QuoteItem[] = [];

  if (activeBundleOption && bundleReplacesBaseSelection) {
    const lineId = `bundle-${activeBundleOption.id}`;
    items.push(
      createQuoteItem(
        lineId,
        `${activeBundleOption.title}${
          activeBundleOption.description
            ? ` | ${activeBundleOption.description}`
            : ""
        }`,
        activeBundleOption.price,
        0,
        quoteLineOverrides.get(lineId)
      )
    );
  } else {
    selectedBases.forEach((option, index) => {
      const lineId = `base-${option.id}`;
      items.push(
        createQuoteItem(
          lineId,
          `${option.title}${option.subtitle ? ` | ${option.subtitle}` : ""}`,
          option.compareAtPrice || option.price,
          index,
          quoteLineOverrides.get(lineId)
        )
      );
    });

    if (activeBundleOption) {
      const lineId = `bundle-${activeBundleOption.id}`;
      items.push(
        createQuoteItem(
          lineId,
          `${activeBundleOption.title}${
            activeBundleOption.description
              ? ` | ${activeBundleOption.description}`
              : ""
          }`,
          activeBundleOption.price,
          items.length,
          quoteLineOverrides.get(lineId)
        )
      );
    } else {
      selectedAddOns.forEach((option) => {
        const lineId = `addon-${option.id}`;
        items.push(
          createQuoteItem(
            lineId,
            `${option.title}${option.subtitle ? ` | ${option.subtitle}` : ""}`,
            option.price,
            items.length,
            quoteLineOverrides.get(lineId)
          )
        );
      });
    }

    adjustmentLines.forEach((adjustmentLine) => {
      items.push(
        createQuoteItem(
          adjustmentLine.id,
          adjustmentLine.title,
          -adjustmentLine.amount,
          items.length,
          quoteLineOverrides.get(adjustmentLine.id)
        )
      );
    });
  }

  return normalizeQuote({
    quoteCode: document.code,
    quoteId: content.quoteId,
    status: document.status,
    title: document.title,
    clientName: document.clientName,
    clientCompany: document.clientCompany,
    clientEmail: document.clientEmail,
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
    ctaLabel: document.ctaLabel || "Accept via email",
    adminEmail: document.adminEmail,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    items,
  });
};

export const buildProjectSummaryLines = (
  document: StudioDocument & { content: ProjectDocumentContent },
  selection: ProjectSelection
) => {
  const content = normalizeProjectContent(document.content);
  const selectedBases = getSelectedBaseOptions(content, selection);
  const selectedAddOns = getSelectedAddOnOptions(content, selection);
  const activeBundleOption = getActiveProjectBundleOption(content, selection);
  const bundleDiscountLine = getProjectBundleDiscountLine(
    content,
    activeBundleOption
  );
  const adjustmentLines = getProjectAdjustmentLines(
    selectedBases,
    activeBundleOption,
    content.currency
  );
  const bundledAddOnIds = new Set(activeBundleOption?.addOnIds || []);

  return {
    baseLines: selectedBases.map((option) => ({
      id: option.id,
      title: option.title,
      priceLabel: formatCurrency(option.compareAtPrice || option.price, content.currency),
    })),
    bundleLine: activeBundleOption
      ? {
          id: activeBundleOption.id,
          title: activeBundleOption.title,
          priceLabel: formatCurrency(activeBundleOption.price, content.currency),
        }
      : null,
    bundleDiscountLine,
    addOnLines: selectedAddOns.map((option) => ({
      id: option.id,
      title: option.title,
      priceLabel: bundledAddOnIds.has(option.id)
        ? "Included in package"
        : formatCurrency(option.price, content.currency),
      includedInBundle: bundledAddOnIds.has(option.id),
    })),
    adjustmentLines,
    bundleActive: Boolean(activeBundleOption),
  };
};

const isProjectTimelinePhaseIncluded = (
  phase: ProjectRecommendedTimelinePhase,
  selection: ProjectSelection
) => {
  if (!phase.relatedOptionIds.length) {
    return true;
  }

  const selectedIds = new Set([
    ...selection.selectedBaseIds,
    ...selection.selectedAddOnIds,
  ]);

  if (phase.relatedOptionMatch === "all") {
    return phase.relatedOptionIds.every((id) => selectedIds.has(id));
  }

  return phase.relatedOptionIds.some((id) => selectedIds.has(id));
};

const getProjectTimelinePhaseToggleTarget = (
  documentCode: string,
  content: ProjectDocumentContent,
  phase: ProjectRecommendedTimelinePhase
): ProjectTimelinePhaseToggleTarget | undefined => {
  if (phase.relatedOptionIds.length !== 1) {
    return undefined;
  }

  const optionId = phase.relatedOptionIds[0];

  if (
    documentCode.trim().toUpperCase() === RHEEM_PROJECT_CODE &&
    RHEEM_REQUIRED_BASE_IDS.includes(optionId)
  ) {
    return undefined;
  }

  if (content.baseOptions.some((option) => option.id === optionId)) {
    return {
      type: "base",
      id: optionId,
    };
  }

  if (content.addOnOptions.some((option) => option.id === optionId)) {
    return {
      type: "addon",
      id: optionId,
    };
  }

  return undefined;
};

const getProjectTimelinePhaseLabel = (
  documentCode: string,
  phaseId: string,
  fallbackLabel: string,
  fallbackIndex: number
) => {
  if (documentCode.trim().toUpperCase() !== RHEEM_PROJECT_CODE) {
    return fallbackLabel || `Phase ${fallbackIndex + 1}`;
  }

  if (
    phaseId === "rheem-roadmap-phase-1" ||
    phaseId === "rheem-roadmap-phase-2" ||
    phaseId === "rheem-roadmap-phase-2-remote" ||
    phaseId === "rheem-roadmap-phase-2-remote-esl"
  ) {
    return "Phase 1";
  }

  if (phaseId === "rheem-roadmap-phase-3") {
    return "Phase 2";
  }

  if (phaseId === "rheem-roadmap-phase-4") {
    return "Phase 3";
  }

  if (phaseId === "rheem-roadmap-phase-5") {
    return "Phase 4";
  }

  return fallbackLabel || `Phase ${fallbackIndex + 1}`;
};

const getProjectTimelinePhaseAgendaBinding = (
  documentCode: string,
  content: ProjectDocumentContent,
  phaseId: string
) => {
  if (documentCode.trim().toUpperCase() !== RHEEM_PROJECT_CODE) {
    return undefined;
  }

  const optionIdByPhaseId: Record<string, string> = {
    "rheem-roadmap-phase-2": "f2f-session",
    "rheem-roadmap-phase-2-remote": "remote-session",
    "rheem-roadmap-phase-2-remote-esl": "esl-remote-session",
    "rheem-roadmap-phase-3": "addon-1",
    "rheem-roadmap-phase-4": "addon-2",
    "rheem-roadmap-phase-5": "addon-3",
  };

  const optionId = optionIdByPhaseId[phaseId];

  if (!optionId) {
    return undefined;
  }

  const option = [...content.baseOptions, ...content.addOnOptions].find(
    (candidate) => candidate.id === optionId
  );

  if (!option?.agenda) {
    return undefined;
  }

  return {
    linkedOptionId: option.id,
    agenda: option.agenda,
  };
};

export const buildProjectTimelineDisplayData = (
  document: StudioDocument & { content: ProjectDocumentContent },
  selection: ProjectSelection
): ProjectTimelineDisplayData | null => {
  const content = normalizeProjectContent(document.content);
  const timeline = content.recommendedTimeline;

  if (!timeline?.phases.length) {
    return null;
  }

  const optionTitleById = new Map(
    [...content.baseOptions, ...content.addOnOptions].map((option) => [
      option.id,
      option.title,
    ])
  );
  const selectedIds = new Set([
    ...selection.selectedBaseIds,
    ...selection.selectedAddOnIds,
  ]);
  const isRheemProject = document.code.trim().toUpperCase() === RHEEM_PROJECT_CODE;
  const showRheemRemotePhase = isRheemProject;
  const displayPhases = timeline.phases.map((phase) => {
    const includedInCurrentScope = isProjectTimelinePhaseIncluded(
      phase,
      selection
    );
    const matchedTimingVariant = resolveProjectTimelinePhaseTimingVariant(
      phase,
      selectedIds
    );
    const relatedOptionTitles = phase.relatedOptionIds
      .map((id) => optionTitleById.get(id) || "")
      .filter(Boolean);
    const hideTimingNote =
      showRheemRemotePhase && phase.id === "rheem-roadmap-phase-2";
    const toggleTarget = getProjectTimelinePhaseToggleTarget(
      document.code,
      content,
      phase
    );
    const agendaBinding = getProjectTimelinePhaseAgendaBinding(
      document.code,
      content,
      phase.id
    );

    return {
      ...phase,
      timing: phase.timing,
      timingNote: hideTimingNote ? "" : matchedTimingVariant?.timing || "",
      includedInCurrentScope,
      statusLabel: includedInCurrentScope ? "" : "+ Add to Plan (Recommended)",
      toggleTarget,
      helperText:
        !includedInCurrentScope &&
        relatedOptionTitles.length &&
        toggleTarget?.type !== "base"
          ? `Unlocked by: ${joinNaturalLanguageList(relatedOptionTitles)}`
          : "",
      linkedOptionId: agendaBinding?.linkedOptionId,
      agenda: agendaBinding?.agenda,
    };
  });

  if (showRheemRemotePhase) {
    const insertionIndex = displayPhases.findIndex(
      (phase) => phase.id === "rheem-roadmap-phase-2"
    );
    const phaseTwoSource = timeline.phases.find(
      (phase) => phase.id === "rheem-roadmap-phase-2"
    );
    const remoteTiming = phaseTwoSource
      ? resolveProjectTimelinePhaseTimingVariant(phaseTwoSource, selectedIds)?.timing ||
        "Wednesday, April 29, 2026"
      : "Wednesday, April 29, 2026";

    if (insertionIndex >= 0 && remoteTiming) {
      const remoteAgendaBinding = getProjectTimelinePhaseAgendaBinding(
        document.code,
        content,
        "rheem-roadmap-phase-2-remote"
      );
      const eslRemoteAgendaBinding = getProjectTimelinePhaseAgendaBinding(
        document.code,
        content,
        "rheem-roadmap-phase-2-remote-esl"
      );

      displayPhases.splice(
        insertionIndex + 1,
        0,
        {
          id: "rheem-roadmap-phase-2-remote",
          label: "Phase 1",
          timing: remoteTiming,
          title: "Remote Session",
          summary:
            "Run the live online follow-up for a small 4-6 person remote or offshore cohort, with plain-English facilitation, written prompts in chat, and recap checkpoints to support mixed English confidence.",
          deliverables: [
            "Live online capability uplift session for a small 4-6 person remote cohort",
            "Plain-English facilitation, written prompts in chat, recap checkpoints, and optional split delivery blocks",
          ],
          relatedOptionIds: ["remote-session"],
          relatedOptionMatch: "all",
          timingVariants: [],
          includedInCurrentScope: selectedIds.has("remote-session"),
          statusLabel: selectedIds.has("remote-session")
            ? ""
            : "+ Add to Plan (Recommended)",
          helperText: "",
          timingNote: "",
          toggleTarget: {
            type: "base",
            id: "remote-session",
          },
          linkedOptionId: remoteAgendaBinding?.linkedOptionId,
          agenda: remoteAgendaBinding?.agenda,
        },
        {
          id: "rheem-roadmap-phase-2-remote-esl",
          label: "Phase 1",
          timing: "Week of April 27, 2026",
          title: "ESL Remote Session",
          summary:
            "Run a supported live online follow-up for participants with mixed English confidence, using smaller breakout groups, clearer step-by-step facilitation, and more active engagement from our side.",
          deliverables: [
            "Live online supported capability uplift session for up to 10 participants",
            "Smaller-group practice, written prompts in chat, recap checkpoints, and stronger facilitator-led engagement",
          ],
          relatedOptionIds: ["esl-remote-session"],
          relatedOptionMatch: "all",
          timingVariants: [],
          includedInCurrentScope: selectedIds.has("esl-remote-session"),
          statusLabel: selectedIds.has("esl-remote-session")
            ? ""
            : "+ Add to Plan (Recommended)",
          helperText: "",
          timingNote: "",
          toggleTarget: {
            type: "base",
            id: "esl-remote-session",
          },
          linkedOptionId: eslRemoteAgendaBinding?.linkedOptionId,
          agenda: eslRemoteAgendaBinding?.agenda,
        }
      );
    }
  }

  return {
    chipLabel: document.clientCompany || document.clientName || "Studio Project",
    chipSecondaryLabel: timeline.eyebrow || "Suggested timeline",
    preparedForLabel: "Prepared for",
    preparedForLogoAlt: `${
      document.clientCompany || document.clientName || "Client"
    } logo`,
    preparedForLogoSrc: content.logoUrl || undefined,
    eyebrow: timeline.eyebrow,
    heading: timeline.heading,
    intro: timeline.intro,
    closingNote: timeline.closingNote,
    phases: displayPhases.map((phase, index) => ({
      ...phase,
      label: getProjectTimelinePhaseLabel(
        document.code,
        phase.id,
        phase.label,
        index
      ),
    })),
  };
};

export const buildProjectBrochurePage = (
  document: StudioDocument & { content: ProjectDocumentContent },
  option: ProjectOption
) => ({
  chipLabel: document.clientCompany || document.clientName || "Studio Project",
  chipSecondaryLabel: "Brochure",
  footerNote:
    document.content.brochureFooterNote ||
    (document.status === "published" ? "Shared studio project." : "Draft preview."),
  preparedForLabel: "Prepared for",
  preparedForLogoAlt: `${
    document.clientCompany || document.clientName || "Client"
  } logo`,
  preparedForLogoSrc: document.content.logoUrl || undefined,
  title: option.title || document.title,
  subtitle: option.subtitle || document.content.introText,
  facts: option.facts.filter((fact) => fact.label || fact.value).concat([
    {
      label: "Price",
      value: formatCurrency(option.price, document.content.currency),
    },
  ]),
  sections: option.brochureSections.filter(
    (section) => section.title || section.paragraphs.length || section.bullets.length
  ),
});

export const buildProjectAgendaPage = (
  document: StudioDocument & { content: ProjectDocumentContent },
  option: ProjectOption
): ProjectAgendaPageData | null => {
  if (!option.agenda) {
    return null;
  }

  return {
    chipLabel: document.clientCompany || document.clientName || "Studio Project",
    chipSecondaryLabel: "Session Agenda",
    footerNote:
      document.content.brochureFooterNote ||
      (document.status === "published" ? "Shared studio project." : "Draft preview."),
    preparedForLabel: "Prepared for",
    preparedForLogoAlt: `${
      document.clientCompany || document.clientName || "Client"
    } logo`,
    preparedForLogoSrc: document.content.logoUrl || undefined,
    title: option.agenda.heading || `${option.title} agenda`,
    subtitle:
      option.agenda.subtitle || option.subtitle || option.description || option.title,
    duration: option.agenda.duration,
    deliveryMode: option.agenda.deliveryMode,
    whyThisMattersNow: option.agenda.whyThisMattersNow,
    sources: option.agenda.sources || [],
    blocks: option.agenda.blocks,
    includedValueAdd: option.agenda.includedValueAdd,
    overallOutcomes: option.agenda.overallOutcomes || [],
    contextNote: option.agenda.contextNote,
  };
};

export const buildProjectBrochurePages = (
  document: StudioDocument & { content: ProjectDocumentContent },
  selection: ProjectSelection,
  selectedOnly = false
) => {
  const content = normalizeProjectContent(document.content);
  const options = selectedOnly
    ? [
        ...getSelectedBaseOptions(content, selection),
        ...getSelectedAddOnOptions(content, selection),
      ]
    : [...content.baseOptions, ...content.addOnOptions];

  return options.map((option) => buildProjectBrochurePage(document, option));
};

const getFactValue = (option: ProjectOption, labelPattern: RegExp, fallback = "TBD") =>
  option.facts.find((fact) => labelPattern.test(fact.label))?.value || fallback;

const formatMarkdownPrice = (
  value: number,
  currency: string,
  gstMode: ProjectDocumentContent["gstMode"]
) => {
  if (value <= 0) {
    return "TBD";
  }

  const formatted = formatCurrency(value, currency);

  if (gstMode === "exclusive") {
    return `${formatted} + GST`;
  }

  if (gstMode === "inclusive") {
    return `${formatted} incl. GST`;
  }

  return formatted;
};

const serializeSectionMarkdown = (section: ProjectBrochureSection) => {
  const paragraphs = section.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  const bullets = section.bullets.map((bullet) => bullet.trim()).filter(Boolean);

  return [
    `### ${section.title || "Section"}`,
    "",
    ...paragraphs,
    ...(paragraphs.length && bullets.length ? [""] : []),
    ...bullets.map((bullet) => `- ${bullet}`),
  ]
    .filter((line, index, array) => !(line === "" && array[index - 1] === ""))
    .join("\n")
    .trim();
};

const serializeAgendaMarkdown = (agenda: ProjectOptionAgenda) => {
  const sourceLines = (agenda.sources || []).map(
    (source) => `- ${source.label}: ${source.url}`
  );
  const metaLines =
    agenda.duration || agenda.deliveryMode
      ? [
          `**Duration:** ${agenda.duration || "TBD"}  `,
          `**Delivery:** ${agenda.deliveryMode || "TBD"}`,
        ]
      : [];

  return [
    "### Session Agenda",
    "",
    agenda.subtitle,
    ...metaLines,
    ...(agenda.contextNote ? ["", agenda.contextNote] : []),
    ...(agenda.whyThisMattersNow ? ["", "#### Why this matters now", "", agenda.whyThisMattersNow] : []),
    ...(sourceLines.length ? ["", "#### Sources", ...sourceLines] : []),
    "",
    "#### Agenda blocks",
    "",
    ...agenda.blocks.flatMap((block) => [
      `##### ${[block.timeLabel, block.title].filter(Boolean).join(" | ")}`,
      "",
      ...(block.focus ? [`**Focus:** ${block.focus}`, ""] : []),
      ...block.bullets.map((bullet) => `- ${bullet}`),
      ...((block.examples || []).length
        ? [
            "",
            `${block.examplesLabel || "Examples"}:`,
            ...(block.examples || []).map((example) => `- ${example}`),
          ]
        : []),
      ...(block.outcome ? ["", `**Outcome:** ${block.outcome}`] : []),
      "",
    ]),
    ...(agenda.includedValueAdd
      ? ["#### Included value-add", "", agenda.includedValueAdd]
      : []),
    ...(agenda.overallOutcomes?.length ? ["", "#### Overall outcomes"] : []),
    ...(agenda.overallOutcomes || []).map((outcome) => `- ${outcome}`),
  ]
    .filter((line, index, array) => !(line === "" && array[index - 1] === ""))
    .join("\n")
    .trim();
};

const serializeProjectTimelineMarkdown = (
  timeline: ProjectRecommendedTimeline,
  content: ProjectDocumentContent
) => {
  const optionTitleById = new Map(
    [...content.baseOptions, ...content.addOnOptions].map((option) => [
      option.id,
      option.title,
    ])
  );

  return [
    "## Suggested Timeline",
    `# ${timeline.heading || "Suggested timeline"}`,
    "",
    timeline.intro,
    "",
    ...timeline.phases.flatMap((phase, index) => {
      const relatedTitles = phase.relatedOptionIds
        .map((id) => optionTitleById.get(id) || "")
        .filter(Boolean);
      const timingVariantNotes = (phase.timingVariants || [])
        .map((variant) => {
          const optionTitles = variant.optionIds
            .map((id) => optionTitleById.get(id) || "")
            .filter(Boolean);

          if (!variant.timing) {
            return "";
          }

          if (!optionTitles.length) {
            return `Alternate timing: ${variant.timing}`;
          }

          return `If ${joinNaturalLanguageList(optionTitles)} is selected: ${variant.timing}`;
        })
        .filter(Boolean);
      const heading = [phase.label, phase.timing, phase.title]
        .filter(Boolean)
        .join(" · ");

      return [
        `### ${heading || `Phase ${index + 1}`}`,
        "",
        phase.summary,
        ...(phase.summary && phase.deliverables.length ? [""] : []),
        ...phase.deliverables.map((deliverable) => `- ${deliverable}`),
        ...(timingVariantNotes.length
          ? [
              "",
              ...timingVariantNotes.map((note) => `- ${note}`),
            ]
          : []),
        ...(relatedTitles.length
          ? [
              "",
              `Included with: ${joinNaturalLanguageList(relatedTitles)}`,
            ]
          : []),
        "",
      ];
    }),
    timeline.closingNote,
  ]
    .filter((line, index, array) => {
      const currentLine = typeof line === "string" ? line.trimEnd() : "";
      const previousLine = index > 0 ? array[index - 1] : null;

      return !(
        currentLine === "" &&
        (previousLine === "" || previousLine === null)
      );
    })
    .join("\n")
    .trim();
};

const serializeOptionBlock = (
  heading: string,
  option: ProjectOption,
  currency: string,
  gstMode: ProjectDocumentContent["gstMode"],
  mode: "base" | "addon"
) => {
  const duration = getFactValue(option, /duration/i);
  const delivery = getFactValue(option, /delivery/i);
  const thirdFact =
    option.facts.find((fact) => !/duration|delivery/i.test(fact.label))?.value ||
    "TBD";

  return [
    heading,
    `# ${option.subtitle || option.title || "Offer"}`,
    "",
    mode === "base"
      ? "| DURATION | DELIVERY MODE | COHORT SIZE | PRICE |"
      : "| DURATION | DELIVERY MODE | SUGGESTED TIMING | PRICE |",
    "|---|---|---|---:|",
    `| ${duration} | ${delivery} | ${thirdFact} | ${formatMarkdownPrice(
      option.price,
      currency,
      gstMode
    )} |`,
    "",
    ...option.brochureSections
      .filter(
        (section) => section.title || section.paragraphs.length || section.bullets.length
      )
      .flatMap((section, index) => [
        ...(index > 0 ? [""] : []),
        serializeSectionMarkdown(section),
      ]),
    ...(option.agenda
      ? [
          "",
          serializeAgendaMarkdown(option.agenda),
        ]
      : []),
  ]
    .filter((line, index, array) => !(line === "" && array[index - 1] === ""))
    .join("\n")
    .trim();
};

export const serializeProjectDocumentToBrochureMarkdown = (
  document: StudioDocument & { content: ProjectDocumentContent }
) => {
  const content = normalizeProjectContent(document.content);
  const quote = buildProjectQuote(document, {
    selectedBaseIds: content.defaultSelectedBaseIds,
    selectedAddOnIds: content.defaultSelectedAddOnIds,
  });
  const basePrices = content.baseOptions
    .map((option) => option.price)
    .filter((price) => price > 0);
  const lowestBasePrice = basePrices.length ? Math.min(...basePrices) : 0;
  const highestBasePrice = basePrices.length ? Math.max(...basePrices) : 0;
  const bundleRows = content.bundleOptions
    .map((bundleOption) => {
      const includedBaseTitles = bundleOption.baseIds
        .map((id) => content.baseOptions.find((option) => option.id === id)?.title || "")
        .filter(Boolean);
      const includedAddOnTitles = bundleOption.addOnIds
        .map((id) => content.addOnOptions.find((option) => option.id === id)?.title || "")
        .filter(Boolean);

      return `| ${bundleOption.title || "Bundle"} | ${[
        ...includedBaseTitles,
        ...includedAddOnTitles,
      ].join(" + ")} | ${formatMarkdownPrice(
        bundleOption.price,
        content.currency,
        content.gstMode
      )} |`;
    })
    .filter(Boolean);
  const timelineBlock = content.recommendedTimeline
    ? serializeProjectTimelineMarkdown(content.recommendedTimeline, content)
    : "";

  return [
    content.introText,
    content.notes ? `\n${content.notes}` : "",
    "",
    "---",
    "",
    "## Market Pricing Guide",
    "",
    "> **Current base session pricing range**",
    `> **${formatMarkdownPrice(
      lowestBasePrice,
      content.currency,
      content.gstMode
    )} - ${formatMarkdownPrice(
      highestBasePrice || lowestBasePrice,
      content.currency,
      content.gstMode
    )}**`,
    "",
    "### Pricing Rationale",
    "",
    content.introText,
    "",
    "---",
    "",
    ...content.baseOptions.flatMap((option) => [
      serializeOptionBlock(
        `## ${option.title || "Base session"}`,
        option,
        content.currency,
        content.gstMode,
        "base"
      ),
      "",
      "---",
      "",
    ]),
    "## Optional Hybrid Add-Ons",
    `# ${document.title || "Follow-up sessions"}`,
    "",
    "These add-ons extend the core brochure into practical follow-up work, team-specific application, and clearer next-step decisions.",
    "",
    ...content.addOnOptions.flatMap((option, index) => [
      serializeOptionBlock(
        `### ${option.title || `Hybrid Add-On ${index + 1}`}`,
        option,
        content.currency,
        content.gstMode,
        "addon"
      ),
      "",
    ]),
    "### Add-On Bundle",
    "",
    "| OPTION | INCLUDES | PRICE |",
    "|---|---|---:|",
    ...bundleRows,
    "",
    content.brochureFooterNote ||
      "This bundle structure gives the client a practical path from foundational capability uplift into tested practice and clearer next-step decisions.",
    ...(timelineBlock
      ? [
          "",
          "---",
          "",
          timelineBlock,
        ]
      : []),
    "",
    "---",
    "",
    "## Recommended Positioning",
    "",
    content.brochureFooterNote || content.notes || content.introText,
    "",
    "---",
    "",
    "## Quote Details",
    "",
    "| FIELD | VALUE |",
    "|---|---|",
    `| Project Title | ${document.title || "TBD"} |`,
    `| Client Name | ${document.clientName || "TBD"} |`,
    `| Organisation | ${document.clientCompany || "TBD"} |`,
    `| Quote ID | ${content.quoteId || "TBD"} |`,
    `| Issued On | ${content.issuedOn || "TBD"} |`,
    `| Valid Until | ${content.validUntil || "TBD"} |`,
    `| Currency | ${content.currency} |`,
    `| GST Mode | ${content.gstMode} |`,
    "",
    "### Quote Items",
    "",
    "| DESCRIPTION | QTY | RATE | SUBTOTAL |",
    "|---|---:|---:|---:|",
    ...quote.items.map(
      (item) =>
        `| ${item.description || "Scope"} | ${item.quantity} | ${formatCurrency(
          item.unitPrice,
          quote.currency
        )} | ${formatCurrency(item.lineTotal, quote.currency)} |`
    ),
    "",
    "### Notes",
    "",
    content.notes || "TBD",
    "",
    "### Terms",
    "",
    content.terms || "TBD",
    "",
    "### Acceptance",
    "",
    content.acceptanceLine || "TBD",
  ]
    .filter((line, index, array) => !(line === "" && array[index - 1] === ""))
    .join("\n")
    .trim();
};

export const buildProjectMailto = (
  document: StudioDocument & { content: ProjectDocumentContent },
  selection: ProjectSelection,
  origin: string,
  path: string
) => {
  const quote = buildProjectQuote(document, selection);
  const content = normalizeProjectContent(document.content);
  const summary = buildProjectSummaryLines(document, selection);
  const pdfUrl = `${origin}${path}?${buildProjectSearchParams(selection, {
    printMode: true,
  }).toString()}`;

  const subject = `Acceptance for ${content.quoteId || document.code || document.title}`;
  const body = [
    "Hi Rushi,",
    "",
    `I'd like to proceed with ${content.quoteId || document.code || document.title}.`,
    "",
    "Selected base options:",
    ...(summary.baseLines.length
      ? summary.baseLines.map((line) => `- ${line.title} (${line.priceLabel})`)
      : ["- None selected"]),
    "",
    "Selected bundles:",
    ...(summary.bundleLine
      ? [`- ${summary.bundleLine.title} (${summary.bundleLine.priceLabel})`]
      : ["- None selected"]),
    "",
    "Selected add-ons:",
    ...(summary.addOnLines.length
      ? summary.addOnLines.map((line) => `- ${line.title} (${line.priceLabel})`)
      : ["- None selected"]),
    "",
    "Pricing summary:",
    ...(summary.bundleDiscountLine
      ? [`- ${summary.bundleDiscountLine.title}: ${summary.bundleDiscountLine.priceLabel}`]
      : []),
    ...(summary.adjustmentLines.length
      ? summary.adjustmentLines.map(
          (line) => `- ${line.title}: ${line.priceLabel}`
        )
      : []),
    `- Subtotal: ${formatCurrency(quote.subtotal, quote.currency)}`,
    `- GST: ${formatCurrency(quote.gstAmount, quote.currency)}`,
    `- Total: ${formatCurrency(quote.total, quote.currency)}`,
    "",
    `PDF link: ${pdfUrl}`,
    "",
    "Thanks,",
  ].join("\n");

  return `mailto:${document.adminEmail || "rushi@knowwhatson.com"}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};

export const deriveProjectLibraryMeta = (
  document: StudioDocument & { content: ProjectDocumentContent }
): DocumentLibraryMeta => {
  const currentMeta = document.content.libraryMeta;

  return {
    isListed: currentMeta.isListed ?? document.status === "published",
    cardCompany:
      currentMeta.cardCompany ||
      document.clientCompany ||
      document.clientName ||
      "Studio Project",
    cardTitle: currentMeta.cardTitle || document.title || "Untitled project",
    cardCategory:
      currentMeta.cardCategory ||
      (document.content.projectVariant === "presentation"
        ? "Presentation"
        : "Project"),
    cardStatusLabel:
      currentMeta.cardStatusLabel ||
      (document.status === "published"
        ? "Code required"
        : document.status === "archived"
          ? "Archived"
          : "Draft"),
    cardSummary:
      currentMeta.cardSummary ||
      document.content.introText ||
      "Shared through the public studio.",
    cardLogoUrl: currentMeta.cardLogoUrl || document.content.logoUrl || "",
  };
};
