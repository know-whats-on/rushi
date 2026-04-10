export type BrochureStatus = "draft" | "published" | "archived";

export type BrochureSectionId =
  | "deliveryMode"
  | "learningOutcomes"
  | "timeCommitment"
  | "pathway"
  | "assessment";

export interface BrochureCta {
  id: string;
  label: string;
  url: string;
}

export interface BrochureSection {
  id: BrochureSectionId;
  title: string;
  sourceClause: string;
  body: string;
  bullets: string[];
}

export interface Brochure {
  id?: string;
  engagementId?: string | null;
  brochureCode: string;
  status: BrochureStatus;
  clientName: string;
  logoUrl: string;
  title: string;
  subtitle: string;
  duration: string;
  deliveryMode: string;
  studyLoad: string;
  priceLabel: string;
  ctas: BrochureCta[];
  sections: BrochureSection[];
  footerComplianceText: string;
  adminEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrochureListItem {
  id: string;
  engagementId?: string | null;
  brochureCode: string;
  status: BrochureStatus;
  title: string;
  clientName: string;
  updatedAt?: string;
}

export const BROCHURE_SECTION_ORDER: Array<{
  id: BrochureSectionId;
  title: string;
  column: "left" | "right";
}> = [
  {
    id: "deliveryMode",
    title: "Delivery Mode",
    column: "left",
  },
  {
    id: "learningOutcomes",
    title: "Learning Outcomes",
    column: "right",
  },
  {
    id: "timeCommitment",
    title: "Time Commitment",
    column: "right",
  },
  {
    id: "pathway",
    title: "Pathway",
    column: "left",
  },
  {
    id: "assessment",
    title: "Assessment",
    column: "right",
  },
];
