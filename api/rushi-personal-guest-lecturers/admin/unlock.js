import { ensureMethod, readJsonBody, sendJson } from "../../_shared.js";
import {
  buildGuestLecturerAdminCookie,
  clearGuestLecturerAdminCookie,
  getGuestLecturerAdminSession,
  verifyGuestLecturerAdminPasscode,
} from "../_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const passcode =
      typeof body?.passcode === "string" ? body.passcode.trim() : "";

    if (!passcode) {
      sendJson(res, 400, {
        accessible: false,
        campaignKey: "unsw-ai-fluency-2026",
        message: "Admin passcode is required.",
      });
      return;
    }

    if (!verifyGuestLecturerAdminPasscode(passcode)) {
      sendJson(
        res,
        401,
        {
          accessible: false,
          campaignKey: "unsw-ai-fluency-2026",
          message: "Incorrect admin passcode.",
        },
        {
          "Set-Cookie": clearGuestLecturerAdminCookie(),
        }
      );
      return;
    }

    const session = await getGuestLecturerAdminSession(req);

    sendJson(
      res,
      200,
      {
        ...session,
        accessible: true,
      },
      {
      "Set-Cookie": buildGuestLecturerAdminCookie(),
      }
    );
  } catch (error) {
    sendJson(res, 500, {
      accessible: false,
      campaignKey: "unsw-ai-fluency-2026",
      message:
        error instanceof Error
          ? error.message
          : "Unable to unlock admin access right now.",
    });
  }
}
