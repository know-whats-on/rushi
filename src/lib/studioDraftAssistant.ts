import type { ProjectDocumentContent, StudioDocument } from "../types/documents";
import type { QuoteGstMode } from "../types/quotes";
import {
  createEmptyProjectContent,
  normalizeProjectContent,
  serializeProjectDocumentToBrochureMarkdown,
} from "./projectDocuments";
import { supabase } from "./supabase";

type AssistantOption = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  facts?: Array<{ label?: string; value?: string }>;
  highlights?: string[];
  brochureSections?: Array<{
    id?: string;
    title?: string;
    column?: "left" | "right";
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

type AssistantBundleOption = {
  id?: string;
  title?: string;
  description?: string;
  baseIds?: string[];
  addOnIds?: string[];
  price?: number;
};

type AssistantResponse = {
  title?: string;
  quoteId?: string;
  issuedOn?: string;
  validUntil?: string;
  introText?: string;
  notes?: string;
  terms?: string;
  acceptanceLine?: string;
  currency?: string;
  gstMode?: QuoteGstMode;
  supportingDocsText?: string;
  referenceBrochureMarkdown?: string;
  generatedBrochureMarkdown?: string;
  lastGeneratedAt?: string;
  referenceSource?: "fallback" | "override";
  defaultSelectedBaseIds?: string[];
  defaultSelectedAddOnIds?: string[];
  baseOptions?: AssistantOption[];
  addOnOptions?: AssistantOption[];
  bundleOptions?: AssistantBundleOption[];
};

export interface GenerateStudioProjectDraftInput {
  currentDocument: StudioDocument & { kind: "project"; content: ProjectDocumentContent };
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  timeline: string;
  budgetRange: string;
  supportingDocsText: string;
  referenceBrochureMarkdown: string;
}

export interface SyncStudioProjectFromBrochureInput {
  currentDocument: StudioDocument & { kind: "project"; content: ProjectDocumentContent };
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  timeline: string;
  budgetRange: string;
  supportingDocsText: string;
  referenceBrochureMarkdown: string;
  generatedBrochureMarkdown: string;
}

export interface GenerateStudioProjectDraftRequest
  extends GenerateStudioProjectDraftInput {
  sourceMaterial: string;
}

export interface GenerateStudioProjectDraftResult {
  title: string;
  content: ProjectDocumentContent;
}

const STUDIO_PROJECT_ASSISTANT_TIMEOUT_MS = 20_000;
const DEFAULT_PROJECT_TITLE = "Brochure Quote";
type BrochureSectionType =
  | "overview"
  | "focus"
  | "activities"
  | "outputs"
  | "included";
type BrochureSectionDefaults = Record<BrochureSectionType, string[]>;
const DEFAULT_SECTION_ORDER: BrochureSectionType[] = [
  "overview",
  "focus",
  "activities",
  "outputs",
  "included",
];

const emptyString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const cleanSourceText = (value: string) =>
  value
    .replace(/^#+\s*/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const textKey = (value: string) => cleanSourceText(value).toLowerCase();

const uniqueTextItems = (items: string[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = textKey(item);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const splitTextIntoFragments = (value: string) => {
  const cleaned = cleanSourceText(value);
  if (!cleaned) {
    return [];
  }

  const fragments = cleaned
    .split(/(?<=[.!?])\s+/)
    .flatMap((sentence) => sentence.split(/\s*[;•]\s*/))
    .map((fragment) => cleanSourceText(fragment))
    .filter((fragment) => fragment.length >= 12);

  return fragments.length ? fragments : [cleaned];
};

const buildCandidatePool = (...groups: string[][]) =>
  uniqueTextItems(
    groups.flatMap((group) => group.flatMap((item) => splitTextIntoFragments(item)))
  );

const takeDistinctContent = (
  preferredItems: string[],
  fallbackItems: string[],
  count: number,
  usedKeys: Set<string>
) => {
  const nextItems: string[] = [];

  const addItem = (item: string) => {
    const cleaned = cleanSourceText(item);
    const key = textKey(cleaned);

    if (!cleaned || !key || usedKeys.has(key) || nextItems.length >= count) {
      return;
    }

    usedKeys.add(key);
    nextItems.push(cleaned);
  };

  uniqueTextItems(preferredItems).forEach(addItem);
  uniqueTextItems(fallbackItems).forEach(addItem);

  return nextItems;
};

const normalizeList = (value: unknown, limit = 6) =>
  Array.isArray(value)
    ? value
        .map((item) => emptyString(item))
        .filter(Boolean)
        .slice(0, limit)
    : [];

const formatDateInput = (value?: string) => {
  const normalized = emptyString(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parsed = normalized ? new Date(normalized) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
};

const parseDraftPrice = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseBudgetAmount = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/,/g, "");
  const scaledMatch = normalized.match(/(\d+(?:\.\d+)?)([km])?/);

  if (scaledMatch) {
    const amount = Number(scaledMatch[1]);
    if (Number.isFinite(amount)) {
      const multiplier =
        scaledMatch[2] === "m" ? 1_000_000 : scaledMatch[2] === "k" ? 1_000 : 1;
      return Math.round(amount * multiplier);
    }
  }

  const digits = value.replace(/\D+/g, "");
  if (!digits) {
    return 0;
  }

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractSourceParagraphs = (sourceMaterial: string) =>
  sourceMaterial
    .split(/\n{2,}/)
    .map((paragraph) => cleanSourceText(paragraph))
    .filter(Boolean);

const extractSourceLines = (sourceMaterial: string) =>
  sourceMaterial
    .split("\n")
    .map((line) =>
      cleanSourceText(line.replace(/^[-*•\s]+/, "").replace(/^\|\s*/, "").replace(/\s*\|$/, ""))
    )
    .filter(
      (line) => Boolean(line) && !/^[:\-\s|]+$/.test(line) && !/^[-]{2,}$/.test(line)
    );

const extractSourceSentences = (sourceMaterial: string) =>
  sourceMaterial
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => cleanSourceText(sentence))
    .filter(Boolean);

const extractFirstPrice = (sourceMaterial: string, budgetRange: string) => {
  const matches = Array.from(
    sourceMaterial.matchAll(/\$?\s?(\d[\d,]*(?:\.\d{1,2})?)/g)
  );
  const firstMatch = matches
    .map((match) => Number(match[1].replace(/,/g, "")))
    .find((value) => Number.isFinite(value) && value > 0);

  if (firstMatch) {
    return firstMatch;
  }

  return parseBudgetAmount(budgetRange);
};

const deriveFallbackTitle = (
  sourceMaterial: string,
  currentTitle: string,
  clientCompany: string,
  clientName: string
) => {
  const current = emptyString(currentTitle);
  if (current && current !== DEFAULT_PROJECT_TITLE) {
    return current;
  }

  const headingMatch = sourceMaterial.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch?.[1]) {
    return cleanSourceText(headingMatch[1]).slice(0, 88);
  }

  const lineCandidate = extractSourceLines(sourceMaterial).find(
    (line) =>
      line.length >= 8 &&
      line.length <= 96 &&
      /[a-z]/i.test(line) &&
      !/^(duration|delivery|price|overview|focus areas|typical activities|outputs|included)$/i.test(
        line
      )
  );

  if (lineCandidate) {
    return lineCandidate;
  }

  return clientCompany || clientName || DEFAULT_PROJECT_TITLE;
};

const inferDuration = (sourceMaterial: string, timeline: string, fallback: string) => {
  const timelineValue = emptyString(timeline);
  if (timelineValue) {
    return timelineValue;
  }

  const match = sourceMaterial.match(
    /(\d+\s*(?:minutes?|mins?|hours?|hrs?|days?|weeks?|sessions?))/i
  );

  return match?.[1] ? cleanSourceText(match[1]) : fallback;
};

const inferDelivery = (sourceMaterial: string, fallback = "Hybrid") => {
  if (/face-to-face|in person|on-site|onsite/i.test(sourceMaterial)) {
    return "In person";
  }

  if (/virtual|online|remote/i.test(sourceMaterial)) {
    return "Virtual";
  }

  if (/hybrid/i.test(sourceMaterial)) {
    return "Hybrid";
  }

  return fallback;
};

const inferAudience = (
  sourceMaterial: string,
  clientCompany: string,
  clientName: string
) => {
  const audienceMatch = sourceMaterial.match(
    /(finance team|leadership team|operations team|sales team|marketing team|project team|executive team)/i
  );

  return (
    cleanSourceText(audienceMatch?.[1] || "") ||
    clientCompany ||
    clientName ||
    "Client team"
  );
};

const inferSuggestedTiming = (sourceMaterial: string, fallback: string) => {
  const match = sourceMaterial.match(
    /(\d+\s*(?:days?|weeks?|months?)\s+(?:after|post)[^.|\n]*)/i
  );

  return cleanSourceText(match?.[1] || "") || fallback;
};

const getSectionType = (title: string, index: number): BrochureSectionType => {
  if (/overview/i.test(title)) {
    return "overview";
  }

  if (/focus|priority|theme/i.test(title)) {
    return "focus";
  }

  if (/typical|activities|agenda|approach|delivery/i.test(title)) {
    return "activities";
  }

  if (/output|outcome|result|benefit/i.test(title)) {
    return "outputs";
  }

  if (/included|scope|support/i.test(title)) {
    return "included";
  }

  return DEFAULT_SECTION_ORDER[index] || "included";
};

const buildBaseSectionDefaults = (title: string, audience: string) => ({
  overview: [
    `${title} is designed to give ${audience} a clear, practical starting point for the work described in the brief.`,
    "The session keeps the material grounded in current business context, immediate use cases, and sensible next-step decisions.",
  ],
  focus: [
    `Practical priorities that matter most to ${audience}.`,
    "Clearer understanding of where AI can support current work without over-claiming capability.",
    "Prompting and workflow patterns that feel realistic for day-to-day use.",
    "Governance, review, and confidence-building built into the discussion.",
  ],
  activities: [
    "Facilitated discussion using examples drawn from the source material.",
    "Walkthrough of likely use cases, decisions, and friction points.",
    "Prompting and workflow exercises connected to current business tasks.",
    "Discussion of next steps, risks, and practical rollout sequencing.",
  ],
  outputs: [
    `A clearer capability baseline for ${audience}.`,
    "Practical examples the team can keep using after the session.",
    "Shortlist of realistic next-step opportunities from the brief.",
    "Shared language for adoption, governance, and decision-making.",
  ],
  included: [
    "Session design and tailoring before delivery.",
    "Facilitation and working examples during the session.",
    "Practical recommendations connected to the brief.",
    "A clearer path for what to do next after the session.",
  ],
});

const buildAddOnSectionDefaults = (title: string, audience: string) => ({
  overview: [
    `${title} extends the main session into a more applied piece of follow-up work for ${audience}.`,
    "It is designed to turn initial momentum into something more practical, specific, and easier to carry forward.",
  ],
  focus: [
    "Sharper application of the workshop ideas in real work.",
    "More specific support for priority use cases or internal questions.",
    "Clearer guardrails, review steps, and practical examples.",
    "Better handover for internal champions or follow-through owners.",
  ],
  activities: [
    "Applied follow-up discussion tied to live team workflows.",
    "Focused review of prompts, tasks, or examples from the brief.",
    "Walkthrough of controls, edge cases, or implementation decisions.",
    "Capture of next-step actions for the team after the session.",
  ],
  outputs: [
    "More practical follow-through from the initial session.",
    "Examples, prompts, or assets the team can keep using.",
    "Clearer internal alignment on what to test next.",
    "A stronger bridge from broad capability uplift into applied practice.",
  ],
  included: [
    "Preparation aligned to the add-on focus.",
    "Delivery of the follow-up session and working examples.",
    "Documentation or prompt support where relevant.",
    "Recommendations for immediate next steps after delivery.",
  ],
});

const repairOptionSections = (
  option: ProjectDocumentContent["baseOptions"][number],
  defaults: BrochureSectionDefaults
) => {
  const allSectionParagraphs = option.brochureSections.flatMap(
    (section) => section.paragraphs
  );
  const allSectionBullets = option.brochureSections.flatMap((section) => section.bullets);
  const sharedPool = buildCandidatePool(
    [option.subtitle, option.description],
    option.highlights,
    allSectionParagraphs,
    allSectionBullets
  );
  const overviewCandidates = uniqueTextItems([
    ...option.brochureSections
      .filter((section, index) => getSectionType(section.title, index) === "overview")
      .flatMap((section) => section.paragraphs),
    option.description,
    option.subtitle,
    ...defaults.overview,
  ]);
  const usedKeys = new Set<string>();

  return {
    ...option,
    brochureSections: option.brochureSections.map((section, index) => {
      const sectionType = getSectionType(section.title, index);
      const sectionPool = buildCandidatePool(
        section.paragraphs,
        section.bullets,
        sharedPool
      );

      if (sectionType === "overview") {
        return {
          ...section,
          paragraphs: takeDistinctContent(
            overviewCandidates,
            defaults.overview,
            2,
            usedKeys
          ),
          bullets: [],
        };
      }

      return {
        ...section,
        paragraphs: [],
        bullets: takeDistinctContent(
          sectionPool,
          defaults[sectionType],
          4,
          usedKeys
        ),
      };
    }),
  };
};

const splitSourceIntoSections = (sourceMaterial: string) => {
  const rawLines = sourceMaterial.split("\n");
  const sections: Array<{ title: string; body: string }> = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  rawLines.forEach((line) => {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

    if (headingMatch?.[1]) {
      if (currentTitle || currentLines.some((item) => item.trim())) {
        sections.push({
          title: cleanSourceText(currentTitle),
          body: currentLines.join("\n").trim(),
        });
      }

      currentTitle = headingMatch[1];
      currentLines = [];
      return;
    }

    currentLines.push(line);
  });

  if (currentTitle || currentLines.some((item) => item.trim())) {
    sections.push({
      title: cleanSourceText(currentTitle),
      body: currentLines.join("\n").trim(),
    });
  }

  return sections
    .map((section) => ({
      title: cleanSourceText(section.title),
      body: section.body,
      paragraphs: extractSourceParagraphs(section.body),
      lines: extractSourceLines(section.body),
    }))
    .filter(
      (section) =>
        Boolean(section.title) || section.paragraphs.length > 0 || section.lines.length > 0
    );
};

const isRenderableOption = (option: ProjectDocumentContent["baseOptions"][number]) => {
  const title = emptyString(option.title);
  const isDefaultTitle =
    !title ||
    /^base option(?: \d+)?$/i.test(title) ||
    /^add-on(?: \d+)?$/i.test(title);
  const filledFacts = option.facts.filter((fact) => emptyString(fact.value)).length;
  const hasSectionBody = option.brochureSections.some(
    (section) =>
      section.paragraphs.some((paragraph) => emptyString(paragraph)) ||
      section.bullets.some((bullet) => emptyString(bullet))
  );

  return (
    (!isDefaultTitle || Boolean(emptyString(option.subtitle))) &&
    (Boolean(emptyString(option.description)) ||
      Boolean(emptyString(option.subtitle)) ||
      filledFacts >= 2 ||
      hasSectionBody)
  );
};

const isMeaningfulOption = (option: ProjectDocumentContent["baseOptions"][number]) =>
  Boolean(
    emptyString(option.title) &&
      emptyString(option.title).toLowerCase() !== "base option" &&
      emptyString(option.title).toLowerCase() !== "base option 1"
  ) ||
  Boolean(emptyString(option.subtitle)) ||
  Boolean(emptyString(option.description)) ||
  option.price > 0 ||
  option.facts.some((fact) => emptyString(fact.value)) ||
  option.highlights.some((highlight) => emptyString(highlight)) ||
  option.brochureSections.some(
    (section) =>
      emptyString(section.title) ||
      section.paragraphs.some((paragraph) => emptyString(paragraph)) ||
      section.bullets.some((bullet) => emptyString(bullet))
  );

const hasMeaningfulProjectContent = (content: ProjectDocumentContent) =>
  Boolean(emptyString(content.generatedBrochureMarkdown)) ||
  Boolean(emptyString(content.introText) && content.introText !== createEmptyProjectContent().introText) ||
  Boolean(emptyString(content.notes) && content.notes !== createEmptyProjectContent().notes) ||
  Boolean(emptyString(content.quoteId)) ||
  Boolean(emptyString(content.issuedOn)) ||
  Boolean(content.addOnOptions.length) ||
  Boolean(content.bundleOptions.length) ||
  content.baseOptions.some((option) => isMeaningfulOption(option));

const hasRenderableProjectContent = (content: ProjectDocumentContent) =>
  content.baseOptions.some((option) => isRenderableOption(option));

const meetsGeneratedDraftThreshold = (content: ProjectDocumentContent) =>
  hasRenderableProjectContent(content) &&
  content.addOnOptions.filter((option) => isRenderableOption(option)).length >= 3 &&
  content.bundleOptions.length >= 2;

const normalizeAssistantOptionList = (
  options: unknown
): ProjectDocumentContent["baseOptions"] =>
  Array.isArray(options)
    ? options.map((option) => {
        const optionValue = (option || {}) as AssistantOption;
        const optionFacts = Array.isArray(optionValue.facts) ? optionValue.facts : [];
        const optionSections = Array.isArray(optionValue.brochureSections)
          ? optionValue.brochureSections
          : [];

        return {
          id: emptyString(optionValue.id) || crypto.randomUUID(),
          title: emptyString(optionValue.title),
          subtitle: emptyString(optionValue.subtitle),
          description: emptyString(optionValue.description),
          price: parseDraftPrice(optionValue.price),
          facts: optionFacts
            .map((fact) => ({
              label: emptyString(fact?.label),
              value: emptyString(fact?.value),
            }))
            .filter((fact) => fact.label || fact.value),
          highlights: normalizeList(optionValue.highlights, 6),
          brochureSections: optionSections.map((section) => {
            const sectionValue = (section || {}) as NonNullable<
              AssistantOption["brochureSections"]
            >[number];

            return {
              id: emptyString(sectionValue.id) || crypto.randomUUID(),
              title: emptyString(sectionValue.title),
              column: sectionValue.column === "right" ? "right" : "left",
              paragraphs: normalizeList(sectionValue.paragraphs, 4),
              bullets: normalizeList(sectionValue.bullets, 6),
            };
          }),
        };
      })
    : [];

const normalizeAssistantBundleOptions = (bundleOptions: unknown) =>
  Array.isArray(bundleOptions)
    ? bundleOptions.map((bundleOption) => ({
        id:
          emptyString((bundleOption as AssistantBundleOption).id) ||
          crypto.randomUUID(),
        title: emptyString((bundleOption as AssistantBundleOption).title),
        description: emptyString((bundleOption as AssistantBundleOption).description),
        baseIds: normalizeList((bundleOption as AssistantBundleOption).baseIds, 12),
        addOnIds: normalizeList((bundleOption as AssistantBundleOption).addOnIds, 12),
        price: parseDraftPrice((bundleOption as AssistantBundleOption).price),
      }))
    : [];

const finalizeDraftResult = (
  document: StudioDocument & { kind: "project"; content: ProjectDocumentContent },
  title: string,
  content: ProjectDocumentContent
): GenerateStudioProjectDraftResult => {
  const normalizedContent = normalizeProjectContent(content);
  const lastGeneratedAt =
    emptyString(normalizedContent.lastGeneratedAt) || new Date().toISOString();
  const draftDocument = {
    ...document,
    title,
    content: {
      ...normalizedContent,
      lastGeneratedAt,
    },
  } as StudioDocument & { kind: "project"; content: ProjectDocumentContent };
  const generatedBrochureMarkdown =
    emptyString(normalizedContent.generatedBrochureMarkdown) ||
    serializeProjectDocumentToBrochureMarkdown(draftDocument);

  return {
    title,
    content: normalizeProjectContent({
      ...draftDocument.content,
      generatedBrochureMarkdown,
      lastGeneratedAt,
    }),
  };
};

const buildFallbackDraft = (
  input: GenerateStudioProjectDraftRequest
): GenerateStudioProjectDraftResult => {
  const { currentDocument, clientCompany, clientName, timeline, budgetRange } = input;
  const sourceMaterial = emptyString(input.sourceMaterial);
  const paragraphs = extractSourceParagraphs(sourceMaterial);
  const lines = extractSourceLines(sourceMaterial);
  const sentences = extractSourceSentences(sourceMaterial);
  const sections = splitSourceIntoSections(sourceMaterial);
  const firstParagraph = paragraphs[0] || sentences[0] || sourceMaterial.trim();
  const additionalParagraph = paragraphs[1] || sentences[1] || "";
  const highlightLines = lines.slice(0, 8);
  const price = extractFirstPrice(sourceMaterial, budgetRange) || 2400;
  const currentContent = currentDocument.content;
  const preserveCurrent =
    hasMeaningfulProjectContent(currentContent) &&
    hasRenderableProjectContent(currentContent);
  const fallbackTitle = deriveFallbackTitle(
    sourceMaterial,
    currentDocument.title,
    clientCompany,
    clientName
  );
  const baseDuration = inferDuration(sourceMaterial, timeline, "90 minutes");
  const baseDelivery = inferDelivery(sourceMaterial, "Hybrid");
  const baseAudience = inferAudience(sourceMaterial, clientCompany, clientName);
  const baseSection = sections.find(
    (section) =>
      !/add-on|addon|follow-up|workflow clinic|governance|resource pack|support/i.test(
        section.title
      )
  );
  const baseParagraphs =
    baseSection?.paragraphs.length ? baseSection.paragraphs : paragraphs;
  const baseLines = baseSection?.lines.length ? baseSection.lines : lines;
  const baseOverviewParagraphs = baseParagraphs.length
    ? baseParagraphs.slice(0, 2)
    : firstParagraph
      ? [firstParagraph]
      : [];
  const baseDefaults = buildBaseSectionDefaults(fallbackTitle, baseAudience);
  const addOnSections = sections.filter((section) =>
    /add-on|addon|follow-up|workflow clinic|governance|resource pack|support|demo|clinic/i.test(
      section.title
    )
  );
  const addOnBlueprints = [
    {
      title: "Workflow Clinic",
      duration: inferDuration(sourceMaterial, "", "90 minutes"),
      delivery: "Hybrid",
      timing: inferSuggestedTiming(sourceMaterial, "2-3 weeks after the base session"),
      description:
        "Applied follow-up session focused on translating the workshop into live team workflows, practical prompting, and immediate next-step actions.",
    },
    {
      title: "Governance Review",
      duration: inferDuration(sourceMaterial, "", "60 minutes"),
      delivery: "Virtual",
      timing: inferSuggestedTiming(sourceMaterial, "1-2 weeks after the base session"),
      description:
        "Follow-up governance session to pressure-test safe use, controls, and human-review points before wider rollout.",
    },
    {
      title: "Prompt Pack and Demo Support",
      duration: inferDuration(sourceMaterial, "", "60 minutes"),
      delivery: "Hybrid",
      timing: inferSuggestedTiming(sourceMaterial, "Within 1 week of the base session"),
      description:
        "Post-session support pack with practical prompt examples, demo material, and a clearer handover for internal champions.",
    },
  ];
  const fallbackAddOns = addOnBlueprints.map((blueprint, index) => {
    const sourceSection = addOnSections[index];
    const sourceParagraphs = sourceSection?.paragraphs || paragraphs.slice(index + 1);
    const sourceOverviewParagraphs = sourceParagraphs.length
      ? sourceParagraphs.slice(0, 2)
      : [blueprint.description];
    const addOnPrice =
      extractFirstPrice(sourceSection?.body || "", "") ||
      Math.max(600, Math.round(price * (0.28 + index * 0.07)));

    return repairOptionSections({
      id: currentContent.addOnOptions[index]?.id || crypto.randomUUID(),
      title: sourceSection?.title || blueprint.title,
      subtitle: sourceParagraphs[0] || blueprint.description,
      description:
        sourceParagraphs.slice(0, 2).join(" ") || blueprint.description,
      price: addOnPrice,
      facts: [
        { label: "Duration", value: blueprint.duration },
        {
          label: "Delivery",
          value: inferDelivery(sourceSection?.body || "", blueprint.delivery),
        },
        {
          label: "Suggested timing",
          value: inferSuggestedTiming(sourceSection?.body || "", blueprint.timing),
        },
      ],
      highlights: buildCandidatePool(sourceSection?.lines || [], highlightLines).slice(0, 3),
      brochureSections: [
        {
          id: crypto.randomUUID(),
          title: "Overview",
          column: "left" as const,
          paragraphs: sourceOverviewParagraphs,
          bullets: [],
        },
        {
          id: crypto.randomUUID(),
          title: "Focus Areas",
          column: "right" as const,
          paragraphs: [],
          bullets: buildCandidatePool(sourceSection?.lines || [], highlightLines).slice(0, 4),
        },
        {
          id: crypto.randomUUID(),
          title: "Typical Activities",
          column: "left" as const,
          paragraphs: [],
          bullets: buildCandidatePool(sourceSection?.lines || [], highlightLines).slice(1, 5),
        },
        {
          id: crypto.randomUUID(),
          title: "Outputs",
          column: "right" as const,
          paragraphs: [],
          bullets: buildCandidatePool(sourceSection?.lines || [], highlightLines).slice(2, 6),
        },
        {
          id: crypto.randomUUID(),
          title: "Included",
          column: "right" as const,
          paragraphs: [],
          bullets: buildCandidatePool(sourceSection?.lines || [], highlightLines).slice(3, 7),
        },
      ],
    }, buildAddOnSectionDefaults(sourceSection?.title || blueprint.title, baseAudience));
  });
  const baseOptionId = currentContent.baseOptions[0]?.id || crypto.randomUUID();
  const fallbackBundleOptions = [
    {
      id: currentContent.bundleOptions[0]?.id || crypto.randomUUID(),
      title: `${fallbackTitle} + ${fallbackAddOns[0]?.title || "Workflow Clinic"}`,
      description: "Base session plus one focused follow-up session.",
      baseIds: [baseOptionId],
      addOnIds: fallbackAddOns[0] ? [fallbackAddOns[0].id] : [],
      price: Math.round(
        price +
          (fallbackAddOns[0]?.price || 0) * 0.9
      ),
    },
    {
      id: currentContent.bundleOptions[1]?.id || crypto.randomUUID(),
      title: `${fallbackTitle} Follow-Through Bundle`,
      description: "Base session plus the strongest follow-up supports.",
      baseIds: [baseOptionId],
      addOnIds: fallbackAddOns.slice(0, 2).map((option) => option.id),
      price: Math.round(
        price +
          fallbackAddOns
            .slice(0, 2)
            .reduce((total, option) => total + option.price, 0) *
            0.88
      ),
    },
    {
      id: currentContent.bundleOptions[2]?.id || crypto.randomUUID(),
      title: `${fallbackTitle} Full Capability Pack`,
      description: "Base session with all add-on support included.",
      baseIds: [baseOptionId],
      addOnIds: fallbackAddOns.map((option) => option.id),
      price: Math.round(
        price +
          fallbackAddOns.reduce((total, option) => total + option.price, 0) * 0.85
      ),
    },
  ];

  const content = normalizeProjectContent({
    ...currentContent,
    introText:
      currentContent.introText !== createEmptyProjectContent().introText &&
      emptyString(currentContent.introText)
        ? currentContent.introText
        : firstParagraph || createEmptyProjectContent().introText,
    notes:
      currentContent.notes !== createEmptyProjectContent().notes &&
      emptyString(currentContent.notes)
        ? currentContent.notes
        : additionalParagraph || createEmptyProjectContent().notes,
    terms: currentContent.terms || createEmptyProjectContent().terms,
    acceptanceLine:
      currentContent.acceptanceLine || createEmptyProjectContent().acceptanceLine,
    issuedOn: currentContent.issuedOn || formatDateInput(new Date().toISOString()),
    supportingDocsText:
      emptyString(input.supportingDocsText) || currentContent.supportingDocsText,
    referenceBrochureMarkdown:
      emptyString(input.referenceBrochureMarkdown) ||
      currentContent.referenceBrochureMarkdown,
    referenceSource: emptyString(input.referenceBrochureMarkdown)
      ? "override"
      : currentContent.referenceSource || "fallback",
    recommendedTimeline: currentContent.recommendedTimeline,
    baseOptions: preserveCurrent
      ? currentContent.baseOptions.map((option) =>
          repairOptionSections(
            option,
            buildBaseSectionDefaults(option.title || fallbackTitle, baseAudience)
          )
        )
      : [
          repairOptionSections({
            id: baseOptionId,
            title: fallbackTitle,
            subtitle:
              baseParagraphs[0] ||
              firstParagraph ||
              "Capability uplift workshop",
            description:
              [baseParagraphs[0], baseParagraphs[1] || additionalParagraph]
                .filter(Boolean)
                .join(" ") ||
              currentContent.introText,
            price,
            facts: [
              { label: "Duration", value: baseDuration },
              { label: "Delivery", value: baseDelivery },
              { label: "Best for", value: baseAudience },
            ],
            highlights:
              highlightLines.length > 0
                ? highlightLines.slice(0, 3)
                : [
                    "Capability uplift aligned to the source material.",
                    "Client-ready draft created from the brief.",
                    "Ready for further desktop editing in the brochure workspace.",
                  ],
            brochureSections: [
              {
                id: crypto.randomUUID(),
                title: "Overview",
                column: "left",
                paragraphs: baseOverviewParagraphs,
                bullets: [],
              },
              {
                id: crypto.randomUUID(),
                title: "Focus Areas",
                column: "right",
                paragraphs: [],
                bullets: buildCandidatePool(baseLines, highlightLines).slice(0, 4),
              },
              {
                id: crypto.randomUUID(),
                title: "Typical Activities",
                column: "left",
                paragraphs: [],
                bullets: buildCandidatePool(baseLines, highlightLines).slice(1, 5),
              },
              {
                id: crypto.randomUUID(),
                title: "Outputs",
                column: "right",
                paragraphs: [],
                bullets: buildCandidatePool(baseLines, highlightLines).slice(2, 6),
              },
              {
                id: crypto.randomUUID(),
                title: "Included",
                column: "right",
                paragraphs: [],
                bullets: buildCandidatePool(baseLines, highlightLines).slice(3, 7),
              },
            ],
          }, baseDefaults),
        ],
    addOnOptions: preserveCurrent
      ? currentContent.addOnOptions.map((option) =>
          repairOptionSections(
            option,
            buildAddOnSectionDefaults(option.title || "Add-On", baseAudience)
          )
        )
      : fallbackAddOns,
    bundleOptions: preserveCurrent ? currentContent.bundleOptions : fallbackBundleOptions,
    defaultSelectedBaseIds: preserveCurrent
      ? currentContent.defaultSelectedBaseIds
      : [baseOptionId],
    defaultSelectedAddOnIds: preserveCurrent ? currentContent.defaultSelectedAddOnIds : [],
  });

  return finalizeDraftResult(input.currentDocument, fallbackTitle, content);
};

const toDraftResult = (
  input:
    | GenerateStudioProjectDraftRequest
    | SyncStudioProjectFromBrochureInput,
  payload: AssistantResponse
): GenerateStudioProjectDraftResult => {
  const defaultContent = createEmptyProjectContent();
  const currentContent = input.currentDocument.content;
  const audience =
    input.clientCompany || input.clientName || input.currentDocument.clientCompany || "Client team";
  const baseOptions = normalizeAssistantOptionList(payload.baseOptions).map((option) =>
    repairOptionSections(
      option,
      buildBaseSectionDefaults(option.title || input.currentDocument.title || DEFAULT_PROJECT_TITLE, audience)
    )
  );
  const addOnOptions = normalizeAssistantOptionList(payload.addOnOptions).map((option) =>
    repairOptionSections(
      option,
      buildAddOnSectionDefaults(option.title || "Add-On", audience)
    )
  );
  const bundleOptions = normalizeAssistantBundleOptions(payload.bundleOptions);
  const defaultSelectedBaseIds = normalizeList(payload.defaultSelectedBaseIds, 12);
  const defaultSelectedAddOnIds = normalizeList(payload.defaultSelectedAddOnIds, 12);

  const content = normalizeProjectContent({
    ...currentContent,
    quoteId: emptyString(payload.quoteId) || currentContent.quoteId,
    issuedOn:
      emptyString(payload.issuedOn) ||
      currentContent.issuedOn ||
      formatDateInput(new Date().toISOString()),
    validUntil: emptyString(payload.validUntil) || currentContent.validUntil,
    introText:
      emptyString(payload.introText) ||
      currentContent.introText ||
      defaultContent.introText,
    notes: emptyString(payload.notes) || currentContent.notes || defaultContent.notes,
    terms: emptyString(payload.terms) || currentContent.terms || defaultContent.terms,
    acceptanceLine:
      emptyString(payload.acceptanceLine) ||
      currentContent.acceptanceLine ||
      defaultContent.acceptanceLine,
    currency: emptyString(payload.currency) || currentContent.currency,
    gstMode:
      payload.gstMode === "inclusive" ||
      payload.gstMode === "none" ||
      payload.gstMode === "exclusive"
        ? payload.gstMode
        : currentContent.gstMode,
    supportingDocsText:
      emptyString(payload.supportingDocsText) ||
      emptyString(input.supportingDocsText) ||
      currentContent.supportingDocsText,
    referenceBrochureMarkdown:
      emptyString(payload.referenceBrochureMarkdown) ||
      emptyString(input.referenceBrochureMarkdown) ||
      currentContent.referenceBrochureMarkdown,
    generatedBrochureMarkdown:
      emptyString(payload.generatedBrochureMarkdown) ||
      currentContent.generatedBrochureMarkdown,
    lastGeneratedAt:
      emptyString(payload.lastGeneratedAt) || currentContent.lastGeneratedAt,
    referenceSource:
      payload.referenceSource === "override" ||
      emptyString(payload.referenceBrochureMarkdown) ||
      emptyString(input.referenceBrochureMarkdown)
        ? "override"
        : "fallback",
    recommendedTimeline: currentContent.recommendedTimeline,
    defaultSelectedBaseIds:
      defaultSelectedBaseIds.length > 0
        ? defaultSelectedBaseIds
        : currentContent.defaultSelectedBaseIds,
    defaultSelectedAddOnIds:
      defaultSelectedAddOnIds.length > 0
        ? defaultSelectedAddOnIds
        : currentContent.defaultSelectedAddOnIds,
    baseOptions: baseOptions.length ? baseOptions : currentContent.baseOptions,
    addOnOptions: addOnOptions.length ? addOnOptions : currentContent.addOnOptions,
    bundleOptions: bundleOptions.length ? bundleOptions : currentContent.bundleOptions,
  });

  const title =
    emptyString(payload.title) ||
    input.currentDocument.title ||
    input.clientCompany ||
    input.clientName ||
    "Brochure Quote";

  return finalizeDraftResult(input.currentDocument, title, content);
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              "Studio generation timed out while waiting for the assistant."
            )
          );
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const invokeStudioProjectAssistant = async (body: Record<string, unknown>) => {
  const { data, error } = await withTimeout(
    supabase.functions.invoke("studio-draft-assistant", {
      body,
    }),
    STUDIO_PROJECT_ASSISTANT_TIMEOUT_MS
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data || typeof data !== "object") {
    throw new Error("No project draft was returned.");
  }

  return data as AssistantResponse;
};

export const generateStudioProjectDraft = async (
  input: GenerateStudioProjectDraftRequest
): Promise<GenerateStudioProjectDraftResult> => {
  const sourceMaterial = emptyString(input.sourceMaterial);
  if (!sourceMaterial) {
    throw new Error("Paste or upload source material first.");
  }

  try {
    const data = await invokeStudioProjectAssistant({
      mode: "generate",
      clientName: emptyString(input.clientName),
      clientCompany: emptyString(input.clientCompany),
      clientEmail: emptyString(input.clientEmail),
      timeline: emptyString(input.timeline),
      budgetRange: emptyString(input.budgetRange),
      sourceMaterial,
      supportingDocsText: emptyString(input.supportingDocsText),
      referenceBrochureMarkdown: emptyString(input.referenceBrochureMarkdown),
      currentTitle: emptyString(input.currentDocument.title),
      currentLogoUrl: emptyString(input.currentDocument.content.logoUrl),
      currentQuoteId: emptyString(input.currentDocument.content.quoteId),
      currentLastGeneratedAt: emptyString(input.currentDocument.content.lastGeneratedAt),
    });
    const draftResult = toDraftResult(input, data);

    if (meetsGeneratedDraftThreshold(draftResult.content)) {
      return draftResult;
    }

    return buildFallbackDraft({
      ...input,
      sourceMaterial: emptyString(data.generatedBrochureMarkdown) || sourceMaterial,
    });
  } catch {
    return buildFallbackDraft(input);
  }
};

export const syncStudioProjectFromBrochure = async (
  input: SyncStudioProjectFromBrochureInput
): Promise<GenerateStudioProjectDraftResult> => {
  const generatedBrochureMarkdown = emptyString(input.generatedBrochureMarkdown);

  if (!generatedBrochureMarkdown) {
    throw new Error("Generate a brochure first.");
  }

  const data = await invokeStudioProjectAssistant({
    mode: "extract",
    clientName: emptyString(input.clientName),
    clientCompany: emptyString(input.clientCompany),
    clientEmail: emptyString(input.clientEmail),
    timeline: emptyString(input.timeline),
    budgetRange: emptyString(input.budgetRange),
    supportingDocsText: emptyString(input.supportingDocsText),
    referenceBrochureMarkdown: emptyString(input.referenceBrochureMarkdown),
    generatedBrochureMarkdown,
    currentTitle: emptyString(input.currentDocument.title),
    currentLogoUrl: emptyString(input.currentDocument.content.logoUrl),
    currentQuoteId: emptyString(input.currentDocument.content.quoteId),
    currentLastGeneratedAt: emptyString(input.currentDocument.content.lastGeneratedAt),
  });

  return toDraftResult(input, data);
};
