const DEFAULT_STUDIO_APP_ORIGIN = "https://rushi.knowwhatson.com";

export const NETWORKING_URL = `${DEFAULT_STUDIO_APP_ORIGIN}/`;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getStudioAppOrigin = () => {
  const configuredOrigin = import.meta.env.VITE_STUDIO_APP_SITE_ORIGIN?.trim();

  if (configuredOrigin) {
    return trimTrailingSlash(configuredOrigin);
  }

  if (typeof window !== "undefined") {
    const { origin, protocol } = window.location;

    if (protocol === "http:" || protocol === "https:") {
      return trimTrailingSlash(origin);
    }
  }

  return trimTrailingSlash(DEFAULT_STUDIO_APP_ORIGIN);
};

export const buildStudioAppUrl = (path: string) =>
  `${getStudioAppOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
