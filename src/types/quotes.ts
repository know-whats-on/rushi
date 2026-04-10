export type QuoteStatus = "draft" | "published" | "archived";
export type QuoteGstMode = "none" | "exclusive" | "inclusive";

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  displayOrder: number;
}

export interface Quote {
  id?: string;
  engagementId?: string | null;
  quoteCode: string;
  quoteId: string;
  status: QuoteStatus;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  introText: string;
  issuedOn: string;
  currency: string;
  gstMode: QuoteGstMode;
  subtotal: number;
  gstAmount: number;
  total: number;
  validUntil: string;
  notes: string;
  terms: string;
  acceptanceLine: string;
  ctaLabel: string;
  adminEmail: string;
  createdAt?: string;
  updatedAt?: string;
  items: QuoteItem[];
}

export interface QuoteListItem {
  id: string;
  engagementId?: string | null;
  quoteCode: string;
  status: QuoteStatus;
  title: string;
  clientCompany: string;
  updatedAt?: string;
}
