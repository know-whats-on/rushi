import { ensureMethod, sendJson } from "../../_shared.js";
import { clearGuestLecturerAdminCookie } from "../_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  sendJson(
    res,
    200,
    {
      accessible: false,
      campaignKey: "unsw-ai-fluency-2026",
      expiresAt: null,
    },
    {
      "Set-Cookie": clearGuestLecturerAdminCookie(),
      "Cache-Control": "no-store",
    }
  );
}
