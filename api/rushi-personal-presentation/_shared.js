import {
  createSignedToken,
  emptyString,
  getOptionalEnv,
  getRequiredEnv,
  verifySignedToken,
} from "../_shared.js";

export const PRESENTATION_REMOTE_WIDGET_CODE = "INFS5700";
export const PRESENTATION_REMOTE_WIDGET_SESSION_ID = "PUBLIC";
export const PRESENTATION_REMOTE_WIDGET_TARGETS = [
  {
    code: "INFS5700",
    sessionId: "PUBLIC",
    displayName: "INFS5700",
    widgetKindPrefix: "PresentationRemoteWidget",
  },
  {
    code: "RHEEMPRESSO",
    sessionId: "PUBLIC",
    displayName: "RHEEMPRESSO",
    widgetKindPrefix: "RheempressoPresentationRemoteWidget",
  },
];
export const PRESENTATION_REMOTE_WIDGET_TOKEN_MAX_AGE_SECONDS =
  60 * 60 * 24 * 30;
export const PRESENTATION_REMOTE_WIDGET_CLIENT_ID = "IOS_WIDGET";

export const PRESENTATION_REMOTE_WIDGET_COMMANDS = new Set([
  "prevSlide",
  "prev",
  "next",
  "nextSlide",
]);

export const PRESENTATION_REMOTE_COMMAND_EVENT = "remote-command";

export const normalizePresentationCode = (value) =>
  emptyString(value).toUpperCase();

export const normalizePresentationSessionId = (value) =>
  emptyString(value).toUpperCase();

export const getRemoteAccessSecret = () =>
  getOptionalEnv("RUSHI_PRESENTATION_REMOTE_SESSION_SECRET") ||
  getRequiredEnv("RUSHI_PERSONAL_ADMIN_SESSION_SECRET");

export const getWidgetTokenSecret = () =>
  getOptionalEnv("RUSHI_PRESENTATION_WIDGET_TOKEN_SECRET") ||
  getRemoteAccessSecret();

export const getFixedPresentationTarget = () => ({
  code: PRESENTATION_REMOTE_WIDGET_CODE,
  sessionId: PRESENTATION_REMOTE_WIDGET_SESSION_ID,
});

export const listSupportedPresentationTargets = () =>
  PRESENTATION_REMOTE_WIDGET_TARGETS.map((target) => ({
    ...target,
  }));

export const findSupportedPresentationTarget = ({
  code,
  sessionId,
} = {}) => {
  const normalizedCode = normalizePresentationCode(code);
  const normalizedSessionId = normalizePresentationSessionId(sessionId);

  if (!normalizedCode || !normalizedSessionId) {
    return null;
  }

  return (
    PRESENTATION_REMOTE_WIDGET_TARGETS.find(
      (target) =>
        target.code === normalizedCode && target.sessionId === normalizedSessionId
    ) || null
  );
};

export const isSupportedPresentationTarget = (payload = null) =>
  Boolean(findSupportedPresentationTarget(payload));

export const resolveSupportedPresentationTarget = (payload = null) => {
  const code = normalizePresentationCode(payload?.code);
  const sessionId = normalizePresentationSessionId(payload?.sessionId);

  if (!code && !sessionId) {
    return getFixedPresentationTarget();
  }

  return findSupportedPresentationTarget({ code, sessionId });
};

export const resolveFixedPresentationTarget = (payload = null) => {
  const target = resolveSupportedPresentationTarget(payload);
  const fixedTarget = getFixedPresentationTarget();
  if (!target) {
    return null;
  }

  return target.code === fixedTarget.code && target.sessionId === fixedTarget.sessionId
    ? target
    : null;
};

export const createPresentationChannelName = (code, sessionId) =>
  `presentation:${normalizePresentationCode(code)}:${normalizePresentationSessionId(
    sessionId
  )}`;

export const createWidgetToken = ({ code, sessionId }) =>
  createSignedToken(
    {
      code,
      sessionId,
      exp:
        Date.now() + PRESENTATION_REMOTE_WIDGET_TOKEN_MAX_AGE_SECONDS * 1000,
      v: 1,
    },
    getWidgetTokenSecret()
  );

export const verifyWidgetToken = (token) =>
  verifySignedToken(token, getWidgetTokenSecret());
