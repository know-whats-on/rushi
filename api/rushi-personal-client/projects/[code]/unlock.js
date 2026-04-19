import { ensureMethod, readJsonBody, sendJson } from "../../../_shared.js";
import {
  buildProjectAccessCookie,
  clearProjectAccessCookie,
  clearProjectParticipantCookie,
  getProjectAccessSession,
  verifyProjectPassword,
} from "../../_lib.js";

const getCode = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const code = getCode(req);
    const body = await readJsonBody(req);
    const password = typeof body?.password === "string" ? body.password : "";

    if (!code) {
      sendJson(res, 400, {
        accessible: false,
        message: "Project code is required.",
      });
      return;
    }

    if (!password.trim()) {
      sendJson(res, 400, {
        accessible: false,
        message: "Project password is required.",
      });
      return;
    }

    const isAuthorized = await verifyProjectPassword(code, password);
    if (!isAuthorized) {
      sendJson(
        res,
        401,
        {
          accessible: false,
          message: "Incorrect project password.",
        },
        {
          "Set-Cookie": [
            clearProjectAccessCookie(),
            clearProjectParticipantCookie(),
          ],
        }
      );
      return;
    }

    sendJson(
      res,
      200,
      {
        accessible: true,
        code: code.trim().toUpperCase(),
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 14 * 1000).toISOString(),
        participant: null,
      },
      {
        "Set-Cookie": buildProjectAccessCookie(code),
      }
    );
  } catch (error) {
    sendJson(res, 500, {
      accessible: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to unlock this project right now.",
    });
  }
}
