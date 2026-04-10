export type EngagementStatus =
  | "new"
  | "drafting"
  | "shared"
  | "won"
  | "archived";

export interface StudioRequestPricing {
  currency: string;
  subtotal: number;
  gstAmount: number;
  total: number;
}

export interface StudioRequest {
  selectedBaseIds: string[];
  selectedBaseTitles: string[];
  selectedAddOnIds: string[];
  selectedAddOnTitles: string[];
  audience: string;
  desiredOutcome: string;
  toneAndBrandNotes: string;
  logoUrl: string;
  referenceLinks: string[];
  pricing: StudioRequestPricing | null;
}

export interface LeadFormInput {
  contactName: string;
  organisation: string;
  email: string;
  serviceType: string;
  timeline: string;
  budgetRange: string;
  brief: string;
  website?: string;
}

export interface StudioLeadFormInput {
  name: string;
  company: string;
  companyWebsite: string;
  contactEmail: string;
  phone: string;
  service: string;
  timeline: string;
  budgetRange: string;
  brief: string;
}

export interface Engagement {
  id?: string;
  status: EngagementStatus;
  source: string;
  contactName: string;
  organisation: string;
  email: string;
  serviceType: string;
  timeline: string;
  budgetRange: string;
  brief: string;
  notes: string;
  requestPayload?: StudioRequest | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EngagementListItem extends Engagement {
  documentId?: string | null;
  documentKind?: "brochure" | "quote" | "project" | null;
  documentCode?: string | null;
  documentStatus?: "draft" | "published" | "archived" | null;
  documentTitle?: string | null;
  isListed?: boolean | null;
  cardCompany?: string | null;
  cardTitle?: string | null;
}
