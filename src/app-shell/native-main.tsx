import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NativeAppShell from "./NativeAppShell";
import "../index.css";
import "../components/styles/DocumentStudio.css";

const createFallbackRandomUUID = () => {
  const cryptoObject = globalThis.crypto;
  const bytes = new Uint8Array(16);

  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
};

if (typeof globalThis !== "undefined" && globalThis.crypto) {
  const cryptoObject = globalThis.crypto as Crypto & {
    randomUUID?: () => string;
  };

  if (typeof cryptoObject.randomUUID !== "function") {
    Object.defineProperty(cryptoObject, "randomUUID", {
      value: createFallbackRandomUUID,
      configurable: true,
    });
  }
}

createRoot(document.getElementById("app-shell-root")!).render(
  <StrictMode>
    <NativeAppShell />
  </StrictMode>
);
