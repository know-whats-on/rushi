import { supabase } from "./supabase";
import {
  BROCHURE_SECTION_ORDER,
  Brochure,
  BrochureCta,
  BrochureListItem,
  BrochureSection,
  BrochureSectionId,
} from "../types/brochures";

const emptyString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeBullets = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) => emptyString(item))
        .filter(Boolean)
        .slice(0, 6)
    : [];

export const createEmptyBrochureCta = (): BrochureCta => ({
  id: crypto.randomUUID(),
  label: "",
  url: "",
});

export const buildDefaultBrochureSections = (): BrochureSection[] =>
  BROCHURE_SECTION_ORDER.map((section) => ({
    id: section.id,
    title: section.title,
    sourceClause: "",
    body: "",
    bullets: [],
  }));

export const createEmptyBrochure = (): Brochure => ({
  brochureCode: "",
  status: "draft",
  clientName: "",
  logoUrl: "",
  title: "",
  subtitle: "",
  duration: "",
  deliveryMode: "",
  studyLoad: "",
  priceLabel: "",
  ctas: [createEmptyBrochureCta()],
  sections: buildDefaultBrochureSections(),
  footerComplianceText: "",
  adminEmail: "rushi@knowwhatson.com",
});

export const getBrochureSection = (
  brochure: Brochure,
  sectionId: BrochureSectionId
) =>
  brochure.sections.find((section) => section.id === sectionId) || null;

export const normalizeBrochure = (brochure: Brochure): Brochure => {
  const ctas = brochure.ctas
    .map((cta) => ({
      id: cta.id || crypto.randomUUID(),
      label: emptyString(cta.label),
      url: emptyString(cta.url),
    }))
    .slice(0, 2);

  const sections = BROCHURE_SECTION_ORDER.map((definition) => {
    const match = brochure.sections.find((section) => section.id === definition.id);

    return {
      id: definition.id,
      title: definition.title,
      sourceClause: emptyString(match?.sourceClause),
      body: definition.id === "learningOutcomes" ? "" : emptyString(match?.body),
      bullets:
        definition.id === "learningOutcomes"
          ? normalizeBullets(match?.bullets)
          : [],
    };
  });

  return {
    ...brochure,
    brochureCode: emptyString(brochure.brochureCode).toUpperCase(),
    clientName: emptyString(brochure.clientName),
    logoUrl: emptyString(brochure.logoUrl),
    title: emptyString(brochure.title),
    subtitle: emptyString(brochure.subtitle),
    duration: emptyString(brochure.duration),
    deliveryMode: emptyString(brochure.deliveryMode),
    studyLoad: emptyString(brochure.studyLoad),
    priceLabel: emptyString(brochure.priceLabel),
    footerComplianceText: emptyString(brochure.footerComplianceText),
    adminEmail: emptyString(brochure.adminEmail).toLowerCase(),
    ctas,
    sections,
  };
};

const mapSectionRow = (value: unknown): BrochureSection[] => {
  if (!Array.isArray(value)) {
    return buildDefaultBrochureSections();
  }

  const rows = value as Array<Record<string, unknown>>;

  return BROCHURE_SECTION_ORDER.map((definition) => {
    const row = rows.find((item) => item.id === definition.id);

    return {
      id: definition.id,
      title: definition.title,
      sourceClause: emptyString(row?.sourceClause),
      body: definition.id === "learningOutcomes" ? "" : emptyString(row?.body),
      bullets:
        definition.id === "learningOutcomes" ? normalizeBullets(row?.bullets) : [],
    };
  });
};

const mapCtas = (value: unknown): BrochureCta[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return (value as Array<Record<string, unknown>>)
    .map((row) => ({
      id: emptyString(row.id) || crypto.randomUUID(),
      label: emptyString(row.label),
      url: emptyString(row.url),
    }))
    .slice(0, 2);
};

const mapBrochureRow = (row: Record<string, unknown>): Brochure =>
  normalizeBrochure({
    id: row.id as string,
    brochureCode: (row.brochure_code as string) || "",
    status: ((row.status as Brochure["status"]) || "draft") as Brochure["status"],
    clientName: (row.client_name as string) || "",
    logoUrl: (row.logo_url as string) || "",
    title: (row.title as string) || "",
    subtitle: (row.subtitle as string) || "",
    duration: (row.duration as string) || "",
    deliveryMode: (row.delivery_mode as string) || "",
    studyLoad: (row.study_load as string) || "",
    priceLabel: (row.price_label as string) || "",
    ctas: mapCtas(row.ctas),
    sections: mapSectionRow(row.sections),
    footerComplianceText: (row.footer_compliance_text as string) || "",
    adminEmail: (row.admin_email as string) || "rushi@knowwhatson.com",
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  });

export const listAdminBrochures = async (): Promise<BrochureListItem[]> => {
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_BROCHURES")
    .select("id, brochure_code, status, title, client_name, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    brochureCode: row.brochure_code,
    status: row.status,
    title: row.title,
    clientName: row.client_name || "",
    updatedAt: row.updated_at || undefined,
  }));
};

export const getAdminBrochure = async (brochureId: string): Promise<Brochure> => {
  const { data, error } = await supabase
    .from("RUSHI_PERSONAL_BROCHURES")
    .select("*")
    .eq("id", brochureId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBrochureRow(data);
};

export const saveAdminBrochure = async (input: Brochure): Promise<Brochure> => {
  const normalized = normalizeBrochure(input);
  const brochurePayload = {
    brochure_code: normalized.brochureCode,
    status: normalized.status,
    client_name: normalized.clientName,
    logo_url: normalized.logoUrl,
    title: normalized.title,
    subtitle: normalized.subtitle,
    duration: normalized.duration,
    delivery_mode: normalized.deliveryMode,
    study_load: normalized.studyLoad,
    price_label: normalized.priceLabel,
    ctas: normalized.ctas,
    sections: normalized.sections,
    footer_compliance_text: normalized.footerComplianceText || null,
    admin_email: normalized.adminEmail,
  };

  let brochureId = normalized.id;

  if (brochureId) {
    const { error } = await supabase
      .from("RUSHI_PERSONAL_BROCHURES")
      .update(brochurePayload)
      .eq("id", brochureId);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_BROCHURES")
      .insert(brochurePayload)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    brochureId = data.id;
  }

  if (!brochureId) {
    throw new Error("A brochure ID was not returned after saving.");
  }

  return getAdminBrochure(brochureId);
};

export const deleteAdminBrochure = async (brochureId: string): Promise<void> => {
  const { error } = await supabase
    .from("RUSHI_PERSONAL_BROCHURES")
    .delete()
    .eq("id", brochureId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getPublicBrochureByCode = async (
  code: string
): Promise<Brochure | null> => {
  const { data, error } = await supabase.rpc(
    "RUSHI_PERSONAL_GET_BROCHURE_BY_CODE",
    {
      input_code: code.trim(),
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const payload = Array.isArray(data) ? data[0] : data;
  if (!payload) {
    return null;
  }

  return normalizeBrochure({
    id: payload.id,
    brochureCode: payload.brochureCode,
    status: payload.status,
    clientName: payload.clientName || "",
    logoUrl: payload.logoUrl || "",
    title: payload.title || "",
    subtitle: payload.subtitle || "",
    duration: payload.duration || "",
    deliveryMode: payload.deliveryMode || "",
    studyLoad: payload.studyLoad || "",
    priceLabel: payload.priceLabel || "",
    ctas: mapCtas(payload.ctas),
    sections: mapSectionRow(payload.sections),
    footerComplianceText: payload.footerComplianceText || "",
    adminEmail: payload.adminEmail || "rushi@knowwhatson.com",
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  });
};

export const getBrochurePublicLink = (brochure: Brochure) =>
  brochure.brochureCode.trim()
    ? `${window.location.origin}/studio/project/${encodeURIComponent(
        brochure.brochureCode.trim()
      )}`
    : "";

export const getBrochurePublishErrors = (
  brochure: Brochure,
  options?: { hasOverflow?: boolean }
) => {
  const errors: string[] = [];
  const validCtas = brochure.ctas.filter(
    (cta) => cta.label.trim() && cta.url.trim()
  );
  const learningOutcomes =
    getBrochureSection(brochure, "learningOutcomes")?.bullets || [];

  if (!brochure.brochureCode.trim()) {
    errors.push("Brochure code is required before publishing.");
  }

  if (!brochure.title.trim()) {
    errors.push("Course or workshop title is required before publishing.");
  }

  if (!brochure.duration.trim()) {
    errors.push("Duration is required before publishing.");
  }

  if (!brochure.deliveryMode.trim()) {
    errors.push("Delivery mode is required before publishing.");
  }

  if (!brochure.studyLoad.trim()) {
    errors.push("Study load is required before publishing.");
  }

  if (!brochure.priceLabel.trim()) {
    errors.push("Price is required before publishing.");
  }

  if (validCtas.length === 0) {
    errors.push("Add at least one CTA label and URL before publishing.");
  }

  if (brochure.ctas.length > 2) {
    errors.push("Only two CTAs are supported in this layout.");
  }

  if (learningOutcomes.length === 0) {
    errors.push("Learning Outcomes needs at least one bullet before publishing.");
  }

  if (learningOutcomes.length > 6) {
    errors.push("Learning Outcomes is limited to six bullets for A4 fit.");
  }

  BROCHURE_SECTION_ORDER.filter((section) => section.id !== "learningOutcomes").forEach(
    (section) => {
      const content = getBrochureSection(brochure, section.id);
      if (!content?.body.trim()) {
        errors.push(`${section.title} copy is required before publishing.`);
      }
    }
  );

  if (options?.hasOverflow) {
    errors.push("This brochure overflows a single A4 page. Shorten the copy before publishing.");
  }

  return errors;
};

export interface BrochurePolishRequest {
  sectionId: BrochureSectionId;
  sourceClause: string;
  brochure: Pick<
    Brochure,
    | "clientName"
    | "title"
    | "subtitle"
    | "duration"
    | "deliveryMode"
    | "studyLoad"
    | "priceLabel"
  >;
}

export interface BrochurePolishResult {
  sectionId: BrochureSectionId;
  body: string;
  bullets: string[];
}

export const polishBrochureSection = async (
  payload: BrochurePolishRequest
): Promise<BrochurePolishResult> => {
  const { data, error } = await supabase.functions.invoke(
    "brochure-copy-assistant",
    {
      body: payload,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No content was returned by the brochure copy assistant.");
  }

  return {
    sectionId: payload.sectionId,
    body: emptyString(data.body),
    bullets: normalizeBullets(data.bullets),
  };
};
