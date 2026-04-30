import {
  RHEEM_CERTIFICATE_COMPLETION_LINE,
  RHEEM_CERTIFICATE_EVENT_LINE,
  RHEEM_CERTIFICATE_EXPORT_HEIGHT,
  RHEEM_CERTIFICATE_EXPORT_WIDTH,
  RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL,
  RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION,
  RHEEM_CERTIFICATE_PRESENTER_SIGNATURE_URL,
  RHEEM_CERTIFICATE_PRESENTER_TITLE,
  RHEEM_CERTIFICATE_PROGRAM_TITLE,
  RHEEM_CERTIFICATE_TITLE,
} from "../data/rheemCertificate";
import { RHEEM_PROJECT_PDF_LOGO_URL } from "../data/rheemProject";

// The export width/height already represent the final PNG dimensions we want.
// Rendering above 1x here can push mobile browsers into oversized canvases and
// make large certificate exports hang or fail.
const CERTIFICATE_CAPTURE_SCALE = 1;
const MOBILE_EXPORT_MAX_WIDTH = 1800;

type RheemArtworkDownloadTransport = {
  targetWindow: Window;
} | null;

const canSharePngFile = (file: File) =>
  typeof navigator !== "undefined" &&
  typeof navigator.share === "function" &&
  typeof navigator.canShare === "function" &&
  navigator.canShare({ files: [file] });

const isMobileBrowser = () =>
  typeof window !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

const supportsPngFileShare = () => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.share !== "function" ||
    typeof navigator.canShare !== "function"
  ) {
    return false;
  }

  try {
    const probeFile = new File([""], "certificate.png", {
      type: "image/png",
    });

    return navigator.canShare({ files: [probeFile] });
  } catch {
    return false;
  }
};

const waitForNextPaint = async () => {
  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
};

const waitForElementImages = async (element: HTMLElement) => {
  const images = Array.from(element.querySelectorAll<HTMLImageElement>("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve, reject) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          const handleLoad = () => {
            cleanup();
            resolve();
          };
          const handleError = () => {
            cleanup();
            reject(new Error("Certificate artwork is still loading."));
          };
          const cleanup = () => {
            image.removeEventListener("load", handleLoad);
            image.removeEventListener("error", handleError);
          };

          image.addEventListener("load", handleLoad, { once: true });
          image.addEventListener("error", handleError, { once: true });
        })
    )
  );
};

const rasterizeSignatureForExport = async ({
  sourceArtwork,
  exportArtwork,
}: {
  sourceArtwork: HTMLDivElement;
  exportArtwork: HTMLDivElement;
}) => {
  const sourceSignature = sourceArtwork.querySelector<HTMLImageElement>(
    ".rheem-certificate-artwork__signature"
  );
  const exportSignature = exportArtwork.querySelector<HTMLImageElement>(
    ".rheem-certificate-artwork__signature"
  );

  if (!sourceSignature || !exportSignature || !sourceSignature.complete) {
    return;
  }

  const signatureWidth = Math.max(
    1,
    Math.round(parseFloat(window.getComputedStyle(sourceSignature).width) || 0)
  );
  const signatureHeight = Math.max(
    1,
    Math.round(parseFloat(window.getComputedStyle(sourceSignature).height) || 0)
  );

  if (!signatureWidth || !signatureHeight) {
    return;
  }

  const rasterScale = 3;
  const canvas = window.document.createElement("canvas");
  canvas.width = signatureWidth * rasterScale;
  canvas.height = signatureHeight * rasterScale;

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sourceSignature, 0, 0, canvas.width, canvas.height);

  exportSignature.src = canvas.toDataURL("image/png");
  exportSignature.style.width = `${signatureWidth}px`;
  exportSignature.style.height = `${signatureHeight}px`;
  exportSignature.width = signatureWidth;
  exportSignature.height = signatureHeight;
};

export const prepareRheemArtworkDownloadTransport =
  (): RheemArtworkDownloadTransport => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!isMobileBrowser() || supportsPngFileShare()) {
      return null;
    }

    const targetWindow = window.open("", "_blank");

    if (!targetWindow) {
      return null;
    }

    try {
      targetWindow.document.title = "Preparing certificate";
      targetWindow.document.body.innerHTML =
        "<div style=\"font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px 20px; color: #2a1112; background: #fbf4e8; line-height: 1.5;\">Preparing your PNG…</div>";
    } catch {
      // Ignore write failures and just reuse the blank window.
    }

    return { targetWindow };
  };

const downloadBlob = async (
  blob: Blob,
  filename: string,
  downloadTransport: RheemArtworkDownloadTransport
) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const file = new File([blob], filename, {
    type: blob.type || "image/png",
  });

  try {
    if (canSharePngFile(file)) {
      try {
        await navigator.share({
          title: filename,
          files: [file],
        });
        downloadTransport?.targetWindow.close();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          downloadTransport?.targetWindow.close();
          return;
        }
      }
    }

    if (isMobileBrowser()) {
      if (downloadTransport?.targetWindow && !downloadTransport.targetWindow.closed) {
        downloadTransport.targetWindow.location.replace(downloadUrl);
        return;
      }

      const openedWindow = window.open(
        downloadUrl,
        "_blank",
        "noopener,noreferrer"
      );

      if (!openedWindow) {
        window.location.assign(downloadUrl);
      }
      return;
    }

    const link = window.document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener";
    window.document.body.append(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
  }
};

const loadImageAsset = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Certificate artwork is still loading."));
    image.src = src;
  });

const loadCertificateFonts = async () => {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  const fontFaceSet = document.fonts;

  await Promise.allSettled([
    fontFaceSet.load('700 78px "Geist"'),
    fontFaceSet.load('700 420px "Geist"'),
    fontFaceSet.load('600 132px "Geist"'),
    fontFaceSet.load('400 42px "Geist"'),
    fontFaceSet.load('400 152px "Iowan Old Style"'),
    fontFaceSet.ready,
  ]);
};

const drawRoundedRectPath = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const nextRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

  context.beginPath();
  context.moveTo(x + nextRadius, y);
  context.lineTo(x + width - nextRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + nextRadius);
  context.lineTo(x + width, y + height - nextRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - nextRadius,
    y + height
  );
  context.lineTo(x + nextRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - nextRadius);
  context.lineTo(x, y + nextRadius);
  context.quadraticCurveTo(x, y, x + nextRadius, y);
  context.closePath();
};

const strokeRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) => {
  context.save();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  drawRoundedRectPath(context, x, y, width, height, radius);
  context.stroke();
  context.restore();
};

const drawTrackedText = ({
  align = "center",
  color,
  context,
  font,
  letterSpacing,
  text,
  x,
  y,
}: {
  align?: CanvasTextAlign;
  color: string;
  context: CanvasRenderingContext2D;
  font: string;
  letterSpacing: number;
  text: string;
  x: number;
  y: number;
}) => {
  context.save();
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "alphabetic";

  const characters = Array.from(text);
  const trackedWidth = characters.reduce((width, character, index) => {
    const characterWidth = context.measureText(character).width;
    return width + characterWidth + (index < characters.length - 1 ? letterSpacing : 0);
  }, 0);

  let drawX = x;
  if (align === "center") {
    drawX = x - trackedWidth / 2;
  } else if (align === "right" || align === "end") {
    drawX = x - trackedWidth;
  }

  characters.forEach((character, index) => {
    context.fillText(character, drawX, y);
    drawX += context.measureText(character).width;
    if (index < characters.length - 1) {
      drawX += letterSpacing;
    }
  });

  context.restore();
};

const fitCanvasFontSize = ({
  context,
  fontFamily,
  fontWeight,
  maxWidth,
  minSize,
  startSize,
  text,
}: {
  context: CanvasRenderingContext2D;
  fontFamily: string;
  fontWeight: number | string;
  maxWidth: number;
  minSize: number;
  startSize: number;
  text: string;
}) => {
  for (let size = startSize; size >= minSize; size -= 4) {
    context.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (context.measureText(text).width <= maxWidth) {
      return size;
    }
  }

  return minSize;
};

export const exportRheemCertificateCanvasPng = async ({
  downloadTransport = null,
  filename,
  participantName,
}: {
  downloadTransport?: RheemArtworkDownloadTransport;
  filename: string;
  participantName: string;
}) => {
  await loadCertificateFonts();

  const [signatureImage, logoImage] = await Promise.all([
    loadImageAsset(RHEEM_CERTIFICATE_PRESENTER_SIGNATURE_URL),
    loadImageAsset(RHEEM_PROJECT_PDF_LOGO_URL),
  ]);

  const canvas = window.document.createElement("canvas");
  canvas.width = RHEEM_CERTIFICATE_EXPORT_WIDTH;
  canvas.height = RHEEM_CERTIFICATE_EXPORT_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to prepare the certificate right now.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.fillStyle = "#fbf4e8";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const backgroundGradient = context.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );
  backgroundGradient.addColorStop(0, "#fbf4e8");
  backgroundGradient.addColorStop(0.52, "#f3e8d6");
  backgroundGradient.addColorStop(1, "#fff9f1");
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const redGlow = context.createRadialGradient(392, 356, 0, 392, 356, 840);
  redGlow.addColorStop(0, "rgba(178, 31, 36, 0.11)");
  redGlow.addColorStop(1, "rgba(178, 31, 36, 0)");
  context.fillStyle = redGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const goldGlow = context.createRadialGradient(2352, 198, 0, 2352, 198, 540);
  goldGlow.addColorStop(0, "rgba(207, 167, 99, 0.2)");
  goldGlow.addColorStop(1, "rgba(207, 167, 99, 0)");
  context.fillStyle = goldGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sheen = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.38)");
  sheen.addColorStop(0.4, "rgba(255, 255, 255, 0)");
  context.fillStyle = sheen;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#b3161d";
  context.fillRect(0, 0, canvas.width, 168);

  strokeRoundedRect(context, 36, 36, 2728, 1908, 42, "#a9151c", 26);
  strokeRoundedRect(context, 92, 92, 2616, 1796, 24, "rgba(201, 157, 81, 0.84)", 6);
  strokeRoundedRect(context, 122, 122, 2556, 1736, 18, "rgba(170, 118, 43, 0.52)", 1);

  context.save();
  context.font =
    '700 420px "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  context.fillStyle = "rgba(161, 31, 35, 0.055)";
  context.fillText("2026", 1715, 1850);
  context.restore();

  drawTrackedText({
    color: "#962125",
    context,
    font: '700 78px "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    letterSpacing: 18,
    text: RHEEM_CERTIFICATE_TITLE.toUpperCase(),
    x: canvas.width / 2,
    y: 505,
  });

  const nameFontFamily =
    '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
  const nameFontSize = fitCanvasFontSize({
    context,
    fontFamily: nameFontFamily,
    fontWeight: 400,
    maxWidth: 1700,
    minSize: 98,
    startSize: 152,
    text: participantName,
  });
  context.save();
  context.font = `400 ${nameFontSize}px ${nameFontFamily}`;
  context.fillStyle = "#681618";
  context.textAlign = "center";
  context.fillText(participantName, canvas.width / 2, 690);
  context.restore();

  context.save();
  context.strokeStyle = "rgba(170, 118, 43, 0.42)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(460, 776);
  context.lineTo(2340, 776);
  context.stroke();
  context.restore();

  context.save();
  context.font =
    '400 42px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
  context.fillStyle = "rgba(84, 39, 28, 0.82)";
  context.textAlign = "center";
  context.fillText(RHEEM_CERTIFICATE_COMPLETION_LINE, canvas.width / 2, 862);
  context.restore();

  const programFontSize = fitCanvasFontSize({
    context,
    fontFamily:
      '"Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: 600,
    maxWidth: 1560,
    minSize: 92,
    startSize: 132,
    text: RHEEM_CERTIFICATE_PROGRAM_TITLE,
  });
  context.save();
  context.font =
    `600 ${programFontSize}px "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.fillStyle = "#2a1112";
  context.textAlign = "center";
  context.fillText(RHEEM_CERTIFICATE_PROGRAM_TITLE, canvas.width / 2, 1045);
  context.restore();

  drawTrackedText({
    color: "rgba(63, 29, 17, 0.74)",
    context,
    font: '400 42px "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    letterSpacing: 10,
    text: RHEEM_CERTIFICATE_EVENT_LINE.toUpperCase(),
    x: canvas.width / 2,
    y: 1188,
  });

  const signatureWidth = 620;
  const signatureHeight = Math.round(
    signatureWidth * (signatureImage.naturalHeight / signatureImage.naturalWidth)
  );
  context.drawImage(signatureImage, 154, 1452, signatureWidth, signatureHeight);

  context.save();
  context.font =
    '400 32px "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  context.fillStyle = "rgba(84, 39, 28, 0.76)";
  context.fillText(RHEEM_CERTIFICATE_PRESENTER_TITLE, 170, 1748);
  context.fillText(RHEEM_CERTIFICATE_PRESENTER_ORGANIZATION, 170, 1798);
  context.fillStyle = "rgba(84, 30, 18, 0.9)";
  context.fillText(RHEEM_CERTIFICATE_PRESENTER_CREDENTIAL, 170, 1848);
  context.restore();

  context.drawImage(logoImage, 2310, 1512, 328, 328);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    throw new Error("Unable to create the PNG right now.");
  }

  await downloadBlob(blob, filename, downloadTransport);
};

export const exportRheemArtworkPng = async ({
  backgroundColor,
  downloadTransport = null,
  filename,
  height,
  sourceArtwork,
  width,
}: {
  backgroundColor: string;
  downloadTransport?: RheemArtworkDownloadTransport;
  filename: string;
  height: number;
  sourceArtwork: HTMLDivElement;
  width: number;
}) => {
  const exportScaleFactor =
    isMobileBrowser() && width > MOBILE_EXPORT_MAX_WIDTH
      ? MOBILE_EXPORT_MAX_WIDTH / width
      : 1;
  const exportWidth = Math.max(1, Math.round(width * exportScaleFactor));
  const exportHeight = Math.max(1, Math.round(height * exportScaleFactor));
  const exportSurface = window.document.createElement("div");
  exportSurface.setAttribute("aria-hidden", "true");
  exportSurface.className = "rheem-certificate-export-surface";
  exportSurface.style.setProperty("--rheem-export-width", `${exportWidth}px`);
  exportSurface.style.setProperty("--rheem-export-height", `${exportHeight}px`);
  exportSurface.style.overflow = "hidden";

  const exportArtwork = sourceArtwork.cloneNode(true) as HTMLDivElement;
  if (exportScaleFactor !== 1) {
    exportArtwork.style.transformOrigin = "top left";
    exportArtwork.style.transform = `scale(${exportScaleFactor})`;
  }
  exportSurface.append(exportArtwork);
  window.document.body.append(exportSurface);

  try {
    await document.fonts.ready;
    await rasterizeSignatureForExport({
      sourceArtwork,
      exportArtwork,
    });
    await waitForElementImages(exportSurface);
    await waitForNextPaint();
    await waitForNextPaint();

    const { default: html2canvas } = await import("html2canvas");
    const scale = Math.max(
      1,
      Math.min(window.devicePixelRatio || 1, CERTIFICATE_CAPTURE_SCALE)
    );
    const canvas = await html2canvas(exportSurface, {
      backgroundColor,
      height: exportHeight,
      imageTimeout: 15000,
      logging: false,
      scale,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      width: exportWidth,
      windowHeight: exportHeight,
      windowWidth: exportWidth,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!blob) {
      throw new Error("Unable to create the PNG right now.");
    }

    await downloadBlob(blob, filename, downloadTransport);
  } finally {
    exportSurface.remove();
  }
};
