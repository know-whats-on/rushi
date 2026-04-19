import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isNativeStudioApp } from "../lib/nativeBridge";
import { getAppShellPresentationRemoteTarget } from "../lib/presentationRemoteTargets";
import {
  remoteWidgetSetup,
  type RemoteWidgetSetupStatus,
  type RemoteWidgetSetupTargetStatus,
} from "../lib/remoteWidgetSetup";

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Not connected yet";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const getLiveStateLabel = (
  value: RemoteWidgetSetupTargetStatus["liveStateStatus"]
) => {
  switch (value) {
    case "live":
      return "Live";
    case "stale":
      return "Cached";
    case "notesUnavailable":
      return "No notes";
    case "waiting":
    default:
      return "Waiting";
  }
};

const getInteractionLabel = (
  value: NonNullable<RemoteWidgetSetupTargetStatus["lastInteraction"]>
) => {
  const kind = value.kind === "notesPage" ? "Notes" : "Remote";
  const commandLabel =
    value.command === "prevSlide"
      ? "Prev slide"
      : value.command === "nextSlide"
        ? "Next slide"
        : value.command === "prev"
          ? "Prev"
          : value.command === "next"
            ? "Next"
            : null;
  const prefix = commandLabel ? `${kind} · ${commandLabel}` : kind;

  switch (value.stage) {
    case "invoked":
      return `${prefix} · Sending`;
    case "delivered":
      return `${prefix} · Delivered`;
    case "failed":
      return `${prefix} · Failed`;
    case "settled":
      return `${prefix} · Synced`;
    case "noOp":
      return `${prefix} · No change`;
    case "localOnly":
      return `${prefix} · Local`;
    default:
      return prefix;
  }
};

const RemoteWidgetSetupPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RemoteWidgetSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionStorageKey, setActionStorageKey] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const nextStatus = await remoteWidgetSetup.getStatus();
      setStatus(nextStatus);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to read the widget remote status right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNativeStudioApp()) {
      setLoading(false);
      return;
    }

    void loadStatus();
  }, []);

  const targetStatuses = useMemo(
    () => status?.targets ?? [],
    [status?.targets]
  );

  if (!isNativeStudioApp()) {
    return (
      <section className="studio-app-page studio-app-page--workspace">
        <div className="studio-app-empty studio-app-empty--frame">
          <div>
            <p className="studio-app-eyebrow">Widget Remote</p>
            <h3>Open this inside the iOS app.</h3>
          </div>
        </div>
      </section>
    );
  }

  const handlePresentSetup = async () => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      const nextStatus = await remoteWidgetSetup.presentSetup();
      setStatus(nextStatus);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "The widget setup did not finish."
      );
      await loadStatus();
    } finally {
      setSubmitting(false);
      setActionStorageKey(null);
    }
  };

  const handleStartLiveNotes = async (storageKey: string) => {
    try {
      setSubmitting(true);
      setActionStorageKey(storageKey);
      setErrorMessage(null);
      const nextStatus = await remoteWidgetSetup.startLiveNotes({ storageKey });
      setStatus(nextStatus);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start live notes."
      );
      await loadStatus();
    } finally {
      setSubmitting(false);
      setActionStorageKey(null);
    }
  };

  const handleStopLiveNotes = async (storageKey: string) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      setActionStorageKey(storageKey);
      const nextStatus = await remoteWidgetSetup.stopLiveNotes();
      setStatus(nextStatus);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to stop live notes."
      );
      await loadStatus();
    } finally {
      setSubmitting(false);
      setActionStorageKey(null);
    }
  };

  return (
    <section className="studio-app-page studio-app-page--workspace">
      <section className="studio-app-panel">
        <div className="studio-app-panel-heading">
          <div>
            <p className="studio-app-eyebrow">Widget Remote</p>
            <h3>Keep both presentation remotes one tap away.</h3>
          </div>
          <span className="studio-app-status">
            {targetStatuses.some((target) => target.isLiveActivityRunning)
              ? "Live notes running"
              : targetStatuses.some((target) => !target.needsSetup)
                ? "Connected"
                : "Setup required"}
          </span>
        </div>

        <p className="studio-app-overview-copy">
          Unlock either deck once with the shared password, then add the matching
          remote launcher widget. Use Live Notes as the near-live notes surface.
        </p>

        {loading ? (
          <div className="studio-app-empty studio-app-empty--tight">
            <p>Checking the presentation remotes...</p>
          </div>
        ) : (
          <div className="studio-app-document-stack">
            {targetStatuses.map((target) => (
              <section
                key={target.storageKey}
                className="studio-app-remote-widget-status"
              >
                <div className="studio-app-panel-heading">
                  <div>
                    <p className="studio-app-eyebrow">{target.displayName}</p>
                    <h3>
                      {target.code} / {target.sessionId}
                    </h3>
                  </div>
                  <span className="studio-app-status">
                    {target.needsSetup
                      ? "Setup required"
                      : target.isConfigured
                        ? "Connected"
                        : "Ready"}
                  </span>
                </div>

                <div className="studio-app-summary-grid">
                  <div>
                    <span>Access</span>
                    <strong>
                      {target.isConfigured
                        ? target.isExpired
                          ? "Expired"
                          : "Connected"
                        : "Not connected"}
                    </strong>
                  </div>
                  <div>
                    <span>Expires</span>
                    <strong>{formatDateTime(target.expiresAt || null)}</strong>
                  </div>
                  <div>
                    <span>Live notes</span>
                    <strong>{getLiveStateLabel(target.liveStateStatus)}</strong>
                  </div>
                  <div>
                    <span>Live Activity</span>
                    <strong>{target.isLiveActivityRunning ? "Active" : "Off"}</strong>
                  </div>
                </div>

                {target.lastCommand ? (
                  <div className="studio-app-remote-widget-status-copy">
                    <strong>{target.lastCommand.message}</strong>
                    <span>{formatDateTime(target.lastCommand.recordedAt)}</span>
                  </div>
                ) : null}

                {target.lastInteraction ? (
                  <div className="studio-app-remote-widget-status-copy">
                    <strong>{target.lastInteraction.message}</strong>
                    <span>
                      {getInteractionLabel(target.lastInteraction)} ·{" "}
                      {formatDateTime(target.lastInteraction.recordedAt)}
                    </span>
                  </div>
                ) : null}

                <div className="studio-app-sheet-actions">
                  {getAppShellPresentationRemoteTarget(target.storageKey) ? (
                    <button
                      type="button"
                      className="studio-app-button studio-app-button--ghost"
                      disabled={submitting}
                      onClick={() => {
                        const remoteTarget = getAppShellPresentationRemoteTarget(
                          target.storageKey
                        );
                        if (!remoteTarget) {
                          return;
                        }
                        void navigate(remoteTarget.routePath);
                      }}
                    >
                      Open {target.displayName} remote
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="studio-app-button"
                    disabled={submitting}
                    onClick={() => {
                      setActionStorageKey(target.storageKey);
                      void handlePresentSetup();
                    }}
                  >
                    {submitting && actionStorageKey === target.storageKey
                      ? "Opening..."
                      : target.isConfigured
                        ? "Reconnect remote"
                        : "Connect remote"}
                  </button>
                  <button
                    type="button"
                    className="studio-app-button studio-app-button--ghost"
                    disabled={submitting}
                    onClick={() => {
                      if (target.isLiveActivityRunning) {
                        void handleStopLiveNotes(target.storageKey);
                        return;
                      }
                      void handleStartLiveNotes(target.storageKey);
                    }}
                  >
                    {submitting && actionStorageKey === target.storageKey
                      ? "Working..."
                      : target.isLiveActivityRunning
                        ? "Stop live notes"
                        : "Start live notes"}
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}

        {errorMessage ? <p className="studio-app-error">{errorMessage}</p> : null}

        <div className="studio-app-sheet-actions">
          <button
            type="button"
            className="studio-app-button studio-app-button--ghost"
            disabled={loading || submitting}
            onClick={() => {
              void loadStatus();
            }}
          >
            Refresh status
          </button>
        </div>
      </section>
    </section>
  );
};

export default RemoteWidgetSetupPage;
