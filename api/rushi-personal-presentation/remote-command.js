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

const isPresentationStatePayload = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof value.updatedAt === "string" &&
      Number.isInteger(value.slideIndex)
  );

const getCommandSettledState = (payload, commandId) => {
  if (!isPresentationStatePayload(payload) || typeof commandId !== "string") {
    return null;
  }

  const appliedCommand = payload.lastAppliedRemoteCommand;
  if (!appliedCommand || typeof appliedCommand !== "object") {
    return null;
  }

  if (appliedCommand.commandId !== commandId) {
    return null;
  }

  if (appliedCommand.effect !== "changed" && appliedCommand.effect !== "noOp") {
    return null;
  }

  return {
    liveState: payload,
    lastAppliedRemoteCommand: appliedCommand,
    status: appliedCommand.effect === "noOp" ? "noOp" : "settled",
  };
};

const getAcceptedMessage = () => "Command delivered. Waiting for deck sync.";

const getSettledMessage = (command) => {
  switch (command) {
    case "prevSlide":
      return "Moved to the previous slide.";
    case "prev":
      return "Moved back.";
    case "next":
      return "Moved forward.";
    case "nextSlide":
      return "Moved to the next slide.";
    default:
      return "Remote command sent.";
  }
};

const getNoOpMessage = (command) => {
  switch (command) {
    case "prevSlide":
      return "Already at the first slide.";
    case "prev":
      return "Already at the beginning.";
    case "next":
      return "Already at the end.";
    case "nextSlide":
      return "Already at the last slide.";
    default:
      return "That command did not change the deck.";
  }
};

const subscribeToPresentationState = async ({
  supabase,
  channelName,
  commandId,
}) => {
  const channel = supabase.channel(channelName);

  const nextLiveState = new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(null), LIVE_STATE_WAIT_TIMEOUT_MS);

    channel.on(
      "broadcast",
      { event: PRESENTATION_STATE_EVENT },
      ({ payload }) => {
        const settledState = getCommandSettledState(payload, commandId);
        if (!settledState) {
          return;
        }

        clearTimeout(timeoutId);
        resolve(settledState);
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
        status: "failed",
        message: "Widget remote authorization has expired. Reconnect it in the app.",
      });
      return;
    }

    const command = typeof body?.command === "string" ? body.command.trim() : "";
    if (!PRESENTATION_REMOTE_WIDGET_COMMANDS.has(command)) {
      sendJson(res, 400, {
        status: "failed",
        message: "Unsupported remote command.",
      });
      return;
    }

    const channelName = createPresentationChannelName(payload.code, payload.sessionId);
    const supabase = getSupabaseAdmin();
    let listener = null;
    const commandId =
      typeof body?.commandId === "string" ? body.commandId.trim() : "";

    if (!commandId) {
      sendJson(res, 400, {
        status: "failed",
        message: "Missing command identifier.",
      });
      return;
    }

    try {
      listener = await subscribeToPresentationState({
        supabase,
        channelName,
        commandId,
      });
    } catch {
      listener = null;
    }

    const commandChannel = listener?.channel ?? supabase.channel(channelName);

    try {
      const sentAt = new Date().toISOString();
      const commandPayload = {
        code: payload.code,
        sessionId: payload.sessionId,
        commandId,
        command,
        sentAt,
        senderClientId: PRESENTATION_REMOTE_WIDGET_CLIENT_ID,
        senderRole: "remote",
      };

      await commandChannel.httpSend(
        PRESENTATION_REMOTE_COMMAND_EVENT,
        commandPayload,
        { timeout: LIVE_STATE_WAIT_TIMEOUT_MS }
      );

      const settledState = listener ? await listener.nextLiveState : null;
      const status = settledState?.status ?? "accepted";
      const liveState = settledState?.liveState ?? null;
      const lastAppliedRemoteCommand =
        settledState?.lastAppliedRemoteCommand ?? null;
      const message =
        status === "settled"
          ? getSettledMessage(command)
          : status === "noOp"
            ? getNoOpMessage(command)
            : getAcceptedMessage();

      sendJson(res, 200, {
        code: payload.code,
        sessionId: payload.sessionId,
        command,
        commandId,
        sentAt,
        status,
        message,
        liveState,
        lastAppliedRemoteCommand,
      });
    } catch (error) {
      sendJson(res, 502, {
        status: "failed",
        message:
          error instanceof Error && error.message.trim()
            ? error.message
            : "The remote command could not be sent.",
      });
    } finally {
      if (listener) {
        await listener.cleanup();
      } else {
        try {
          await supabase.removeChannel(commandChannel);
        } catch {
          // Ignore cleanup failures for the fire-and-forget command channel.
        }
      }
    }
  } catch (error) {
    sendJson(res, 500, {
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Unable to send the widget remote command right now.",
    });
  }
}
