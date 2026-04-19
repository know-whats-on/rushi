import { ensureMethod, readJsonBody, sendJson } from "../_shared.js";
import {
  buildGuestLecturerAccessCookie,
  clearGuestLecturerAccessCookie,
  getGuestLecturerAccessSession,
  verifyGuestLecturerAccessCode,
} from "./_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!code) {
      sendJson(res, 400, {
        accessible: false,
        campaignKey: "unsw-ai-fluency-2026",
        message: "Guest lecturer access code is required.",
      });
      return;
    }

    if (!verifyGuestLecturerAccessCode(code)) {
      sendJson(
        res,
        401,
        {
          accessible: false,
          campaignKey: "unsw-ai-fluency-2026",
          message: "Incorrect guest lecturer access code.",
        },
        {
          "Set-Cookie": clearGuestLecturerAccessCookie(),
        }
      );
      return;
    }

    const session = await getGuestLecturerAccessSession(req);

    sendJson(
      res,
      200,
      {
        ...session,
        accessible: true,
      },
      {
      "Set-Cookie": buildGuestLecturerAccessCookie(),
      }
    );
  } catch (error) {
    sendJson(res, 500, {
      accessible: false,
      campaignKey: "unsw-ai-fluency-2026",
      message:
        error instanceof Error
          ? error.message
          : "Unable to unlock guest lecturer access right now.",
    });
  }
}
