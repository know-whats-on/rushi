import { getSupabaseAdmin, sendJson, ensureMethod } from "../_shared.js";

const TECHNET_RETIRED_CODE = "TECHNET26";

const emptyString = (value) =>
  typeof value === "string" ? value.trim() : "";

const isRetiredStudioCode = (value) =>
  emptyString(value).toUpperCase() === TECHNET_RETIRED_CODE;

const deriveLibraryMeta = (row) => {
  const content = row.content && typeof row.content === "object" ? row.content : {};
  const libraryMeta =
    content.libraryMeta && typeof content.libraryMeta === "object"
      ? content.libraryMeta
      : {};

  return {
    id: row.id,
    engagementId: row.engagement_id,
    code: row.code,
    kind: content.mode === "project" ? "project" : row.kind,
    documentStatus: row.status,
    updatedAt: row.updated_at,
    cardCompany:
      emptyString(libraryMeta.cardCompany) ||
      emptyString(row.client_company) ||
      emptyString(row.client_name) ||
      "Studio Project",
    cardTitle: emptyString(libraryMeta.cardTitle) || emptyString(row.title) || "Untitled project",
    cardCategory: emptyString(libraryMeta.cardCategory) || "Project",
    cardStatusLabel:
      emptyString(libraryMeta.cardStatusLabel) ||
      (row.status === "published" ? "Code required" : "Draft"),
    cardSummary:
      emptyString(libraryMeta.cardSummary) ||
      emptyString(content.introText) ||
      emptyString(row.title) ||
      "Shared through the public studio.",
    cardLogoUrl:
      emptyString(libraryMeta.cardLogoUrl) ||
      emptyString(content.logoUrl),
  };
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_DOCUMENTS")
      .select("*")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    sendJson(
      res,
      200,
      {
        documents: (data || [])
          .filter((row) => !isRetiredStudioCode(row.code))
          .map(deriveLibraryMeta),
      },
      {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      }
    );
  } catch (error) {
    sendJson(res, 500, {
      message:
        error instanceof Error
          ? error.message
          : "Unable to load the studio library right now.",
    });
  }
}
