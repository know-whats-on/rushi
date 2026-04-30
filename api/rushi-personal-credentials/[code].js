import { ensureMethod, getSupabaseAdmin, sendJson } from "../_shared.js";
import {
  getCredentialCodeFromRequest,
  mapCredentialRow,
  RHEEM_CREDENTIAL_STATUS_ISSUED,
} from "./_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  const code = getCredentialCodeFromRequest(req);

  if (!code || typeof code !== "string" || !code.trim()) {
    sendJson(res, 400, {
      message: "Credential code is required.",
    });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("RUSHI_PERSONAL_CREDENTIALS")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("status", RHEEM_CREDENTIAL_STATUS_ISSUED)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      sendJson(res, 404, {
        message: "Credential not found.",
      });
      return;
    }

    sendJson(
      res,
      200,
      {
        credential: mapCredentialRow(data),
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
          : "Unable to load this credential right now.",
    });
  }
}
