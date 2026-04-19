import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://pcgdqsdiidtiziypvqri.supabase.co";

const bufferToBase64Url = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlToBuffer = (value) => {
  const normalized = `${value}`.replace(/-/g, "+").replace(/_/g, "/");
  const padding =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64");
};

export const emptyString = (value) =>
  typeof value === "string" ? value.trim() : "";

export const normalizeProjectCode = (value) => emptyString(value).toUpperCase();

export const getOptionalEnv = (name) => emptyString(process.env[name]);

export const getRequiredEnv = (name) => {
  const value = getOptionalEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getSupabaseAdmin = () =>
  createClient(
    process.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

export const ensureMethod = (req, res, allowedMethods) => {
  if (allowedMethods.includes(req.method)) {
    return true;
  }

  res.setHeader("Allow", allowedMethods.join(", "));
  sendJson(res, 405, {
    message: `Method ${req.method} is not allowed.`,
  });
  return false;
};

export const readJsonBody = async (req) => {
  if (!req.body) {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const raw = Buffer.concat(chunks).toString("utf8").trim();
    return raw ? JSON.parse(raw) : {};
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  return req.body;
};

export const sendJson = (res, status, payload, extraHeaders = {}) => {
  Object.entries(extraHeaders).forEach(([name, value]) => {
    res.setHeader(name, value);
  });
  res.status(status).json(payload);
};

export const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, part) => {
    const [name, ...rest] = part.trim().split("=");
    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});

const signValue = (input, secret) =>
  createHmac("sha256", secret).update(input).digest();

export const createSignedToken = (payload, secret) => {
  const payloadEncoded = bufferToBase64Url(JSON.stringify(payload));
  const signatureEncoded = bufferToBase64Url(signValue(payloadEncoded, secret));
  return `${payloadEncoded}.${signatureEncoded}`;
};

export const verifySignedToken = (token, secret) => {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payloadEncoded, signatureEncoded] = token.split(".");
  if (!payloadEncoded || !signatureEncoded) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlToBuffer(payloadEncoded).toString("utf8"));
  } catch {
    return null;
  }

  if (!payload || typeof payload.exp !== "number" || payload.exp <= Date.now()) {
    return null;
  }

  try {
    const expected = signValue(payloadEncoded, secret);
    const actual = base64UrlToBuffer(signatureEncoded);

    if (expected.length !== actual.length) {
      return null;
    }

    return timingSafeEqual(expected, actual) ? payload : null;
  } catch {
    return null;
  }
};

export const createSessionCookie = ({
  name,
  value,
  maxAgeSeconds,
  httpOnly = true,
}) =>
  [
    `${name}=${value}`,
    `Max-Age=${maxAgeSeconds}`,
    "Path=/",
    httpOnly ? "HttpOnly" : "",
    "SameSite=Lax",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

export const clearSessionCookie = ({ name, httpOnly = true }) =>
  [
    `${name}=`,
    "Max-Age=0",
    "Path=/",
    httpOnly ? "HttpOnly" : "",
    "SameSite=Lax",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

export const matchesSecret = (candidate, expected) => {
  const candidateBuffer = Buffer.from(candidate || "", "utf8");
  const expectedBuffer = Buffer.from(expected || "", "utf8");

  if (!expectedBuffer.length || candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
};

export const verifyPasswordHash = (candidate, encodedHash) => {
  const normalizedHash = emptyString(encodedHash);

  if (!normalizedHash) {
    return false;
  }

  if (!normalizedHash.startsWith("scrypt:")) {
    return matchesSecret(candidate, normalizedHash);
  }

  const [, saltHex, expectedHex] = normalizedHash.split(":");
  if (!saltHex || !expectedHex) {
    return false;
  }

  try {
    const candidateHash = scryptSync(candidate || "", saltHex, 64);
    const expectedHash = Buffer.from(expectedHex, "hex");

    if (candidateHash.length !== expectedHash.length) {
      return false;
    }

    return timingSafeEqual(candidateHash, expectedHash);
  } catch {
    return false;
  }
};
