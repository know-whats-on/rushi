import {
  ensureMethod,
  getSupabaseAdmin,
  readJsonBody,
  sendJson,
} from "../_shared.js";
import {
  PRESENTATION_REMOTE_COMMAND_EVENT,
  PRESENTATION_REMOTE_WIDGET_CLIENT_ID,
  PRESENTATION_REMOTE_WIDGET_COMMANDS,
  createPresentationChannelName,
  verifyWidgetToken,
} from "./_shared.js";

const PRESENTATION_STATE_EVENT = "presentation-state";
const LIVE_STATE_WAIT_TIMEOUT_MS = 2000;

const parseIsoDate = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isPresentationStatePayload = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof value.updatedAt === "string" &&
      Number.isInteger(value.slideIndex)
  );

const shouldAcceptLiveState = (payload, sinceUpdatedAt) => {
  if (!isPresentationStatePayload(payload)) {
    return false;
  }

  if (!sinceUpdatedAt) {
    return true;
  }

  const payloadUpdatedAt = parseIsoDate(payload.updatedAt);
  return Boolean(payloadUpdatedAt && payloadUpdatedAt > sinceUpdatedAt);
};

const subscribeToPresentationState = async ({
  supabase,
  channelName,
  sinceUpdatedAt,
}) => {
  const channel = supabase.channel(channelName);

  const nextLiveState = new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(null), LIVE_STATE_WAIT_TIMEOUT_MS);

    channel.on(
      "broadcast",
      { event: PRESENTATION_STATE_EVENT },
      ({ payload }) => {
        if (!shouldAcceptLiveState(payload, sinceUpdatedAt)) {
          return;
        }

        clearTimeout(timeoutId);
        resolve(payload);
      }
    );
  });

  const subscribed = new Promise((resolve, reject) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        resolve();
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        reject(new Error("The widget remote could not subscribe to live deck updates."));
      }
    });
  });

  await subscribed;

  return {
    channel,
    nextLiveState,
    cleanup: async () => {
      try {
        await supabase.removeChannel(channel);
      } catch {
        // Ignore realtime cleanup failures in the response path.
      }
    },
  };
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const payload = verifyWidgetToken(token);

    if (!payload?.code || !payload?.sessionId) {
      sendJson(res, 401, {
        message: "Widget remote authorization has expired. Reconnect it in the app.",
      });
      return;
    }

    const command = typeof body?.command === "string" ? body.command.trim() : "";
    if (!PRESENTATION_REMOTE_WIDGET_COMMANDS.has(command)) {
      sendJson(res, 400, {
        message: "Unsupported remote command.",
      });
      return;
    }

    const sinceUpdatedAt = parseIsoDate(body?.sinceUpdatedAt);
    const channelName = createPresentationChannelName(payload.code, payload.sessionId);
    const supabase = getSupabaseAdmin();
    const listener = await subscribeToPresentationState({
      supabase,
      channelName,
      sinceUpdatedAt,
    });

    try {
      const sentAt = new Date().toISOString();
      const result = await listener.channel.send({
        type: "broadcast",
        event: PRESENTATION_REMOTE_COMMAND_EVENT,
        payload: {
          code: payload.code,
          sessionId: payload.sessionId,
          command,
          sentAt,
          senderClientId: PRESENTATION_REMOTE_WIDGET_CLIENT_ID,
          senderRole: "remote",
        },
      });

      if (result !== "ok") {
        sendJson(res, 502, {
          message: "The remote command could not be sent.",
        });
        return;
      }

      const liveState = await listener.nextLiveState;

      sendJson(res, 200, {
        code: payload.code,
        sessionId: payload.sessionId,
        command,
        message: "Remote command sent.",
        sentAt,
        liveState,
      });
    } finally {
      await listener.cleanup();
    }
  } catch (error) {
    sendJson(res, 500, {
      message:
        error instanceof Error
          ? error.message
          : "Unable to send the widget remote command right now.",
    });
  }
}
