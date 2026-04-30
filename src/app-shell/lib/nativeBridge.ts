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

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Copy is not available.");
  }
};

export const openStudioExternalUrl = async (url: string) => {
  if (isNativeStudioApp()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({
      url,
    });
    return;
  }

  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (!openedWindow) {
    window.location.assign(url);
  }
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
