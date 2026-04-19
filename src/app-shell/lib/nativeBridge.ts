import { Capacitor } from "@capacitor/core";

export const isNativeStudioApp = () => Capacitor.isNativePlatform();

export const canShareStudioLink = () =>
  isNativeStudioApp() ||
  (typeof navigator !== "undefined" && typeof navigator.share === "function");

export const copyStudioText = async (value: string) => {
  if (isNativeStudioApp()) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({
      string: value,
    });
    return;
  }

  await navigator.clipboard.writeText(value);
};

export const openStudioExternalUrl = async (url: string) => {
  if (isNativeStudioApp()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({
      url,
    });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

export const shareStudioLink = async ({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) => {
  if (isNativeStudioApp()) {
    const { Share } = await import("@capacitor/share");
    await Share.share({
      title,
      text,
      url,
    });
    return;
  }

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    await navigator.share({
      title,
      text,
      url,
    });
  }
};
