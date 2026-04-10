import type { FormEvent } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/PublicExperience.css";
import "../components/styles/DocumentStudio.css";
import "../components/styles/StudioLibrary.css";
import {
  createRheemProjectLibraryCard,
  isRheemProjectAliasCode,
  RHEEM_PROJECT_CARD_LOGO_URL,
} from "../data/rheemProject";
import { studioLibraryFallbackCards } from "../data/studioLibraryFallback";
import { portfolioContent } from "../data/portfolioContent";
import {
  getPublicDocumentByCode,
  listPublicStudioLibrary,
} from "../lib/documents";
import type { StudioLibraryCard } from "../types/documents";

const normalizeCompanySortKey = (value: string) =>
  value.trim().replace(/^the\s+/i, "").toLowerCase();

const normalizeTitleSortKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^the\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ");

const sortCardsAlphabetically = (cards: StudioLibraryCard[]) =>
  [...cards].sort((left, right) => {
    const titleComparison = normalizeTitleSortKey(left.cardTitle).localeCompare(
      normalizeTitleSortKey(right.cardTitle),
      undefined,
      { numeric: true }
    );

    if (titleComparison !== 0) {
      return titleComparison;
    }

    return normalizeCompanySortKey(left.cardCompany).localeCompare(
      normalizeCompanySortKey(right.cardCompany),
      undefined,
      { numeric: true }
    );
  });

const compareCardsAlphabetically = (
  left: StudioLibraryCard,
  right: StudioLibraryCard
) => {
  const titleComparison = normalizeTitleSortKey(left.cardTitle).localeCompare(
    normalizeTitleSortKey(right.cardTitle),
    undefined,
    { numeric: true }
  );

  if (titleComparison !== 0) {
    return titleComparison;
  }

  return normalizeCompanySortKey(left.cardCompany).localeCompare(
    normalizeCompanySortKey(right.cardCompany),
    undefined,
    { numeric: true }
  );
};

const STUDIO_LIBRARY_LOAD_TIMEOUT_MS = 2500;
type BriefCardFrame = {
  kind: "logo";
  src: string;
  alt: string;
  variant?: "you";
  logoScale?: "boost" | "double" | "triple";
};

const BRIEF_CARD_FRAMES: readonly BriefCardFrame[] = [
  {
    kind: "logo",
    src: "/images/studio/brief-logo-linkedin.png",
    alt: "LinkedIn",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-deloitte.png",
    alt: "Deloitte",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-prime-video.png",
    alt: "Prime Video",
    logoScale: "double",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-spotify.png",
    alt: "Spotify",
    logoScale: "double",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-coca-cola.png",
    alt: "Coca-Cola",
    logoScale: "double",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/tata-studio-logo.png",
    alt: "Tata",
    logoScale: "boost",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/starbucks-studio-logo.png",
    alt: "Starbucks",
    logoScale: "double",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/bridgestone-studio-logo.png",
    alt: "Bridgestone",
    logoScale: "triple",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
  {
    kind: "logo",
    src: "/images/studio/colgate-palmolive-studio-logo.png",
    alt: "Colgate-Palmolive",
    logoScale: "triple",
  },
  {
    kind: "logo",
    src: "/images/studio/brief-logo-your-logo-here.png",
    alt: "Your Logo Here",
    variant: "you",
  },
] as const;

type ExperienceProjectSource = (typeof portfolioContent.experience)[number];

type LiveProjectTile = {
  kind: "live";
  id: string;
  card: StudioLibraryCard;
  sortTitle: string;
  sortCompany: string;
  searchText: string;
};

type CompletedProjectCard = {
  id: string;
  company: string;
  title: string;
  summary: string;
  logos: ExperienceProjectSource["logos"];
  logoLayout?: ExperienceProjectSource["logoLayout"];
  logoScale?: "boost" | "double" | "triple";
  sortTitle: string;
  sortCompany: string;
  searchText: string;
};

type CompletedProjectTile = {
  kind: "completed";
  id: string;
  completed: CompletedProjectCard;
  sortTitle: string;
  sortCompany: string;
  searchText: string;
};

type StudioLibraryProjectTile = LiveProjectTile | CompletedProjectTile;

type StudioLibraryTile =
  | {
      kind: "brief";
      id: "submit-brief";
      title: string;
      summary: string;
      href: string;
      mark: string;
    }
  | StudioLibraryProjectTile;

const isRheemShowcaseCard = (card: StudioLibraryCard) =>
  isRheemProjectAliasCode(card.code || "") ||
  normalizeCompanySortKey(card.cardCompany).includes("rheem");

const normalizeShowcaseCard = (card: StudioLibraryCard): StudioLibraryCard =>
  isRheemShowcaseCard(card)
    ? createRheemProjectLibraryCard({
        id: card.id,
        engagementId: card.engagementId ?? null,
        updatedAt: card.updatedAt,
      })
    : card;

const SHOWCASE_TEMPLATE_CARDS = studioLibraryFallbackCards
  .map(normalizeShowcaseCard)
  .sort(compareCardsAlphabetically);

const normalizeCardLookupValue = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

const UNSW_WIDE_CARD_LOGO_URL = "/images/studio/unsw-sydney-card-logo.png";

const getCardLookupKeys = (card: StudioLibraryCard) => {
  const companyKey = normalizeCardLookupValue(card.cardCompany);
  const titleKey = normalizeCardLookupValue(card.cardTitle);
  const codeKey = normalizeCardLookupValue(card.code || "");

  return [
    codeKey,
    companyKey,
    titleKey,
    companyKey && titleKey ? `${companyKey}:${titleKey}` : "",
  ].filter(Boolean);
};

const buildShowcaseCards = (liveCards: StudioLibraryCard[] = []) => {
  const normalizedLiveCards = sortCardsAlphabetically(
    liveCards.map(normalizeShowcaseCard)
  );

  return sortCardsAlphabetically(
    SHOWCASE_TEMPLATE_CARDS.map((templateCard) => {
      const templateKeys = new Set(getCardLookupKeys(templateCard));
      const matchingLiveCard = normalizedLiveCards.find((liveCard) =>
        getCardLookupKeys(liveCard).some((key) => templateKeys.has(key))
      );

      if (!matchingLiveCard) {
        return templateCard;
      }

      return normalizeShowcaseCard({
        ...templateCard,
        code: matchingLiveCard.code || templateCard.code,
        engagementId: matchingLiveCard.engagementId ?? templateCard.engagementId,
        updatedAt: matchingLiveCard.updatedAt || templateCard.updatedAt,
        documentStatus: matchingLiveCard.documentStatus || templateCard.documentStatus,
      });
    })
  );
};

const createCompletedProjectCards = (): CompletedProjectCard[] =>
  portfolioContent.experience
    .flatMap<CompletedProjectCard>((item) => {
      const normalizedCompany = normalizeCardLookupValue(item.company);

      if (normalizedCompany === "spotify") {
        return [
          {
            id: `completed-${normalizedCompany}`,
            company: "Spotify",
            title: "Audience Strategy for Music Discovery",
            summary:
              "Developed a mobile-first audience strategy for Spotify's India launch, using local listening culture, campus behavior, and multilingual discovery patterns to sharpen early positioning.",
            logos: item.logos,
            logoLayout: item.logoLayout,
            logoScale: "double",
            sortTitle: "Audience Strategy for Music Discovery",
            sortCompany: "Spotify",
            searchText: [
              "Spotify",
              "Audience Strategy for Music Discovery",
              "mobile-first launch strategy",
              "music discovery",
              "consumer strategy",
            ]
              .join(" ")
              .toLowerCase(),
          },
        ];
      }

      if (normalizedCompany === "tatasustainabilitygroup") {
        return [
          {
            id: "completed-tata-sustainability-group",
            company: "Tata Sustainability Group",
            title: "Enterprise Sustainability Platforms & Workforce Enablement",
            summary:
              "Built the digital backbone for Tata Sustainability Group's sustainability work across the core website, volunteering and skilling portals, governance-linked learning, and internal activation assets.",
            logos: [
              {
                alt: "Tata",
                src: "/images/studio/tata-studio-logo.png",
              },
            ],
            logoLayout: item.logoLayout,
            logoScale: "boost",
            sortTitle: "Enterprise Sustainability Platforms & Workforce Enablement",
            sortCompany: "Tata Sustainability Group",
            searchText: [
              "Tata Sustainability Group",
              "Enterprise Sustainability Platforms & Workforce Enablement",
              "volunteering portal",
              "skilling portal",
              "sustainability training",
            ]
              .join(" ")
              .toLowerCase(),
          },
          {
            id: "completed-starbucks-india",
            company: "Starbucks India",
            title: "Employee Volunteering & Sustainability Activation",
            summary:
              "Supported sustainability participation for Starbucks India within the broader Tata ecosystem through campaign work, branded volunteering identities, and learning experiences designed to lift employee engagement.",
            logos: [
              {
                alt: "Starbucks",
                src: "/images/studio/starbucks-studio-logo.png",
              },
            ],
            logoLayout: item.logoLayout,
            logoScale: "double",
            sortTitle: "Employee Volunteering & Sustainability Activation",
            sortCompany: "Starbucks India",
            searchText: [
              "Starbucks India",
              "Employee Volunteering & Sustainability Activation",
              "employee engagement",
              "volunteering campaign",
              "sustainability learning",
            ]
              .join(" ")
              .toLowerCase(),
          },
        ];
      }

      if (normalizedCompany === "cocacola") {
        return [
          {
            id: `completed-${normalizedCompany}`,
            company: "Coca-Cola",
            title: "Consumer Strategy for Cherry Coke Launch",
            summary:
              "Built a youth-focused launch strategy for Cherry Coke in MENA, turning taste, format, and social-context insight into clearer rollout priorities and market-entry storytelling.",
            logos: item.logos,
            logoLayout: item.logoLayout,
            logoScale: "double",
            sortTitle: "Consumer Strategy for Cherry Coke Launch",
            sortCompany: "Coca-Cola",
            searchText: [
              "Coca-Cola",
              "Consumer Strategy for Cherry Coke Launch",
              "market entry strategy",
              "brand positioning",
              "launch storytelling",
            ]
              .join(" ")
              .toLowerCase(),
          },
        ];
      }

      if (normalizedCompany === "colgatepalmolivebridgestone") {
        return [
          {
            id: "completed-colgate-palmolive",
            company: "Colgate-Palmolive",
            title: "Materiality Assessment & Sustainability Roadmap",
            summary:
              "Built the strategic foundation for clearer sustainability decision-making at Colgate-Palmolive through materiality analysis, roadmap framing, internal sensitisation, and priority-setting support.",
            logos: [
              {
                alt: "Colgate-Palmolive",
                src: "/images/studio/colgate-palmolive-studio-logo.png",
              },
            ],
            logoLayout: item.logoLayout,
            logoScale: "triple",
            sortTitle: "Materiality Assessment & Sustainability Roadmap",
            sortCompany: "Colgate-Palmolive",
            searchText: [
              "Colgate-Palmolive",
              "Materiality Assessment & Sustainability Roadmap",
              "sustainability roadmap",
              "materiality assessment",
              "internal sensitisation",
            ]
              .join(" ")
              .toLowerCase(),
          },
          {
            id: "completed-bridgestone",
            company: "Bridgestone",
            title: "Sustainability Positioning & Stakeholder Communication",
            summary:
              "Shaped Bridgestone's sustainability positioning and stakeholder communication approach, helping translate priority issues into clearer internal alignment and external narrative.",
            logos: [
              {
                alt: "Bridgestone",
                src: "/images/studio/bridgestone-studio-logo.png",
              },
            ],
            logoLayout: item.logoLayout,
            logoScale: "triple",
            sortTitle: "Sustainability Positioning & Stakeholder Communication",
            sortCompany: "Bridgestone",
            searchText: [
              "Bridgestone",
              "Sustainability Positioning & Stakeholder Communication",
              "stakeholder communication",
              "sustainability positioning",
              "external narrative",
            ]
              .join(" ")
              .toLowerCase(),
          },
        ];
      }

      if (normalizedCompany === "amazonprimevideo") {
        return [
          {
            id: "completed-primevideo",
            company: "Prime Video",
            title: "Audience Intelligence for Content Strategy",
            summary:
              "Used audience-perception analysis to map binge-worthiness, fandom, and shareability signals, shaping stronger content strategy and partner relevance around entertainment moments.",
            logos: item.logos,
            logoLayout: item.logoLayout,
            logoScale: "double",
            sortTitle: "Audience Intelligence for Content Strategy",
            sortCompany: "Prime Video",
            searchText: [
              "Prime Video",
              "Audience Intelligence for Content Strategy",
              "content psychology",
              "audience sentiment",
              "content strategy",
            ]
              .join(" ")
              .toLowerCase(),
          },
        ];
      }

      return [];
    });

const getCardRuntimeKey = (card: StudioLibraryCard) =>
  normalizeCardLookupValue(card.code || "") || card.id;

const buildLiveProjectTiles = (
  cards: StudioLibraryCard[]
): LiveProjectTile[] =>
  cards.map((card) => ({
    kind: "live",
    id: getCardRuntimeKey(card),
    card,
    sortTitle: card.cardTitle || "",
    sortCompany: card.cardCompany || "",
    searchText: `${card.cardCompany} ${card.cardTitle}`.toLowerCase(),
  }));

const sortProjectTilesAlphabetically = (
  tiles: StudioLibraryProjectTile[]
) =>
  [...tiles].sort((left, right) => {
    const titleComparison = normalizeTitleSortKey(left.sortTitle).localeCompare(
      normalizeTitleSortKey(right.sortTitle),
      undefined,
      { numeric: true }
    );

    if (titleComparison !== 0) {
      return titleComparison;
    }

    return normalizeCompanySortKey(left.sortCompany).localeCompare(
      normalizeCompanySortKey(right.sortCompany),
      undefined,
      { numeric: true }
    );
  });

const getCardMonogram = (
  card: Pick<StudioLibraryCard, "cardCompany" | "cardTitle">
) => {
  const source = (card.cardCompany || card.cardTitle)
    .replace(/[^a-z0-9\s]/gi, " ")
    .trim();
  const words = source.split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "RV";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
};

const getCardActionLabel = () => "Access Project";

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Studio library request timed out."));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });

const StudioLibraryPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<StudioLibraryCard[]>(() => buildShowcaseCards());
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());
  const [activeBriefFrameIndex, setActiveBriefFrameIndex] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessPending, setAccessPending] = useState(false);
  const [activeAccessCardId, setActiveAccessCardId] = useState<string | null>(null);
  const [brokenLogoKeys, setBrokenLogoKeys] = useState<Record<string, true>>({});
  const hasActiveSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  useEffect(() => {
    let active = true;

    const loadCards = async () => {
      try {
        const libraryCards = await withTimeout(
          listPublicStudioLibrary(),
          STUDIO_LIBRARY_LOAD_TIMEOUT_MS
        );
        const publishedCards = libraryCards.filter(
          (card) =>
            card.documentStatus === "published" &&
            card.cardCompany.trim() &&
            card.cardTitle.trim()
        );

        if (!active) {
          return;
        }

        setCards(buildShowcaseCards(publishedCards));
      } catch {
        if (!active) {
          return;
        }

        setCards((currentCards) => currentCards.length ? currentCards : buildShowcaseCards());
      }
    };

    loadCards();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBriefFrameIndex((currentIndex) =>
        (currentIndex + 1) % BRIEF_CARD_FRAMES.length
      );
    }, 1050);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const liveProjectTiles = useMemo(() => buildLiveProjectTiles(cards), [cards]);
  const completedProjectTiles = useMemo<CompletedProjectTile[]>(
    () =>
      createCompletedProjectCards().map((completed) => ({
        kind: "completed",
        id: completed.id,
        completed,
        sortTitle: completed.sortTitle,
        sortCompany: completed.sortCompany,
        searchText: completed.searchText,
      })),
    []
  );

  const filteredProjectTiles = useMemo(() => {
    const allProjectTiles = sortProjectTilesAlphabetically([
      ...liveProjectTiles,
      ...completedProjectTiles,
    ]);

    if (!deferredSearchQuery) {
      return allProjectTiles;
    }

    return allProjectTiles.filter((tile) =>
      tile.searchText.includes(deferredSearchQuery)
    );
  }, [completedProjectTiles, deferredSearchQuery, liveProjectTiles]);

  const tiles = useMemo<StudioLibraryTile[]>(
    () => [
      ...(!hasActiveSearch
        ? [
            {
              kind: "brief" as const,
              id: "submit-brief" as const,
              title: "Submit a Brief",
              summary:
                "Share the project scope, audience, and timing to start a tailored brochure or proposal.",
              href: "/studio/brief",
              mark: "Brief",
            },
          ]
        : []),
      ...filteredProjectTiles,
    ],
    [filteredProjectTiles, hasActiveSearch]
  );

  const openInlineAccess = (cardId: string) => {
    setActiveAccessCardId(cardId);
    setAccessCode("");
    setAccessError(null);
  };

  const resolveCode = async (rawCode: string) => {
    const normalizedCode = rawCode.trim().toUpperCase();
    if (!normalizedCode) {
      setAccessError("Enter the code Rushi shared with you.");
      return;
    }

    try {
      setAccessPending(true);
      setAccessError(null);
      const documentRecord = await getPublicDocumentByCode(normalizedCode);

      if (!documentRecord) {
        setAccessError("No published project was found for that code.");
        return;
      }

      navigate(
        `/studio/project/${encodeURIComponent(documentRecord.code || normalizedCode)}`
      );
    } catch (error) {
      setAccessError(
        error instanceof Error
          ? error.message
          : "Unable to open that project right now."
      );
    } finally {
      setAccessPending(false);
    }
  };

  const handleAccessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await resolveCode(accessCode);
  };

  const handleCompletedAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessCode.trim()) {
      setAccessError("Enter the code Rushi shared with you.");
      return;
    }

    setAccessError("This archive preview is a placeholder and still requires a private code.");
  };

  return (
    <main className="studio-page studio-page--public">
      <header className="studio-topbar studio-library-topbar">
        <Link to="/" className="studio-topbar-brand">
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
          <Link to="/">Portfolio</Link>
          <Link to="/studio">Studio</Link>
        </nav>
      </header>

      <div className="studio-shell studio-library-shell">
        <section className="studio-library-page-header">
          <p className="studio-library-eyebrow">Studio</p>
          <div className="studio-library-hero-copy">
            <h1>Projects</h1>
          </div>
        </section>

        <section className="studio-library-toolbar">
          <label className="studio-library-search">
            <span>Search</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Company, Project Title or Keyword"
            />
          </label>
        </section>

        <section className="studio-library-section" id="projects">
          <div className="studio-library-grid">
            {tiles.map((tile) =>
              tile.kind === "brief" ? (
                <article key={tile.id} className="studio-library-card">
                  <div className="studio-library-card-mark studio-library-card-mark--brief">
                    <div
                      className="studio-library-brief-sequence"
                      aria-hidden="true"
                    >
                      {(() => {
                        const frame = BRIEF_CARD_FRAMES[activeBriefFrameIndex];

                        return (
                          <div
                            key={`${frame.kind}-${activeBriefFrameIndex}`}
                            className={`studio-library-brief-sequence-layer studio-library-brief-sequence-layer--active studio-library-brief-sequence-layer--${frame.kind}${
                              frame.variant === "you"
                                ? " studio-library-brief-sequence-layer--you"
                                : ""
                            }${
                              frame.logoScale === "boost"
                                ? " studio-library-brief-sequence-layer--boost"
                                : ""
                            }${
                              frame.logoScale === "double"
                                ? " studio-library-brief-sequence-layer--double"
                                : ""
                            }${
                              frame.logoScale === "triple"
                                ? " studio-library-brief-sequence-layer--triple"
                                : ""
                            }`}
                          >
                            {frame.kind === "logo" ? (
                              <img src={frame.src} alt="" />
                            ) : null}
                          </div>
                        );
                      })()}
                    </div>
                    <span className="studio-library-visually-hidden">{tile.mark}</span>
                  </div>

                  <div className="studio-library-card-copy">
                    <h3>{tile.title}</h3>
                    <p className="studio-library-card-summary">{tile.summary}</p>
                  </div>

                  <div className="studio-library-card-actions">
                    <Link
                      to={tile.href}
                      className="studio-library-card-action studio-library-card-action--primary"
                    >
                      Submit Brief
                    </Link>
                  </div>
                </article>
              ) : tile.kind === "completed" ? (
                <article
                  key={tile.id}
                  className="studio-library-card studio-library-card--completed"
                >
                  <div className="studio-library-card-mark studio-library-card-mark--completed">
                    {tile.completed.logos.length && !brokenLogoKeys[tile.id] ? (
                      <div
                        className={`studio-library-completed-logo-list${
                          tile.completed.logoLayout === "grid-2x2"
                            ? " studio-library-completed-logo-list--grid"
                            : ""
                        }${
                          tile.completed.logos.length === 2
                            ? " studio-library-completed-logo-list--pair"
                            : ""
                        }${
                          tile.completed.logos.length === 1
                            ? " studio-library-completed-logo-list--single"
                            : ""
                        }${
                          tile.completed.logoScale === "boost"
                            ? " studio-library-completed-logo-list--boost"
                            : ""
                        }${
                          tile.completed.logoScale === "double"
                            ? " studio-library-completed-logo-list--double"
                            : ""
                        }${
                          tile.completed.logoScale === "triple"
                            ? " studio-library-completed-logo-list--triple"
                            : ""
                        }`}
                      >
                        {tile.completed.logos.map((logo) =>
                          logo.src ? (
                            <div
                              className="studio-library-completed-logo-wrap"
                              key={`${tile.id}-${logo.alt}`}
                            >
                              <img
                                src={logo.src}
                                alt={logo.alt}
                                onError={() =>
                                  setBrokenLogoKeys((currentKeys) =>
                                    currentKeys[tile.id]
                                      ? currentKeys
                                      : {
                                          ...currentKeys,
                                          [tile.id]: true,
                                        }
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div
                              className="studio-library-completed-logo-badge"
                              key={`${tile.id}-${logo.alt}`}
                            >
                              {logo.label ?? logo.alt}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <span>
                        {getCardMonogram({
                          cardCompany: tile.completed.company,
                          cardTitle: tile.completed.title,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="studio-library-card-copy studio-library-card-copy--completed">
                    <p className="studio-library-card-company">
                      {tile.completed.company}
                    </p>
                    <h3>{tile.completed.title}</h3>
                    <p className="studio-library-card-summary studio-library-card-summary--completed">
                      {tile.completed.summary}
                    </p>
                  </div>

                  <div className="studio-library-card-actions">
                    {activeAccessCardId === tile.id ? (
                      <>
                        <form
                          className="studio-library-card-access"
                          onSubmit={handleCompletedAccessSubmit}
                        >
                          <input
                            value={accessCode}
                            onChange={(event) => setAccessCode(event.target.value)}
                            placeholder="Enter Code"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="studio-library-card-action studio-library-card-action--secondary"
                          >
                            Access Project
                          </button>
                        </form>
                        {accessError ? (
                          <p className="studio-library-card-error">{accessError}</p>
                        ) : null}
                      </>
                    ) : (
                      <button
                        type="button"
                        className="studio-library-card-action studio-library-card-action--primary"
                        onClick={() => openInlineAccess(tile.id)}
                      >
                        Access Project
                      </button>
                    )}
                  </div>
                </article>
              ) : (
                <article key={tile.id} className="studio-library-card">
                  <div
                    className={`studio-library-card-mark${
                      tile.card.cardLogoUrl === RHEEM_PROJECT_CARD_LOGO_URL
                        ? " studio-library-card-mark--rheem"
                        : ""
                    }${
                      tile.card.cardLogoUrl === UNSW_WIDE_CARD_LOGO_URL
                        ? " studio-library-card-mark--unsw-wide"
                        : ""
                    }`}
                  >
                    {tile.card.cardLogoUrl && !brokenLogoKeys[tile.id] ? (
                      <img
                        src={tile.card.cardLogoUrl}
                        alt={`${tile.card.cardCompany || tile.card.cardTitle} logo`}
                        onError={() =>
                          setBrokenLogoKeys((currentKeys) =>
                            currentKeys[tile.id]
                              ? currentKeys
                              : {
                                  ...currentKeys,
                                  [tile.id]: true,
                                }
                          )
                        }
                      />
                    ) : (
                      <span>{getCardMonogram(tile.card)}</span>
                    )}
                  </div>

                  <div className="studio-library-card-copy">
                    <p className="studio-library-card-company">
                      {tile.card.cardCompany}
                    </p>
                    <h3>{tile.card.cardTitle || "Untitled project"}</h3>
                    <p className="studio-library-card-summary">
                      {tile.card.cardSummary || "Private studio project."}
                    </p>
                  </div>

                  <div className="studio-library-card-actions">
                    {activeAccessCardId === tile.id ? (
                      <>
                        <form
                          className="studio-library-card-access"
                          onSubmit={handleAccessSubmit}
                        >
                          <input
                            value={accessCode}
                            onChange={(event) => setAccessCode(event.target.value)}
                            placeholder="Enter Code"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="studio-library-card-action studio-library-card-action--secondary"
                            disabled={accessPending}
                          >
                            {accessPending ? "Opening..." : "Access Project"}
                          </button>
                        </form>
                        {accessError ? (
                          <p className="studio-library-card-error">{accessError}</p>
                        ) : null}
                      </>
                    ) : (
                      <button
                        type="button"
                        className="studio-library-card-action studio-library-card-action--primary"
                        onClick={() => openInlineAccess(tile.id)}
                      >
                        {getCardActionLabel()}
                      </button>
                    )}
                  </div>
                </article>
              )
            )}

            {filteredProjectTiles.length === 0 ? (
              <article className="public-panel studio-library-empty">
                <h3>No projects found</h3>
                <p>Try another search.</p>
              </article>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
};

export default StudioLibraryPage;
