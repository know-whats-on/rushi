import type { BrochureCta, BrochureSection } from "./brochures";
import type { QuoteGstMode, QuoteItem } from "./quotes";

export type DocumentKind = "brochure" | "quote" | "project";
export type DocumentStatus = "draft" | "published" | "archived";

export interface DocumentLibraryMeta {
  isListed: boolean;
  cardCompany: string;
  cardTitle: string;
  cardCategory: string;
  cardStatusLabel: string;
  cardSummary: string;
  cardLogoUrl: string;
}

export interface ProjectOptionFact {
  label: string;
  value: string;
}

export interface ProjectRecommendedTimelinePhase {
  id: string;
  label: string;
  timing: string;
  title: string;
  summary: string;
  deliverables: string[];
  relatedOptionIds: string[];
  relatedOptionMatch: "any" | "all";
  timingVariants?: ProjectRecommendedTimelinePhaseTimingVariant[];
}

export interface ProjectRecommendedTimelinePhaseTimingVariant {
  optionIds: string[];
  optionMatch: "any" | "all";
  timing: string;
}

export interface ProjectRecommendedTimeline {
  eyebrow: string;
  heading: string;
  intro: string;
  closingNote: string;
  phases: ProjectRecommendedTimelinePhase[];
}

export type ProjectReferenceSource = "fallback" | "override";

export interface ProjectBrochureSection {
  id: string;
  title: string;
  column: "left" | "right";
  paragraphs: string[];
  bullets: string[];
}

export type ProjectVariant = "proposal" | "presentation";

export interface ProjectPresentationSlideSection {
  id: string;
  heading: string;
  bullets: string[];
}

export interface ProjectPresentationCallout {
  value: string;
  label: string;
  note?: string;
}

export interface ProjectPresentationVisualItem {
  label: string;
  value?: string;
  note?: string;
  detail?: string;
  group?: string;
  metric?: number;
  speakerNotes?: string[];
}

export interface ProjectPresentationVisual {
  variant: string;
  items: ProjectPresentationVisualItem[];
}

export interface ProjectPresentationCountdown {
  targetAt: string;
  timeZone: string;
  autoAdvance?: boolean;
  showTargetLabel?: boolean;
}

export type ProjectPresentationTheme = "default" | "breathing-hue";

export type ProjectPresentationFooterMode = "none" | "all" | "non-title";

export type ProjectPresentationSlideLayout =
  | "countdown"
  | "title"
  | "intro"
  | "question"
  | "overview"
  | "evidence"
  | "capabilities"
  | "bullets"
  | "split-2"
  | "split-3"
  | "closing"
  | "statement"
  | "qr";

export interface ProjectPresentationBranding {
  speakerName: string;
  website: string;
  tagline: string;
  footerMode: ProjectPresentationFooterMode;
}

export interface ProjectPresentationSlide {
  id: string;
  layout: ProjectPresentationSlideLayout;
  countdown?: ProjectPresentationCountdown;
  kicker?: string;
  title: string;
  titleLines?: string[];
  subtitle?: string;
  mediaUrl?: string;
  qrValue?: string;
  qrLabel?: string;
  bullets: string[];
  sections: ProjectPresentationSlideSection[];
  caption?: string;
  sourceLabel?: string;
  callouts?: ProjectPresentationCallout[];
  visual?: ProjectPresentationVisual;
  takeaway?: string;
  speakerNotes: string[];
}

export interface ProjectPresentationContent {
  remoteEnabled: boolean;
  publicSessionId?: string;
  theme: ProjectPresentationTheme;
  branding: ProjectPresentationBranding;
  slides: ProjectPresentationSlide[];
}

export interface ProjectOptionAgendaSource {
  label: string;
  url: string;
}

export interface ProjectOptionAgendaBlock {
  id: string;
  timeLabel: string;
  title: string;
  focus?: string;
  bullets: string[];
  examplesLabel?: string;
  examples?: string[];
  outcome?: string;
}

export interface ProjectOptionAgenda {
  heading: string;
  subtitle?: string;
  duration: string;
  deliveryMode: string;
  whyThisMattersNow?: string;
  sources?: ProjectOptionAgendaSource[];
  blocks: ProjectOptionAgendaBlock[];
  includedValueAdd?: string;
  overallOutcomes?: string[];
  contextNote?: string;
}

export interface ProjectOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  price: number;
  compareAtPrice?: number;
  facts: ProjectOptionFact[];
  highlights: string[];
  brochureSections: ProjectBrochureSection[];
  agenda?: ProjectOptionAgenda;
}

export interface ProjectBundleOption {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  baseIds: string[];
  addOnIds: string[];
  price: number;
}

export interface ProjectSupportingDownload {
  id: string;
  label: string;
  url: string;
  metaText?: string;
}

export interface ProjectQuoteLineOverride {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface BrochureDocumentContent {
  logoUrl: string;
  subtitle: string;
  duration: string;
  deliveryMode: string;
  studyLoad: string;
  priceLabel: string;
  ctas: BrochureCta[];
  sections: BrochureSection[];
  footerComplianceText: string;
  libraryMeta: DocumentLibraryMeta;
}

export interface QuoteDocumentContent {
  quoteId: string;
  introText: string;
  issuedOn: string;
  currency: string;
  gstMode: QuoteGstMode;
  validUntil: string;
  notes: string;
  terms: string;
  acceptanceLine: string;
  items: QuoteItem[];
  libraryMeta: DocumentLibraryMeta;
}

export interface ProjectDocumentContent {
  mode: "project";
  projectVariant: ProjectVariant;
  quoteId: string;
  logoUrl: string;
  issuedOn: string;
  validUntil: string;
  introText: string;
  notes: string;
  terms: string;
  acceptanceLine: string;
  currency: string;
  gstMode: QuoteGstMode;
  brochureFooterNote: string;
  supportingDocsText: string;
  supportingDownloads?: ProjectSupportingDownload[];
  referenceBrochureMarkdown: string;
  generatedBrochureMarkdown: string;
  lastGeneratedAt: string;
  referenceSource: ProjectReferenceSource;
  presentation: ProjectPresentationContent;
  defaultSelectedBaseIds: string[];
  defaultSelectedAddOnIds: string[];
  recommendedTimeline?: ProjectRecommendedTimeline;
  baseOptions: ProjectOption[];
  addOnOptions: ProjectOption[];
  bundleOptions: ProjectBundleOption[];
  quoteLineOverrides: ProjectQuoteLineOverride[];
  libraryMeta: DocumentLibraryMeta;
}

export type StudioDocumentContent =
  | BrochureDocumentContent
  | QuoteDocumentContent
  | ProjectDocumentContent;

export interface StudioDocument {
  id?: string;
  engagementId?: string | null;
  kind: DocumentKind;
  code: string;
  status: DocumentStatus;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  ctaLabel: string;
  adminEmail: string;
  createdAt?: string;
  updatedAt?: string;
  content: StudioDocumentContent;
}

export interface StudioLibraryCard {
  id: string;
  engagementId?: string | null;
  code?: string;
  kind: DocumentKind;
  documentStatus: DocumentStatus;
  updatedAt?: string;
  cardCompany: string;
  cardTitle: string;
  cardCategory: string;
  cardStatusLabel: string;
  cardSummary: string;
  cardLogoUrl: string;
}
