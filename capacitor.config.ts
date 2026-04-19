import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.knowwhatson.rushistudio",
  appName: "Rushi's Studio",
  webDir: "dist-ios",
  bundledWebRuntime: false,
  ios: {
    backgroundColor: "#050912",
    contentInset: "never",
  },
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith("http://"),
          allowNavigation: (() => {
            try {
              return [new URL(serverUrl).hostname];
            } catch {
              return [];
            }
          })(),
        },
      }
    : {}),
};

export default config;
