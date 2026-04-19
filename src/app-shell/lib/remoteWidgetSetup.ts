import { registerPlugin } from "@capacitor/core";

export interface RemoteWidgetSetupTargetStatus {
  storageKey: string;
  displayName: string;
  shortDisplayName: string;
  code: string;
  sessionId: string;
  isConfigured: boolean;
  isExpired: boolean;
  needsSetup: boolean;
  expiresAt: string | null;
  liveStateStatus: "waiting" | "live" | "stale" | "notesUnavailable";
  isLiveActivityRunning: boolean;
  lastCommand: {
    command: string;
    message: string;
    succeeded: boolean;
    recordedAt: string;
  } | null;
  lastInteraction: {
    kind: "remoteCommand" | "notesPage";
    stage: "invoked" | "delivered" | "failed" | "settled" | "noOp" | "localOnly";
    commandId: string | null;
    command: string | null;
    direction: string | null;
    message: string;
    recordedAt: string;
  } | null;
}

export interface RemoteWidgetSetupStatus extends RemoteWidgetSetupTargetStatus {
  targets: RemoteWidgetSetupTargetStatus[];
  activeLiveActivityTarget: string | null;
}

export interface PendingRemoteLaunchTarget {
  storageKey: string;
  code: string;
  sessionId: string;
  displayName: string;
  shortDisplayName: string;
  routePath: string;
  remoteLabel: string;
}

export interface RemoteWidgetSetupPlugin {
  getStatus(): Promise<RemoteWidgetSetupStatus>;
  presentSetup(): Promise<RemoteWidgetSetupStatus>;
  startLiveNotes(options: { storageKey: string }): Promise<RemoteWidgetSetupStatus>;
  stopLiveNotes(): Promise<RemoteWidgetSetupStatus>;
  consumePendingRemoteLaunch(): Promise<Partial<PendingRemoteLaunchTarget>>;
}

const unavailable = async (): Promise<never> => {
  throw new Error("The widget remote setup is only available in the iOS app.");
};

export const remoteWidgetSetup = registerPlugin<RemoteWidgetSetupPlugin>(
  "RemoteWidgetSetup",
  {
    web: () => ({
      getStatus: unavailable,
      presentSetup: unavailable,
      startLiveNotes: unavailable,
      stopLiveNotes: unavailable,
      consumePendingRemoteLaunch: unavailable,
    }),
  }
);
