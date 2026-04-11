import type {
  ProjectPresentationSlide,
  ProjectPresentationVisualItem,
} from "../types/documents";

const interactiveVisualVariants = new Set([
  "workflow-shift",
  "workflow-evolution",
  "data-foundation",
  "maturity-staircase",
  "decision-gates",
  "governance-timeline",
  "systems-stack",
  "human-plus-system",
  "agentic-readiness",
  "capability-pillars",
  "roadmap-timeline",
  "framework-cards",
  "quiz-grid",
  "permissions-funnel",
  "governance-stack",
  "reconciliation-workflow",
  "worksheet-flow",
  "pilot-scorecard",
  "adoption-loop",
]);

export interface PresentationRevealableCardDescriptor {
  id: string;
  index: number;
  detail: string;
  label: string;
  group?: string;
  value?: string;
  speakerNotes: string[];
}

export interface PresentationSpeakerFlashcard {
  id: string;
  context: "slide" | "card";
  eyebrow: string;
  title: string;
  subtitle?: string;
  lines: string[];
}

export const isInteractivePresentationVisualVariant = (variant: string) =>
  interactiveVisualVariants.has(variant);

export const buildPresentationVisualCardId = (
  slide: ProjectPresentationSlide,
  item: ProjectPresentationVisualItem,
  index: number
) => `${slide.id}-${index}-${item.label}-${item.value || item.group || "detail"}`;

export const getRevealableCardsForSlide = (
  slide: ProjectPresentationSlide | null | undefined
): PresentationRevealableCardDescriptor[] => {
  if (
    slide?.stageDisplay?.disableCardReveal ||
    !slide?.visual?.items.length ||
    !isInteractivePresentationVisualVariant(slide.visual.variant)
  ) {
    return [];
  }

  return slide.visual.items.flatMap((item, index) => {
    if (!item.detail) {
      return [];
    }

    return [
      {
        id: buildPresentationVisualCardId(slide, item, index),
        index,
        label: item.label,
        value: item.value,
        detail: item.detail,
        group: item.group,
        speakerNotes: item.speakerNotes ?? [],
      },
    ];
  });
};

export const getPresentationSpeakerFlashcard = (
  slide: ProjectPresentationSlide | null | undefined,
  activeCardIndex: number | null | undefined
): PresentationSpeakerFlashcard => {
  const revealableCards = getRevealableCardsForSlide(slide);
  const activeCard =
    typeof activeCardIndex === "number" &&
    activeCardIndex >= 0 &&
    activeCardIndex < revealableCards.length
      ? revealableCards[activeCardIndex]
      : null;

  if (activeCard) {
    return {
      id: `${activeCard.id}-flashcard`,
      context: "card",
      eyebrow: activeCard.group || "Card detail",
      title: activeCard.label,
      subtitle: activeCard.value,
      lines: activeCard.speakerNotes.length
        ? activeCard.speakerNotes
        : [activeCard.detail],
    };
  }

  if (slide) {
    const slideLines = [
      ...(slide.caption ? [slide.caption] : []),
      ...slide.speakerNotes,
    ];

    return {
      id: `${slide.id}-flashcard`,
      context: "slide",
      eyebrow: slide.kicker?.trim() || "Current slide",
      title: slide.title,
      subtitle: slide.subtitle?.trim() || undefined,
      lines: slideLines.length ? slideLines : [slide.title],
    };
  }

  return {
    id: "presentation-flashcard",
    context: "slide",
    eyebrow: "Current slide",
    title: "Presentation",
    lines: [],
  };
};
