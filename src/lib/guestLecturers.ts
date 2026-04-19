import { buildStudioAppUrl } from "./studioAppOrigin";
import type {
  GuestLecturerAccessSession,
  GuestLecturerAdminSession,
  GuestLecturerSubmission,
  GuestLecturerSubmissionInput,
  GuestLecturerWeek,
} from "../types/guestLecturers";

import {
  GUEST_LECTURER_APP_ROUTE,
  GUEST_LECTURER_BUILDING,
  GUEST_LECTURER_CAMPAIGN_KEY,
  GUEST_LECTURER_CAMPUS,
  GUEST_LECTURER_CARD_ID,
  GUEST_LECTURER_CARD_LOGO_URL,
  GUEST_LECTURER_CARD_MARK,
  GUEST_LECTURER_CARD_SUMMARY,
  GUEST_LECTURER_CARD_TITLE,
  GUEST_LECTURER_CLASS_END_HOUR,
  GUEST_LECTURER_CLASS_END_MINUTE,
  GUEST_LECTURER_CLASS_START_HOUR,
  GUEST_LECTURER_CLASS_START_MINUTE,
  GUEST_LECTURER_CONFIRMATION_COPY,
  GUEST_LECTURER_LOCATION_LABEL,
  GUEST_LECTURER_MAP_EMBED_SRC,
  GUEST_LECTURER_MAP_LINK,
  GUEST_LECTURER_OFF_WEEK_NUMBER,
  GUEST_LECTURER_ORGANISATION,
  GUEST_LECTURER_PAGE_SUMMARY,
  GUEST_LECTURER_PAGE_TITLE,
  GUEST_LECTURER_PUBLIC_ROUTE,
  GUEST_LECTURER_SEGMENT_LABEL,
  GUEST_LECTURER_TIME_LABEL,
  GUEST_LECTURER_TIMEZONE,
  GUEST_LECTURER_TOPIC_FIELD_LABEL,
  GUEST_LECTURER_TOPIC_FIELD_PLACEHOLDER,
  GUEST_LECTURER_WEEKS,
  getGuestLecturerWeek as getSharedGuestLecturerWeek,
} from "../../shared/guestLecturers.js";

type FetchErrorPayload = {
  message?: string;
};

type AccessSessionPayload = {
  accessible?: unknown;
  campaignKey?: unknown;
  expiresAt?: unknown;
};

type SubmissionPayload = {
  id?: unknown;
  campaignKey?: unknown;
  name?: unknown;
  email?: unknown;
  linkedinUrl?: unknown;
  topicPreference?: unknown;
  selectedWeeks?: unknown;
  createdAt?: unknown;
};

export const guestLecturerCampaignKey = GUEST_LECTURER_CAMPAIGN_KEY as string;
export const guestLecturerCardId = GUEST_LECTURER_CARD_ID as string;
export const guestLecturerCardMark = GUEST_LECTURER_CARD_MARK as string;
export const guestLecturerCardLogoUrl =
  GUEST_LECTURER_CARD_LOGO_URL as string;
export const guestLecturerCardTitle = GUEST_LECTURER_CARD_TITLE as string;
export const guestLecturerCardSummary = GUEST_LECTURER_CARD_SUMMARY as string;
export const guestLecturerPublicRoute = GUEST_LECTURER_PUBLIC_ROUTE as string;
export const guestLecturerAppRoute = GUEST_LECTURER_APP_ROUTE as string;
export const guestLecturerPageTitle = GUEST_LECTURER_PAGE_TITLE as string;
export const guestLecturerPageSummary = GUEST_LECTURER_PAGE_SUMMARY as string;
export const guestLecturerConfirmationCopy =
  GUEST_LECTURER_CONFIRMATION_COPY as string;
export const guestLecturerTopicFieldLabel =
  GUEST_LECTURER_TOPIC_FIELD_LABEL as string;
export const guestLecturerTopicFieldPlaceholder =
  GUEST_LECTURER_TOPIC_FIELD_PLACEHOLDER as string;
export const guestLecturerOrganisation = GUEST_LECTURER_ORGANISATION as string;
export const guestLecturerCampus = GUEST_LECTURER_CAMPUS as string;
export const guestLecturerBuilding = GUEST_LECTURER_BUILDING as string;
export const guestLecturerLocationLabel =
  GUEST_LECTURER_LOCATION_LABEL as string;
export const guestLecturerMapLink = GUEST_LECTURER_MAP_LINK as string;
export const guestLecturerMapEmbedSrc = GUEST_LECTURER_MAP_EMBED_SRC as string;
export const guestLecturerTimeLabel = GUEST_LECTURER_TIME_LABEL as string;
export const guestLecturerSegmentLabel = GUEST_LECTURER_SEGMENT_LABEL as string;
export const guestLecturerTimeZone = GUEST_LECTURER_TIMEZONE as string;
export const guestLecturerOffWeekNumber =
  GUEST_LECTURER_OFF_WEEK_NUMBER as number;
export const guestLecturerWeeks = GUEST_LECTURER_WEEKS as GuestLecturerWeek[];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildStudioAppUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? ((await response.json()) as FetchErrorPayload | T)
    : null;

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === "object" && "message" in payload
        ? (payload as FetchErrorPayload).message ||
            "Unable to complete this request right now."
        : "Unable to complete this request right now."
    );
  }

  return payload as T;
};

const mapAccessSession = (
  payload: AccessSessionPayload
): GuestLecturerAccessSession => ({
  accessible: Boolean(payload.accessible),
  campaignKey:
    typeof payload.campaignKey === "string"
      ? payload.campaignKey
      : guestLecturerCampaignKey,
  expiresAt: typeof payload.expiresAt === "string" ? payload.expiresAt : null,
});

const mapAdminSession = (
  payload: AccessSessionPayload
): GuestLecturerAdminSession => ({
  accessible: Boolean(payload.accessible),
  campaignKey:
    typeof payload.campaignKey === "string"
      ? payload.campaignKey
      : guestLecturerCampaignKey,
  expiresAt: typeof payload.expiresAt === "string" ? payload.expiresAt : null,
});

const normalizeWeekSelection = (value: unknown): number[] =>
  Array.isArray(value)
    ? [...new Set(value.map((item) => Number(item)).filter(Number.isInteger))].sort(
        (left, right) => left - right
      )
    : [];

const mapSubmission = (payload: SubmissionPayload): GuestLecturerSubmission => ({
  id: typeof payload.id === "string" ? payload.id : crypto.randomUUID(),
  campaignKey:
    typeof payload.campaignKey === "string"
      ? payload.campaignKey
      : guestLecturerCampaignKey,
  name: typeof payload.name === "string" ? payload.name : "",
  email: typeof payload.email === "string" ? payload.email : "",
  linkedinUrl: typeof payload.linkedinUrl === "string" ? payload.linkedinUrl : "",
  topicPreference:
    typeof payload.topicPreference === "string" ? payload.topicPreference : "",
  selectedWeeks: normalizeWeekSelection(payload.selectedWeeks),
  createdAt:
    typeof payload.createdAt === "string"
      ? payload.createdAt
      : new Date().toISOString(),
});

export const isGuestLecturerEmailValid = (value: string) =>
  EMAIL_PATTERN.test(value.trim());

export const normalizeGuestLecturerLinkedInUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return "";
  }

  const candidate = /^[a-z]+:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(candidate);
  } catch {
    throw new Error("Enter a valid LinkedIn URL.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const isLinkedInHost =
    hostname === "linkedin.com" ||
    hostname.endsWith(".linkedin.com") ||
    hostname === "lnkd.in" ||
    hostname.endsWith(".lnkd.in");

  if (!isLinkedInHost) {
    throw new Error("Enter a valid LinkedIn URL.");
  }

  parsedUrl.hash = "";
  return parsedUrl.toString();
};

export const getGuestLecturerWeek = (weekNumber: number) =>
  (getSharedGuestLecturerWeek(weekNumber) as GuestLecturerWeek | null) || null;

export const formatGuestLecturerWeekDate = (week: GuestLecturerWeek) =>
  new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: guestLecturerTimeZone,
  }).format(new Date(`${week.date}T12:00:00+10:00`));

export const getSelectedGuestLecturerWeeks = (selectedWeeks: number[]) =>
  guestLecturerWeeks.filter(
    (week) => selectedWeeks.includes(week.weekNumber) && !week.isOff
  );

export const getGuestLecturerAccessSession = async () =>
  mapAccessSession(
    await fetchJson<AccessSessionPayload>(
      "/api/rushi-personal-guest-lecturers/access"
    )
  );

export const unlockGuestLecturerAccess = async (code: string) =>
  mapAccessSession(
    await fetchJson<AccessSessionPayload>(
      "/api/rushi-personal-guest-lecturers/unlock",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      }
    )
  );

export const submitGuestLecturerEoi = async (
  input: GuestLecturerSubmissionInput
) => {
  const payload = await fetchJson<{ submission?: SubmissionPayload }>(
    "/api/rushi-personal-guest-lecturers/submissions",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!payload.submission) {
    throw new Error("Submission not returned.");
  }

  return mapSubmission(payload.submission);
};

export const getGuestLecturerAdminSession = async () =>
  mapAdminSession(
    await fetchJson<AccessSessionPayload>(
      "/api/rushi-personal-guest-lecturers/admin/session"
    )
  );

export const unlockGuestLecturerAdmin = async (passcode: string) =>
  mapAdminSession(
    await fetchJson<AccessSessionPayload>(
      "/api/rushi-personal-guest-lecturers/admin/unlock",
      {
        method: "POST",
        body: JSON.stringify({ passcode }),
      }
    )
  );

export const logoutGuestLecturerAdmin = async () =>
  mapAdminSession(
    await fetchJson<AccessSessionPayload>(
      "/api/rushi-personal-guest-lecturers/admin/logout",
      {
        method: "POST",
      }
    )
  );

export const listGuestLecturerSubmissions = async () => {
  const payload = await fetchJson<{ submissions?: SubmissionPayload[] }>(
    "/api/rushi-personal-guest-lecturers/admin/submissions"
  );

  return Array.isArray(payload.submissions)
    ? payload.submissions.map(mapSubmission)
    : [];
};

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

const formatUtcDateTime = (
  date: string,
  hour: number,
  minute: number
) => {
  const utcDate = new Date(
    `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00+10:00`
  );

  return utcDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
};

export const downloadGuestLecturerCalendar = (selectedWeeks: number[]) => {
  const weeks = getSelectedGuestLecturerWeeks(selectedWeeks);
  if (!weeks.length) {
    return;
  }

  const createdAt = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const events = weeks
    .map((week) => {
      const title = `UNSW AI Fluency class window - ${week.label}`;
      const description = [
        "EOI only. This calendar blocker marks the full class window.",
        `Guest lecture segment, if confirmed, is expected to run for ${guestLecturerSegmentLabel}.`,
        `Location: ${guestLecturerLocationLabel}`,
        `Map: ${guestLecturerMapLink}`,
      ].join("\n");

      return [
        "BEGIN:VEVENT",
        `UID:${week.date}-${week.weekNumber}@${guestLecturerCampaignKey}`,
        `DTSTAMP:${createdAt}`,
        `DTSTART:${formatUtcDateTime(
          week.date,
          GUEST_LECTURER_CLASS_START_HOUR as number,
          GUEST_LECTURER_CLASS_START_MINUTE as number
        )}`,
        `DTEND:${formatUtcDateTime(
          week.date,
          GUEST_LECTURER_CLASS_END_HOUR as number,
          GUEST_LECTURER_CLASS_END_MINUTE as number
        )}`,
        `SUMMARY:${escapeIcsText(title)}`,
        `DESCRIPTION:${escapeIcsText(description)}`,
        `LOCATION:${escapeIcsText(guestLecturerLocationLabel)}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rushi Studio//Guest Lecturers//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${guestLecturerTimeZone}`,
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  const weekSuffix = weeks.map((week) => week.weekNumber).join("-");
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `unsw-ai-fluency-weeks-${weekSuffix}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    window.URL.revokeObjectURL(downloadUrl);
  }, 0);
};
