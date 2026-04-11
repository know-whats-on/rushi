import {
  clearSessionCookie,
  createSessionCookie,
  createSignedToken,
  ensureMethod,
  getRequiredEnv,
  matchesSecret,
  parseCookies,
  readJsonBody,
  sendJson,
  verifySignedToken,
} from "../_shared.js";
import {
  findSupportedPresentationTarget,
  getRemoteAccessSecret,
  normalizePresentationCode,
  normalizePresentationSessionId,
} from "./_shared.js";

const REMOTE_ACCESS_COOKIE_NAME = "RUSHI_PRESENTATION_REMOTE_ACCESS";
const REMOTE_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

const getRemoteAccessCode = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

const getRemoteAccessSessionId = (req) => {
  const value = req.query?.sessionId;
  return Array.isArray(value) ? value[0] : value;
};

const getRemoteAccessPassword = () =>
  getRequiredEnv("INFS5700_PUBLIC_REMOTE_PASSWORD");

const buildRemoteAccessCookie = (code, sessionId) =>
  createSessionCookie({
    name: REMOTE_ACCESS_COOKIE_NAME,
    maxAgeSeconds: REMOTE_ACCESS_MAX_AGE_SECONDS,
    value: createSignedToken(
      {
        code,
        sessionId,
        exp: Date.now() + REMOTE_ACCESS_MAX_AGE_SECONDS * 1000,
        v: 1,
      },
      getRemoteAccessSecret()
    ),
  });

const isRemoteAccessAuthorized = (req, code, sessionId) => {
  const cookies = parseCookies(req.headers.cookie);
  const payload = verifySignedToken(
    cookies[REMOTE_ACCESS_COOKIE_NAME],
    getRemoteAccessSecret()
  );

  return Boolean(
    payload &&
      payload.code === code &&
      payload.sessionId === sessionId
  );
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET", "POST"])) {
    return;
  }

  try {
    if (req.method === "GET") {
      const code = normalizePresentationCode(getRemoteAccessCode(req));
      const sessionId = normalizePresentationSessionId(getRemoteAccessSessionId(req));
      const target = findSupportedPresentationTarget({ code, sessionId });

      if (!code || !sessionId) {
        sendJson(res, 400, {
          authorized: false,
          message: "Presentation code and session id are required.",
        });
        return;
      }

      if (!target) {
        sendJson(res, 404, {
          authorized: false,
          message: "Protected remote not found.",
        });
        return;
      }

      sendJson(res, 200, {
        authorized: isRemoteAccessAuthorized(req, code, sessionId),
      });
      return;
    }

    const body = await readJsonBody(req);
    const code = normalizePresentationCode(body?.code);
    const sessionId = normalizePresentationSessionId(body?.sessionId);
    const password = typeof body?.password === "string" ? body.password.trim() : "";
    const target = findSupportedPresentationTarget({ code, sessionId });

    if (!code || !sessionId) {
      sendJson(res, 400, {
        authorized: false,
        message: "Presentation code and session id are required.",
      });
      return;
    }

    if (!target) {
      sendJson(res, 404, {
        authorized: false,
        message: "Protected remote not found.",
      });
      return;
    }

    if (!matchesSecret(password, getRemoteAccessPassword())) {
      sendJson(
        res,
        401,
        {
          authorized: false,
          message: "Incorrect password.",
        },
        {
          "Set-Cookie": clearSessionCookie({
            name: REMOTE_ACCESS_COOKIE_NAME,
          }),
        }
      );
      return;
    }

    sendJson(
      res,
      200,
      {
        authorized: true,
      },
      {
        "Set-Cookie": buildRemoteAccessCookie(code, sessionId),
      }
    );
  } catch (error) {
    sendJson(res, 500, {
      authorized: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify remote access right now.",
    });
  }
}
