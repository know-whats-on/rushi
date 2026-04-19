import { useEffect, useMemo, useState } from "react";
import {
  formatGuestLecturerWeekDate,
  getGuestLecturerAdminSession,
  getGuestLecturerWeek,
  guestLecturerPageTitle,
  guestLecturerWeeks,
  listGuestLecturerSubmissions,
  logoutGuestLecturerAdmin,
  unlockGuestLecturerAdmin,
} from "../../lib/guestLecturers";
import type { GuestLecturerSubmission } from "../../types/guestLecturers";

const adminDateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

const formatSubmittedAt = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return adminDateFormatter.format(parsed);
};

const GuestLecturerAdminPage = () => {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAccessible, setIsAccessible] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<GuestLecturerSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeWeekFilter, setActiveWeekFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        setSessionLoading(true);
        const session = await getGuestLecturerAdminSession();

        if (!active) {
          return;
        }

        setIsAccessible(session.accessible);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoginError(
          error instanceof Error
            ? error.message
            : "Unable to verify admin access right now."
        );
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadSubmissionData = async () => {
      if (!isAccessible) {
        return;
      }

      try {
        setLoadingSubmissions(true);
        setLoadError(null);
        const nextSubmissions = await listGuestLecturerSubmissions();

        if (!active) {
          return;
        }

        setSubmissions(nextSubmissions);
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load guest lecturer submissions right now.";

        if (message.toLowerCase().includes("passcode")) {
          setIsAccessible(false);
          setLoginError(message);
        } else {
          setLoadError(message);
        }
      } finally {
        if (active) {
          setLoadingSubmissions(false);
        }
      }
    };

    void loadSubmissionData();

    return () => {
      active = false;
    };
  }, [isAccessible]);

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return submissions.filter((submission) => {
      if (
        activeWeekFilter !== "all" &&
        !submission.selectedWeeks.includes(activeWeekFilter)
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        submission.name,
        submission.email,
        submission.linkedinUrl,
        submission.topicPreference,
        submission.selectedWeeks.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activeWeekFilter, searchQuery, submissions]);

  const weeksWithInterest = useMemo(
    () =>
      new Set(submissions.flatMap((submission) => submission.selectedWeeks)).size,
    [submissions]
  );

  const latestSubmission = submissions[0] || null;

  const handleLogin = async () => {
    try {
      setLoginPending(true);
      setLoginError(null);
      const session = await unlockGuestLecturerAdmin(passcode);
      setIsAccessible(session.accessible);

      if (!session.accessible) {
        setLoginError("Incorrect admin passcode.");
      }
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Unable to unlock admin access right now."
      );
    } finally {
      setLoginPending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGuestLecturerAdmin();
    } finally {
      setIsAccessible(false);
      setPasscode("");
      setSubmissions([]);
      setActiveWeekFilter("all");
    }
  };

  if (sessionLoading) {
    return (
      <section className="studio-app-page studio-app-page--workspace">
        <div className="studio-app-empty">
          <h3>Checking guest lecturer access...</h3>
          <p>Loading the current admin session.</p>
        </div>
      </section>
    );
  }

  if (!isAccessible) {
    return (
      <section className="studio-app-page studio-app-page--workspace">
        <section className="studio-app-panel studio-app-panel--narrow">
          <div className="studio-app-panel-heading">
            <div>
              <p className="studio-app-eyebrow">Guests</p>
              <h3>Enter the admin passcode.</h3>
            </div>
          </div>

          <p>
            Review guest lecturer EOIs for {guestLecturerPageTitle.toLowerCase()}
            once the admin session is unlocked.
          </p>

          <label className="studio-app-field">
            <span>Admin passcode</span>
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter passcode"
            />
          </label>

          {loginError ? <p className="studio-app-error">{loginError}</p> : null}

          <div className="studio-app-sheet-actions">
            <button
              type="button"
              className="studio-app-button"
              disabled={loginPending}
              onClick={() => {
                void handleLogin();
              }}
            >
              {loginPending ? "Unlocking..." : "Unlock"}
            </button>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="studio-app-page studio-app-page--workspace studio-app-guests-page">
      <div className="studio-app-hero">
        <div>
          <p className="studio-app-eyebrow">Guests</p>
          <h2>Guest lecturer EOIs</h2>
        </div>
        <p className="studio-app-hero-copy">
          Review weekly interest, follow up with speakers, and keep the EOI list in
          one place.
        </p>
      </div>

      <section className="studio-app-workspace-grid studio-app-guests-summary-grid">
        <section className="studio-app-panel">
          <div className="studio-app-panel-heading">
            <div>
              <p className="studio-app-eyebrow">Total EOIs</p>
              <h3>{submissions.length}</h3>
            </div>
          </div>
          <p>All guest lecturer submissions received so far.</p>
        </section>

        <section className="studio-app-panel">
          <div className="studio-app-panel-heading">
            <div>
              <p className="studio-app-eyebrow">Weeks With Interest</p>
              <h3>{weeksWithInterest}</h3>
            </div>
          </div>
          <p>Number of distinct class weeks with at least one EOI.</p>
        </section>

        <section className="studio-app-panel">
          <div className="studio-app-panel-heading">
            <div>
              <p className="studio-app-eyebrow">Latest EOI</p>
              <h3>{latestSubmission ? latestSubmission.name : "None yet"}</h3>
            </div>
          </div>
          <p>
            {latestSubmission
              ? formatSubmittedAt(latestSubmission.createdAt)
              : "The first submission will appear here once someone opts in."}
          </p>
        </section>
      </section>

      <section className="studio-app-panel">
        <div className="studio-app-panel-heading">
          <div>
            <p className="studio-app-eyebrow">Filters</p>
            <h3>Review by week or speaker.</h3>
          </div>
          <div className="studio-app-sheet-actions">
            <button
              type="button"
              className="studio-app-button studio-app-button--ghost"
              onClick={() => {
                void handleLogout();
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="studio-app-toolbar studio-app-guests-toolbar">
          <label className="studio-app-search">
            <span>Search</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Name, email, LinkedIn, or topic"
            />
          </label>
          <button
            type="button"
            className="studio-app-button studio-app-button--ghost"
            onClick={() => {
              setLoadingSubmissions(true);
              void listGuestLecturerSubmissions()
                .then((nextSubmissions) => {
                  setSubmissions(nextSubmissions);
                  setLoadError(null);
                })
                .catch((error) => {
                  setLoadError(
                    error instanceof Error
                      ? error.message
                      : "Unable to refresh guest lecturer submissions right now."
                  );
                })
                .finally(() => {
                  setLoadingSubmissions(false);
                });
            }}
          >
            Refresh
          </button>
        </div>

        <div className="studio-app-guests-week-filters" role="tablist" aria-label="Week filters">
          <button
            type="button"
            className={`studio-app-tab${activeWeekFilter === "all" ? " is-active" : ""}`}
            onClick={() => setActiveWeekFilter("all")}
          >
            All Weeks
          </button>
          {guestLecturerWeeks.map((week) => (
            <button
              key={week.weekNumber}
              type="button"
              className={`studio-app-tab${
                activeWeekFilter === week.weekNumber ? " is-active" : ""
              }${week.isOff ? " is-disabled" : ""}`}
              onClick={() => setActiveWeekFilter(week.weekNumber)}
            >
              {week.label}
            </button>
          ))}
        </div>

        {loadError ? <p className="studio-app-error">{loadError}</p> : null}

        {loadingSubmissions ? (
          <div className="studio-app-empty studio-app-empty--tight">
            <h3>Loading EOIs...</h3>
            <p>Pulling the current guest lecturer submissions.</p>
          </div>
        ) : filteredSubmissions.length ? (
          <div className="studio-app-guests-list">
            {filteredSubmissions.map((submission) => (
              <article key={submission.id} className="studio-app-panel studio-app-guests-card">
                <div className="studio-app-panel-heading">
                  <div>
                    <p className="studio-app-eyebrow">{submission.name}</p>
                    <h3>{submission.email}</h3>
                  </div>
                  <span className="studio-app-status">
                    {formatSubmittedAt(submission.createdAt)}
                  </span>
                </div>

                <div className="studio-app-guests-week-row">
                  {submission.selectedWeeks.map((weekNumber) => {
                    const week = getGuestLecturerWeek(weekNumber);

                    return (
                      <span key={`${submission.id}-${weekNumber}`} className="studio-app-status">
                        {week?.label || `Week ${weekNumber}`}
                      </span>
                    );
                  })}
                </div>

                <div className="studio-app-summary-grid studio-app-guests-meta-grid">
                  <div>
                    <p className="studio-app-eyebrow">LinkedIn</p>
                    <a
                      className="studio-app-download-link"
                      href={submission.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open profile
                    </a>
                  </div>
                  <div>
                    <p className="studio-app-eyebrow">Weeks</p>
                    <p>
                      {submission.selectedWeeks
                        .map((weekNumber) => {
                          const week = getGuestLecturerWeek(weekNumber);
                          return week
                            ? `${week.label} · ${formatGuestLecturerWeekDate(week)}`
                            : `Week ${weekNumber}`;
                        })
                        .join(" | ")}
                    </p>
                  </div>
                </div>

                <div className="studio-app-guests-topic">
                  <p className="studio-app-eyebrow">Preferred lecture topic</p>
                  <p>
                    {submission.topicPreference ||
                      "No preferred lecture topic was added."}
                  </p>
                </div>

                <div className="studio-app-sheet-actions">
                  <a
                    className="studio-app-button"
                    href={`mailto:${encodeURIComponent(submission.email)}`}
                  >
                    Email
                  </a>
                  <a
                    className="studio-app-button studio-app-button--ghost"
                    href={submission.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="studio-app-empty studio-app-empty--tight">
            <h3>No matching EOIs</h3>
            <p>Try a different week or search term.</p>
          </div>
        )}
      </section>
    </section>
  );
};

export default GuestLecturerAdminPage;
