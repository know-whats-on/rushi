import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioContent } from "../data/portfolioContent";
import {
  downloadGuestLecturerCalendar,
  formatGuestLecturerWeekDate,
  getGuestLecturerAccessSession,
  getSelectedGuestLecturerWeeks,
  guestLecturerBuilding,
  guestLecturerCampus,
  guestLecturerConfirmationCopy,
  guestLecturerCourseOutlineUrl,
  guestLecturerLocationLabel,
  guestLecturerMapEmbedSrc,
  guestLecturerMapLink,
  guestLecturerOrganisation,
  guestLecturerPageSummary,
  guestLecturerPageTitle,
  guestLecturerPublicRoute,
  guestLecturerSegmentLabel,
  guestLecturerTimeLabel,
  guestLecturerTopicFieldLabel,
  guestLecturerTopicFieldPlaceholder,
  guestLecturerWeeks,
  isGuestLecturerEmailValid,
  normalizeGuestLecturerLinkedInUrl,
  submitGuestLecturerEoi,
  unlockGuestLecturerAccess,
} from "../lib/guestLecturers";
import type { GuestLecturerSubmission } from "../types/guestLecturers";
import "../components/styles/PublicExperience.css";
import "../components/styles/DocumentStudio.css";
import "../components/styles/StudioLibrary.css";
import "../components/styles/GuestLecturers.css";

type StudioGuestLecturerPageProps = {
  portfolioHref?: string;
  studioHref?: string;
};

const GUEST_LECTURER_INLINE_MAP_MEDIA_QUERY =
  "(min-width: 960px) and (hover: hover) and (pointer: fine)";

const isAppleTouchDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (platform.includes("mac") && navigator.maxTouchPoints > 1)
  );
};

const getCalendarButtonLabel = (
  selectedWeekRecords: ReturnType<typeof getSelectedGuestLecturerWeeks>
) => {
  if (!selectedWeekRecords.length) {
    return "Select weeks to enable calendar blocker";
  }

  if (selectedWeekRecords.length === 1) {
    return `Download blocker for ${selectedWeekRecords[0].label}`;
  }

  return `Download blocker for ${selectedWeekRecords.length} weeks`;
};

const getWeekSummaryLabel = (week: { label: string; theme: string }) =>
  `${week.label} · ${week.theme}`;

const StudioGuestLecturerPage = ({
  portfolioHref = "/",
  studioHref = "/studio",
}: StudioGuestLecturerPageProps = {}) => {
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [accessSubmitPending, setAccessSubmitPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    linkedinUrl: "",
    topicPreference: "",
    website: "",
  });
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [submitPending, setSubmitPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showInlineMap, setShowInlineMap] = useState(false);
  const [submittedEoi, setSubmittedEoi] = useState<GuestLecturerSubmission | null>(
    null
  );

  useEffect(() => {
    let active = true;

    const loadAccess = async () => {
      try {
        setAccessLoading(true);
        setAccessError(null);
        const session = await getGuestLecturerAccessSession();

        if (!active) {
          return;
        }

        setAccessGranted(session.accessible);
      } catch (error) {
        if (!active) {
          return;
        }

        setAccessGranted(false);
        setAccessError(
          error instanceof Error
            ? error.message
            : "Unable to verify guest lecturer access right now."
        );
      } finally {
        if (active) {
          setAccessLoading(false);
        }
      }
    };

    void loadAccess();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(GUEST_LECTURER_INLINE_MAP_MEDIA_QUERY);

    const updateInlineMap = () => {
      setShowInlineMap(mediaQuery.matches && !isAppleTouchDevice());
    };

    updateInlineMap();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateInlineMap);
      return () => {
        mediaQuery.removeEventListener("change", updateInlineMap);
      };
    }

    mediaQuery.addListener(updateInlineMap);
    return () => {
      mediaQuery.removeListener(updateInlineMap);
    };
  }, []);

  const selectedWeekRecords = useMemo(
    () => getSelectedGuestLecturerWeeks(selectedWeeks),
    [selectedWeeks]
  );
  const calendarButtonLabel = useMemo(
    () => getCalendarButtonLabel(selectedWeekRecords),
    [selectedWeekRecords]
  );

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleWeek = (weekNumber: number) => {
    const week = guestLecturerWeeks.find((item) => item.weekNumber === weekNumber);
    if (!week || week.isOff) {
      return;
    }

    setSelectedWeeks((current) =>
      current.includes(weekNumber)
        ? current.filter((value) => value !== weekNumber)
        : [...current, weekNumber].sort((left, right) => left - right)
    );
  };

  const handleAccessUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = accessCode.trim();

    if (!normalizedCode) {
      setAccessError("Enter the guest lecturer access code to continue.");
      return;
    }

    try {
      setAccessSubmitPending(true);
      setAccessError(null);
      const session = await unlockGuestLecturerAccess(normalizedCode);
      setAccessGranted(session.accessible);
      setAccessCode("");
    } catch (error) {
      setAccessGranted(false);
      setAccessError(
        error instanceof Error
          ? error.message
          : "Unable to unlock guest lecturer access right now."
      );
    } finally {
      setAccessSubmitPending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!form.name.trim()) {
      setSubmitError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setSubmitError("Email is required.");
      return;
    }

    if (!isGuestLecturerEmailValid(form.email)) {
      setSubmitError("Enter a valid email address.");
      return;
    }

    let normalizedLinkedInUrl = "";

    try {
      normalizedLinkedInUrl = normalizeGuestLecturerLinkedInUrl(form.linkedinUrl);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Enter a valid LinkedIn URL."
      );
      return;
    }

    if (!selectedWeekRecords.length) {
      setSubmitError("Select at least one available week.");
      return;
    }

    try {
      setSubmitPending(true);
      const submission = await submitGuestLecturerEoi({
        name: form.name.trim(),
        email: form.email.trim(),
        linkedinUrl: normalizedLinkedInUrl,
        topicPreference: form.topicPreference.trim(),
        selectedWeeks: selectedWeekRecords.map((week) => week.weekNumber),
      });

      setSubmittedEoi(submission);
      setForm((current) => ({
        ...current,
        linkedinUrl: normalizedLinkedInUrl,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save your guest lecturer EOI right now.";

      if (message.toLowerCase().includes("access code")) {
        setAccessGranted(false);
        setAccessError(message);
      } else {
        setSubmitError(message);
      }
    } finally {
      setSubmitPending(false);
    }
  };

  return (
    <main className="studio-page studio-page--public">
      <header className="studio-topbar studio-library-topbar">
        <Link to={portfolioHref} className="studio-topbar-brand">
          {portfolioContent.meta.initials}
        </Link>
        <a
          href={portfolioContent.contact.linkedin}
          className="studio-library-topbar-linkedin"
          target="_blank"
          rel="noreferrer"
        >
          {portfolioContent.meta.linkedinDisplay}
        </a>
        <nav className="studio-topbar-links">
          <Link to={portfolioHref}>Portfolio</Link>
          <Link to={studioHref}>Studio</Link>
        </nav>
      </header>

      <section className="public-page studio-guest-page">
        <section className="public-hero studio-guest-hero">
          <p className="public-eyebrow">UNSW Sydney</p>
          <h1>{guestLecturerPageTitle}</h1>
          <p>
            {guestLecturerPageSummary}{" "}
            <a href={guestLecturerCourseOutlineUrl} target="_blank" rel="noreferrer">
              See the weekly course schedule.
            </a>
          </p>
          <div className="public-action-row">
            <span className="public-status">EOI only</span>
          </div>
        </section>

        <section className="public-grid public-grid--two studio-guest-grid">
          <section className="public-panel studio-guest-form-panel">
            {accessLoading ? (
              <div className="public-confirmation">
                <h2>Checking access...</h2>
                <p>Loading the current guest lecturer access state.</p>
              </div>
            ) : !accessGranted ? (
              <div className="public-confirmation">
                <div className="studio-guest-panel-heading">
                  <div>
                    <p className="studio-library-label">Guest Access</p>
                    <h2>Enter the guest access code to continue.</h2>
                  </div>
                </div>
                <p>
                  If you have been invited to submit an EOI, enter the guest
                  access code below to unlock the form directly on this page.
                </p>
                <form className="public-form studio-guest-access-form" onSubmit={handleAccessUnlock}>
                  <label>
                    Guest access code
                    <input
                      type="password"
                      value={accessCode}
                      onChange={(event) => {
                        setAccessCode(event.target.value);
                        if (accessError) {
                          setAccessError(null);
                        }
                      }}
                      autoComplete="current-password"
                      placeholder="Enter guest access code"
                    />
                  </label>
                  {accessError ? <p className="public-error-copy">{accessError}</p> : null}
                  <div className="public-action-row">
                    <button
                      className="public-button"
                      type="submit"
                      disabled={accessSubmitPending || !accessCode.trim()}
                    >
                      {accessSubmitPending ? "Unlocking..." : "Unlock EOI form"}
                    </button>
                    <Link className="public-button public-button--secondary" to={studioHref}>
                      Go to studio
                    </Link>
                    <Link className="public-button public-button--secondary" to={portfolioHref}>
                      Back to portfolio
                    </Link>
                  </div>
                </form>
              </div>
            ) : submittedEoi ? (
              <div className="public-confirmation">
                <div className="studio-guest-panel-heading">
                  <div>
                    <p className="studio-library-label">EOI Received</p>
                    <h2>Thanks for putting your hand up.</h2>
                  </div>
                </div>
                <p>{guestLecturerConfirmationCopy}</p>
                <div className="studio-guest-selected-weeks">
                  {selectedWeekRecords.map((week) => (
                    <span key={week.weekNumber} className="studio-guest-week-pill">
                      {getWeekSummaryLabel(week)}
                    </span>
                  ))}
                </div>
                <div className="public-action-row">
                  <button
                    type="button"
                    className="public-button"
                    onClick={() => downloadGuestLecturerCalendar(selectedWeeks)}
                  >
                    {calendarButtonLabel}
                  </button>
                  <Link className="public-button public-button--secondary" to={studioHref}>
                    Back to studio
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="studio-guest-panel-heading">
                  <div>
                    <p className="studio-library-label">Guest Lecturer EOI</p>
                    <h2>Choose the weeks that could work for you.</h2>
                  </div>
                </div>

                <div className="studio-guest-week-grid" role="group" aria-label="Available weeks">
                  {guestLecturerWeeks.map((week) => {
                    const isSelected = selectedWeeks.includes(week.weekNumber);

                    return (
                      <button
                        key={week.weekNumber}
                        type="button"
                        className={`studio-guest-week-card${
                          isSelected ? " is-selected" : ""
                        }${week.isOff ? " is-off" : ""}`}
                        onClick={() => toggleWeek(week.weekNumber)}
                        disabled={week.isOff}
                        aria-pressed={isSelected}
                      >
                        <span>{week.label}</span>
                        <strong>{formatGuestLecturerWeekDate(week)}</strong>
                        <p className="studio-guest-week-theme">{week.theme}</p>
                        <small>
                          {week.isOff ? "Off week" : `${guestLecturerTimeLabel}`}
                        </small>
                      </button>
                    );
                  })}
                </div>

                <form className="public-form" onSubmit={handleSubmit}>
                  <div className="public-field-grid">
                    <label>
                      Name
                      <input
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        autoComplete="name"
                        placeholder="Your name"
                      />
                    </label>

                    <label>
                      Email
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        autoComplete="email"
                        placeholder="name@company.com"
                      />
                    </label>

                    <label className="public-field-span-2">
                      LinkedIn URL
                      <input
                        value={form.linkedinUrl}
                        onChange={(event) =>
                          updateField("linkedinUrl", event.target.value)
                        }
                        autoComplete="url"
                        placeholder="linkedin.com/in/your-name"
                      />
                    </label>

                    <label className="public-field-span-2">
                      {guestLecturerTopicFieldLabel}
                      <textarea
                        rows={5}
                        value={form.topicPreference}
                        onChange={(event) =>
                          updateField("topicPreference", event.target.value)
                        }
                        placeholder={guestLecturerTopicFieldPlaceholder}
                      />
                    </label>

                    <label className="public-input-honeypot" aria-hidden="true">
                      Website
                      <input
                        value={form.website}
                        onChange={(event) => updateField("website", event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>

                  {submitError ? <p className="public-error-copy">{submitError}</p> : null}

                  <p className="studio-guest-submit-note">
                    Thanks for your interest in contributing to AI Fluency.
                    Submitting an EOI does not guarantee a guest lecturing slot,
                    but it helps Rushi plan the session well, understand how much
                    of the class he should cover himself, and make sure students
                    have a strong experience.
                  </p>

                  <div className="public-action-row">
                    <button className="public-button" type="submit" disabled={submitPending}>
                      {submitPending ? "Submitting..." : "Share EOI"}
                    </button>
                    <button
                      type="button"
                      className="public-button public-button--secondary"
                      onClick={() => downloadGuestLecturerCalendar(selectedWeeks)}
                      disabled={!selectedWeekRecords.length}
                    >
                      {calendarButtonLabel}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>

          <aside className="public-panel public-panel--sticky studio-guest-side-panel">
            <div className="studio-guest-panel-heading">
              <div>
                <p className="studio-library-label">Class Details</p>
                <h2>{guestLecturerOrganisation}</h2>
              </div>
            </div>

            <div className="public-meta-list studio-guest-meta-list">
              <div>
                <span>Location</span>
                <strong>{guestLecturerCampus}</strong>
                <p>{guestLecturerBuilding}</p>
              </div>
              <div>
                <span>Time</span>
                <strong>{guestLecturerTimeLabel}</strong>
                <p>Guest lecture slot is typically {guestLecturerSegmentLabel}.</p>
              </div>
              <div>
                <span>Selected weeks</span>
                <strong>
                  {selectedWeekRecords.length
                    ? `${selectedWeekRecords.length} selected`
                    : "Select one or more available weeks"}
                </strong>
                <div className="studio-guest-selected-weeks">
                  {selectedWeekRecords.map((week) => (
                    <span key={week.weekNumber} className="studio-guest-week-pill">
                      {getWeekSummaryLabel(week)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="studio-guest-map-frame">
              {showInlineMap ? (
                <iframe
                  src={guestLecturerMapEmbedSrc}
                  title="Map by MazeMap"
                  loading="lazy"
                />
              ) : (
                <div className="studio-guest-map-fallback">
                  <p className="studio-library-label">Campus map</p>
                  <strong>{guestLecturerBuilding}</strong>
                  <p>
                    Open the interactive map in a new tab on phones and touch
                    devices for a lighter, more reliable experience.
                  </p>
                </div>
              )}
            </div>

            <div className="public-action-row">
              <a
                href={guestLecturerMapLink}
                className="public-button"
                target="_blank"
                rel="noreferrer"
              >
                Open Map
              </a>
              <a
                href={guestLecturerPublicRoute}
                className="public-button public-button--secondary"
              >
                Refresh Page
              </a>
            </div>

            <p className="studio-guest-side-note">
              {guestLecturerLocationLabel}. The calendar blocker reserves the full
              class window from {guestLecturerTimeLabel}.
            </p>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default StudioGuestLecturerPage;
