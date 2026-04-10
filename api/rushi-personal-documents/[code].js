import { getSupabaseAdmin, sendJson, ensureMethod } from "../_shared.js";

const TECHNET_RETIRED_CODE = "TECHNET26";

const getCode = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

const isRetiredStudioCode = (value) =>
  typeof value === "string" && value.trim().toUpperCase() === TECHNET_RETIRED_CODE;

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  const code = getCode(req);
  if (!code) {
    sendJson(res, 400, {
      message: "Project code is required.",
    });
    return;
  }

  if (isRetiredStudioCode(code)) {
    sendJson(res, 404, {
      message: "Project not found.",
    });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_DOCUMENTS")
      .select("*")
      .ilike("code", code.trim())
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      sendJson(res, 404, {
        message: "Project not found.",
      });
      return;
    }

    sendJson(
      res,
      200,
      {
        document: {
          id: data.id,
          engagementId: data.engagement_id,
          kind:
            data.content && typeof data.content === "object" && data.content.mode === "project"
              ? "project"
              : data.kind,
          code: data.code,
          status: data.status,
          title: data.title,
          clientName: data.client_name,
          clientCompany: data.client_company,
          clientEmail: data.client_email,
          ctaLabel: data.cta_label,
          adminEmail: data.admin_email,
          content: data.content || {},
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
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
          : "Unable to load this project right now.",
    });
  }
}
