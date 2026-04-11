import {
  ensureMethod,
  getRequiredEnv,
  matchesSecret,
  readJsonBody,
  sendJson,
} from "../_shared.js";
import {
  createWidgetToken,
  resolveSupportedPresentationTarget,
} from "./_shared.js";

const getRemoteAccessPassword = () =>
  getRequiredEnv("INFS5700_PUBLIC_REMOTE_PASSWORD");

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const target = resolveSupportedPresentationTarget(body);

    if (!target) {
      sendJson(res, 400, {
        message:
          "This widget remote only supports the approved public presentation sessions.",
      });
      return;
    }

    const password = typeof body?.password === "string" ? body.password.trim() : "";
    if (!password) {
      sendJson(res, 400, {
        message: "Remote password is required.",
      });
      return;
    }

    if (!matchesSecret(password, getRemoteAccessPassword())) {
      sendJson(res, 401, {
        message: "Incorrect password.",
      });
      return;
    }

    sendJson(res, 200, {
      code: target.code,
      sessionId: target.sessionId,
      token: createWidgetToken(target),
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toISOString(),
    });
  } catch (error) {
    sendJson(res, 500, {
      message:
        error instanceof Error
          ? error.message
          : "Unable to connect the widget remote right now.",
    });
  }
}
