import { type RealtimeChannel } from "@supabase/supabase-js";
import {
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaCaretLeft, FaCaretRight, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPublicDocumentByCode } from "../lib/documents";
import { getPresentationSpeakerFlashcard } from "../lib/presentationSpeakerNotes";
import {
  createPresentationChannelName,
  createPresentationClientId,
  normalizePresentationSessionId,
  normalizePresentationCode,
  PRESENTATION_JOIN_REQUEST_EVENT,
  PRESENTATION_REMOTE_COMMAND_EVENT,
  PRESENTATION_STATE_EVENT,
  resolvePresentationSession,
  type PresentationRevealableCardState,
  type PresentationRemoteCommand,
  type PresentationRemoteCommandType,
  type PresentationSessionState,
} from "../lib/presentationRemote";
import { isProjectDocument, normalizeProjectContent } from "../lib/projectDocuments";
import { supabase } from "../lib/supabase";
import type { ProjectPresentationSlide, StudioDocument } from "../types/documents";
import "../components/styles/PresentationRemote.css";

type RemoteCommandStatus = {
  kind: "success" | "error";
  message: string;
};

type SwipeGestureState = {
  pointerId: number;
  startX: number;
  startY: number;
  hasTriggered: boolean;
};

type FlashcardAnimationDirection = "forward" | "backward";

const EMPTY_PRESENTATION_SLIDES: ProjectPresentationSlide[] = [];
const SWIPE_TRIGGER_DISTANCE = 56;
const SWIPE_DIRECTION_RATIO = 1.2;
const SWIPE_VERTICAL_CANCEL_DISTANCE = 28;
const PRESENTATION_REMOTE_ACCESS_ENDPOINT =
  "/api/rushi-personal-presentation/remote-access";

const realtimeStatusLabel = (status: string) => {
  if (status === "SUBSCRIBED") {
    return "Connected";
  }

  if (status === "CHANNEL_ERROR") {
    return "Unavailable";
  }

  if (status === "TIMED_OUT") {
    return "Timed out";
  }

  if (status === "CLOSED") {
    return "Disconnected";
  }

  return "Connecting";
};

const formatSyncTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const clampSlideIndex = (value: number, totalSlides: number) =>
  Math.min(Math.max(value, 0), Math.max(totalSlides - 1, 0));

const getUpcomingPreviewLines = (slide: ProjectPresentationSlide) => {
  if (slide.bullets.length) {
    return slide.bullets.slice(0, 4);
  }

  if (slide.sections.length) {
    return slide.sections
      .flatMap((section) => {
        if (section.bullets.length) {
          return [`${section.heading}: ${section.bullets[0]}`];
        }

        return [section.heading];
      })
      .slice(0, 4);
  }

  if (slide.subtitle) {
    return [slide.subtitle];
  }

  return ["Question slide"];
};

const getCommandStatusMessage = (
  command: PresentationRemoteCommandType,
  slideIndex?: number,
  cardIndex?: number
) => {
  if (command === "goToSlide") {
    return `Jumped to slide ${typeof slideIndex === "number" ? slideIndex + 1 : ""}.`;
  }

  if (command === "prevSlide") {
    return "Moved to the previous slide.";
  }

  if (command === "nextSlide") {
    return "Moved to the next slide.";
  }

  if (command === "goToCard") {
    return `Opened detail ${typeof cardIndex === "number" ? cardIndex + 1 : ""}.`;
  }

  if (command === "clearCard") {
    return "Returned to the base slide.";
  }

  return command === "prev" ? "Moved back." : "Moved forward.";
};

const getSlideSearchLabel = (slide: ProjectPresentationSlide, index: number) =>
  [String(index + 1), slide.kicker || "", slide.title, slide.subtitle || ""]
    .join(" ")
    .toLowerCase();

const parseRemoteAccessResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as {
        authorized?: boolean;
        message?: string;
      })
    : null;

  if (!response.ok) {
    throw new Error(
      payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to verify remote access right now."
    );
  }

  return payload || {};
};

const getRemoteAccessStatus = async (code: string, sessionId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("code", code);
  searchParams.set("sessionId", sessionId);

  const response = await fetch(
    `${PRESENTATION_REMOTE_ACCESS_ENDPOINT}?${searchParams.toString()}`,
    {
      credentials: "include",
    }
  );

  return parseRemoteAccessResponse(response);
};

const unlockRemoteAccess = async ({
  code,
  password,
  sessionId,
}: {
  code: string;
  password: string;
  sessionId: string;
}) => {
  const response = await fetch(PRESENTATION_REMOTE_ACCESS_ENDPOINT, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      password,
      sessionId,
    }),
  });

  return parseRemoteAccessResponse(response);
};

const getFlashcardAnimationDirection = (
  previousSlideIndex: number,
  previousCardIndex: number | null,
  nextSlideIndex: number,
  nextCardIndex: number | null
): FlashcardAnimationDirection => {
  if (nextSlideIndex !== previousSlideIndex) {
    return nextSlideIndex > previousSlideIndex ? "forward" : "backward";
  }

  const previousStep = previousCardIndex ?? -1;
  const nextStep = nextCardIndex ?? -1;

  return nextStep >= previousStep ? "forward" : "backward";
};

const PresentationRemotePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialSession = searchParams.get("session") || "";
  const normalizedCode = normalizePresentationCode(initialCode);
  const [joinCode, setJoinCode] = useState(initialCode);
  const [joinSessionId, setJoinSessionId] = useState(initialSession);
  const [slideSearch, setSlideSearch] = useState("");
  const [documentRecord, setDocumentRecord] = useState<StudioDocument | null>(null);
  const [loading, setLoading] = useState(Boolean(normalizedCode));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordAuthorized, setIsPasswordAuthorized] = useState(false);
  const [isPasswordAuthorizationLoading, setIsPasswordAuthorizationLoading] =
    useState(false);
  const [channelStatus, setChannelStatus] = useState("idle");
  const [sessionState, setSessionState] = useState<PresentationSessionState | null>(null);
  const [commandStatus, setCommandStatus] = useState<RemoteCommandStatus | null>(null);
  const [flashcardAnimation, setFlashcardAnimation] = useState<{
    key: number;
    direction: FlashcardAnimationDirection;
  } | null>(null);
  const remoteClientIdRef = useRef("");
  const channelRef = useRef<RealtimeChannel | null>(null);
  const swipeStateRef = useRef<SwipeGestureState | null>(null);
  const previousFlashcardViewRef = useRef<{
    slideIndex: number;
    cardIndex: number | null;
    flashcardId: string | null;
  } | null>(null);

  if (!remoteClientIdRef.current) {
    remoteClientIdRef.current = createPresentationClientId();
  }

  useEffect(() => {
    setJoinCode(initialCode);
    setJoinSessionId(initialSession);
  }, [initialCode, initialSession]);

  const presentationContent = useMemo(
    () =>
      documentRecord && isProjectDocument(documentRecord)
        ? normalizeProjectContent(documentRecord.content).presentation
        : null,
    [documentRecord]
  );
  const { sessionId: resolvedSessionId } = resolvePresentationSession({
    explicitSessionId: initialSession,
    publicSessionId: presentationContent?.publicSessionId,
    fallbackSessionId: "",
  });
  const publicSessionId = normalizePresentationSessionId(
    presentationContent?.publicSessionId || ""
  );
  const requiresPublicRemotePassword =
    normalizedCode === "INFS5700" &&
    Boolean(publicSessionId) &&
    resolvedSessionId === publicSessionId;

  useEffect(() => {
    setSlideSearch("");
    setCommandStatus(null);
  }, [normalizedCode, resolvedSessionId]);

  useEffect(() => {
    setPasswordInput("");
    setPasswordError(null);

    if (!requiresPublicRemotePassword || !normalizedCode || !resolvedSessionId) {
      setIsPasswordAuthorized(!requiresPublicRemotePassword);
      setIsPasswordAuthorizationLoading(false);
      return;
    }

    let active = true;

    setIsPasswordAuthorized(false);
    setIsPasswordAuthorizationLoading(true);

    void getRemoteAccessStatus(normalizedCode, resolvedSessionId)
      .then((payload) => {
        if (!active) {
          return;
        }

        setIsPasswordAuthorized(Boolean(payload.authorized));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify remote access right now."
        );
      })
      .finally(() => {
        if (active) {
          setIsPasswordAuthorizationLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [normalizedCode, requiresPublicRemotePassword, resolvedSessionId]);

  useEffect(() => {
    if (!normalizedCode) {
      setDocumentRecord(null);
      setLoading(false);
      setErrorMessage(null);
      return;
    }

    let active = true;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const nextDocument = await getPublicDocumentByCode(normalizedCode);

        if (!active) {
          return;
        }

        if (!nextDocument || !isProjectDocument(nextDocument)) {
          setDocumentRecord(null);
          setErrorMessage("This code does not match a shared presentation.");
          return;
        }

        const normalizedContent = normalizeProjectContent(nextDocument.content);
        if (
          normalizedContent.projectVariant !== "presentation" ||
          !normalizedContent.presentation.slides.length
        ) {
          setDocumentRecord(null);
          setErrorMessage("This project is not available in the universal remote.");
          return;
        }

        setDocumentRecord({
          ...nextDocument,
          content: normalizedContent,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setDocumentRecord(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load this shared presentation right now."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDocument();

    return () => {
      active = false;
    };
  }, [normalizedCode]);

  useEffect(() => {
    if (
      !documentRecord ||
      !resolvedSessionId ||
      !isProjectDocument(documentRecord) ||
      !isPasswordAuthorized
    ) {
      setSessionState(null);
      setChannelStatus("idle");
      return;
    }

    let active = true;
    const channel = supabase.channel(
      createPresentationChannelName(documentRecord.code, resolvedSessionId)
    );
    channelRef.current = channel;

    channel
      .on("broadcast", { event: PRESENTATION_STATE_EVENT }, ({ payload }) => {
        if (!active) {
          return;
        }

        setSessionState(payload as PresentationSessionState);
        setErrorMessage(null);
        setCommandStatus((currentStatus) =>
          currentStatus?.kind === "success" ? null : currentStatus
        );
      })
      .subscribe(async (status) => {
        if (!active) {
          return;
        }

        setChannelStatus(status);

        if (status === "SUBSCRIBED") {
          const result = await channel.send({
            type: "broadcast",
            event: PRESENTATION_JOIN_REQUEST_EVENT,
            payload: {
              code: documentRecord.code,
              sessionId: resolvedSessionId,
              joinedAt: new Date().toISOString(),
            },
          });

          if (result !== "ok") {
            setErrorMessage(
              "Connected to the session, but the live deck host has not shared the current slide yet."
            );
          }

          return;
        }

        if (status === "CHANNEL_ERROR") {
          setErrorMessage(
            "The remote could not connect to live sync. Try reconnecting or re-opening the session link."
          );
          return;
        }

        if (status === "TIMED_OUT") {
          setErrorMessage(
            "The remote timed out while waiting for the live deck host. You can stay on this page and try again."
          );
        }
      });

    return () => {
      active = false;
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [documentRecord, isPasswordAuthorized, resolvedSessionId]);

  const slides = presentationContent?.slides ?? EMPTY_PRESENTATION_SLIDES;
  const currentSlide =
    sessionState && slides.length
      ? slides[clampSlideIndex(sessionState.slideIndex, slides.length)]
      : null;
  const currentSlideIndex = clampSlideIndex(sessionState?.slideIndex ?? 0, slides.length);
  const upcomingSlide =
    currentSlideIndex < slides.length - 1 ? slides[currentSlideIndex + 1] : null;
  const upcomingPreviewLines = upcomingSlide ? getUpcomingPreviewLines(upcomingSlide) : [];
  const revealableCards: PresentationRevealableCardState[] =
    sessionState?.revealableCards ?? [];
  const buildProgress = sessionState?.buildProgress ?? {
    current: sessionState?.activeCardIndex != null ? sessionState.activeCardIndex + 1 : 0,
    total: revealableCards.length,
  };
  const currentSpeakerFlashcard = useMemo(
    () => getPresentationSpeakerFlashcard(currentSlide, sessionState?.activeCardIndex ?? null),
    [currentSlide, sessionState?.activeCardIndex]
  );
  const currentSpeakerFlashcardStatus =
    currentSpeakerFlashcard.context === "card" && buildProgress.total
      ? `Detail ${buildProgress.current} / ${buildProgress.total}`
      : "Base slide";
  const hasRevealableCards = revealableCards.length > 0;
  const canGoPrevious =
    channelStatus === "SUBSCRIBED" &&
    (currentSlideIndex > 0 || buildProgress.current > 0);
  const canGoNext =
    channelStatus === "SUBSCRIBED" &&
    (currentSlideIndex < slides.length - 1 ||
      (hasRevealableCards && buildProgress.current < buildProgress.total));
  const canGoPreviousSlide =
    channelStatus === "SUBSCRIBED" && currentSlideIndex > 0;
  const canGoNextSlide =
    channelStatus === "SUBSCRIBED" && currentSlideIndex < slides.length - 1;
  const filteredSlides = useMemo(() => {
    const query = slideSearch.trim().toLowerCase();
    const slideEntries = slides.map((slide, index) => ({
      index,
      slide,
    }));

    if (!query) {
      return slideEntries;
    }

    return slideEntries.filter(({ slide, index }) =>
      getSlideSearchLabel(slide, index).includes(query)
    );
  }, [slideSearch, slides]);
  const filteredSlidesLabel = slideSearch.trim()
    ? `${filteredSlides.length} result${filteredSlides.length === 1 ? "" : "s"}`
    : `${slides.length} slides`;

  useEffect(() => {
    if (!currentSlide || !currentSpeakerFlashcard) {
      previousFlashcardViewRef.current = null;
      return;
    }

    const nextView = {
      slideIndex: currentSlideIndex,
      cardIndex: sessionState?.activeCardIndex ?? null,
      flashcardId: currentSpeakerFlashcard.id,
    };
    const previousView = previousFlashcardViewRef.current;

    if (
      previousView &&
      (previousView.slideIndex !== nextView.slideIndex ||
        previousView.cardIndex !== nextView.cardIndex ||
        previousView.flashcardId !== nextView.flashcardId)
    ) {
      setFlashcardAnimation({
        key: Date.now(),
        direction: getFlashcardAnimationDirection(
          previousView.slideIndex,
          previousView.cardIndex,
          nextView.slideIndex,
          nextView.cardIndex
        ),
      });
    }

    previousFlashcardViewRef.current = nextView;
  }, [
    currentSlide,
    currentSlideIndex,
    currentSpeakerFlashcard,
    sessionState?.activeCardIndex,
  ]);

  const sendCommand = async (
    command: PresentationRemoteCommandType,
    slideIndex?: number,
    cardIndex?: number
  ) => {
    const channel = channelRef.current;
    if (!channel || !documentRecord || !resolvedSessionId) {
      setCommandStatus({
        kind: "error",
        message: "The remote is not ready to send a command yet.",
      });
      return;
    }

    const payload: PresentationRemoteCommand = {
      code: documentRecord.code,
      sessionId: resolvedSessionId,
      command,
      slideIndex,
      cardIndex,
      sentAt: new Date().toISOString(),
      senderClientId: remoteClientIdRef.current,
      senderRole: "remote",
    };

    const result = await channel.send({
      type: "broadcast",
      event: PRESENTATION_REMOTE_COMMAND_EVENT,
      payload,
    });

    setCommandStatus({
      kind: result === "ok" ? "success" : "error",
      message:
        result === "ok"
          ? getCommandStatusMessage(command, slideIndex, cardIndex)
          : "The command could not be sent.",
    });
  };

  const triggerSwipeCommand = (direction: "prev" | "next") => {
    if (direction === "next") {
      if (!canGoNext) {
        return;
      }

      void sendCommand("next");
      return;
    }

    if (!canGoPrevious) {
      return;
    }

    void sendCommand("prev");
  };

  const clearSwipeState = (pointerId?: number) => {
    if (!swipeStateRef.current) {
      return;
    }

    if (typeof pointerId === "number" && swipeStateRef.current.pointerId !== pointerId) {
      return;
    }

    swipeStateRef.current = null;
  };

  const handleFlashcardPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!event.isPrimary || event.pointerType === "mouse") {
      return;
    }

    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      hasTriggered: false,
    };
  };

  const handleFlashcardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const swipeState = swipeStateRef.current;

    if (
      !swipeState ||
      swipeState.pointerId !== event.pointerId ||
      swipeState.hasTriggered ||
      event.pointerType === "mouse"
    ) {
      return;
    }

    const deltaX = event.clientX - swipeState.startX;
    const deltaY = event.clientY - swipeState.startY;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);

    if (absoluteY > SWIPE_VERTICAL_CANCEL_DISTANCE && absoluteY > absoluteX) {
      clearSwipeState(event.pointerId);
      return;
    }

    if (
      absoluteX < SWIPE_TRIGGER_DISTANCE ||
      absoluteX < absoluteY * SWIPE_DIRECTION_RATIO
    ) {
      return;
    }

    swipeState.hasTriggered = true;
    triggerSwipeCommand(deltaX < 0 ? "next" : "prev");
  };

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCode = normalizePresentationCode(joinCode);
    const nextSessionId = normalizePresentationSessionId(joinSessionId);

    if (!nextCode) {
      setErrorMessage("Enter a presentation code.");
      return;
    }

    setErrorMessage(null);
    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("code", nextCode);
    if (nextSessionId) {
      nextSearchParams.set("session", nextSessionId);
    }

    navigate(`/remote?${nextSearchParams.toString()}`);
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedCode || !resolvedSessionId) {
      setPasswordError("Presentation code and session id are required.");
      return;
    }

    try {
      setPasswordError(null);
      setIsPasswordAuthorizationLoading(true);

      const payload = await unlockRemoteAccess({
        code: normalizedCode,
        password: passwordInput,
        sessionId: resolvedSessionId,
      });

      setIsPasswordAuthorized(Boolean(payload.authorized));
      setPasswordInput("");
      setErrorMessage(null);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to unlock remote right now."
      );
    } finally {
      setIsPasswordAuthorizationLoading(false);
    }
  };

  return (
    <main className="remote-page">
      <section className="remote-shell">
        <header className="remote-header">
          <div className="remote-header-copy">
            <p className="remote-kicker">Universal Remote</p>
            <h1>{documentRecord?.title || "Presentation Remote"}</h1>
          </div>
          <div className="remote-header-meta">
            <span>{normalizedCode || "No code"}</span>
            <span>{resolvedSessionId || "No session"}</span>
            <span>{realtimeStatusLabel(channelStatus)}</span>
          </div>
        </header>

        {!normalizedCode || (!resolvedSessionId && !loading) ? (
          <section className="remote-panel remote-panel--state remote-panel--join">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Join Remote</p>
              <h2>Pair with a live presentation</h2>
              <p className="remote-panel-copy">
                Enter the presentation code to open the synced remote. Add a session id for
                private or ad hoc live sessions.
              </p>
            </div>
            <form className="remote-join-form" onSubmit={handleJoinSubmit}>
              <label>
                <span>Presentation code</span>
                <input
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value)}
                  placeholder="INFS5700"
                />
              </label>
              <label>
                <span>Session id</span>
                <input
                  value={joinSessionId}
                  onChange={(event) => setJoinSessionId(event.target.value)}
                  placeholder="Optional for public decks"
                />
              </label>
              <button type="submit" className="remote-action-button remote-action-button--primary">
                Open Remote
              </button>
            </form>
          </section>
        ) : null}

        {loading ? (
          <section className="remote-panel remote-panel--state">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Loading</p>
              <h2>Loading presentation...</h2>
            </div>
          </section>
        ) : null}

        {!loading && errorMessage ? (
          <section className="remote-panel remote-panel--state">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Remote Unavailable</p>
              <h2>Remote unavailable</h2>
              <p className="remote-panel-copy">{errorMessage}</p>
            </div>
          </section>
        ) : null}

        {!loading &&
        !errorMessage &&
        documentRecord &&
        requiresPublicRemotePassword &&
        isPasswordAuthorizationLoading ? (
          <section className="remote-panel remote-panel--state">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Protected Remote</p>
              <h2>Checking remote access...</h2>
              <p className="remote-panel-copy">
                Verifying whether this browser already has access to the permanent
                INFS5700 remote.
              </p>
            </div>
          </section>
        ) : null}

        {!loading &&
        !errorMessage &&
        documentRecord &&
        requiresPublicRemotePassword &&
        !isPasswordAuthorizationLoading &&
        !isPasswordAuthorized ? (
          <section className="remote-panel remote-panel--state remote-panel--join">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Protected Remote</p>
              <h2>Enter password to access this remote</h2>
              <p className="remote-panel-copy">
                The permanent INFS5700 remote link is password protected.
              </p>
            </div>
            <form className="remote-join-form" onSubmit={handlePasswordSubmit}>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
              </label>
              <button
                type="submit"
                className="remote-action-button remote-action-button--primary"
                disabled={isPasswordAuthorizationLoading}
              >
                Unlock Remote
              </button>
              {passwordError ? <p className="remote-panel-copy">{passwordError}</p> : null}
            </form>
          </section>
        ) : null}

        {!loading &&
        !errorMessage &&
        documentRecord &&
        (!requiresPublicRemotePassword || isPasswordAuthorized) &&
        currentSlide ? (
          <div className="remote-layout">
            <section className="remote-panel remote-panel--flashcard">
              <div className="remote-panel-header">
                <div className="remote-panel-heading-inline">
                  <p className="remote-panel-kicker">Flash Card</p>
                  <strong>{currentSpeakerFlashcardStatus}</strong>
                </div>
                <span className="remote-panel-chip">{`${currentSlideIndex + 1} / ${slides.length}`}</span>
              </div>
              <article
                className="remote-flashcard-surface"
                onPointerCancel={(event) => clearSwipeState(event.pointerId)}
                onPointerDown={handleFlashcardPointerDown}
                onPointerLeave={(event) => clearSwipeState(event.pointerId)}
                onPointerMove={handleFlashcardPointerMove}
                onPointerUp={(event) => clearSwipeState(event.pointerId)}
              >
                <div
                  key={`${currentSpeakerFlashcard.id}-${flashcardAnimation?.key ?? "base"}`}
                  className={`remote-flashcard-motion-layer${
                    flashcardAnimation
                      ? ` remote-flashcard-motion-layer--${flashcardAnimation.direction}`
                      : ""
                  }`}
                >
                  <div className="remote-flashcard-meta">
                    <span>{currentSlide.kicker || `Slide ${currentSlideIndex + 1}`}</span>
                    <strong>
                      {sessionState ? `Updated ${formatSyncTime(sessionState.updatedAt)}` : "Waiting"}
                    </strong>
                  </div>
                  <div className="remote-flashcard-copy">
                    <h2>{currentSpeakerFlashcard.title}</h2>
                    {currentSpeakerFlashcard.subtitle ? (
                      <p className="remote-flashcard-subtitle">
                        {currentSpeakerFlashcard.subtitle}
                      </p>
                    ) : null}
                  </div>
                  {currentSpeakerFlashcard.lines.length ? (
                    <ol className="remote-flashcard-points">
                      {currentSpeakerFlashcard.lines.map((note, index) => (
                        <li key={`${currentSpeakerFlashcard.id}-${index}`}>{note}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              </article>
            </section>

            <section className="remote-panel remote-panel--transport">
              <div className="remote-panel-header">
                <div className="remote-panel-heading-inline">
                  <p className="remote-panel-kicker">Controls</p>
                </div>
                <span className="remote-panel-chip">
                  {channelStatus === "SUBSCRIBED" ? "Live" : realtimeStatusLabel(channelStatus)}
                </span>
              </div>
              <div className="remote-transport-row">
                <button
                  type="button"
                  className="remote-transport-button"
                  onClick={() => void sendCommand("prevSlide")}
                  disabled={!canGoPreviousSlide}
                >
                  <FaStepBackward aria-hidden="true" />
                  <span className="remote-visually-hidden">Previous slide</span>
                </button>
                <button
                  type="button"
                  className="remote-transport-button"
                  onClick={() => void sendCommand("prev")}
                  disabled={!canGoPrevious}
                >
                  <FaCaretLeft aria-hidden="true" />
                  <span className="remote-visually-hidden">Previous step</span>
                </button>
                <button
                  type="button"
                  className="remote-transport-button"
                  onClick={() => void sendCommand("next")}
                  disabled={!canGoNext}
                >
                  <FaCaretRight aria-hidden="true" />
                  <span className="remote-visually-hidden">Next step</span>
                </button>
                <button
                  type="button"
                  className="remote-transport-button"
                  onClick={() => void sendCommand("nextSlide")}
                  disabled={!canGoNextSlide}
                >
                  <FaStepForward aria-hidden="true" />
                  <span className="remote-visually-hidden">Next slide</span>
                </button>
              </div>
              {commandStatus ? (
                <p
                  className={`remote-command-status remote-command-status--${commandStatus.kind}`}
                >
                  {commandStatus.message}
                </p>
              ) : null}
            </section>

            <section className="remote-panel remote-panel--detail">
              <div className="remote-panel-header">
                <div className="remote-panel-heading-inline">
                  <p className="remote-panel-kicker">Slide Cards</p>
                </div>
                <span className="remote-panel-chip">
                  {hasRevealableCards ? `${buildProgress.total} cards` : "No cards"}
                </span>
              </div>
              <div className="remote-card-grid">
                {hasRevealableCards ? (
                  revealableCards.map((card, index) => (
                    <button
                      key={card.id}
                      type="button"
                      className={`remote-card-button${
                        sessionState?.activeCardIndex === index ? " is-active" : ""
                      }`}
                      onClick={() => void sendCommand("goToCard", undefined, index)}
                      disabled={channelStatus !== "SUBSCRIBED"}
                    >
                      <span>{`Card ${index + 1}`}</span>
                      <strong>{card.label}</strong>
                    </button>
                  ))
                ) : (
                  <div className="remote-card-button remote-card-button--empty">
                    <span>No revealable cards</span>
                    <strong>This slide uses base slide navigation only.</strong>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="remote-action-button"
                onClick={() => void sendCommand("clearCard")}
                disabled={channelStatus !== "SUBSCRIBED" || sessionState?.activeCardIndex == null}
              >
                Base Slide
              </button>
            </section>

            <section className="remote-panel remote-panel--jump">
              <div className="remote-panel-header">
                <div className="remote-panel-heading-inline">
                  <p className="remote-panel-kicker">Jump to / Search Slide</p>
                </div>
                <span className="remote-panel-chip">{filteredSlidesLabel}</span>
              </div>
              <label className="remote-search-field">
                <span className="remote-visually-hidden">Search slides</span>
                <input
                  value={slideSearch}
                  onChange={(event) => setSlideSearch(event.target.value)}
                  placeholder="Search by slide #, kicker, title, or subtitle"
                  type="search"
                />
              </label>
              <div className="remote-slide-jump-list">
                {filteredSlides.length ? (
                  filteredSlides.map(({ slide, index: slideIndex }) => {
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        className={`remote-slide-jump${
                          sessionState?.slideIndex === slideIndex ? " is-active" : ""
                        }`}
                        onClick={() => void sendCommand("goToSlide", slideIndex)}
                        disabled={channelStatus !== "SUBSCRIBED"}
                      >
                        <span>{slide.kicker || `Slide ${slideIndex + 1}`}</span>
                        <strong>{`${slideIndex + 1}. ${slide.title}`}</strong>
                        {slide.subtitle ? <em>{slide.subtitle}</em> : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="remote-empty-results">
                    <p>No slides match that search yet.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="remote-panel remote-panel--upcoming">
              <div className="remote-panel-header">
                <div className="remote-panel-heading-inline">
                  <p className="remote-panel-kicker">Upcoming Slide</p>
                </div>
                <span className="remote-panel-chip">
                  {upcomingSlide ? `Slide ${currentSlideIndex + 2}` : "Complete"}
                </span>
              </div>
              {upcomingSlide ? (
                <div className="remote-upcoming-preview">
                  <div className="remote-upcoming-meta">
                    <span>{upcomingSlide.kicker || `Slide ${currentSlideIndex + 2}`}</span>
                    <strong>{upcomingSlide.title}</strong>
                    {upcomingSlide.subtitle ? <em>{upcomingSlide.subtitle}</em> : null}
                  </div>
                  <ul className="remote-upcoming-list">
                    {upcomingPreviewLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="remote-upcoming-empty">
                  <p>There is no upcoming slide after the current live deck view.</p>
                </div>
              )}
            </section>
          </div>
        ) : null}

        {!loading &&
        !errorMessage &&
        documentRecord &&
        (!requiresPublicRemotePassword || isPasswordAuthorized) &&
        !currentSlide &&
        resolvedSessionId ? (
          <section className="remote-panel remote-panel--state">
            <div className="remote-panel-heading">
              <p className="remote-panel-kicker">Waiting</p>
              <h2>Waiting for live deck</h2>
              <p className="remote-panel-copy">
                This remote is connected to session <strong>{resolvedSessionId}</strong>. It
                will populate as soon as the live deck host shares the current slide.
              </p>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
};

export default PresentationRemotePage;
