import type { StudioLeadFormInput } from "../types/engagements";
import { portfolioContent } from "../data/portfolioContent";

export const studioServiceOptions = [
  "AI Product",
  "AI Capability Development",
  "Market Research",
  "Product Strategy",
] as const;

export const studioBudgetOptions = [
  "Under A$5k",
  "A$5k-A$15k",
  "A$15k-A$30k",
  "A$30k+",
  "Need guidance",
] as const;

const validServiceTitles = new Set<string>(studioServiceOptions);

export const normalizeStudioBriefServiceType = (serviceType = "") => {
  const trimmedValue = serviceType.trim();

  if (!trimmedValue) {
    return "";
  }

  if (validServiceTitles.has(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue === "Market & Product Strategy") {
    return "Product Strategy";
  }

  return "";
};

export const createInitialStudioLeadForm = (
  serviceType = ""
): StudioLeadFormInput => ({
  name: "",
  company: "",
  companyWebsite: "",
  contactEmail: "",
  phone: "",
  service: normalizeStudioBriefServiceType(serviceType),
  timeline: "",
  budgetRange: "",
  brief: "",
});

export const normalizeStudioBriefWebsite = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
};

export const isStudioBriefEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isStudioBriefWebsiteValid = (value: string) => {
  const normalizedValue = normalizeStudioBriefWebsite(value);
  if (!normalizedValue) {
    return false;
  }

  try {
    const parsed = new URL(normalizedValue);
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
};

export const buildStudioBriefSubject = (form: StudioLeadFormInput) =>
  `Studio brief — ${form.company.trim()} — ${form.service.trim()}`;

export const buildStudioBriefBody = (form: StudioLeadFormInput) => {
  const lines = [
    `Name: ${form.name.trim()}`,
    `Company: ${form.company.trim()}`,
    `Company Website: ${normalizeStudioBriefWebsite(form.companyWebsite)}`,
    `Contact Email: ${form.contactEmail.trim()}`,
  ];

  if (form.phone.trim()) {
    lines.push(`Phone: ${form.phone.trim()}`);
  }

  lines.push(
    `Service: ${form.service.trim()}`,
    `Timeline / Delivery Date: ${form.timeline.trim()}`,
    `Budget Range (AUS$): ${form.budgetRange.trim()}`,
    "",
    "Brief:",
    form.brief.trim()
  );

  return lines.join("\n");
};

export const buildStudioBriefMailto = (form: StudioLeadFormInput) =>
  `mailto:${portfolioContent.contact.email}?subject=${encodeURIComponent(
    buildStudioBriefSubject(form)
  )}&body=${encodeURIComponent(buildStudioBriefBody(form))}`;
