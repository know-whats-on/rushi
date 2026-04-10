import { createRheemProjectLibraryCard } from "./rheemProject";
import { createTechnetProjectLibraryCard } from "./technetProject";
import { createUnswCyberSecuritySummitProjectLibraryCard } from "./unswCyberSecuritySummitProject";
import { createUnswAssessmentProjectLibraryCard } from "./unswAssessmentProject";
import { createInfs5700KeynoteProjectLibraryCard } from "./infs5700KeynoteProject";
import type { StudioLibraryCard } from "../types/documents";

export const studioLibraryFallbackCards: StudioLibraryCard[] = [
  createInfs5700KeynoteProjectLibraryCard({
    id: "fallback-infs5700-keynote",
    engagementId: null,
  }),
  createUnswCyberSecuritySummitProjectLibraryCard({
    id: "fallback-2026-cyber-security-summit",
    engagementId: null,
  }),
  createUnswAssessmentProjectLibraryCard({
    id: "fallback-unsw-assessment",
    engagementId: null,
  }),
  {
    id: "fallback-city-of-sydney",
    engagementId: null,
    kind: "brochure",
    documentStatus: "published",
    cardCompany: "City of Sydney",
    cardTitle: "AI-assisted Content Creation for Small Businesses",
    cardCategory: "Market & Product Strategy",
    cardStatusLabel: "Code required",
    cardSummary:
      "Helping Sydney-based small business owners with free, AI-assisted marketing sessions.",
    cardLogoUrl: "/images/logos/city-of-sydney.png",
  },
  {
    id: "fallback-lung-foundation-australia",
    engagementId: null,
    kind: "brochure",
    documentStatus: "published",
    cardCompany: "Lung Foundation Australia",
    cardTitle: "Helping 630,000+ Australians Breathe Better",
    cardCategory: "AI Capability Development",
    cardStatusLabel: "Code required",
    cardSummary:
      "Building Australia's first breathlessness recovery app and AI assistant.",
    cardLogoUrl: "/images/studio/lfa-logo.png",
  },
  createRheemProjectLibraryCard({
    id: "fallback-rheem",
    engagementId: null,
  }),
  createTechnetProjectLibraryCard({
    id: "fallback-technet-australia-2026",
    engagementId: null,
  }),
  {
    id: "fallback-university-of-sydney",
    engagementId: null,
    kind: "brochure",
    documentStatus: "published",
    cardCompany: "The University of Sydney",
    cardTitle: "AI Capability Development",
    cardCategory: "AI Capability Development",
    cardStatusLabel: "Code required",
    cardSummary:
      "Generic AI upskilling for leadership and management teams.",
    cardLogoUrl: "/images/logos/usyd.png",
  },
  {
    id: "fallback-unsw-founders",
    engagementId: null,
    kind: "brochure",
    documentStatus: "published",
    cardCompany: "UNSW Founders",
    cardTitle: "Showcasing UNSW’s Portfolio Companies",
    cardCategory: "Market & Product Strategy",
    cardStatusLabel: "Code required",
    cardSummary:
      "Supporting the UNSW 10x accelerator with flagship conference AI and engagement technology.",
    cardLogoUrl: "/images/logos/unsw-founders.png",
  },
];
