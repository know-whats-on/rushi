import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ClientProjectCard } from "../../types/clientApp";
import {
  getProjectAccess,
  listClientProjectCards,
  saveClientParticipant,
  unlockClientProject,
} from "../lib/clientApi";

const StudioHomePage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<ClientProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCard, setActiveCard] = useState<ClientProjectCard | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [unlockPending, setUnlockPending] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [participantPending, setParticipantPending] = useState(false);
  const [needsParticipant, setNeedsParticipant] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCards = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const nextCards = await listClientProjectCards();

        if (!active) {
          return;
        }

        setCards(nextCards);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load live studio projects right now."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCards();

    return () => {
      active = false;
    };
  }, []);

  const filteredCards = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return cards;
    }

    return cards.filter((card) =>
      [card.title, card.company, card.summary, card.code]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [cards, searchQuery]);

  const closeSheet = () => {
    setActiveCard(null);
    setPassword("");
    setPasswordError(null);
    setParticipantName("");
    setParticipantEmail("");
    setParticipantError(null);
    setNeedsParticipant(false);
  };

  const openProject = async (card: ClientProjectCard) => {
    setActiveCard(card);
    setPassword("");
    setPasswordError(null);
    setParticipantName("");
    setParticipantEmail("");
    setParticipantError(null);
    setNeedsParticipant(false);

    try {
      const access = await getProjectAccess(card.code);

      if (access.accessible && access.participant) {
        navigate(`/project/${encodeURIComponent(card.code)}`);
        return;
      }

      if (access.accessible) {
        setNeedsParticipant(true);
      }
    } catch {
      // If access lookup fails we still allow local unlock entry.
    }
  };

  const handleUnlock = async () => {
    if (!activeCard) {
      return;
    }

    try {
      setUnlockPending(true);
      setPasswordError(null);
      const access = await unlockClientProject(activeCard.code, password);

      if (access.participant) {
        navigate(`/project/${encodeURIComponent(activeCard.code)}`);
        return;
      }

      setNeedsParticipant(true);
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to unlock this project right now."
      );
    } finally {
      setUnlockPending(false);
    }
  };

  const handleParticipantSave = async () => {
    if (!activeCard) {
      return;
    }

    try {
      setParticipantPending(true);
      setParticipantError(null);
      await saveClientParticipant(activeCard.code, participantName, participantEmail);
      navigate(`/project/${encodeURIComponent(activeCard.code)}`);
    } catch (error) {
      setParticipantError(
        error instanceof Error
          ? error.message
          : "Unable to save your details right now."
      );
    } finally {
      setParticipantPending(false);
    }
  };

  return (
    <section className="studio-app-page studio-app-page--studio">
      <div className="studio-app-hero">
        <div>
          <p className="studio-app-eyebrow">Client Projects</p>
          <h2>Open your live studio workspace.</h2>
        </div>
        <p className="studio-app-hero-copy">
          The app stays in sync with the production studio, so newly published
          projects appear here automatically.
        </p>
      </div>

      <section className="studio-app-toolbar">
        <label className="studio-app-search">
          <span>Search projects</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Company, title, or code"
          />
        </label>
        <button
          type="button"
          className="studio-app-button studio-app-button--ghost"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </section>

      {errorMessage ? (
        <p className="studio-app-error">{errorMessage}</p>
      ) : null}

      {loading ? (
        <div className="studio-app-empty">
          <h3>Loading live projects...</h3>
          <p>Pulling the current studio list from production.</p>
        </div>
      ) : filteredCards.length ? (
        <section className="studio-app-project-grid">
          {filteredCards.map((card) => (
            <button
              type="button"
              key={card.id}
              className="studio-app-project-card"
              onClick={() => {
                void openProject(card);
              }}
            >
              <div className="studio-app-project-mark">
                {card.logoUrl ? (
                  <img src={card.logoUrl} alt="" />
                ) : (
                  <span>{card.company.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="studio-app-project-copy">
                <div className="studio-app-project-meta">
                  <span>{card.company}</span>
                  <strong>{card.statusLabel || "Live"}</strong>
                </div>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
              </div>

              <div className="studio-app-project-footer">
                <span>{card.code}</span>
                <span>Open</span>
              </div>
            </button>
          ))}
        </section>
      ) : (
        <div className="studio-app-empty">
          <h3>No matching projects</h3>
          <p>Try a different company, title, or project code.</p>
        </div>
      )}

      {activeCard ? (
        <div className="studio-app-sheet-backdrop" role="presentation" onClick={closeSheet}>
          <div
            className="studio-app-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Unlock ${activeCard.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="studio-app-sheet-header">
              <div>
                <p className="studio-app-eyebrow">Studio Access</p>
                <h3>{activeCard.title}</h3>
              </div>
              <button
                type="button"
                className="studio-app-close"
                onClick={closeSheet}
                aria-label="Close project access"
              >
                x
              </button>
            </div>

            {!needsParticipant ? (
              <div className="studio-app-sheet-body">
                <p>
                  Enter the project password Rushi shared with you to unlock this
                  workspace.
                </p>

                <label className="studio-app-field">
                  <span>Project password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                </label>

                {passwordError ? (
                  <p className="studio-app-error">{passwordError}</p>
                ) : null}

                <div className="studio-app-sheet-actions">
                  <button
                    type="button"
                    className="studio-app-button"
                    disabled={unlockPending}
                    onClick={() => {
                      void handleUnlock();
                    }}
                  >
                    {unlockPending ? "Unlocking..." : "Unlock project"}
                  </button>
                  <button
                    type="button"
                    className="studio-app-button studio-app-button--ghost"
                    onClick={closeSheet}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="studio-app-sheet-body">
                <p>
                  Add your name and email once so replies, approvals, and change
                  requests stay attributable inside the project thread.
                </p>

                <label className="studio-app-field">
                  <span>Name</span>
                  <input
                    value={participantName}
                    onChange={(event) => setParticipantName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <label className="studio-app-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(event) => setParticipantEmail(event.target.value)}
                    placeholder="name@company.com"
                  />
                </label>

                {participantError ? (
                  <p className="studio-app-error">{participantError}</p>
                ) : null}

                <div className="studio-app-sheet-actions">
                  <button
                    type="button"
                    className="studio-app-button"
                    disabled={participantPending}
                    onClick={() => {
                      void handleParticipantSave();
                    }}
                  >
                    {participantPending ? "Saving..." : "Continue to workspace"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default StudioHomePage;
