import { type RealtimeChannel } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";
import Marquee from "react-fast-marquee";
import {
  startTransition,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { portfolioContent } from "../../data/portfolioContent";
import {
  buildPresentationVisualCardId,
  getPresentationSpeakerFlashcard,
  getRevealableCardsForSlide,
  isInteractivePresentationVisualVariant,
} from "../../lib/presentationSpeakerNotes";
import { supabase } from "../../lib/supabase";
import type {
  ProjectDocumentContent,
  ProjectPresentationBranding,
  ProjectPresentationSlide,
  ProjectPresentationSlideLayout,
  ProjectPresentationVisualItem,
  StudioDocument,
} from "../../types/documents";
import {
  createPresentationChannelName,
  createPresentationClientId,
  createPresentationSessionId,
  arePresentationHostsEqual,
  getPresentationActiveHost,
  listPresentationParticipants,
  normalizePresentationSessionId,
  normalizePresentationCode,
  PRESENTATION_JOIN_REQUEST_EVENT,
  PRESENTATION_REMOTE_COMMAND_EVENT,
  PRESENTATION_STATE_EVENT,
  resolvePresentationSession,
  type PresentationHostIdentity,
  type PresentationParticipantPresence,
  type PresentationParticipantRole,
  type PresentationRevealableCardState,
  type PresentationRemoteCommand,
  type PresentationRemoteCommandType,
  type PresentationSessionState,
} from "../../lib/presentationRemote";
import "../styles/PresentationExperience.css";

interface KeynotePresentationExperienceProps {
  projectDocument: StudioDocument & { content: ProjectDocumentContent };
  heroKicker: string;
}

const realtimeStatusLabel = (status: string) => {
  if (status === "SUBSCRIBED") {
    return "Remote live";
  }

  if (status === "CHANNEL_ERROR") {
    return "Remote unavailable";
  }

  if (status === "TIMED_OUT") {
    return "Remote timed out";
  }

  if (status === "CLOSED") {
    return "Remote disconnected";
  }

  return "Connecting remote";
};

const clampSlideIndex = (value: number, totalSlides: number) =>
  Math.min(Math.max(value, 0), Math.max(totalSlides - 1, 0));

const splitLogoRows = <T,>(items: T[]) => {
  const firstRow = items.filter((_, index) => index % 2 === 0);
  const secondRow = items.filter((_, index) => index % 2 === 1);

  return [
    firstRow.length ? firstRow : items,
    secondRow.length ? secondRow : items,
  ] as const;
};

const introMarqueeLogos = portfolioContent.logoMarquee.flatMap((item) =>
  item.logo ? [{ name: item.name, logo: item.logo }] : []
);
const [introMarqueeTop, introMarqueeBottom] = splitLogoRows(introMarqueeLogos);
const introHeroBadges = portfolioContent.hero.badges ?? [];

interface PresentationRevealableCard extends PresentationRevealableCardState {
  index: number;
  detail: string;
  group?: string;
  value?: string;
}

interface PresentationModalOrigin {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
}

const getQuestionKickerLabel = (value: string) => {
  const match = value.match(/(\d+)/);
  if (!match) {
    return value.trim();
  }

  return `Q${match[1]}`;
};

const normalizePresentationMode = (value: string) =>
  value.trim().toLowerCase() === "screen" ? "screen" : "present";

type PresentationSurfaceVariant = "default" | "screen" | "console-current" | "console-next";
type PresentationScaledSurfaceVariant = Extract<
  PresentationSurfaceVariant,
  "console-current" | "console-next"
>;

const PRESENTATION_STAGE_CANVAS_WIDTH = 1600;
const PRESENTATION_STAGE_CANVAS_HEIGHT = 900;
const PRESENTATION_STAGE_SAFE_GUTTER_INLINE = 40;
const PRESENTATION_STAGE_SAFE_GUTTER_BLOCK = 10;
const PRESENTATION_SCALED_SURFACE_VARIANTS: PresentationScaledSurfaceVariant[] = [
  "console-current",
  "console-next",
];

const isScaledPresentationSurface = (
  surfaceVariant: PresentationSurfaceVariant
): surfaceVariant is PresentationScaledSurfaceVariant =>
  surfaceVariant === "console-current" || surfaceVariant === "console-next";

interface PresentationCountdownState {
  remainingMs: number;
  segments: [string, string, string];
  targetLabel: string;
}

const formatCountdownSegment = (value: number) => value.toString().padStart(2, "0");

const formatCountdownTargetLabel = (targetAt: string, timeZone: string) => {
  const parsedTarget = new Date(targetAt);
  if (Number.isNaN(parsedTarget.getTime())) {
    return "";
  }

  let formattedTarget = "";

  try {
    formattedTarget = new Intl.DateTimeFormat("en-AU", {
      timeZone: timeZone || "Australia/Sydney",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(parsedTarget);
  } catch {
    formattedTarget = parsedTarget.toLocaleString("en-AU");
  }

  if (timeZone === "Australia/Sydney") {
    return `${formattedTarget} Sydney time`;
  }

  return `${formattedTarget} ${timeZone}`.trim();
};

const getPresentationCountdownState = (
  slide: ProjectPresentationSlide,
  now: number
): PresentationCountdownState | null => {
  if (slide.layout !== "countdown" || !slide.countdown?.targetAt) {
    return null;
  }

  const targetTime = Date.parse(slide.countdown.targetAt);
  if (Number.isNaN(targetTime)) {
    return null;
  }

  const remainingMs = Math.max(targetTime - now, 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    remainingMs,
    segments: [
      formatCountdownSegment(hours),
      formatCountdownSegment(minutes),
      formatCountdownSegment(seconds),
    ],
    targetLabel: formatCountdownTargetLabel(
      slide.countdown.targetAt,
      slide.countdown.timeZone
    ),
  };
};

const getPresentationFooterLeftText = (branding: ProjectPresentationBranding) =>
  branding.website.trim();

const getPresentationFooterRightText = (branding: ProjectPresentationBranding) =>
  branding.tagline.trim();

const shouldShowPresentationFooter = (
  branding: ProjectPresentationBranding,
  layout: ProjectPresentationSlideLayout
) => {
  if (
    !getPresentationFooterLeftText(branding) &&
    !getPresentationFooterRightText(branding)
  ) {
    return false;
  }

  if (branding.footerMode === "all") {
    return true;
  }

  if (branding.footerMode === "non-title") {
    return layout !== "title";
  }

  return false;
};

const KeynotePresentationExperience = ({
  projectDocument,
  heroKicker,
}: KeynotePresentationExperienceProps) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const presentation = projectDocument.content.presentation;
  const slides = presentation.slides;
  const totalSlides = slides.length;
  const pendingSessionIdRef = useRef("");
  const clientIdRef = useRef("");
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hostIdentityRef = useRef<PresentationHostIdentity | null>(null);
  const sessionStateRef = useRef<PresentationSessionState | null>(null);
  const screenWindowNameRef = useRef("");
  const jumpSearchRef = useRef<HTMLDivElement | null>(null);
  const revealCardElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const modalRef = useRef<HTMLDivElement | null>(null);
  const stageScaleShellRefs = useRef<Record<PresentationScaledSurfaceVariant, HTMLDivElement | null>>({
    "console-current": null,
    "console-next": null,
  });
  const slideIndexRef = useRef(0);
  const activeCardIndexRef = useRef<number | null>(null);
  const rawSessionId = searchParams.get("session") || "";
  const rawMode = searchParams.get("mode") || "";
  const presentationMode = normalizePresentationMode(rawMode);
  const isScreenMode = presentationMode === "screen";
  const isPresenterMode = !isScreenMode;
  const participantRole: PresentationParticipantRole = isScreenMode
    ? "screen"
    : "presenter";
  const normalizedRawSessionId = normalizePresentationSessionId(rawSessionId);
  const normalizedPublicSessionId = normalizePresentationSessionId(
    presentation.publicSessionId || ""
  );

  if (!clientIdRef.current) {
    clientIdRef.current = createPresentationClientId();
  }

  const clientId = clientIdRef.current;

  if (
    !normalizedRawSessionId &&
    !normalizedPublicSessionId &&
    !pendingSessionIdRef.current
  ) {
    pendingSessionIdRef.current = createPresentationSessionId();
  }

  const { sessionId, source: sessionSource } = resolvePresentationSession({
    explicitSessionId: normalizedRawSessionId,
    publicSessionId: normalizedPublicSessionId,
    fallbackSessionId: pendingSessionIdRef.current,
  });
  const isPublicSession = sessionSource === "public";
  const [slideIndex, setSlideIndex] = useState(0);
  const [channelStatus, setChannelStatus] = useState("idle");
  const [channelError, setChannelError] = useState<string | null>(null);
  const [hostIdentity, setHostIdentity] = useState<PresentationHostIdentity | null>(
    null
  );
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [screenLaunchStatus, setScreenLaunchStatus] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [hasScreenState, setHasScreenState] = useState(() => !isScreenMode);
  const [jumpQuery, setJumpQuery] = useState("");
  const [isJumpSearchOpen, setIsJumpSearchOpen] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [modalOrigin, setModalOrigin] = useState<PresentationModalOrigin | null>(null);
  const [isModalReady, setIsModalReady] = useState(false);
  const [countdownNow, setCountdownNow] = useState(() => Date.now());
  const [stageScaleByVariant, setStageScaleByVariant] = useState<
    Record<PresentationScaledSurfaceVariant, number>
  >({
    "console-current": 1,
    "console-next": 1,
  });
  const isActiveHost =
    hostIdentity?.clientId === clientId && hostIdentity?.role === participantRole;
  const currentSlide = slides[clampSlideIndex(slideIndex, totalSlides)];
  const currentSlideId = currentSlide?.id ?? "";
  const currentSlideLayout = currentSlide?.layout ?? "";
  const currentSlideCountdownAutoAdvance =
    currentSlide?.countdown?.autoAdvance ?? false;
  const renderedSlide =
    isScreenMode && !hasScreenState && !isPublicSession && !isActiveHost
      ? null
      : currentSlide;
  const presentationBranding = presentation.branding;
  const footerLeftText = getPresentationFooterLeftText(presentationBranding);
  const footerRightText = getPresentationFooterRightText(presentationBranding);
  const normalizedCode = normalizePresentationCode(projectDocument.code);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const buildPresentationUrl = (mode: "present" | "screen") => {
    const params = new URLSearchParams();
    params.set("mode", mode);

    if (!isPublicSession) {
      params.set("session", sessionId);
    }

    return `${origin}${location.pathname}?${params.toString()}`;
  };
  const presenterUrl = buildPresentationUrl("present");
  const screenUrl = buildPresentationUrl("screen");
  const remoteSearchParams = new URLSearchParams();
  remoteSearchParams.set("code", normalizedCode);
  if (!isPublicSession) {
    remoteSearchParams.set("session", sessionId);
  }
  const remoteUrl = `${origin}/remote?${remoteSearchParams.toString()}`;

  if (!screenWindowNameRef.current) {
    screenWindowNameRef.current = `presentation-screen-${normalizedCode}-${sessionId}`;
  }

  const countdownAutoAdvanceRef = useRef({
    slideId: "",
    hasAutoAdvanced: false,
    wasPositive: false,
  });
  const nextSlide = slideIndex < totalSlides - 1 ? slides[slideIndex + 1] : null;
  const currentCountdownState = useMemo(
    () => (currentSlide ? getPresentationCountdownState(currentSlide, countdownNow) : null),
    [countdownNow, currentSlide]
  );
  const jumpSearchEntries = useMemo(
    () =>
      slides.map((slide, index) => {
        const searchText = [
          `slide ${index + 1}`,
          slide.kicker || "",
          getQuestionKickerLabel(slide.kicker || ""),
          slide.title,
          ...(slide.titleLines ?? []),
          slide.subtitle || "",
          ...slide.bullets,
          ...slide.sections.flatMap((section) => [section.heading, ...section.bullets]),
          slide.caption || "",
          slide.sourceLabel || "",
          ...(slide.callouts?.flatMap((callout) => [
            callout.value,
            callout.label,
            callout.note || "",
          ]) ?? []),
          ...(slide.visual?.items.flatMap((item) => [
            item.label,
            item.value || "",
            item.note || "",
            item.detail || "",
            item.group || "",
          ]) ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return {
          index,
          slide,
          searchText,
        };
      }),
    [slides]
  );
  const normalizedJumpQuery = jumpQuery.trim().toLowerCase();
  const jumpSearchResults = useMemo(() => {
    if (!normalizedJumpQuery) {
      return jumpSearchEntries.slice(0, 8);
    }

    return jumpSearchEntries
      .filter((entry) => entry.searchText.includes(normalizedJumpQuery))
      .slice(0, 10);
  }, [jumpSearchEntries, normalizedJumpQuery]);

  const getRevealableCardsForIndex = useCallback(
    (index: number) =>
      getRevealableCardsForSlide(slides[clampSlideIndex(index, totalSlides)]),
    [slides, totalSlides]
  );

  const currentRevealableCards = useMemo(
    () => getRevealableCardsForSlide(currentSlide),
    [currentSlide]
  );
  const normalizedActiveCardIndex =
    typeof activeCardIndex === "number" &&
    activeCardIndex >= 0 &&
    activeCardIndex < currentRevealableCards.length
      ? activeCardIndex
      : null;
  const activeRevealCard =
    normalizedActiveCardIndex === null
      ? null
      : currentRevealableCards[normalizedActiveCardIndex] ?? null;
  const activeRevealCardId = activeRevealCard?.id ?? null;
  const currentSpeakerFlashcard = useMemo(
    () => getPresentationSpeakerFlashcard(currentSlide, normalizedActiveCardIndex),
    [currentSlide, normalizedActiveCardIndex]
  );
  const currentSpeakerFlashcardStatus =
    currentSpeakerFlashcard.context === "card" && currentRevealableCards.length
      ? `Detail ${(normalizedActiveCardIndex ?? 0) + 1} / ${currentRevealableCards.length}`
      : "Base slide";
  const buildProgress = useMemo(
    () =>
      currentRevealableCards.length
        ? {
            current: normalizedActiveCardIndex === null ? 0 : normalizedActiveCardIndex + 1,
            total: currentRevealableCards.length,
          }
        : {
            current: 0,
            total: 0,
          },
    [currentRevealableCards.length, normalizedActiveCardIndex]
  );

  const applyPresentationPosition = useCallback((
    nextSlideIndex: number,
    nextCardIndex: number | null = null
  ) => {
    const normalizedSlideIndex = clampSlideIndex(nextSlideIndex, totalSlides);
    const revealableCards = getRevealableCardsForIndex(normalizedSlideIndex);
    const normalizedCardIndex =
      typeof nextCardIndex === "number" &&
      nextCardIndex >= 0 &&
      nextCardIndex < revealableCards.length
        ? nextCardIndex
        : null;

    setSlideIndex(normalizedSlideIndex);
    setActiveCardIndex(normalizedCardIndex);
  }, [getRevealableCardsForIndex, totalSlides]);

  const advancePresentation = useCallback(() => {
    const revealableCards = getRevealableCardsForIndex(slideIndexRef.current);
    const currentCardIndex = activeCardIndexRef.current;

    if (
      revealableCards.length &&
      (currentCardIndex === null || currentCardIndex < revealableCards.length - 1)
    ) {
      applyPresentationPosition(
        slideIndexRef.current,
        currentCardIndex === null ? 0 : currentCardIndex + 1
      );
      return;
    }

    if (slideIndexRef.current < totalSlides - 1) {
      applyPresentationPosition(slideIndexRef.current + 1, null);
    }
  }, [applyPresentationPosition, getRevealableCardsForIndex, totalSlides]);

  const retreatPresentation = useCallback(() => {
    const revealableCards = getRevealableCardsForIndex(slideIndexRef.current);
    const currentCardIndex = activeCardIndexRef.current;

    if (revealableCards.length && currentCardIndex !== null) {
      applyPresentationPosition(
        slideIndexRef.current,
        currentCardIndex > 0 ? currentCardIndex - 1 : null
      );
      return;
    }

    if (slideIndexRef.current > 0) {
      const previousSlideIndex = slideIndexRef.current - 1;
      const previousRevealableCards = getRevealableCardsForIndex(previousSlideIndex);

      applyPresentationPosition(
        previousSlideIndex,
        previousRevealableCards.length ? previousRevealableCards.length - 1 : null
      );
    }
  }, [applyPresentationPosition, getRevealableCardsForIndex]);

  const retreatSlideOnly = useCallback(() => {
    if (slideIndexRef.current <= 0) {
      return;
    }

    applyPresentationPosition(slideIndexRef.current - 1, null);
  }, [applyPresentationPosition]);

  const advanceSlideOnly = useCallback(() => {
    if (slideIndexRef.current >= totalSlides - 1) {
      return;
    }

    applyPresentationPosition(slideIndexRef.current + 1, null);
  }, [applyPresentationPosition, totalSlides]);

  const openRevealCard = useCallback((cardIndex: number) => {
    const revealableCards = getRevealableCardsForIndex(slideIndexRef.current);
    if (cardIndex < 0 || cardIndex >= revealableCards.length) {
      return;
    }

    applyPresentationPosition(slideIndexRef.current, cardIndex);
  }, [applyPresentationPosition, getRevealableCardsForIndex]);

  const clearRevealCard = useCallback(() => {
    applyPresentationPosition(slideIndexRef.current, null);
  }, [applyPresentationPosition]);

  const executePresentationCommand = useCallback(
    (
      command: PresentationRemoteCommandType,
      slideIndexOverride?: number,
      cardIndexOverride?: number
    ) => {
      if (command === "prev") {
        retreatPresentation();
        return;
      }

      if (command === "next") {
        advancePresentation();
        return;
      }

      if (command === "prevSlide") {
        retreatSlideOnly();
        return;
      }

      if (command === "nextSlide") {
        advanceSlideOnly();
        return;
      }

      if (command === "goToSlide" && typeof slideIndexOverride === "number") {
        applyPresentationPosition(slideIndexOverride, null);
        return;
      }

      if (command === "goToCard" && typeof cardIndexOverride === "number") {
        openRevealCard(cardIndexOverride);
        return;
      }

      if (command === "clearCard") {
        clearRevealCard();
      }
    },
    [
      advancePresentation,
      advanceSlideOnly,
      applyPresentationPosition,
      clearRevealCard,
      openRevealCard,
      retreatPresentation,
      retreatSlideOnly,
    ]
  );

  const executePresentationCommandRef = useRef(executePresentationCommand);

  const setRevealCardElement = useCallback((cardId: string, node: HTMLElement | null) => {
    if (node) {
      revealCardElementsRef.current.set(cardId, node);
      return;
    }

    revealCardElementsRef.current.delete(cardId);
  }, []);

  const sessionState = useMemo<PresentationSessionState | null>(() => {
    if (!totalSlides || !currentSlide) {
      return null;
    }

    return {
      code: normalizedCode,
      sessionId,
      slideIndex,
      totalSlides,
      title: currentSlide.title,
      updatedAt: new Date().toISOString(),
      sourceClientId: clientId,
      sourceRole: participantRole,
      hostClientId: hostIdentity?.clientId || clientId,
      hostRole: hostIdentity?.role || participantRole,
      activeCardIndex: normalizedActiveCardIndex,
      activeCardId: activeRevealCardId,
      revealableCards: currentRevealableCards.map((card) => ({
        id: card.id,
        label: card.label,
      })),
      buildProgress,
    };
  }, [
    activeRevealCardId,
    buildProgress,
    currentRevealableCards,
    currentSlide,
    clientId,
    hostIdentity?.clientId,
    hostIdentity?.role,
    normalizedActiveCardIndex,
    normalizedCode,
    participantRole,
    sessionId,
    slideIndex,
    totalSlides,
  ]);

  const createAuthoritativeSessionState = useCallback(
    (
      baseState: PresentationSessionState | null
    ): PresentationSessionState | null => {
      if (!baseState) {
        return null;
      }

      const currentHost = hostIdentityRef.current;

      return {
        ...baseState,
        updatedAt: new Date().toISOString(),
        hostClientId: currentHost?.clientId || clientId,
        hostRole: currentHost?.role || participantRole,
      };
    },
    [clientId, participantRole]
  );

  useEffect(() => {
    executePresentationCommandRef.current = executePresentationCommand;
  }, [executePresentationCommand]);

  useEffect(() => {
    hostIdentityRef.current = hostIdentity;
  }, [hostIdentity]);

  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
    activeCardIndexRef.current = normalizedActiveCardIndex;
  }, [normalizedActiveCardIndex, slideIndex]);

  useEffect(() => {
    if (!currentSlideId || currentSlideLayout !== "countdown") {
      return;
    }

    let intervalId = 0;
    let timeoutId = 0;

    const syncClock = () => {
      setCountdownNow(Date.now());
    };

    syncClock();

    timeoutId = window.setTimeout(() => {
      syncClock();
      intervalId = window.setInterval(syncClock, 1000);
    }, 1000 - (Date.now() % 1000));

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [currentSlideId, currentSlideLayout]);

  useEffect(() => {
    if (currentSlideLayout !== "countdown" || !currentCountdownState) {
      countdownAutoAdvanceRef.current = {
        slideId: "",
        hasAutoAdvanced: false,
        wasPositive: false,
      };
      return;
    }

    const tracker = countdownAutoAdvanceRef.current;
    const remainingMs = currentCountdownState.remainingMs;
    const isPositive = remainingMs > 0;

    if (tracker.slideId !== currentSlideId) {
      countdownAutoAdvanceRef.current = {
        slideId: currentSlideId,
        hasAutoAdvanced: false,
        wasPositive: isPositive,
      };
      return;
    }

    if (
      isActiveHost &&
      currentSlideCountdownAutoAdvance &&
      tracker.wasPositive &&
      !isPositive &&
      !tracker.hasAutoAdvanced
    ) {
      countdownAutoAdvanceRef.current = {
        slideId: currentSlideId,
        hasAutoAdvanced: true,
        wasPositive: false,
      };
      advanceSlideOnly();
      return;
    }

    countdownAutoAdvanceRef.current = {
      ...tracker,
      wasPositive: isPositive,
    };
  }, [
    advanceSlideOnly,
    currentCountdownState,
    currentSlideCountdownAutoAdvance,
    currentSlideId,
    currentSlideLayout,
    isActiveHost,
  ]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();

    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useLayoutEffect(() => {
    if (!activeRevealCardId) {
      setModalOrigin(null);
      setIsModalReady(false);
      return;
    }

    if (prefersReducedMotion) {
      setModalOrigin(null);
      setIsModalReady(true);
      return;
    }

    let rafId = 0;
    let readyRafId = 0;

    setIsModalReady(false);

    rafId = window.requestAnimationFrame(() => {
      const modalElement = modalRef.current;
      const originElement = revealCardElementsRef.current.get(activeRevealCardId);

      if (!modalElement || !originElement) {
        setModalOrigin(null);
        setIsModalReady(true);
        return;
      }

      const modalRect = modalElement.getBoundingClientRect();
      const originRect = originElement.getBoundingClientRect();
      const modalCenterX = modalRect.left + modalRect.width / 2;
      const modalCenterY = modalRect.top + modalRect.height / 2;
      const originCenterX = originRect.left + originRect.width / 2;
      const originCenterY = originRect.top + originRect.height / 2;

      setModalOrigin({
        translateX: originCenterX - modalCenterX,
        translateY: originCenterY - modalCenterY,
        scaleX: Math.min(Math.max(originRect.width / modalRect.width, 0.42), 1),
        scaleY: Math.min(Math.max(originRect.height / modalRect.height, 0.34), 1),
      });

      readyRafId = window.requestAnimationFrame(() => {
        setIsModalReady(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(readyRafId);
    };
  }, [activeRevealCardId, prefersReducedMotion, slideIndex]);

  const setStageScaleShellNode = useCallback(
    (variant: PresentationScaledSurfaceVariant, node: HTMLDivElement | null) => {
      stageScaleShellRefs.current[variant] = node;
    },
    []
  );

  const updateStageScale = useCallback(
    (variant: PresentationScaledSurfaceVariant, width: number, height: number) => {
      if (width <= 0 || height <= 0) {
        return;
      }

      const availableWidth = Math.max(
        width - PRESENTATION_STAGE_SAFE_GUTTER_INLINE * 2,
        1
      );
      const availableHeight = Math.max(
        height - PRESENTATION_STAGE_SAFE_GUTTER_BLOCK * 2,
        1
      );

      const nextScale = Math.min(
        availableWidth / PRESENTATION_STAGE_CANVAS_WIDTH,
        availableHeight / PRESENTATION_STAGE_CANVAS_HEIGHT,
        1
      );

      if (!Number.isFinite(nextScale) || nextScale <= 0) {
        return;
      }

      setStageScaleByVariant((currentScales) => {
        if (Math.abs(currentScales[variant] - nextScale) < 0.001) {
          return currentScales;
        }

        return {
          ...currentScales,
          [variant]: nextScale,
        };
      });
    },
    []
  );

  useLayoutEffect(() => {
    if (!isPresenterMode || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const variant = entry.target.getAttribute(
          "data-presentation-scale-variant"
        ) as PresentationScaledSurfaceVariant | null;

        if (!variant) {
          return;
        }

        updateStageScale(variant, entry.contentRect.width, entry.contentRect.height);
      });
    });

    PRESENTATION_SCALED_SURFACE_VARIANTS.forEach((variant) => {
      const node = stageScaleShellRefs.current[variant];

      if (!node) {
        return;
      }

      observer.observe(node);
      updateStageScale(variant, node.clientWidth, node.clientHeight);
    });

    return () => {
      observer.disconnect();
    };
  }, [currentSlideId, isPresenterMode, nextSlide?.id, updateStageScale]);

  const sendPresentationCommand = useCallback(
    async (
      command: PresentationRemoteCommandType,
      slideIndexOverride?: number,
      cardIndexOverride?: number
    ) => {
      const channel = channelRef.current;
      if (!channel) {
        return "error";
      }

      return channel.send({
        type: "broadcast",
        event: PRESENTATION_REMOTE_COMMAND_EVENT,
        payload: {
          code: normalizedCode,
          sessionId,
          command,
          slideIndex: slideIndexOverride,
          cardIndex: cardIndexOverride,
          sentAt: new Date().toISOString(),
          senderClientId: clientId,
          senderRole: participantRole,
        },
      });
    },
    [clientId, normalizedCode, participantRole, sessionId]
  );

  const requestPresentationCommand = useCallback(
    (
      command: PresentationRemoteCommandType,
      slideIndexOverride?: number,
      cardIndexOverride?: number
    ) => {
      const currentHost = hostIdentityRef.current;
      const shouldApplyLocally =
        !presentation.remoteEnabled ||
        !sessionId ||
        channelStatus !== "SUBSCRIBED" ||
        !currentHost ||
        (currentHost.clientId === clientId &&
          currentHost.role === participantRole);

      if (shouldApplyLocally) {
        executePresentationCommandRef.current(
          command,
          slideIndexOverride,
          cardIndexOverride
        );
        return;
      }

      void sendPresentationCommand(command, slideIndexOverride, cardIndexOverride);
    },
    [
      channelStatus,
      clientId,
      participantRole,
      presentation.remoteEnabled,
      sendPresentationCommand,
      sessionId,
    ]
  );

  const requestAdvancePresentation = useCallback(() => {
    requestPresentationCommand("next");
  }, [requestPresentationCommand]);

  const requestRetreatPresentation = useCallback(() => {
    requestPresentationCommand("prev");
  }, [requestPresentationCommand]);

  const requestGoToSlide = useCallback(
    (nextSlideIndex: number) => {
      requestPresentationCommand("goToSlide", nextSlideIndex);
    },
    [requestPresentationCommand]
  );

  const requestGoToCard = useCallback(
    (cardIndex: number) => {
      requestPresentationCommand("goToCard", undefined, cardIndex);
    },
    [requestPresentationCommand]
  );

  const requestClearRevealCard = useCallback(() => {
    requestPresentationCommand("clearCard");
  }, [requestPresentationCommand]);

  const requestToggleRevealCard = useCallback(
    (cardIndex: number) => {
      if (activeCardIndexRef.current === cardIndex) {
        requestClearRevealCard();
        return;
      }

      requestGoToCard(cardIndex);
    },
    [requestClearRevealCard, requestGoToCard]
  );

  useEffect(() => {
    const needsMode = rawMode.trim().toLowerCase() !== presentationMode;
    const needsSession = isPublicSession
      ? Boolean(normalizedRawSessionId)
      : normalizedRawSessionId !== sessionId;

    if (!needsMode && !needsSession) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("mode", presentationMode);
    if (isPublicSession) {
      nextSearchParams.delete("session");
    } else {
      nextSearchParams.set("session", sessionId);
    }

    startTransition(() => {
      setSearchParams(nextSearchParams, {
        replace: true,
      });
    });
  }, [
    isPublicSession,
    normalizedRawSessionId,
    presentationMode,
    rawMode,
    searchParams,
    sessionId,
    setSearchParams,
  ]);

  useEffect(() => {
    if (!currentSlide) {
      return;
    }

    setSlideIndex((currentIndex) => clampSlideIndex(currentIndex, totalSlides));
  }, [currentSlide, totalSlides]);

  useEffect(() => {
    if (activeCardIndex !== null && normalizedActiveCardIndex === null) {
      setActiveCardIndex(null);
    }
  }, [activeCardIndex, normalizedActiveCardIndex]);

  useEffect(() => {
    setHasScreenState(!isScreenMode);
  }, [isScreenMode, sessionId]);

  useEffect(() => {
    if (isScreenMode && isActiveHost) {
      setHasScreenState(true);
    }
  }, [isActiveHost, isScreenMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };

    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isPresenterMode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTagName = (event.target as HTMLElement | null)?.tagName || "";
      if (activeTagName === "INPUT" || activeTagName === "TEXTAREA") {
        return;
      }

      if (event.key === "Escape" && activeCardIndexRef.current !== null) {
        event.preventDefault();
        requestClearRevealCard();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        requestAdvancePresentation();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        requestRetreatPresentation();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        requestGoToSlide(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        requestGoToSlide(Math.max(totalSlides - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isPresenterMode,
    requestAdvancePresentation,
    requestClearRevealCard,
    requestGoToSlide,
    requestRetreatPresentation,
    totalSlides,
  ]);

  useEffect(() => {
    if (!presentation.remoteEnabled || !sessionId) {
      hostIdentityRef.current = null;
      setHostIdentity(null);
      setChannelStatus("idle");
      return;
    }

    hostIdentityRef.current = null;
    setHostIdentity(null);

    let active = true;
    const channel = supabase.channel(
      createPresentationChannelName(normalizedCode, sessionId),
      {
        config: {
          presence: {
            key: clientId,
          },
        },
      }
    );
    channelRef.current = channel;

    const isCurrentClientHost = () => {
      const currentHost = hostIdentityRef.current;
      return (
        currentHost?.clientId === clientId && currentHost.role === participantRole
      );
    };

    const syncHostIdentity = () => {
      const nextHost = getPresentationActiveHost(
        listPresentationParticipants(
          channel.presenceState<PresentationParticipantPresence>()
        )
      );

      hostIdentityRef.current = nextHost;
      setHostIdentity((currentHost) =>
        arePresentationHostsEqual(currentHost, nextHost)
          ? currentHost
          : nextHost
      );
    };

    const broadcastCurrentState = async () => {
      if (!active || !isCurrentClientHost()) {
        return;
      }

      const currentSessionState = createAuthoritativeSessionState(
        sessionStateRef.current
      );
      if (!currentSessionState) {
        return;
      }

      const result = await channel.send({
        type: "broadcast",
        event: PRESENTATION_STATE_EVENT,
        payload: currentSessionState,
      });

      if (result !== "ok" && active) {
        setChannelError(
          "Remote sync is connected, but the current slide could not be shared."
        );
      }
    };

    channel
      .on("presence", { event: "sync" }, () => {
        if (!active) {
          return;
        }

        syncHostIdentity();

        if (isScreenMode && isCurrentClientHost()) {
          setHasScreenState(true);
        }

        if (isCurrentClientHost()) {
          void broadcastCurrentState();
        }
      })
      .on("broadcast", { event: PRESENTATION_REMOTE_COMMAND_EVENT }, ({ payload }) => {
        if (!active || !isCurrentClientHost()) {
          return;
        }

        const command = payload as PresentationRemoteCommand;
        executePresentationCommandRef.current(
          command.command,
          command.slideIndex,
          command.cardIndex
        );
      })
      .on("broadcast", { event: PRESENTATION_JOIN_REQUEST_EVENT }, () => {
        if (!active || !isCurrentClientHost()) {
          return;
        }

        void broadcastCurrentState();
      })
      .on("broadcast", { event: PRESENTATION_STATE_EVENT }, ({ payload }) => {
        if (!active || isCurrentClientHost()) {
          return;
        }

        const nextState = payload as PresentationSessionState;
        const currentHost = hostIdentityRef.current;

        if (
          currentHost &&
          nextState.hostClientId &&
          (nextState.hostClientId !== currentHost.clientId ||
            nextState.hostRole !== currentHost.role)
        ) {
          return;
        }

        setSlideIndex(clampSlideIndex(nextState.slideIndex, totalSlides));
        setActiveCardIndex(
          typeof nextState.activeCardIndex === "number"
            ? nextState.activeCardIndex
            : null
        );

        if (isScreenMode) {
          setHasScreenState(true);
        }

        setChannelError(null);
      })
      .subscribe(async (status) => {
        if (!active) {
          return;
        }

        setChannelStatus(status);

        if (status === "SUBSCRIBED") {
          setChannelError(null);

          const trackedAt = new Date().toISOString();
          const trackResult = await channel.track({
            clientId,
            role: participantRole,
            joinedAt: trackedAt,
          });

          if (!active) {
            return;
          }

          if (trackResult !== "ok") {
            setChannelError(
              "Live sync is connected, but the deck host could not be identified."
            );
            return;
          }

          syncHostIdentity();

          const result = await channel.send({
            type: "broadcast",
            event: PRESENTATION_JOIN_REQUEST_EVENT,
            payload: {
              code: normalizedCode,
              sessionId,
              joinedAt: trackedAt,
              clientId,
              role: participantRole,
            },
          });

          if (result !== "ok" && !isCurrentClientHost()) {
            setChannelError(
              "Connected to the session, but waiting for the live deck host to share the current slide."
            );
          }

          if (isCurrentClientHost()) {
            void broadcastCurrentState();
          }

          return;
        }

        if (status === "CHANNEL_ERROR") {
          setChannelError(
            isScreenMode
              ? "The presentation screen could not connect to live sync."
              : "Live presentation sync is unavailable right now. The deck still works locally on desktop."
          );
          return;
        }

        if (status === "TIMED_OUT") {
          setChannelError(
            isScreenMode
              ? "The presentation screen timed out while waiting for the live deck host."
              : "Live presentation sync timed out. The deck still works locally on desktop."
          );
        }
      });

    return () => {
      active = false;
      channelRef.current = null;
      hostIdentityRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [
    clientId,
    createAuthoritativeSessionState,
    isScreenMode,
    normalizedCode,
    participantRole,
    presentation.remoteEnabled,
    sessionId,
    totalSlides,
  ]);

  useEffect(() => {
    if (
      !isActiveHost ||
      !presentation.remoteEnabled ||
      channelStatus !== "SUBSCRIBED" ||
      !sessionState
    ) {
      return;
    }

    const channel = channelRef.current;
    if (!channel) {
      return;
    }

    void channel.send({
      type: "broadcast",
      event: PRESENTATION_STATE_EVENT,
      payload: createAuthoritativeSessionState(sessionState),
    });
  }, [
    channelStatus,
    createAuthoritativeSessionState,
    isActiveHost,
    presentation.remoteEnabled,
    sessionState,
  ]);

  const handleCopyRemoteLink = async () => {
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopyStatus("Remote link copied.");
    } catch {
      setCopyStatus("Remote link could not be copied.");
    }
  };

  const handleStartPresentation = () => {
    const screenWindow = window.open(screenUrl, screenWindowNameRef.current);

    if (!screenWindow) {
      setScreenLaunchStatus("Presentation popup blocked. Use the presentation link below.");
      return;
    }

    screenWindow.focus();
    setScreenLaunchStatus("Presentation screen opened.");
  };

  const handleToggleBrowserFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const handleJumpSelect = (nextSlideIndex: number) => {
    requestGoToSlide(nextSlideIndex);
    setJumpQuery("");
    setIsJumpSearchOpen(false);
  };

  useEffect(() => {
    if (!isPresenterMode || !isJumpSearchOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!jumpSearchRef.current?.contains(event.target as Node)) {
        setIsJumpSearchOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isJumpSearchOpen, isPresenterMode]);

  const renderSlideKicker = (slide: ProjectPresentationSlide) => {
    if (!slide.kicker) {
      return null;
    }

    if (slide.layout === "evidence") {
      return null;
    }

    if (slide.layout === "question") {
      return (
        <p className="presentation-slide-kicker presentation-slide-kicker--question">
          {getQuestionKickerLabel(slide.kicker)}
        </p>
      );
    }

    return (
      <div className="presentation-slide-meta">
        <span className="presentation-slide-kicker">{slide.kicker}</span>
      </div>
    );
  };

  const renderSlideHeadline = (
    slide: ProjectPresentationSlide,
    headingClassName = "presentation-slide-heading"
  ) => (
    <div className={headingClassName}>
      <h2 className={slide.titleLines?.length ? "presentation-slide-title-lines" : undefined}>
        {slide.titleLines?.length
          ? slide.titleLines.map((line, index) => (
              <span
                className={`presentation-slide-title-line${
                  slide.layout === "statement" && line.trim().toLowerCase() === "ai-native"
                    ? " presentation-slide-title-line--glow"
                    : ""
                }`}
                key={`${slide.id}-line-${index}`}
              >
                {line}
              </span>
            ))
          : slide.title}
      </h2>
      {slide.subtitle ? (
        <p className="presentation-slide-subtitle">{slide.subtitle}</p>
      ) : null}
    </div>
  );

  const renderSlideHeader = (
    slide: ProjectPresentationSlide,
    headingClassName = "presentation-slide-heading"
  ) => (
    <>
      {renderSlideKicker(slide)}
      {renderSlideHeadline(slide, headingClassName)}
    </>
  );

  const renderSections = (slide: ProjectPresentationSlide, columnCount: 2 | 3) => (
    <div
      className={`presentation-slide-section-grid presentation-slide-section-grid--${columnCount}`}
    >
      {slide.sections.map((section) => (
        <section key={section.id} className="presentation-slide-section">
          <p>{section.heading}</p>
          <ul>
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );

  const getPresentationItemStyle = (index: number): CSSProperties =>
    ({
      "--presentation-item-index": index,
    }) as CSSProperties;

  const renderVisualCard = ({
    slide,
    item,
    index,
    frontContent,
    faceClassName,
    shellClassName,
    interactiveEnabled = false,
    activeCardId = null,
    revealableCards = [],
  }: {
    slide: ProjectPresentationSlide;
    item: ProjectPresentationVisualItem;
    index: number;
    frontContent: ReactNode;
    faceClassName: string;
    shellClassName?: string;
    interactiveEnabled?: boolean;
    activeCardId?: string | null;
    revealableCards?: PresentationRevealableCard[];
  }) => {
    const cardId = buildPresentationVisualCardId(slide, item, index);
    const visualVariant = slide.visual?.variant ?? "";
    const isInteractive =
      interactiveEnabled &&
      Boolean(visualVariant) &&
      isInteractivePresentationVisualVariant(visualVariant) &&
      Boolean(item.detail);
    const revealableIndex = revealableCards.findIndex((card) => card.id === cardId);
    const isActive = activeCardId === cardId;
    const shellClasses = [
      "presentation-visual-card-shell",
      shellClassName,
      visualVariant ? `presentation-visual-card-shell--${visualVariant}` : "",
      isInteractive ? "is-interactive" : "is-static",
      isActive ? "is-active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (!isInteractive || revealableIndex < 0) {
      return (
        <div className={shellClasses} style={getPresentationItemStyle(index)}>
          <div
            className={`presentation-visual-card-face presentation-visual-card-face--static ${faceClassName}`}
          >
            {frontContent}
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        className={shellClasses}
        style={getPresentationItemStyle(index)}
        ref={(node) => setRevealCardElement(cardId, node)}
        onClick={() => requestToggleRevealCard(revealableIndex)}
        aria-pressed={isActive}
        aria-expanded={isActive}
        aria-label={`Open ${item.label} detail`}
      >
        <span
          className={`presentation-visual-card-face presentation-visual-card-face--static ${faceClassName}`}
        >
          {frontContent}
        </span>
      </button>
    );
  };

  const renderBulletStatements = (items: string[], className: string) =>
    items.length ? (
      <div className={className}>
        {items.map((item, index) => (
          <div
            key={item}
            className="presentation-statement-card"
            style={getPresentationItemStyle(index)}
          >
            <p>{item}</p>
          </div>
        ))}
      </div>
    ) : null;

  const renderSlideCaption = (slide: ProjectPresentationSlide) =>
    slide.caption ? <p className="presentation-slide-caption">{slide.caption}</p> : null;

  const renderSlideSource = (slide: ProjectPresentationSlide) =>
    slide.sourceLabel ? (
      <p className="presentation-slide-source-label">{slide.sourceLabel}</p>
    ) : null;

  const renderSlideCallouts = (slide: ProjectPresentationSlide) =>
    slide.callouts?.length ? (
      <div
        className={`presentation-slide-callouts presentation-slide-callouts--${
          slide.callouts.length >= 4 ? "dense" : "standard"
        }`}
      >
        {slide.callouts.map((callout, index) => (
          <div
            className={`presentation-slide-callout-card${
              /\d/.test(callout.value) ? "" : " is-textual"
            }`}
            key={`${slide.id}-${callout.value}-${callout.label}`}
            style={getPresentationItemStyle(index)}
          >
            <strong>{callout.value}</strong>
            <span>{callout.label}</span>
            {callout.note ? <p>{callout.note}</p> : null}
          </div>
        ))}
      </div>
    ) : null;

  const renderSlideVisualFor = (
    slide: ProjectPresentationSlide,
    {
      interactiveEnabled = false,
      activeCardId = null,
      revealableCards = [],
    }: {
      interactiveEnabled?: boolean;
      activeCardId?: string | null;
      revealableCards?: PresentationRevealableCard[];
    } = {}
  ) => {
    const visual = slide.visual;
    if (!visual?.variant) {
      return null;
    }

    if (visual.variant === "network-hero") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--network-hero">
          <div className="presentation-network-grid" aria-hidden="true">
            {visual.items.map((item, index) => (
              <div
                className={`presentation-network-node presentation-network-node--${index + 1}`}
                key={`${slide.id}-network-${item.label}`}
                style={getPresentationItemStyle(index)}
              >
                <span>{item.label}</span>
                {item.value ? <strong>{item.value}</strong> : null}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (
      visual.variant === "workflow-shift" ||
      visual.variant === "workflow-evolution"
    ) {
      return (
        <div
          className={`presentation-slide-visual presentation-slide-visual--${
            visual.variant === "workflow-evolution"
              ? "workflow-evolution"
              : "workflow-shift"
          }`}
        >
          <div className="presentation-flow-track">
            {visual.items.map((item, index) => (
              <div className="presentation-flow-step-wrap" key={`${slide.id}-flow-${item.label}`}>
                {renderVisualCard({
                  slide,
                  item,
                  index,
                  interactiveEnabled,
                  activeCardId,
                  revealableCards,
                  faceClassName: "presentation-flow-step",
                  frontContent: (
                    <>
                      <span>{item.label}</span>
                      {item.note ? <p>{item.note}</p> : null}
                    </>
                  ),
                })}
                {index < visual.items.length - 1 ? (
                  <div className="presentation-flow-arrow" aria-hidden="true">
                    <span />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (visual.variant === "impact-compare") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--impact-compare">
          {visual.items.map((item, index) => (
            <div
              className="presentation-bar-row"
              key={`${slide.id}-bar-${item.label}`}
              style={getPresentationItemStyle(index)}
            >
              <div className="presentation-bar-copy">
                <span>{item.label}</span>
                {item.note ? <p>{item.note}</p> : null}
              </div>
              <div className="presentation-bar-track">
                <div
                  className="presentation-bar-fill"
                  style={{ width: `${Math.max(item.metric ?? 0, 8)}%` }}
                />
              </div>
              {item.value ? <strong>{item.value}</strong> : null}
            </div>
          ))}
        </div>
      );
    }

    if (visual.variant === "data-foundation") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--data-foundation">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              shellClassName: `presentation-foundation-card--${index + 1}`,
              faceClassName: "presentation-foundation-card",
              frontContent: <span>{item.label}</span>,
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "maturity-staircase") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--maturity-staircase">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              shellClassName: "presentation-stair-step-shell",
              faceClassName: "presentation-stair-step",
              frontContent: (
                <>
                  <span>{item.group}</span>
                  <strong>{item.label}</strong>
                </>
              ),
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "decision-gates") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--decision-gates">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              faceClassName: "presentation-gate-node",
              frontContent: (
                <>
                  <div className="presentation-gate-marker">{index + 1}</div>
                  <span>{item.label}</span>
                </>
              ),
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "governance-timeline") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--governance-timeline">
          {visual.items.map((item, index) => (
            <div
              className="presentation-timeline-shell"
              key={`${slide.id}-timeline-${item.label}`}
              style={getPresentationItemStyle(index)}
            >
              {renderVisualCard({
                slide,
                item,
                index,
                interactiveEnabled,
                activeCardId,
                revealableCards,
                faceClassName: "presentation-timeline-card",
                frontContent: (
                  <>
                    {item.value ? <strong>{item.value}</strong> : null}
                    <span>{item.label}</span>
                  </>
                ),
              })}
              {index < visual.items.length - 1 ? (
                <div className="presentation-timeline-link" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      );
    }

    if (visual.variant === "systems-stack") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--systems-stack">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              shellClassName: `presentation-system-layer--${index + 1}`,
              faceClassName: "presentation-system-layer",
              frontContent: (
                <>
                  <strong>{item.label}</strong>
                  {item.note ? <span>{item.note}</span> : null}
                </>
              ),
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "infrastructure-growth") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--infrastructure-growth">
          {visual.items.map((item, index) => (
            <div
              className="presentation-growth-card"
              key={`${slide.id}-growth-${item.label}`}
              style={getPresentationItemStyle(index)}
            >
              <div className="presentation-growth-bar">
                <span
                  className="presentation-growth-fill"
                  style={{
                    height: `max(${Math.max(item.metric ?? 0, 0)}%, 16px)`,
                  }}
                />
              </div>
              {item.value ? <strong>{item.value}</strong> : null}
              <span>{item.label}</span>
              {item.note ? <p>{item.note}</p> : null}
            </div>
          ))}
        </div>
      );
    }

    if (visual.variant === "leaders-laggards") {
      const leaders = visual.items.filter((item) => item.group === "Leaders");
      const laggards = visual.items.filter((item) => item.group === "Laggards");

      return (
        <div className="presentation-slide-visual presentation-slide-visual--leaders-laggards">
          <div
            className="presentation-side-panel presentation-side-panel--leaders"
            style={getPresentationItemStyle(0)}
          >
            <strong>Leaders</strong>
            <ul>
              {leaders.map((item) => (
                <li key={`${slide.id}-leaders-${item.label}`}>{item.label}</li>
              ))}
            </ul>
          </div>
          <div
            className="presentation-side-panel presentation-side-panel--laggards"
            style={getPresentationItemStyle(1)}
          >
            <strong>Laggards</strong>
            <ul>
              {laggards.map((item) => (
                <li key={`${slide.id}-laggards-${item.label}`}>{item.label}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (visual.variant === "adoption-value-gap") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--adoption-value-gap">
          {visual.items.map((item, index) => (
            <div
              className="presentation-gap-bar-card"
              key={`${slide.id}-gap-${item.label}`}
              style={getPresentationItemStyle(index)}
            >
              <div className="presentation-gap-bar-track">
                <span
                  className="presentation-gap-bar-fill"
                  style={{ height: `${Math.max(item.metric ?? 0, 10)}%` }}
                />
              </div>
              <p>{item.group}</p>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="presentation-gap-curve presentation-gap-curve--adoption" aria-hidden="true" />
          <div className="presentation-gap-curve presentation-gap-curve--value" aria-hidden="true" />
        </div>
      );
    }

    if (visual.variant === "human-plus-system") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--human-plus-system">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              faceClassName: "presentation-human-chip",
              frontContent: <span>{item.label}</span>,
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "agentic-readiness") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--agentic-readiness">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              faceClassName: "presentation-agentic-card",
              frontContent: (
                <>
                  <p>{item.group}</p>
                  {item.value ? <strong>{item.value}</strong> : null}
                  <span>{item.label}</span>
                </>
              ),
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "capability-pillars") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--capability-pillars">
          {visual.items.map((item, index) => (
            renderVisualCard({
              slide,
              item,
              index,
              interactiveEnabled,
              activeCardId,
              revealableCards,
              faceClassName: "presentation-capability-pillar",
              frontContent: (
                <>
                  <strong>{item.label}</strong>
                  {item.note ? <span>{item.note}</span> : null}
                </>
              ),
            })
          ))}
        </div>
      );
    }

    if (visual.variant === "closing-orbit") {
      return (
        <div className="presentation-slide-visual presentation-slide-visual--closing-orbit">
          {visual.items.map((item, index) => (
            <div
              className={`presentation-orbit-chip presentation-orbit-chip--${index + 1}`}
              key={`${slide.id}-orbit-${item.label}`}
              style={getPresentationItemStyle(index)}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderSlideFooter = (
    slide: ProjectPresentationSlide,
    variant: "default" | "stage-rail" = "default"
  ) =>
    shouldShowPresentationFooter(presentationBranding, slide.layout) ? (
      <footer
        className={`presentation-slide-footer${
          variant === "stage-rail" ? " presentation-slide-footer--stage-rail" : ""
        }`}
      >
        <span>{footerLeftText}</span>
        <span>{footerRightText}</span>
      </footer>
    ) : null;

  const renderActiveCardModal = () =>
    activeRevealCard ? (
      <div
        key={activeRevealCard.id}
        className={`presentation-card-modal-backdrop${isModalReady ? " is-ready" : ""}`}
        role="presentation"
        onClick={isPresenterMode ? requestClearRevealCard : undefined}
      >
        <div
          ref={modalRef}
          className={`presentation-card-modal${isModalReady ? " is-ready" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`presentation-card-modal-title-${activeRevealCard.id}`}
          onClick={(event) => event.stopPropagation()}
          style={
            {
              "--presentation-modal-origin-x": `${modalOrigin?.translateX ?? 0}px`,
              "--presentation-modal-origin-y": `${modalOrigin?.translateY ?? 0}px`,
              "--presentation-modal-origin-scale-x": `${modalOrigin?.scaleX ?? 0.94}`,
              "--presentation-modal-origin-scale-y": `${modalOrigin?.scaleY ?? 0.92}`,
            } as CSSProperties
          }
        >
          {isPresenterMode ? (
            <button
              type="button"
              className="presentation-card-modal-close"
              onClick={requestClearRevealCard}
              aria-label="Close detail"
            >
              ×
            </button>
          ) : null}
          <div className="presentation-card-modal-header">
            <span>{activeRevealCard.group || "Detail"}</span>
            {buildProgress.total ? (
              <strong>{`Detail ${buildProgress.current} / ${buildProgress.total}`}</strong>
            ) : null}
          </div>
          <h3 id={`presentation-card-modal-title-${activeRevealCard.id}`}>
            {activeRevealCard.label}
          </h3>
          {activeRevealCard.value ? (
            <p className="presentation-card-modal-value">{activeRevealCard.value}</p>
          ) : null}
          <p className="presentation-card-modal-copy">{activeRevealCard.detail}</p>
        </div>
      </div>
    ) : null;

  const renderSlideContent = (
    slide: ProjectPresentationSlide,
    {
      interactiveEnabled = false,
      activeCardId = null,
      revealableCards = [],
      surfaceVariant = "default",
    }: {
      interactiveEnabled?: boolean;
      activeCardId?: string | null;
      revealableCards?: PresentationRevealableCard[];
      surfaceVariant?: PresentationSurfaceVariant;
    } = {}
  ) => {
    if (slide.layout === "countdown") {
      const countdownState = getPresentationCountdownState(slide, countdownNow);
      const countdownSegments = countdownState?.segments ?? ["00", "00", "00"];
      const countdownAriaLabel = `${countdownSegments[0]} hours ${countdownSegments[1]} minutes ${countdownSegments[2]} seconds`;

      return (
        <div className="presentation-slide-content presentation-slide-content--countdown">
          <div className="presentation-slide-countdown-shell">
            {renderSlideKicker(slide)}
            {renderSlideHeadline(
              slide,
              "presentation-slide-heading presentation-slide-heading--countdown"
            )}
            <div
              className="presentation-slide-countdown-clock"
              role="timer"
              aria-live="off"
              aria-atomic="true"
              aria-label={countdownAriaLabel}
            >
              {countdownSegments.map((segment, index) => (
                <div className="presentation-slide-countdown-part" key={`${slide.id}-${index}`}>
                  <span className="presentation-slide-countdown-segment">{segment}</span>
                  <span className="presentation-slide-countdown-unit">
                    {index === 0 ? "hours" : index === 1 ? "minutes" : "seconds"}
                  </span>
                </div>
              ))}
              <span
                className="presentation-slide-countdown-separator presentation-slide-countdown-separator--first"
                aria-hidden="true"
              >
                //
              </span>
              <span
                className="presentation-slide-countdown-separator presentation-slide-countdown-separator--second"
                aria-hidden="true"
              >
                //
              </span>
            </div>
            {slide.countdown?.showTargetLabel !== false && countdownState?.targetLabel ? (
              <p className="presentation-slide-countdown-target">
                {countdownState.targetLabel}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    if (slide.layout === "title") {
      return (
        <div className="presentation-slide-content presentation-slide-content--title">
          <div className="presentation-slide-title-hero">
            {renderSlideKicker(slide)}
            {renderSlideHeadline(slide, "presentation-slide-heading presentation-slide-heading--title")}
            {renderBulletStatements(slide.bullets, "presentation-slide-title-points")}
          </div>
          {renderSlideVisualFor(slide, {
            interactiveEnabled,
            activeCardId,
            revealableCards,
          })}
        </div>
      );
    }

    if (slide.layout === "intro") {
      const usesEdgeAnchoredIntro =
        isScreenMode ||
        surfaceVariant === "console-current" ||
        surfaceVariant === "console-next";

      const introCopyContent = (
        <div
          className={`presentation-slide-intro-copy${
            isScreenMode ? " presentation-slide-intro-copy--screen" : ""
          }${
            surfaceVariant === "console-current" || surfaceVariant === "console-next"
              ? " presentation-slide-intro-copy--console"
              : ""
          }`}
        >
          {introHeroBadges.length ? (
            <div className="presentation-slide-intro-badges" aria-hidden="true">
              {introHeroBadges.map((badge) => (
                <div
                  className="presentation-slide-intro-badge"
                  key={`presentation-intro-badge-${badge.src}`}
                >
                  <img src={badge.src} alt="" />
                </div>
              ))}
            </div>
          ) : null}
          {renderSlideHeadline(
            slide,
            "presentation-slide-heading presentation-slide-heading--intro"
          )}
          <div className="presentation-slide-intro-marquee" aria-hidden="true">
            <div className="presentation-slide-intro-marquee-row">
              <Marquee gradient={false} speed={36} autoFill direction="right">
                {introMarqueeTop.map((item) => (
                  <div
                    className="presentation-slide-intro-logo"
                    key={`presentation-intro-top-${item.name}`}
                  >
                    <img src={item.logo} alt="" />
                  </div>
                ))}
              </Marquee>
            </div>
            <div className="presentation-slide-intro-marquee-row">
              <Marquee gradient={false} speed={42} autoFill>
                {introMarqueeBottom.map((item) => (
                  <div
                    className="presentation-slide-intro-logo"
                    key={`presentation-intro-bottom-${item.name}`}
                  >
                    <img src={item.logo} alt="" />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      );

      if (usesEdgeAnchoredIntro) {
        return (
          <>
            <div
              className={`presentation-slide-content presentation-slide-content--intro${
                isScreenMode
                  ? " presentation-slide-content--intro-screen"
                  : " presentation-slide-content--intro-console"
              }`}
            >
              {introCopyContent}
            </div>

            {slide.mediaUrl ? (
              <div
                className={`presentation-slide-intro-media${
                  isScreenMode
                    ? " presentation-slide-intro-media--screen-edge"
                    : " presentation-slide-intro-media--console-edge"
                }`}
              >
                <img src={slide.mediaUrl} alt={slide.title} />
              </div>
            ) : null}
          </>
        );
      }

      return (
        <>
          <div className="presentation-slide-content presentation-slide-content--intro">
            {introCopyContent}

            {slide.mediaUrl ? (
              <div className="presentation-slide-intro-media presentation-slide-intro-media--fullscreen-anchor">
                <img src={slide.mediaUrl} alt={slide.title} />
              </div>
            ) : null}
          </div>
        </>
      );
    }

    if (slide.layout === "question") {
      return (
        <div className="presentation-slide-content presentation-slide-content--question">
          <div className="presentation-slide-question-shell">
            {renderSlideKicker(slide)}
            {renderSlideHeadline(
              slide,
              "presentation-slide-heading presentation-slide-heading--question"
            )}
            {renderBulletStatements(slide.bullets, "presentation-question-points")}
          </div>
          {renderSlideVisualFor(slide, {
            interactiveEnabled,
            activeCardId,
            revealableCards,
          })}
        </div>
      );
    }

    if (slide.layout === "overview") {
      return (
        <div className="presentation-slide-content presentation-slide-content--overview">
          <div className="presentation-slide-header">
            {renderSlideHeader(slide)}
          </div>
          <ul className="presentation-slide-bullets presentation-slide-bullets--overview">
            {slide.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (slide.layout === "evidence") {
      return (
        <div className="presentation-slide-content presentation-slide-content--evidence">
          <div className="presentation-slide-evidence-copy">
            <div className="presentation-slide-header">
              {renderSlideHeader(slide)}
            </div>
            {slide.bullets.length ? (
              <ul className="presentation-slide-bullets presentation-slide-bullets--compact">
                {slide.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {renderSlideCaption(slide)}
            {renderSlideSource(slide)}
          </div>
          <div className="presentation-slide-evidence-visual-shell">
            {renderSlideVisualFor(slide, {
              interactiveEnabled,
              activeCardId,
              revealableCards,
            })}
            {renderSlideCallouts(slide)}
          </div>
        </div>
      );
    }

    if (slide.layout === "capabilities") {
      return (
        <div className="presentation-slide-content presentation-slide-content--capabilities">
          <div className="presentation-slide-header">
            {renderSlideHeader(slide)}
          </div>
          {renderSlideCallouts(slide)}
          {renderSlideVisualFor(slide, {
            interactiveEnabled,
            activeCardId,
            revealableCards,
          })}
          {slide.bullets.length ? (
            <div className="presentation-capability-summary">
              {slide.bullets.map((bullet) => (
                <div className="presentation-capability-summary-item" key={bullet}>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          ) : null}
          {renderSlideCaption(slide)}
        </div>
      );
    }

    if (slide.layout === "split-2" || slide.layout === "split-3") {
      return (
        <div className="presentation-slide-content presentation-slide-content--split">
          <div className="presentation-slide-header">
            {renderSlideHeader(slide)}
          </div>
          {renderSections(slide, slide.layout === "split-3" ? 3 : 2)}
        </div>
      );
    }

    if (slide.layout === "closing") {
      const isQuoteClosing = !slide.bullets.length && !slide.visual;

      if (isQuoteClosing) {
        return (
          <div className="presentation-slide-content presentation-slide-content--closing presentation-slide-content--closing-quote">
            <div className="presentation-slide-closing-copy presentation-slide-closing-copy--quote">
              {renderSlideKicker(slide)}
              {renderSlideHeadline(
                slide,
                "presentation-slide-heading presentation-slide-heading--closing-quote"
              )}
              {renderSlideCaption(slide)}
            </div>
          </div>
        );
      }

      return (
        <div className="presentation-slide-content presentation-slide-content--closing">
          <div className="presentation-slide-closing-copy">
            <div className="presentation-slide-header">
              {renderSlideHeader(slide)}
            </div>
            {renderSlideCaption(slide)}
          </div>
          <div className="presentation-slide-closing-points">
            <ul className="presentation-slide-bullets presentation-slide-bullets--closing">
              {slide.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          {renderSlideVisualFor(slide, {
            interactiveEnabled,
            activeCardId,
            revealableCards,
          })}
        </div>
      );
    }

    if (slide.layout === "statement") {
      return (
        <div className="presentation-slide-content presentation-slide-content--statement">
          <div className="presentation-slide-statement-shell">
            {renderSlideKicker(slide)}
            {renderSlideHeadline(
              slide,
              "presentation-slide-heading presentation-slide-heading--statement"
            )}
            {renderSlideCaption(slide)}
          </div>
        </div>
      );
    }

    if (slide.layout === "qr") {
      return (
        <div className="presentation-slide-content presentation-slide-content--qr">
          <div className="presentation-slide-qr-shell">
            {renderSlideKicker(slide)}
            {renderSlideHeadline(
              slide,
              "presentation-slide-heading presentation-slide-heading--qr"
            )}
            {slide.qrValue ? (
              <div className="presentation-slide-qr-plate">
                <QRCodeSVG
                  value={slide.qrValue}
                  size={420}
                  bgColor="#ffffff"
                  fgColor="#03111b"
                  level="M"
                  includeMargin
                />
              </div>
            ) : null}
            {slide.qrLabel ? (
              <p className="presentation-slide-qr-label">{slide.qrLabel}</p>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="presentation-slide-content presentation-slide-content--bullets">
            <div className="presentation-slide-header">
              {renderSlideHeader(slide)}
            </div>
        <ul className="presentation-slide-bullets">
          {slide.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderStageSurface = ({
    slide,
    interactiveEnabled = false,
    activeCardId = null,
    revealableCards = [],
    className,
    surfaceVariant = isScreenMode ? "screen" : "default",
  }: {
    slide: ProjectPresentationSlide;
    interactiveEnabled?: boolean;
    activeCardId?: string | null;
    revealableCards?: PresentationRevealableCard[];
    className?: string;
    surfaceVariant?: PresentationSurfaceVariant;
  }) => {
    const scaledSurfaceVariant = isScaledPresentationSurface(surfaceVariant)
      ? surfaceVariant
      : null;
    const stageSurface = (
      <>
        <article className={`presentation-slide presentation-slide--${slide.layout}`}>
          {renderSlideContent(slide, {
            interactiveEnabled,
            activeCardId,
            revealableCards,
            surfaceVariant,
          })}
        </article>
        {renderSlideFooter(slide, "stage-rail")}
      </>
    );

    return (
      <div
        className={`presentation-stage-frame presentation-stage-frame--screenlike${
          className ? ` ${className}` : ""
        }`}
      >
        {scaledSurfaceVariant ? (
          (() => {
            const stageScale = stageScaleByVariant[scaledSurfaceVariant];
            return (
              <div
                className={`presentation-stage-scale-shell presentation-stage-scale-shell--${scaledSurfaceVariant}`}
                data-presentation-scale-variant={scaledSurfaceVariant}
                ref={(node) => {
                  setStageScaleShellNode(scaledSurfaceVariant, node);
                }}
              >
                <div
                  className={`presentation-stage-scale-viewport presentation-stage-scale-viewport--${scaledSurfaceVariant}`}
                  style={
                    {
                      "--presentation-stage-scaled-width": `${
                        PRESENTATION_STAGE_CANVAS_WIDTH * stageScale
                      }px`,
                      "--presentation-stage-scaled-height": `${
                        PRESENTATION_STAGE_CANVAS_HEIGHT * stageScale
                      }px`,
                    } as CSSProperties
                  }
                >
                  <div
                    className={`presentation-stage-scale-canvas presentation-stage-scale-canvas--${scaledSurfaceVariant}`}
                    style={
                      {
                        "--presentation-stage-canvas-width": PRESENTATION_STAGE_CANVAS_WIDTH,
                        "--presentation-stage-canvas-height": PRESENTATION_STAGE_CANVAS_HEIGHT,
                        "--presentation-stage-scale": stageScale,
                      } as CSSProperties
                    }
                  >
                    {stageSurface}
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          stageSurface
        )}
      </div>
    );
  };

  if (!currentSlide) {
    return (
      <main className="presentation-page">
        <section className="presentation-empty-state">
          <h1>{projectDocument.title}</h1>
          <p>This presentation does not have any slides yet.</p>
        </section>
      </main>
    );
  }

  if (isScreenMode) {
    return (
      <div
        className="presentation-page presentation-page--screen"
        data-presentation-theme={presentation.theme}
      >
        <main className="presentation-screen-shell">
          {renderedSlide ? (
            renderStageSurface({
              slide: renderedSlide,
              activeCardId: activeRevealCard?.id ?? null,
              revealableCards: currentRevealableCards,
              className: "presentation-stage-frame--screen-surface",
              surfaceVariant: "screen",
            })
          ) : (
            <section className="presentation-empty-state presentation-empty-state--screen">
              <h1>{projectDocument.title}</h1>
              <p>
                Connected to session <strong>{sessionId}</strong>. Waiting for the live deck host
                to share the current slide.
              </p>
            </section>
          )}
          {channelError ? (
            <div className="presentation-screen-status" role="status">
              {channelError}
            </div>
          ) : null}
        </main>

        {renderActiveCardModal()}

        <div className="presentation-screen-actions">
          <button
            type="button"
            className="presentation-screen-action-button"
            onClick={() => {
              void handleToggleBrowserFullscreen();
            }}
          >
            {isBrowserFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="presentation-page presentation-page--presenter" data-presentation-theme={presentation.theme}>
      <main className="presentation-shell">
        <header className="presentation-shell-header presentation-shell-header--console">
          <div className="presentation-console-toolbar">
            <div className="presentation-console-toolbar-brand">
              <p className="presentation-shell-kicker">{heroKicker}</p>
              <strong>{projectDocument.title}</strong>
            </div>

            <div className="presentation-shell-meta presentation-shell-meta--console">
              <span>{projectDocument.code}</span>
              <span>{`${slideIndex + 1} / ${totalSlides}`}</span>
              <span>{`Session ${sessionId}`}</span>
              <span>{realtimeStatusLabel(channelStatus)}</span>
            </div>

            <div className="presentation-shell-action-row presentation-shell-action-row--console">
              <button
                type="button"
                className="presentation-shell-button presentation-shell-button--accent"
                onClick={handleStartPresentation}
              >
                Start Presentation
              </button>
              {presentation.remoteEnabled ? (
                <button
                  type="button"
                  className="presentation-shell-button"
                  onClick={() => setIsPairingOpen(true)}
                >
                  Pair Phone
                </button>
              ) : null}
            </div>
          </div>

          {screenLaunchStatus ? (
            <p className="presentation-console-link-status">{screenLaunchStatus}</p>
          ) : null}
        </header>

        {channelError ? (
          <div className="presentation-status-banner" role="status">
            {channelError}
          </div>
        ) : null}

        <div className="presentation-workspace presentation-workspace--console">
          <section className="presentation-console-main">
            <section className="presentation-stage-shell presentation-stage-shell--console">
              <div className="presentation-console-section-heading">
                <p>Current slide</p>
                <strong>
                  {buildProgress.total
                    ? `${slideIndex + 1}.${buildProgress.current || 0}`
                    : `Slide ${slideIndex + 1}`}
                </strong>
              </div>

              {renderStageSurface({
                slide: currentSlide,
                interactiveEnabled: true,
                activeCardId: activeRevealCard?.id ?? null,
                revealableCards: currentRevealableCards,
                className: "presentation-stage-frame--console-current",
                surfaceVariant: "console-current",
              })}

              <div className="presentation-stage-controls">
                <button
                  type="button"
                  className="presentation-nav-button"
                  onClick={requestRetreatPresentation}
                  disabled={slideIndex === 0 && normalizedActiveCardIndex === null}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="presentation-nav-button presentation-nav-button--accent"
                  onClick={requestAdvancePresentation}
                  disabled={
                    slideIndex >= totalSlides - 1 &&
                    (!currentRevealableCards.length ||
                      normalizedActiveCardIndex === currentRevealableCards.length - 1)
                  }
                >
                  Next
                </button>
              </div>
            </section>

            <section className="presentation-sidebar-section presentation-sidebar-section--notes">
              <div className="presentation-sidebar-heading presentation-sidebar-heading--notes">
                <p>Speaker flashcard</p>
                <strong>{currentSpeakerFlashcardStatus}</strong>
              </div>
              <article className="presentation-speaker-flashcard">
                <div className="presentation-speaker-flashcard-meta">
                  <span>{currentSpeakerFlashcard.eyebrow}</span>
                  <strong>
                    {currentSpeakerFlashcard.context === "card"
                      ? "Synced detail"
                      : "Current slide"}
                  </strong>
                </div>
                <h3>{currentSpeakerFlashcard.title}</h3>
                {currentSpeakerFlashcard.subtitle ? (
                  <p className="presentation-speaker-flashcard-subtitle">
                    {currentSpeakerFlashcard.subtitle}
                  </p>
                ) : null}
                <ol className="presentation-speaker-flashcard-points">
                  {currentSpeakerFlashcard.lines.map((note, index) => (
                    <li key={`${currentSpeakerFlashcard.id}-${index}`}>{note}</li>
                  ))}
                </ol>
              </article>
            </section>

            <section className="presentation-sidebar-section presentation-sidebar-section--upcoming">
              <div className="presentation-sidebar-heading presentation-sidebar-heading--upcoming">
                <p>Next slide</p>
                <strong>
                  {nextSlide ? `Slide ${slideIndex + 2}` : "Final slide"}
                </strong>
              </div>
              {nextSlide ? (
                <div className="presentation-next-thumbnail">
                  {renderStageSurface({
                    slide: nextSlide,
                    className: "presentation-stage-frame--console-next",
                    surfaceVariant: "console-next",
                  })}
                </div>
              ) : (
                <p className="presentation-sidebar-meta">
                  You are on the final slide of the deck.
                </p>
              )}
            </section>
          </section>

          <aside className="presentation-sidebar presentation-sidebar--console">
            <section className="presentation-sidebar-section presentation-sidebar-section--jump">
              <div className="presentation-sidebar-heading">
                <p>Jump to slide</p>
                <strong>{totalSlides} total slides</strong>
              </div>

              <div className="presentation-jump-search" ref={jumpSearchRef}>
                <input
                  type="text"
                  value={jumpQuery}
                  onChange={(event) => {
                    setJumpQuery(event.target.value);
                    setIsJumpSearchOpen(true);
                  }}
                  onFocus={() => setIsJumpSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsJumpSearchOpen(false);
                    }

                    if (event.key === "Enter" && jumpSearchResults.length) {
                      event.preventDefault();
                      handleJumpSelect(jumpSearchResults[0].index);
                    }
                  }}
                  placeholder="Search slide title or content"
                  aria-label="Search slides"
                />
                {isJumpSearchOpen ? (
                  <div className="presentation-jump-search-results">
                    {jumpSearchResults.length ? (
                      jumpSearchResults.map((entry) => (
                        <button
                          key={entry.slide.id}
                          type="button"
                          className="presentation-jump-search-result"
                          onClick={() => handleJumpSelect(entry.index)}
                        >
                          <span>{entry.slide.kicker || `Slide ${entry.index + 1}`}</span>
                          <strong>{entry.slide.title}</strong>
                        </button>
                      ))
                    ) : (
                      <p className="presentation-jump-search-empty">No slides match that search.</p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="presentation-slide-jump-list">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`presentation-slide-jump${
                      index === slideIndex ? " is-active" : ""
                    }`}
                    onClick={() => requestGoToSlide(index)}
                  >
                    <span>{slide.kicker || `Slide ${index + 1}`}</span>
                    <strong>{slide.title}</strong>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {renderActiveCardModal()}

      {isPairingOpen ? (
        <div className="presentation-pairing-dialog" role="dialog" aria-modal="true">
          <div className="presentation-pairing-panel">
            <div className="presentation-pairing-header">
              <div>
                <p>Pair phone</p>
                <h2>Open the universal remote</h2>
              </div>
              <button
                type="button"
                className="presentation-pairing-close"
                onClick={() => setIsPairingOpen(false)}
                aria-label="Close pairing dialog"
              >
                Close
              </button>
            </div>

            <div className="presentation-pairing-grid">
              <div className="presentation-pairing-qr">
                <QRCodeSVG
                  value={remoteUrl}
                  size={220}
                  bgColor="transparent"
                  fgColor="#f4f7fb"
                  includeMargin={false}
                />
              </div>

              <div className="presentation-pairing-copy">
                <div className="presentation-pairing-block">
                  <span>Remote URL</span>
                  <a href={remoteUrl} target="_blank" rel="noreferrer">
                    {remoteUrl}
                  </a>
                </div>

                <div className="presentation-pairing-block">
                  <span>Presentation URL</span>
                  <a href={screenUrl} target="_blank" rel="noreferrer">
                    {screenUrl}
                  </a>
                </div>

                <div className="presentation-pairing-block">
                  <span>Presenter URL</span>
                  <a href={presenterUrl} target="_blank" rel="noreferrer">
                    {presenterUrl}
                  </a>
                </div>

                <div className="presentation-pairing-block">
                  <span>Session</span>
                  <strong>{sessionId}</strong>
                </div>

                <div className="presentation-pairing-actions">
                  <button
                    type="button"
                    className="presentation-shell-button presentation-shell-button--accent"
                    onClick={() => void handleCopyRemoteLink()}
                  >
                    Copy Remote Link
                  </button>
                  {copyStatus ? (
                    <p className="presentation-pairing-status">{copyStatus}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default KeynotePresentationExperience;
