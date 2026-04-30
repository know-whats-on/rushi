import { ensureMethod, getSupabaseAdmin, readJsonBody, sendJson } from "../_shared.js";
import {
  createCredentialRecord,
  mapCredentialRow,
} from "./_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const participantName =
      body && typeof body === "object" && "participantName" in body
        ? body.participantName
        : "";

    const supabase = getSupabaseAdmin();
    const record = await createCredentialRecord(supabase, participantName);

    sendJson(res, 201, {
      credential: mapCredentialRow(record),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create a digital credential right now.";

    sendJson(
      res,
      message.startsWith("Enter your name") ? 400 : 500,
      {
        message,
      }
    );
  }
}
