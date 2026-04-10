import { rheemSampleProposal } from "./documentSamples";
import type {
  DocumentLibraryMeta,
  ProjectDocumentContent,
  ProjectOption,
  ProjectRecommendedTimeline,
  StudioDocument,
  StudioLibraryCard,
} from "../types/documents";

export const RHEEM_PROJECT_CODE = "RHEEM22APR";
export const RHEEM_PROJECT_CARD_LOGO_URL = "/images/logos/rheem.png";
export const RHEEM_PROJECT_PDF_LOGO_URL = "/images/logos/rheem.svg";
export const RHEEM_PROJECT_CATEGORY = "AI Capability Development";
export const RHEEM_PROJECT_STATUS_LABEL = "Code required";

export interface RheemMarketBenchmarkEntry {
  id: string;
  label: string;
  price: number;
  detail: string;
  mobileDetail: string;
  comparisonUnits: number;
  href?: string;
  isUs?: boolean;
}

export const RHEEM_MARKET_BENCHMARK_ENTRIES: RheemMarketBenchmarkEntry[] = [
  {
    id: "us",
    label: "Our Price",
    price: 20000,
    detail: "5 sessions",
    mobileDetail: "5 sessions",
    comparisonUnits: 5,
    isUs: true,
  },
  {
    id: "nexacu",
    label: "Nexacu",
    price: 12250,
    detail: "1 session",
    mobileDetail: "1 session",
    comparisonUnits: 1,
    href: "https://nexacu.com.au/microsoft-copilot-courses/",
  },
  {
    id: "antelope-media",
    label: "Antelope Media",
    price: 14916,
    detail: "1 session",
    mobileDetail: "1 session",
    comparisonUnits: 1,
    href: "https://www.antelopemedia.com.au/ai-writing-workshops/",
  },
  {
    id: "lumify-work",
    label: "Lumify Work",
    price: 23375,
    detail: "1 session",
    mobileDetail: "1 session",
    comparisonUnits: 1,
    href: "https://www.lumifywork.com/en-au/courses/copilot-studio-in-a-day/",
  },
  {
    id: "aim",
    label: "Australian Institute of Management",
    price: 27000,
    detail: "1 session",
    mobileDetail: "1 session",
    comparisonUnits: 1,
    href: "https://www.aim.com.au/digital-skills/courses/microsoft-365-copilot-essentials",
  },
  {
    id: "dynamic-web-training",
    label: "Dynamic Web Training",
    price: 30937,
    detail: "1 session",
    mobileDetail: "1 session",
    comparisonUnits: 1,
    href: "https://www.dynamicwebtraining.com.au/microsoft-copilot-training-courses",
  },
];

const RHEEM_RECOMMENDED_TIMELINE: ProjectRecommendedTimeline = {
      eyebrow: "Plan overview",
  heading: "Roadmap & Session-wise Agenda",
  intro:
    "A balanced rollout that starts with the April capability uplift session and then moves into the applied hybrid follow-through that usually creates stronger adoption outcomes for the Finance Team.",
  closingNote:
    "The strongest adoption outcomes usually come from pairing the base session with the full hybrid follow-through over 6-8 weeks.",
  phases: [
    {
      id: "rheem-roadmap-phase-1",
      label: "Phase 1",
      timing: "Week of April 13, 2026",
      title: "Pre-Session Scoping",
      summary:
        "Confirm the participant context, business priorities, and workshop examples so the program lands in the real Finance Team environment rather than staying generic.",
      deliverables: [
        "Sponsor discovery and scope alignment call",
        "Tailored finance examples, prompts, and session framing",
      ],
      relatedOptionIds: ["f2f-session"],
      relatedOptionMatch: "any",
    },
    {
      id: "rheem-roadmap-phase-2",
      label: "Phase 1",
      timing: "Wednesday, April 22, 2026",
      title: "Capability Uplifting Day",
      summary:
        "Run the core AI fluency session to build shared language, confidence, and a governance-first Copilot foundation across the team.",
      deliverables: [
        "Live capability uplift session for the Finance Team",
        "Practical prompt framework and immediate next-step shortlist",
      ],
      relatedOptionIds: ["f2f-session"],
      relatedOptionMatch: "any",
      timingVariants: [
        {
          optionIds: ["remote-session"],
          optionMatch: "all",
          timing: "Wednesday, April 29, 2026",
        },
      ],
    },
    {
      id: "rheem-roadmap-phase-3",
      label: "Phase 2",
      timing: "Wednesday, May 20, 2026",
      title: "Custom Prompt Library",
      summary:
        "Turn the first workshop into a reusable prompt asset by shaping practical Finance Team prompts into a tailored library the team can keep using.",
      deliverables: [
        "Applied session to shape Rheem-relevant prompt templates",
        "Tailored Custom Prompt Library for recurring Finance Team workflows",
      ],
      relatedOptionIds: ["addon-1"],
      relatedOptionMatch: "all",
    },
    {
      id: "rheem-roadmap-phase-4",
      label: "Phase 3",
      timing: "Wednesday, June 3, 2026",
      title: "Custom Agents Workshop",
      summary:
        "Explore where custom Copilot agents can support Finance Team work and run a practical workshop on how to design and build them with clear guardrails.",
      deliverables: [
        "Guided custom-agents workshop for Finance Team use cases",
        "Starter agent concepts, governance checkpoints, and next-step build path",
      ],
      relatedOptionIds: ["addon-2"],
      relatedOptionMatch: "all",
    },
    {
      id: "rheem-roadmap-phase-5",
      label: "Phase 4",
      timing: "Wednesday, June 17, 2026",
      title: "Sustainability Reporting Extension",
      summary:
        "Extend the program into a higher-value reporting workflow where Copilot can support narrative drafting, comparison, and evidence-chasing in a more structured way.",
      deliverables: [
        "Sustainability reporting prompt directory",
        "Next-step adoption path for reporting-related workflows",
      ],
      relatedOptionIds: ["addon-3"],
      relatedOptionMatch: "all",
    },
  ],
};

const RHEEM_PROJECT_ALIAS_CODES = new Set([
  RHEEM_PROJECT_CODE,
  "RHEEMAI",
  "RHEEM",
]);

export const isRheemProjectAliasCode = (code: string) =>
  RHEEM_PROJECT_ALIAS_CODES.has(code.trim().toUpperCase());

export const isRheemProjectPublicCode = (code: string) =>
  code.trim().toUpperCase() === RHEEM_PROJECT_CODE;

export const createRheemProjectLibraryMeta = (): DocumentLibraryMeta => ({
  isListed: true,
  cardCompany: rheemSampleProposal.clientCompany,
  cardTitle: rheemSampleProposal.title,
  cardCategory: RHEEM_PROJECT_CATEGORY,
  cardStatusLabel: RHEEM_PROJECT_STATUS_LABEL,
  cardSummary: rheemSampleProposal.introText,
  cardLogoUrl: RHEEM_PROJECT_CARD_LOGO_URL,
});

export const createRheemProjectLibraryCard = (
  values?: Partial<StudioLibraryCard>
): StudioLibraryCard => ({
  id: values?.id || "fallback-rheem",
  engagementId: values?.engagementId ?? null,
  code: RHEEM_PROJECT_CODE,
  kind: "project",
  documentStatus: "published",
  updatedAt: values?.updatedAt,
  ...createRheemProjectLibraryMeta(),
});

const mapProjectOption = (option: typeof rheemSampleProposal.baseOptions[number]): ProjectOption => ({
  id: option.id,
  title: option.title,
  subtitle: option.subtitle,
  description: option.description,
  imageUrl: option.imageUrl,
  price: option.price,
  compareAtPrice: option.compareAtPrice,
  facts: option.facts,
  highlights: option.highlights,
  brochureSections:
    option.brochure?.sections.map((section) => ({
      id: `${option.id}-${section.title}`,
      title: section.title,
      column: section.column,
      paragraphs: section.paragraphs || [],
      bullets: section.bullets || [],
    })) || [],
  agenda: option.agenda,
});

export const createRheemProjectContent = (): ProjectDocumentContent => ({
  mode: "project",
  projectVariant: "proposal",
  quoteId: rheemSampleProposal.quoteId,
  logoUrl: RHEEM_PROJECT_PDF_LOGO_URL,
  issuedOn: rheemSampleProposal.issuedOn,
  validUntil: rheemSampleProposal.validUntil,
  introText: rheemSampleProposal.introText,
  notes: rheemSampleProposal.notes,
  terms: rheemSampleProposal.terms,
  acceptanceLine: rheemSampleProposal.acceptanceLine,
  currency: rheemSampleProposal.currency,
  gstMode: "exclusive",
  brochureFooterNote: rheemSampleProposal.baseOptions[0]?.brochure?.footerNote || "",
  supportingDocsText: "",
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
  defaultSelectedBaseIds: rheemSampleProposal.defaultSelectedBaseIds,
  defaultSelectedAddOnIds: rheemSampleProposal.defaultSelectedAddOnIds,
  recommendedTimeline: RHEEM_RECOMMENDED_TIMELINE,
  baseOptions: rheemSampleProposal.baseOptions.map(mapProjectOption),
  addOnOptions: rheemSampleProposal.addOnOptions.map(mapProjectOption),
  bundleOptions: rheemSampleProposal.bundleOptions.map((bundleOption) => ({
    id: bundleOption.id,
    title: bundleOption.title,
    description: bundleOption.description,
    imageUrl: bundleOption.imageUrl,
    baseIds: bundleOption.baseIds,
    addOnIds: bundleOption.addOnIds,
    price: bundleOption.price,
  })),
  quoteLineOverrides: [],
  libraryMeta: createRheemProjectLibraryMeta(),
});

export const createRheemProjectDocumentSeed = (): StudioDocument => ({
  kind: "project",
  code: RHEEM_PROJECT_CODE,
  status: "published",
  title: rheemSampleProposal.title,
  clientName: rheemSampleProposal.clientName,
  clientCompany: rheemSampleProposal.clientCompany,
  clientEmail: rheemSampleProposal.clientEmail,
  ctaLabel: "Accept via email",
  adminEmail: rheemSampleProposal.recipientEmail,
  content: createRheemProjectContent(),
});
