export type AppShellPresentationRemoteTarget = {
  storageKey: string;
  code: string;
  sessionId: string;
  displayName: string;
  shortDisplayName: string;
  routePath: string;
  remoteLabel: string;
};

export const appShellPresentationRemoteTargets: AppShellPresentationRemoteTarget[] = [
  {
    storageKey: "INFS5700_PUBLIC",
    code: "INFS5700",
    sessionId: "PUBLIC",
    displayName: "INFS5700",
    shortDisplayName: "INFS",
    routePath: "/remote/infs5700",
    remoteLabel: "INFS5700 Remote",
  },
  {
    storageKey: "RHEEMPRESSO_PUBLIC",
    code: "RHEEMPRESSO",
    sessionId: "PUBLIC",
    displayName: "RHEEMPRESSO",
    shortDisplayName: "Rheem",
    routePath: "/remote/rheempresso",
    remoteLabel: "RHEEMPRESSO Remote",
  },
];

export const getAppShellPresentationRemoteTarget = (
  storageKey: string
) =>
  appShellPresentationRemoteTargets.find((target) => target.storageKey === storageKey) ?? null;
