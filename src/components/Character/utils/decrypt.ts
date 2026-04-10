async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  const canUseBrowserDecryption =
    typeof window !== "undefined" &&
    window.isSecureContext &&
    typeof crypto !== "undefined" &&
    Boolean(crypto.subtle);

  if (!canUseBrowserDecryption) {
    const fallbackResponse = await fetch("/models/character.glb?v=2");
    return fallbackResponse.arrayBuffer();
  }

  try {
    const response = await fetch(url);
    const encryptedData = await response.arrayBuffer();
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  } catch (error) {
    console.warn("Falling back to static model asset.", error);
    const fallbackResponse = await fetch("/models/character.glb?v=2");
    return fallbackResponse.arrayBuffer();
  }
};
