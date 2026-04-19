import { ensureMethod, sendJson } from "../_shared.js";
import { getGuestLecturerAccessSession } from "./_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  try {
    sendJson(res, 200, await getGuestLecturerAccessSession(req), {
      "Cache-Control": "no-store",
    });
  } catch (error) {
    sendJson(res, 500, {
      accessible: false,
      campaignKey: "unsw-ai-fluency-2026",
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify guest lecturer access right now.",
    });
  }
}
