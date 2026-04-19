import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import ProposalBrochureDocument from "../documents/ProposalBrochureDocument";
import ProjectAgendaDocument from "../documents/ProjectAgendaDocument";
import ProjectTimelineDocument from "../documents/ProjectTimelineDocument";
import QuoteDocument from "../documents/QuoteDocument";
import {
  buildProjectTimelineDisplayData,
  getActiveProjectBundleOption,
  buildProjectAgendaPage,
  buildProjectBrochurePage,
  buildProjectMailto,
  buildProjectQuote,
  buildProjectSearchParams,
  buildProjectSummaryLines,
  getSelectedAddOnOptions,
  getSelectedBaseOptions,
  getProjectSelectionFromParams,
  isProjectDocument,
  normalizeProjectContent,
  toggleSelectionId,
  type ProjectSelection,
  type ProjectTimelinePhaseDisplay,
} from "../../lib/projectDocuments";
import { formatCurrency } from "../../lib/quotes";
import type { ProjectOption, ProjectOptionAgenda, StudioDocument } from "../../types/documents";
import {
  RHEEM_MARKET_BENCHMARK_ENTRIES,
  RHEEM_PROJECT_CODE,
} from "../../data/rheemProject";
import "../styles/PublicExperience.css";
import "../styles/DocumentStudio.css";

const CART_DRAWER_ID = "studio-project-cart-drawer";
const BROCHURE_PACKET_MODE = "brochure";
const SELECTED_SCOPE_MODE = "selected";
const PACKET_DOWNLOAD_MODE = "pdf";
const PACKET_PAGE_SELECTOR = "[data-pdf-page]";
const PACKET_CAPTURE_SCALE = 2;
const CSS_PIXELS_PER_POINT = 72 / 96;
type StudioAppPacketReturnState = {
  appPacketReturn?: {
    pathname: string;
    search: string;
    scrollTop: number;
  };
};

const sampleDateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const formatSampleDate = (value: string) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return sampleDateFormatter.format(parsed);
};

const benchmarkCurrencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const formatBenchmarkPrice = (value: number) => benchmarkCurrencyFormatter.format(value);

const isNarrowPacketViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 900px)").matches;

const isNativePacketViewport = () => Capacitor.isNativePlatform();

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    window.requestAnimationFrame(() => resolve());
  });

const waitForImageLoad = (image: HTMLImageElement) => {
  if (image.complete) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finalize = () => resolve();

    image.addEventListener("load", finalize, { once: true });
    image.addEventListener("error", finalize, { once: true });
  });
};

const waitForPacketAssets = async (pageElements: HTMLElement[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await window.document.fonts?.ready;
  } catch {
    // Ignore font readiness failures and continue with the export.
  }

  const images = pageElements.flatMap((pageElement) =>
    Array.from(pageElement.querySelectorAll("img"))
  );

  await Promise.all(images.map(waitForImageLoad));
  await waitForNextFrame();
  await waitForNextFrame();
};

const sanitizeFilenameSegment = (value: string) =>
  value
    .trim()
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const buildPacketPdfFilename = (
  documentCode: string,
  packetKind: "brochure" | "selected" | "project"
) => {
  const trimmedCode = documentCode.trim();
  const codeToken =
    trimmedCode && /^[A-Z0-9-]+$/.test(trimmedCode)
      ? trimmedCode
      : sanitizeFilenameSegment(trimmedCode || "project");

  const suffix =
    packetKind === "selected"
      ? "selected-pack"
      : packetKind === "brochure"
        ? "brochure-pack"
        : "project-pack";

  return `${codeToken || "project"}-${suffix}.pdf`;
};

const exportPacketPagesToPdf = async ({
  filename,
  pageElements,
}: {
  filename: string;
  pageElements: HTMLElement[];
}) => {
  if (typeof window === "undefined" || pageElements.length === 0) {
    throw new Error("No packet pages are available to export.");
  }

  await waitForPacketAssets(pageElements);

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const scale = Math.max(
    1,
    Math.min(window.devicePixelRatio || 1, PACKET_CAPTURE_SCALE)
  );
  let pdf: InstanceType<typeof jsPDF> | null = null;

  for (const pageElement of pageElements) {
    const width = Math.max(
      Math.ceil(pageElement.scrollWidth),
      Math.ceil(pageElement.getBoundingClientRect().width)
    );
    const height = Math.max(
      Math.ceil(pageElement.scrollHeight),
      Math.ceil(pageElement.getBoundingClientRect().height)
    );
    const pageWidth = width * CSS_PIXELS_PER_POINT;
    const pageHeight = height * CSS_PIXELS_PER_POINT;
    const orientation = pageWidth > pageHeight ? "landscape" : "portrait";
    const canvas = await html2canvas(pageElement, {
      backgroundColor: "#ffffff",
      height,
      imageTimeout: 15000,
      logging: false,
      scale,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      width,
      windowHeight: height,
      windowWidth: width,
    });

    if (!pdf) {
      pdf = new jsPDF({
        compress: true,
        format: [pageWidth, pageHeight],
        orientation,
        unit: "pt",
      });
    } else {
      pdf.addPage([pageWidth, pageHeight], orientation);
    }

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pageWidth,
      pageHeight,
      undefined,
      "FAST"
    );
  }

  if (!pdf) {
    throw new Error("Unable to create the PDF packet.");
  }

  pdf.save(filename);
};

const renderOptionPrice = (price: number, currency: string, compareAtPrice?: number) => {
  const hasComparePrice =
    typeof compareAtPrice === "number" && compareAtPrice > price;

  return (
    <div className={`sample-proposal-price${hasComparePrice ? " has-compare" : ""}`}>
      {hasComparePrice ? (
        <span className="sample-proposal-price-compare">
          {formatCurrency(compareAtPrice, currency)}
        </span>
      ) : null}
      <strong>{formatCurrency(price, currency)}</strong>
    </div>
  );
};

const renderOptionMedia = (imageUrl?: string) =>
  imageUrl ? (
    <div className="sample-proposal-option-media" aria-hidden="true">
      <img src={imageUrl} alt="" loading="lazy" decoding="async" />
    </div>
  ) : null;

const renderRoadmapTiming = (timing: string) => {
  const exactDateMatch = timing.match(
    /^([A-Za-z]+), ([A-Za-z]+) (\d{1,2}), (\d{4})$/
  );

  if (!exactDateMatch) {
    return <p className="sample-proposal-roadmap-phase-timing">{timing}</p>;
  }

  const [, weekday, month, day, year] = exactDateMatch;

  return (
    <div className="sample-proposal-roadmap-phase-timing sample-proposal-roadmap-phase-timing--stacked">
      <span className="sample-proposal-roadmap-phase-date">{`${day} ${month}`}</span>
      <span className="sample-proposal-roadmap-phase-day">{weekday}</span>
      <span className="sample-proposal-roadmap-phase-year">{year}</span>
    </div>
  );
};

const parseRoadmapTimingDate = (timing: string) => {
  const weekMatch = timing.match(/^Week of ([A-Za-z]+) (\d{1,2}), (\d{4})$/);

  if (weekMatch) {
    return new Date(`${weekMatch[1]} ${weekMatch[2]}, ${weekMatch[3]} 12:00:00`);
  }

  const exactDateMatch = timing.match(/^[A-Za-z]+, ([A-Za-z]+) (\d{1,2}), (\d{4})$/);

  if (exactDateMatch) {
    return new Date(
      `${exactDateMatch[1]} ${exactDateMatch[2]}, ${exactDateMatch[3]} 12:00:00`
    );
  }

  return null;
};

const startOfRoadmapDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getRoadmapDaysUntil = (timing: string, now: Date) => {
  const targetDate = parseRoadmapTimingDate(timing);

  if (!targetDate) {
    return null;
  }

  const today = startOfRoadmapDay(now);
  const targetDay = startOfRoadmapDay(targetDate);
  const diffInDays = Math.round(
    (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    days: diffInDays,
    isToday: diffInDays === 0,
    isPast: diffInDays < 0,
  };
};

const renderRoadmapCountdown = (
  countdown: ReturnType<typeof getRoadmapDaysUntil>
) => {
  if (!countdown) {
    return null;
  }

  if (countdown.isToday) {
    return (
      <div className="sample-proposal-roadmap-countdown is-today">
        <span className="sample-proposal-roadmap-countdown-today">today</span>
      </div>
    );
  }

  const absoluteDays = Math.abs(countdown.days);
  const dayLabel = absoluteDays === 1 ? "day" : "days";

  if (countdown.isPast) {
    return (
      <div className="sample-proposal-roadmap-countdown is-past">
        <strong className="sample-proposal-roadmap-countdown-value">
          {absoluteDays}
        </strong>
        <span className="sample-proposal-roadmap-countdown-suffix">
          {`${dayLabel} ago`}
        </span>
      </div>
    );
  }

  return (
    <div className="sample-proposal-roadmap-countdown">
      <span className="sample-proposal-roadmap-countdown-prefix">in</span>
      <strong className="sample-proposal-roadmap-countdown-value">
        {absoluteDays}
      </strong>
      <span className="sample-proposal-roadmap-countdown-suffix">{dayLabel}</span>
    </div>
  );
};

const renderAgendaSources = (sources: ProjectOptionAgenda["sources"] = []) => {
  const validSources = (sources || []).filter(
    (source) => source?.label?.trim() && source?.url?.trim()
  );

  if (!validSources.length) {
    return null;
  }

  return (
    <div className="sample-proposal-agenda-sources">
      <span>Sources</span>
      <div className="sample-proposal-agenda-source-links">
        {validSources.map((source) => (
          <a
            key={`${source.label}-${source.url}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.label}
          </a>
        ))}
      </div>
    </div>
  );
};

interface ProjectOptionAgendaAccordionProps {
  agenda: ProjectOptionAgenda;
  variant?: "option" | "roadmap";
  summaryLabel?: string;
}

const ProjectOptionAgendaAccordion = ({
  agenda,
  variant = "option",
  summaryLabel = "Session-wise agenda",
}: ProjectOptionAgendaAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className={`sample-proposal-option-agenda sample-proposal-option-agenda--${variant}${
        isOpen ? " is-open" : ""
      }`}
    >
      <button
        type="button"
        className="sample-proposal-option-agenda-summary"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="sample-proposal-option-agenda-summary-main">
          <div>
            <p className="sample-proposal-label">{summaryLabel}</p>
            <strong>{agenda.heading || "Session-wise agenda"}</strong>
          </div>
          <div className="sample-proposal-option-agenda-summary-meta">
            {agenda.duration ? <span>{agenda.duration}</span> : null}
            {agenda.deliveryMode ? <span>{agenda.deliveryMode}</span> : null}
          </div>
        </div>
        <span
          className="sample-proposal-option-agenda-summary-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M5.75 8L10 12.25 14.25 8"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
      </button>

      <div className="sample-proposal-option-agenda-body" aria-hidden={!isOpen}>
        <div className="sample-proposal-option-agenda-inner">
          {agenda.subtitle ? (
            <p className="sample-proposal-subtitle sample-proposal-option-agenda-subtitle">
              {agenda.subtitle}
            </p>
          ) : null}

          {agenda.whyThisMattersNow ? (
            <div className="sample-proposal-option-agenda-callout">
              <strong>Why this matters now</strong>
              <p>{agenda.whyThisMattersNow}</p>
              {renderAgendaSources(agenda.sources)}
            </div>
          ) : renderAgendaSources(agenda.sources)}

          <div className="sample-proposal-option-agenda-grid">
            {agenda.blocks.map((block) => (
              <article
                key={block.id}
                className="sample-proposal-option-agenda-block"
              >
                <div className="sample-proposal-option-agenda-block-top">
                  {block.timeLabel ? (
                    <span className="sample-proposal-option-agenda-time">
                      {block.timeLabel}
                    </span>
                  ) : null}
                  <h4>{block.title}</h4>
                </div>

                {block.focus ? (
                  <p className="sample-proposal-option-agenda-focus">
                    <strong>Focus:</strong> {block.focus}
                  </p>
                ) : null}

                {block.bullets.length ? (
                  <ul className="sample-proposal-list sample-proposal-option-agenda-list">
                    {block.bullets.map((bullet) => (
                      <li key={`${block.id}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {block.examples?.length ? (
                  <div className="sample-proposal-option-agenda-examples">
                    <strong>{block.examplesLabel || "Examples"}</strong>
                    <ul className="sample-proposal-list sample-proposal-option-agenda-list">
                      {(block.examples || []).map((example) => (
                        <li key={`${block.id}-${example}`}>{example}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {block.outcome ? (
                  <p className="sample-proposal-option-agenda-outcome">
                    <strong>Outcome:</strong> {block.outcome}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          {agenda.includedValueAdd ? (
            <div className="sample-proposal-option-agenda-callout sample-proposal-option-agenda-callout--value">
              <strong>Included value-add</strong>
              <p>{agenda.includedValueAdd}</p>
            </div>
          ) : null}

          {agenda.overallOutcomes?.length ? (
            <div className="sample-proposal-option-agenda-callout sample-proposal-option-agenda-callout--outcomes">
              <strong>Overall outcomes</strong>
              <ul className="sample-proposal-list sample-proposal-option-agenda-list">
                {agenda.overallOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

interface ProjectSectionAccordionProps {
  id: string;
  label: string;
  heading: string;
  meta: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const ProjectSectionAccordion = ({
  id,
  label,
  heading,
  meta,
  isOpen,
  onToggle,
  children,
}: ProjectSectionAccordionProps) => {
  return (
    <section
      className={`sample-proposal-panel sample-proposal-roadmap-panel sample-proposal-roadmap-accordion sample-proposal-section-accordion${
        isOpen ? " is-open" : ""
      }`}
    >
      <button
        type="button"
        className="sample-proposal-roadmap-summary"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={onToggle}
      >
        <div className="sample-proposal-roadmap-summary-main">
          <div>
            <p className="sample-proposal-label">{label}</p>
            <h2>{heading}</h2>
          </div>
          <span className="sample-proposal-section-meta">{meta}</span>
        </div>

        <span
          className="sample-proposal-roadmap-summary-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M5.75 8L10 12.25 14.25 8"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
      </button>

      <div
        id={id}
        className="sample-proposal-roadmap-collapse"
        aria-hidden={!isOpen}
      >
        <div className="sample-proposal-roadmap-collapse-inner">{children}</div>
      </div>
    </section>
  );
};

interface ProjectShowcaseProps {
  projectDocument: StudioDocument;
  heroKicker: string;
  brochureButtonLabel?: string;
}

const ProjectShowcase = ({
  projectDocument,
  heroKicker,
  brochureButtonLabel = "Download Brochure Pack",
}: ProjectShowcaseProps) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoDownloadAttemptedRef = useRef(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBaseOptionsOpen, setIsBaseOptionsOpen] = useState(false);
  const [isBundlesOpen, setIsBundlesOpen] = useState(false);
  const [isAddOnsOpen, setIsAddOnsOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [pdfExportError, setPdfExportError] = useState<string | null>(null);
  const document = isProjectDocument(projectDocument) ? projectDocument : null;
  const printMode = searchParams.get("print") === "1";
  const packetMode = searchParams.get("packet");
  const packetScope = searchParams.get("scope");
  const packetDownloadMode = searchParams.get("download");
  const autoPrint = searchParams.get("autoprint") === "1";
  const autoDownloadPdf = packetDownloadMode === PACKET_DOWNLOAD_MODE;
  const brochureOnlyMode = packetMode === BROCHURE_PACKET_MODE;
  const selectedScopeMode = packetScope === SELECTED_SCOPE_MODE;
  const selection = useMemo(
    () =>
      document
        ? getProjectSelectionFromParams(document, searchParams)
        : { selectedBaseIds: [], selectedAddOnIds: [] },
    [document, searchParams]
  );
  const quote = useMemo(
    () =>
      document
        ? buildProjectQuote(document, selection)
        : null,
    [document, selection]
  );
  const summary = useMemo(
    () =>
      document
        ? buildProjectSummaryLines(document, selection)
        : {
            baseLines: [],
            bundleLine: null,
            bundleDiscountLine: null,
            addOnLines: [],
            adjustmentLines: [],
            bundleActive: false,
          },
    [document, selection]
  );
  const activeBundleOption = useMemo(
    () =>
      document ? getActiveProjectBundleOption(document.content, selection) : null,
    [document, selection]
  );
  const canonicalQuery = useMemo(
    () => buildProjectSearchParams(selection).toString(),
    [selection]
  );
  const packetPages = useMemo(() => {
    if (!document) {
      return [];
    }

    const normalizedContent = normalizeProjectContent(document.content);
    const options: ProjectOption[] = selectedScopeMode
      ? [
          ...getSelectedBaseOptions(normalizedContent, selection),
          ...getSelectedAddOnOptions(normalizedContent, selection),
        ]
      : [...normalizedContent.baseOptions, ...normalizedContent.addOnOptions];

    return options.flatMap((option) => {
      const brochurePage = buildProjectBrochurePage(document, option);
      const agendaPage = buildProjectAgendaPage(document, option);

      return agendaPage
        ? [
            { id: `${option.id}-brochure`, type: "brochure" as const, data: brochurePage },
            { id: `${option.id}-agenda`, type: "agenda" as const, data: agendaPage },
          ]
        : [{ id: `${option.id}-brochure`, type: "brochure" as const, data: brochurePage }];
    });
  }, [document, selection, selectedScopeMode]);
  const recommendedTimeline = useMemo(
    () =>
      document ? buildProjectTimelineDisplayData(document, selection) : null,
    [document, selection]
  );
  const roadmapAgendaOptionIds = useMemo(
    () =>
      new Set(
        (recommendedTimeline?.phases || [])
          .map((phase) => phase.linkedOptionId)
          .filter((value): value is string => Boolean(value))
      ),
    [recommendedTimeline]
  );
  const addOnAgendaIntro = useMemo(
    () =>
      document?.content.addOnOptions.find((option) => option.agenda?.contextNote)
        ?.agenda?.contextNote || "",
    [document]
  );
  const roadmapToday = useMemo(() => new Date(), []);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const navigate = useNavigate();
  const locationState = (location.state ?? null) as StudioAppPacketReturnState | null;
  const packetReturnState =
    isNativePacketViewport() && locationState?.appPacketReturn
      ? locationState.appPacketReturn
      : null;
  const getStudioAppMainScrollTop = () => {
    if (typeof window === "undefined") {
      return 0;
    }

    const appMain = window.document.querySelector<HTMLElement>(".studio-app-main");
    return appMain?.scrollTop || 0;
  };
  const scrollStudioAppMainToTop = () => {
    if (typeof window === "undefined") {
      return;
    }

    const appMain = window.document.querySelector<HTMLElement>(".studio-app-main");
    if (!appMain) {
      return;
    }

    appMain.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };
  const restoreStudioAppMainScroll = (top: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const appMain = window.document.querySelector<HTMLElement>(".studio-app-main");
    if (!appMain) {
      return;
    }

    appMain.scrollTo({
      top,
      left: 0,
      behavior: "auto",
    });
  };
  const buildPacketSearchParams = (options?: {
    autoPrint?: boolean;
    brochureOnly?: boolean;
    downloadPdf?: boolean;
    includeSelection?: boolean;
    selectedOnly?: boolean;
  }) => {
    const params =
      options?.includeSelection === false
        ? new URLSearchParams([["print", "1"]])
        : buildProjectSearchParams(selection, {
            printMode: true,
          });

    if (options?.brochureOnly) {
      params.set("packet", BROCHURE_PACKET_MODE);
    }

    if (options?.selectedOnly) {
      params.set("scope", SELECTED_SCOPE_MODE);
    }

    if (options?.autoPrint) {
      params.set("autoprint", "1");
    }

    if (options?.downloadPdf) {
      params.set("download", PACKET_DOWNLOAD_MODE);
    }

    return params;
  };
  const buildPacketUrl = (options?: {
    autoPrint?: boolean;
    brochureOnly?: boolean;
    downloadPdf?: boolean;
    includeSelection?: boolean;
    selectedOnly?: boolean;
  }) => {
    const params = buildPacketSearchParams(options);
    const hashRoutePrefix =
      typeof window !== "undefined" && window.location.hash.startsWith("#/")
        ? "/#"
        : "";

    return `${origin}${hashRoutePrefix}${location.pathname}?${params.toString()}`;
  };
  const brochurePacketDownloadUrl = buildPacketUrl({
    brochureOnly: true,
    downloadPdf: true,
    includeSelection: false,
  });
  const supportingDownloads = useMemo(
    () =>
      document
        ? normalizeProjectContent(document.content).supportingDownloads || []
        : [],
    [document]
  );
  const heroSupportingDownloads = useMemo(
    () =>
      supportingDownloads.map((download) => ({
        id: download.id,
        variant: "gold",
        label: download.label,
        metaText: download.metaText || "Supporting download",
        href: download.url,
        target: undefined,
        rel: undefined,
        ariaLabel: `${download.label} for ${document?.title || "this project"}`,
        download: true,
      })),
    [document?.title, supportingDownloads]
  );
  const selectedPdfDownloadUrl = buildPacketUrl({
    selectedOnly: true,
    downloadPdf: true,
  });
  const mailtoHref = useMemo(
    () =>
      document
        ? buildProjectMailto(document, selection, origin, location.pathname)
        : "#",
    [document, selection, origin, location.pathname]
  );
  const selectedItemCount =
    selection.selectedBaseIds.length + selection.selectedAddOnIds.length;
  const selectedItemLabel = `${selectedItemCount} item${
    selectedItemCount === 1 ? "" : "s"
  }`;
  const adjustmentTotal = useMemo(
    () => summary.adjustmentLines.reduce((sum, line) => sum + line.amount, 0),
    [summary.adjustmentLines]
  );
  const bundleDiscountTotal = summary.bundleDiscountLine?.amount || 0;
  const serviceTotal = quote ? quote.subtotal + adjustmentTotal + bundleDiscountTotal : 0;
  const packetPdfFilename = useMemo(
    () =>
      buildPacketPdfFilename(
        document?.code || "project",
        selectedScopeMode
          ? "selected"
          : brochureOnlyMode
            ? "brochure"
            : "project"
      ),
    [brochureOnlyMode, document?.code, selectedScopeMode]
  );
  const packetPreviewLabel = selectedScopeMode
    ? "Selected project packet"
    : brochureOnlyMode
      ? "Brochure pack preview"
      : "Project packet preview";
  const isRheemBenchmarkProject =
    !!document && document.code.trim().toUpperCase() === RHEEM_PROJECT_CODE;
  const rheemBenchmarkEntries = useMemo(() => {
    if (!isRheemBenchmarkProject) {
      return [];
    }

    const prices = RHEEM_MARKET_BENCHMARK_ENTRIES.map((entry) => entry.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = Math.max(max - min, 1);

    return RHEEM_MARKET_BENCHMARK_ENTRIES.map((entry, index) => ({
      ...entry,
      markerPosition: 6 + ((entry.price - min) / range) * 88,
      isLowerMarker: index % 2 === 1,
    }));
  }, [isRheemBenchmarkProject]);
  const rheemBenchmarkMobileCards = useMemo(() => {
    if (!isRheemBenchmarkProject) {
      return [];
    }

    const ourEntry = RHEEM_MARKET_BENCHMARK_ENTRIES.find((entry) => entry.isUs);
    const competitorEntries = RHEEM_MARKET_BENCHMARK_ENTRIES.filter(
      (entry) => !entry.isUs
    );
    const competitorAverageUnitPrice = competitorEntries.length
      ? competitorEntries.reduce(
          (sum, entry) => sum + entry.price / entry.comparisonUnits,
          0
        ) / competitorEntries.length
      : 0;
    const ourUnitPrice = ourEntry
      ? ourEntry.price / Math.max(ourEntry.comparisonUnits, 1)
      : 0;
    const averageCheaperPercent =
      competitorAverageUnitPrice > 0
        ? Math.round(
            ((competitorAverageUnitPrice - ourUnitPrice) /
              competitorAverageUnitPrice) *
              100
          )
        : null;

    return [...RHEEM_MARKET_BENCHMARK_ENTRIES]
      .sort((a, b) => a.price - b.price)
      .map((entry) => ({
        ...entry,
        mobileChipLabel:
          entry.isUs && averageCheaperPercent !== null
            ? `${averageCheaperPercent}% cheaper than average market rate per session`
            : null,
      }));
  }, [isRheemBenchmarkProject]);

  useEffect(() => {
    if (!document) {
      return;
    }

    if (printMode) {
      return;
    }

    if (canonicalQuery === searchParams.toString()) {
      return;
    }

    setSearchParams(buildProjectSearchParams(selection), {
      replace: true,
    });
  }, [canonicalQuery, document, printMode, searchParams, selection, setSearchParams]);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    const originalOverflow = window.document.body.style.overflow;

    window.document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!printMode || !autoPrint || autoDownloadPdf) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.print();
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoDownloadPdf, autoPrint, printMode]);

  const downloadPacketPdf = useCallback(async () => {
    if (!printMode || typeof window === "undefined" || isPdfExporting) {
      return;
    }

    setIsPdfExporting(true);
    setPdfExportError(null);

    try {
      const pageElements = Array.from(
        window.document.querySelectorAll<HTMLElement>(PACKET_PAGE_SELECTOR)
      );

      await exportPacketPagesToPdf({
        filename: packetPdfFilename,
        pageElements,
      });
    } catch (error) {
      setPdfExportError(
        error instanceof Error
          ? error.message
          : "Unable to download the PDF packet."
      );
    } finally {
      setIsPdfExporting(false);
    }
  }, [isPdfExporting, packetPdfFilename, printMode]);

  useEffect(() => {
    if (!autoDownloadPdf) {
      autoDownloadAttemptedRef.current = false;
      return;
    }

    if (!printMode || autoDownloadAttemptedRef.current) {
      return;
    }

    autoDownloadAttemptedRef.current = true;
    void downloadPacketPdf();
  }, [autoDownloadPdf, downloadPacketPdf, printMode]);

  useEffect(() => {
    if (!printMode || !isNativePacketViewport()) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollStudioAppMainToTop();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [brochureOnlyMode, printMode, selectedScopeMode]);

  const commitSelection = (
    nextSelection: ProjectSelection,
    options?: { printMode?: boolean }
  ) => {
    const enforcedSelection =
      document?.code.trim().toUpperCase() === RHEEM_PROJECT_CODE
        ? {
            ...nextSelection,
            selectedBaseIds: Array.from(
              new Set([...nextSelection.selectedBaseIds, "f2f-session"])
            ),
          }
        : nextSelection;
    const nextSearchParams = buildProjectSearchParams(
      enforcedSelection,
      options
    );
    startTransition(() => {
      setSearchParams(nextSearchParams, {
        replace: true,
        preventScrollReset: true,
      });
    });
  };

  if (!document || !quote) {
    return null;
  }

  const isRheemProject = document.code.trim().toUpperCase() === RHEEM_PROJECT_CODE;
  const isRequiredRheemBase = (id: string) =>
    isRheemProject && id === "f2f-session";

  const toggleBaseOption = (id: string) => {
    if (isRequiredRheemBase(id)) {
      return;
    }

    const nextIds = toggleSelectionId(selection.selectedBaseIds, id);
    const safeIds = nextIds.length ? nextIds : selection.selectedBaseIds;

    commitSelection({
      ...selection,
      selectedBaseIds: safeIds,
    });
  };

  const toggleAddOnOption = (id: string) => {
    commitSelection({
      ...selection,
      selectedAddOnIds: toggleSelectionId(selection.selectedAddOnIds, id),
    });
  };

  const toggleTimelinePhase = (phase: ProjectTimelinePhaseDisplay) => {
    if (!phase.toggleTarget) {
      return;
    }

    if (phase.toggleTarget.type === "base") {
      toggleBaseOption(phase.toggleTarget.id);
      return;
    }

    toggleAddOnOption(phase.toggleTarget.id);
  };

  const selectBundleOption = (bundleId: string) => {
    const bundleOption = document.content.bundleOptions.find(
      (option) => option.id === bundleId
    );

    if (!bundleOption) {
      return;
    }

    commitSelection({
      selectedBaseIds: bundleOption.baseIds.length
        ? bundleOption.baseIds
        : selection.selectedBaseIds,
      selectedAddOnIds: bundleOption.addOnIds,
    });
  };

  const clearBundleOption = (bundleId: string) => {
    const bundleOption = document.content.bundleOptions.find(
      (option) => option.id === bundleId
    );

    if (!bundleOption) {
      return;
    }

    commitSelection({
      selectedBaseIds: bundleOption.baseIds.length
        ? bundleOption.baseIds
        : selection.selectedBaseIds,
      selectedAddOnIds: selection.selectedAddOnIds.filter(
        (id) => !bundleOption.addOnIds.includes(id)
      ),
    });
  };

  const handleOpenPdfPack = () => {
    setIsCartOpen(false);

    if (typeof window === "undefined") {
      return;
    }

    if (isNativePacketViewport()) {
      navigate(
        {
          pathname: location.pathname,
          search: `?${buildPacketSearchParams({
            selectedOnly: true,
          }).toString()}`,
        },
        {
          preventScrollReset: true,
          state: {
            appPacketReturn: {
              pathname: location.pathname,
              search: location.search,
              scrollTop: getStudioAppMainScrollTop(),
            },
          } satisfies StudioAppPacketReturnState,
        }
      );
      return;
    }

    if (isNarrowPacketViewport()) {
      window.location.assign(selectedPdfDownloadUrl);
      return;
    }

    window.open(selectedPdfDownloadUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenBrochurePacket = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (isNativePacketViewport()) {
      navigate(
        {
          pathname: location.pathname,
          search: `?${buildPacketSearchParams({
            brochureOnly: true,
            includeSelection: false,
          }).toString()}`,
        },
        {
          preventScrollReset: true,
          state: {
            appPacketReturn: {
              pathname: location.pathname,
              search: location.search,
              scrollTop: getStudioAppMainScrollTop(),
            },
          } satisfies StudioAppPacketReturnState,
        }
      );
      return;
    }

    if (isNarrowPacketViewport()) {
      window.location.assign(brochurePacketDownloadUrl);
      return;
    }

    window.open(brochurePacketDownloadUrl, "_blank", "noopener,noreferrer");
  };

  if (printMode) {
    return (
      <div className="document-page is-print-mode">
        <div className="document-shell sample-proposal-print-toolbar-shell">
          <section className="sample-proposal-print-toolbar" aria-label="Packet actions">
            <div className="sample-proposal-print-toolbar-meta">
              <span>{packetPreviewLabel}</span>
              <strong>{packetPdfFilename}</strong>
              {pdfExportError ? (
                <p className="sample-proposal-print-toolbar-error">{pdfExportError}</p>
              ) : null}
            </div>
            <div className="sample-proposal-print-toolbar-actions">
              {isNativePacketViewport() ? (
                <button
                  type="button"
                  className="document-page-button document-page-button--secondary"
                  onClick={() => {
                    navigate(
                      packetReturnState || {
                        pathname: location.pathname,
                        search: "",
                      },
                      {
                        replace: true,
                        preventScrollReset: true,
                      }
                    );

                    if (packetReturnState) {
                      window.requestAnimationFrame(() => {
                        restoreStudioAppMainScroll(packetReturnState.scrollTop);
                      });
                    }
                  }}
                  disabled={isPdfExporting}
                >
                  Back to project
                </button>
              ) : null}
              <button
                type="button"
                className="document-page-button"
                onClick={() => void downloadPacketPdf()}
                disabled={isPdfExporting}
              >
                {isPdfExporting ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                type="button"
                className="document-page-button document-page-button--secondary"
                onClick={() => window.print()}
                disabled={isPdfExporting}
              >
                Print / Save as PDF
              </button>
            </div>
          </section>
        </div>
        <main className="document-shell sample-proposal-print-pack">
          {packetPages.map((page) => (
            <section
              key={page.id}
              className="sample-proposal-print-page"
              data-pdf-page={page.id}
            >
              {page.type === "brochure" ? (
                <ProposalBrochureDocument brochure={page.data} />
              ) : (
                <ProjectAgendaDocument agendaPage={page.data} />
              )}
            </section>
          ))}

          {recommendedTimeline ? (
            <section
              className="sample-proposal-print-page"
              data-pdf-page="recommended-timeline"
            >
              <ProjectTimelineDocument timeline={recommendedTimeline} />
            </section>
          ) : null}

          {!brochureOnlyMode ? (
            <section
              className="sample-proposal-print-page"
              data-pdf-page="project-quote"
            >
              <QuoteDocument
                preparedForLabel="Prepared for"
                preparedForLogoAlt={`${
                  document.clientCompany || document.clientName || "Client"
                } logo`}
                preparedForLogoSrc={document.content.logoUrl || undefined}
                quote={quote}
                totalsAdjustments={
                  summary.bundleDiscountLine ? [summary.bundleDiscountLine] : undefined
                }
              />
            </section>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className={`document-page document-page--sample${isCartOpen ? " is-cart-open" : ""}`}>
      <main className="document-shell sample-proposal-shell">
        <section className="document-page-header sample-proposal-hero">
          <p className="document-page-kicker">{heroKicker}</p>
          <div className="sample-proposal-hero-row">
            <h1>{document.title}</h1>
            <div className="sample-proposal-hero-actions">
              <button
                type="button"
                className="document-page-button document-page-button--secondary sample-proposal-download-button"
                aria-label={`Open the brochure pack with all plans for ${
                  document?.title || "this project"
                }`}
                onClick={handleOpenBrochurePacket}
              >
                <span
                  className="sample-proposal-download-icon-wrap"
                  aria-hidden="true"
                >
                  <svg
                    className="sample-proposal-download-icon"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 3.5V11.5M10 11.5L6.75 8.25M10 11.5L13.25 8.25M4 14.5H16"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                    />
                  </svg>
                </span>
                <span className="sample-proposal-download-copy">
                  <span className="sample-proposal-download-title">
                    {brochureButtonLabel}
                  </span>
                  <span className="sample-proposal-download-meta">
                    All plans in one PDF pack
                  </span>
                </span>
              </button>
              {heroSupportingDownloads.map((download) => (
                <a
                  key={download.id}
                  className={`document-page-button document-page-button--secondary sample-proposal-download-button${
                    download.variant === "gold"
                      ? " sample-proposal-download-button--gold"
                      : ""
                  }`}
                  href={download.href}
                  target={download.target}
                  rel={download.rel}
                  download={download.download}
                  aria-label={download.ariaLabel}
                >
                  <span
                    className="sample-proposal-download-icon-wrap"
                    aria-hidden="true"
                  >
                    <svg
                      className="sample-proposal-download-icon"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 3.5V11.5M10 11.5L6.75 8.25M10 11.5L13.25 8.25M4 14.5H16"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                      />
                    </svg>
                  </span>
                  <span className="sample-proposal-download-copy">
                    <span className="sample-proposal-download-title">
                      {download.label}
                    </span>
                    <span className="sample-proposal-download-meta">
                      {download.metaText}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="sample-proposal-main">
          {isRheemBenchmarkProject && rheemBenchmarkEntries.length ? (
            <details className="sample-proposal-panel sample-proposal-benchmark">
              <summary className="sample-proposal-benchmark-summary">
                <div className="sample-proposal-benchmark-heading">
                  <div>
                    <p className="sample-proposal-label">Market benchmark</p>
                    <h2>Market price</h2>
                  </div>
                </div>

                <span
                  className="sample-proposal-benchmark-summary-icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 20 20">
                    <path
                      d="M5.75 8L10 12.25 14.25 8"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
              </summary>

              <div className="sample-proposal-benchmark-body">
                <div className="sample-proposal-benchmark-scale">
                  <div className="sample-proposal-benchmark-track">
                    {rheemBenchmarkEntries.map((entry) => {
                      const className = `sample-proposal-benchmark-marker${
                        entry.isUs ? " is-us" : ""
                      }${entry.isLowerMarker ? " is-lower" : ""}${
                        entry.href ? " is-link" : ""
                      }`;
                      const style = {
                        "--benchmark-position": `${entry.markerPosition}%`,
                      } as CSSProperties;
                      const markerContent = (
                        <>
                          <span className="sample-proposal-benchmark-dot" />
                          <div className="sample-proposal-benchmark-float">
                            <strong>{entry.label}</strong>
                            <span className="sample-proposal-benchmark-price">
                              {formatBenchmarkPrice(entry.price)}
                            </span>
                            <span className="sample-proposal-benchmark-meta">
                              {entry.mobileDetail}
                            </span>
                          </div>
                        </>
                      );

                      return entry.href ? (
                        <a
                          key={entry.id}
                          className={className}
                          href={entry.href}
                          target="_blank"
                          rel="noreferrer"
                          style={style}
                          aria-label={`${entry.label}, ${formatBenchmarkPrice(
                            entry.price
                          )}. ${entry.detail}. Opens source in a new tab.`}
                        >
                          {markerContent}
                        </a>
                      ) : (
                        <div
                          key={entry.id}
                          className={className}
                          style={style}
                          aria-label={`${entry.label}, ${formatBenchmarkPrice(
                            entry.price
                          )}. ${entry.detail}.`}
                        >
                          {markerContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="sample-proposal-benchmark-mobile-list">
                  {rheemBenchmarkMobileCards.map((entry) => {
                    const cardContent = (
                      <>
                        <div className="sample-proposal-benchmark-mobile-card-top">
                          <strong>{entry.label}</strong>
                          <span>{formatBenchmarkPrice(entry.price)}</span>
                        </div>
                        <p>{entry.mobileDetail}</p>
                        {entry.mobileChipLabel ? (
                          <span className="sample-proposal-benchmark-mobile-chip">
                            {entry.mobileChipLabel}
                          </span>
                        ) : null}
                      </>
                    );

                    const className = `sample-proposal-benchmark-mobile-card${
                      entry.isUs ? " is-us" : ""
                    }${entry.href ? " is-link" : ""}`;

                    return entry.href ? (
                      <a
                        key={`mobile-${entry.id}`}
                        className={className}
                        href={entry.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${entry.label}, ${formatBenchmarkPrice(
                          entry.price
                        )}. ${entry.mobileDetail}. Opens source in a new tab.`}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <div key={`mobile-${entry.id}`} className={className}>
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            </details>
          ) : null}

          <ProjectSectionAccordion
            id="base-options-panel"
            label="Base"
            heading="Base options"
            meta={`${selection.selectedBaseIds.length} selected`}
            isOpen={isBaseOptionsOpen}
            onToggle={() => setIsBaseOptionsOpen((current) => !current)}
          >
            <div className="sample-proposal-option-grid sample-proposal-option-grid--equal-height">
              {document.content.baseOptions.map((option) => {
                const selected = selection.selectedBaseIds.includes(option.id);
                const requiredBase = isRequiredRheemBase(option.id);
                const selectionLocked =
                  requiredBase || (selected && selection.selectedBaseIds.length === 1);

                return (
                  <article
                    key={option.id}
                    className={`sample-proposal-option${
                      selected ? " is-selected" : ""
                    }`}
                  >
                    {renderOptionMedia(option.imageUrl)}

                    <div className="sample-proposal-option-top">
                      <div>
                        <p className="sample-proposal-label">Base Option</p>
                        <h3>{option.title}</h3>
                        <p className="sample-proposal-subtitle">{option.subtitle}</p>
                      </div>

                      <div className="sample-proposal-option-meta">
                        <span
                          className={`sample-proposal-status${
                            selected ? " is-selected" : ""
                          }`}
                        >
                          {selected
                            ? requiredBase
                              ? "Included in Plan"
                              : "Included"
                            : "Available"}
                        </span>
                        {renderOptionPrice(
                          option.price,
                          document.content.currency,
                          option.compareAtPrice
                        )}
                      </div>
                    </div>

                    {option.description ? (
                      <p className="sample-proposal-subtitle">{option.description}</p>
                    ) : null}

                    <div className="sample-proposal-facts">
                      {option.facts.map((fact) => (
                        <div key={`${option.id}-${fact.label}`}>
                          <span>{fact.label}</span>
                          <strong>{fact.value}</strong>
                        </div>
                      ))}
                    </div>

                    <ul className="sample-proposal-list">
                      {option.highlights
                        .filter((highlight) => highlight.trim())
                        .map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>

                    {option.agenda && !roadmapAgendaOptionIds.has(option.id) ? (
                      <ProjectOptionAgendaAccordion agenda={option.agenda} />
                    ) : null}

                    <button
                      type="button"
                      className={`sample-proposal-toggle${
                        selected ? " is-selected" : ""
                      }`}
                      onClick={() => toggleBaseOption(option.id)}
                      disabled={selectionLocked}
                    >
                      {selected
                        ? selectionLocked
                          ? requiredBase
                            ? "Included in Plan"
                            : "Included"
                          : "Remove"
                        : "Add"}
                    </button>
                  </article>
                );
              })}
            </div>
          </ProjectSectionAccordion>

          {document.content.bundleOptions.length ? (
            <ProjectSectionAccordion
              id="bundles-panel"
              label="Bundles"
              heading="Bundles"
              meta={activeBundleOption ? "1 selected" : "None selected"}
              isOpen={isBundlesOpen}
              onToggle={() => setIsBundlesOpen((current) => !current)}
            >
              <div className="sample-proposal-option-grid sample-proposal-option-grid--equal-height">
                {document.content.bundleOptions.map((option) => {
                  const selected = activeBundleOption?.id === option.id;
                  const includedBaseTitles = option.baseIds
                    .map(
                      (baseId) =>
                        document.content.baseOptions.find(
                          (baseOption) => baseOption.id === baseId
                        )?.title || ""
                    )
                    .filter(Boolean);
                  const includedAddOnTitles = option.addOnIds
                    .map(
                      (addOnId) =>
                        document.content.addOnOptions.find(
                          (addOnOption) => addOnOption.id === addOnId
                        )?.title || ""
                    )
                    .filter(Boolean);
                  const baseSummary = includedBaseTitles.length
                    ? includedBaseTitles.join(", ")
                    : "Choose 1 or 2";

                  return (
                    <article
                      key={option.id}
                      className={`sample-proposal-option${
                        selected ? " is-selected" : ""
                      }`}
                    >
                      {renderOptionMedia(option.imageUrl)}

                      <div className="sample-proposal-option-top">
                        <div>
                          <p className="sample-proposal-label">Bundle</p>
                          <h3>{option.title}</h3>
                          <p className="sample-proposal-subtitle">
                            {option.description}
                          </p>
                        </div>

                        <div className="sample-proposal-option-meta">
                          <span
                            className={`sample-proposal-status${
                              selected ? " is-selected" : ""
                            }`}
                          >
                            {selected ? "Selected" : "Optional"}
                          </span>
                          {renderOptionPrice(option.price, document.content.currency)}
                        </div>
                      </div>

                      <div className="sample-proposal-facts">
                        <div>
                          <span>Base sessions</span>
                          <strong>{baseSummary}</strong>
                        </div>
                        <div>
                          <span>Add-ons</span>
                          <strong>{includedAddOnTitles.length}</strong>
                        </div>
                      </div>

                      <ul className="sample-proposal-list">
                        {includedAddOnTitles.map((title) => (
                          <li key={`${option.id}-${title}`}>{title}</li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className={`sample-proposal-toggle${
                          selected ? " is-selected" : ""
                        }`}
                        onClick={() =>
                          selected
                            ? clearBundleOption(option.id)
                            : selectBundleOption(option.id)
                        }
                      >
                        {selected ? "Remove" : "Add"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </ProjectSectionAccordion>
          ) : null}

          {document.content.addOnOptions.length ? (
            <ProjectSectionAccordion
              id="add-ons-panel"
              label="Add-Ons"
              heading="Add-ons"
              meta={`${selection.selectedAddOnIds.length} selected`}
              isOpen={isAddOnsOpen}
              onToggle={() => setIsAddOnsOpen((current) => !current)}
            >
              {addOnAgendaIntro ? (
                <p className="sample-proposal-section-intro">
                  {addOnAgendaIntro}
                </p>
              ) : null}

              <div className="sample-proposal-option-grid sample-proposal-option-grid--equal-height">
                {document.content.addOnOptions.map((option) => {
                  const selected = selection.selectedAddOnIds.includes(option.id);
                  const includedInBundle =
                    selected && Boolean(activeBundleOption);

                  return (
                    <article
                      key={option.id}
                      className={`sample-proposal-option${
                        selected ? " is-selected" : ""
                      }`}
                    >
                      {renderOptionMedia(option.imageUrl)}

                      <div className="sample-proposal-option-top">
                        <div>
                          <p className="sample-proposal-label">Add-On</p>
                          <h3>{option.title}</h3>
                          <p className="sample-proposal-subtitle">{option.subtitle}</p>
                        </div>

                        <div className="sample-proposal-option-meta">
                          <span
                            className={`sample-proposal-status${
                              selected ? " is-selected" : ""
                            }`}
                          >
                            {selected
                              ? includedInBundle
                                ? "Included in package"
                                : "Added"
                              : "Optional"}
                          </span>
                          {renderOptionPrice(
                            option.price,
                            document.content.currency,
                            option.compareAtPrice
                          )}
                        </div>
                      </div>

                      {option.description ? (
                        <p className="sample-proposal-subtitle">{option.description}</p>
                      ) : null}

                      <div className="sample-proposal-facts">
                        {option.facts.map((fact) => (
                          <div key={`${option.id}-${fact.label}`}>
                            <span>{fact.label}</span>
                            <strong>{fact.value}</strong>
                          </div>
                        ))}
                      </div>

                      <ul className="sample-proposal-list">
                        {option.highlights
                          .filter((highlight) => highlight.trim())
                          .map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                      </ul>

                      {option.agenda && !roadmapAgendaOptionIds.has(option.id) ? (
                        <ProjectOptionAgendaAccordion agenda={option.agenda} />
                      ) : null}

                      <button
                        type="button"
                        className={`sample-proposal-toggle${
                          selected ? " is-selected" : ""
                        }`}
                        onClick={() => toggleAddOnOption(option.id)}
                      >
                        {selected ? "Remove" : "Add"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </ProjectSectionAccordion>
          ) : null}

          {recommendedTimeline ? (
            <section
              className={`sample-proposal-panel sample-proposal-roadmap-panel sample-proposal-roadmap-accordion${
                isRoadmapOpen ? " is-open" : ""
              }`}
            >
              <button
                type="button"
                className="sample-proposal-roadmap-summary"
                aria-expanded={isRoadmapOpen}
                aria-controls="implementation-roadmap-panel"
                onClick={() => setIsRoadmapOpen((current) => !current)}
              >
                <div className="sample-proposal-roadmap-summary-main">
                  <div>
                    <p className="sample-proposal-label">
                      {recommendedTimeline.eyebrow}
                    </p>
                    <h2>{recommendedTimeline.heading}</h2>
                  </div>
                  <span className="sample-proposal-section-meta">
                    {new Set(recommendedTimeline.phases.map((phase) => phase.label))
                      .size} phases
                  </span>
                </div>

                <span
                  className="sample-proposal-roadmap-summary-icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 20 20">
                    <path
                      d="M5.75 8L10 12.25 14.25 8"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
              </button>

              <div
                id="implementation-roadmap-panel"
                className="sample-proposal-roadmap-collapse"
                aria-hidden={!isRoadmapOpen}
              >
                <div className="sample-proposal-roadmap-collapse-inner">
                  {recommendedTimeline.intro ? (
                    <p className="sample-proposal-roadmap-intro">
                      {recommendedTimeline.intro}
                    </p>
                  ) : null}

                  <div className="sample-proposal-roadmap-flow">
                    <div
                      className="sample-proposal-roadmap-track"
                      aria-hidden="true"
                    />
                    {recommendedTimeline.phases.map((phase, index) => {
                      const daysUntil = phase.timing
                        ? getRoadmapDaysUntil(phase.timing, roadmapToday)
                        : null;

                      return (
                        <article
                          key={phase.id}
                          className={`sample-proposal-roadmap-step${
                            phase.includedInCurrentScope ? " is-included" : ""
                          }${phase.toggleTarget ? " is-toggleable" : ""}${
                            !phase.includedInCurrentScope ? " is-inactive" : ""
                          }`}
                          style={
                            {
                              "--roadmap-index": index,
                            } as CSSProperties
                          }
                        >
                          <div className="sample-proposal-roadmap-step-left">
                            <p className="sample-proposal-roadmap-phase-label">
                              {phase.label}
                            </p>
                            {phase.timing ? renderRoadmapTiming(phase.timing) : null}
                            {renderRoadmapCountdown(daysUntil)}
                            {phase.timingNote ? (
                              <p className="sample-proposal-roadmap-phase-note">
                                {phase.timingNote}
                              </p>
                            ) : null}
                          </div>

                          <div
                            className="sample-proposal-roadmap-marker"
                            aria-hidden="true"
                          >
                            <span className="sample-proposal-roadmap-marker-dot" />
                          </div>

                          <div
                            className="sample-proposal-roadmap-step-right"
                          >
                            <div className="sample-proposal-roadmap-step-top">
                              <div className="sample-proposal-roadmap-title-row">
                                <span
                                  className="sample-proposal-roadmap-selection-indicator"
                                  aria-hidden="true"
                                />
                                <h3>{phase.title || phase.label}</h3>
                              </div>
                              {phase.toggleTarget ? (
                                <button
                                  type="button"
                                  className={`sample-proposal-status sample-proposal-roadmap-toggle${
                                    phase.includedInCurrentScope
                                      ? " is-selected"
                                      : ""
                                  }`}
                                  aria-pressed={phase.includedInCurrentScope}
                                  aria-label={
                                    phase.includedInCurrentScope
                                      ? `Remove ${phase.title || phase.label} from plan`
                                      : `Add ${phase.title || phase.label} to plan`
                                  }
                                  onClick={() => toggleTimelinePhase(phase)}
                                >
                                  {phase.includedInCurrentScope
                                    ? "Included"
                                    : phase.statusLabel}
                                </button>
                              ) : null}
                            </div>

                            {phase.summary ? (
                              <p className="sample-proposal-subtitle">
                                {phase.summary}
                              </p>
                            ) : null}

                            {phase.helperText ? (
                              <p className="sample-proposal-roadmap-helper">
                                {phase.helperText}
                              </p>
                            ) : null}

                            {phase.deliverables.length ? (
                              <ul className="sample-proposal-list sample-proposal-roadmap-list">
                                {phase.deliverables.map((deliverable) => (
                                  <li key={`${phase.id}-${deliverable}`}>
                                    {deliverable}
                                  </li>
                                ))}
                              </ul>
                            ) : null}

                            {phase.agenda ? (
                              <ProjectOptionAgendaAccordion
                                agenda={phase.agenda}
                                variant="roadmap"
                              />
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {recommendedTimeline.closingNote ? (
                    <p className="sample-proposal-roadmap-closing">
                      {recommendedTimeline.closingNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </section>
      </main>

      {isCartOpen ? (
        <button
          type="button"
          className="sample-proposal-cart-backdrop"
          aria-label="Close live quote"
          onClick={() => setIsCartOpen(false)}
        />
      ) : null}

      <section className="sample-proposal-cart" aria-label="Live quote">
        {isCartOpen ? (
          <div id={CART_DRAWER_ID} className="sample-proposal-cart-drawer">
            <div className="sample-proposal-cart-drawer-header">
              <h2>{document.content.quoteId || document.code}</h2>

              <button
                type="button"
                className="sample-proposal-cart-close"
                aria-label="Close live quote"
                onClick={() => setIsCartOpen(false)}
              >
                X
              </button>
            </div>

            <div className="sample-proposal-cart-meta" aria-label="Quote details">
              <div>
                <span>Issued</span>
                <strong>{formatSampleDate(document.content.issuedOn)}</strong>
              </div>
              <div>
                <span>Valid till</span>
                <strong>{formatSampleDate(document.content.validUntil)}</strong>
              </div>
            </div>

            <div className="sample-proposal-summary-block">
              <div className="sample-proposal-invoice-head" aria-hidden="true">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <span>Base options</span>
              <ul className="sample-proposal-summary-list">
                {summary.baseLines.map((line) => (
                  <li key={line.id}>
                    <div className="sample-proposal-line-copy">
                      <span className="sample-proposal-line-label">Base</span>
                      <strong>{line.title}</strong>
                    </div>
                    <span>{line.priceLabel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sample-proposal-summary-block">
              <span>Bundles</span>
              <ul className="sample-proposal-summary-list">
                {summary.bundleLine ? (
                  <li key={summary.bundleLine.id}>
                    <div className="sample-proposal-line-copy">
                      <span className="sample-proposal-line-label">Package</span>
                      <strong>{summary.bundleLine.title}</strong>
                    </div>
                    <span>{summary.bundleLine.priceLabel}</span>
                  </li>
                ) : (
                  <li>
                    <div className="sample-proposal-line-copy">
                      <span className="sample-proposal-line-label">Package</span>
                      <strong>No bundle</strong>
                    </div>
                    <span>Optional</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="sample-proposal-summary-block">
              <span>Add-ons</span>
              <ul className="sample-proposal-summary-list">
                {summary.addOnLines.length ? (
                  summary.addOnLines.map((line) => (
                    <li key={line.id}>
                      <div className="sample-proposal-line-copy">
                        <span className="sample-proposal-line-label">
                          {line.includedInBundle ? "Included" : "Add-on"}
                        </span>
                        <strong>{line.title}</strong>
                      </div>
                      <span>{line.priceLabel}</span>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="sample-proposal-line-copy">
                      <span className="sample-proposal-line-label">Add-on</span>
                      <strong>No add-ons</strong>
                    </div>
                    <span>Optional</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="sample-proposal-summary-totals">
              <div className="sample-proposal-total-row">
                <span>Services</span>
                <strong>{formatCurrency(serviceTotal, quote.currency)}</strong>
              </div>
              {summary.bundleDiscountLine ? (
                <div className="sample-proposal-total-row sample-proposal-total-row--discount">
                  <span>{summary.bundleDiscountLine.title}</span>
                  <strong>{formatCurrency(-summary.bundleDiscountLine.amount, quote.currency)}</strong>
                </div>
              ) : null}
              {summary.adjustmentLines.map((line) => (
                <div
                  key={line.id}
                  className="sample-proposal-total-row sample-proposal-total-row--discount"
                >
                  <span>{line.title}</span>
                  <strong>{formatCurrency(-line.amount, quote.currency)}</strong>
                </div>
              ))}
              <div className="document-divider" />
              <div className="sample-proposal-total-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(quote.subtotal, quote.currency)}</strong>
              </div>
              <div className="sample-proposal-total-row">
                <span>GST</span>
                <strong>{formatCurrency(quote.gstAmount, quote.currency)}</strong>
              </div>
              <div className="document-divider" />
              <div className="sample-proposal-total-row sample-proposal-total-row--grand">
                <span>Total</span>
                <strong>{formatCurrency(quote.total, quote.currency)}</strong>
              </div>
            </div>

            <div className="sample-proposal-actions sample-proposal-cart-actions">
              <a
                className="document-page-button"
                href={mailtoHref}
                onClick={() => setIsCartOpen(false)}
              >
                {document.ctaLabel || "Accept via email"}
              </a>
              <button
                type="button"
                className="document-page-button document-page-button--secondary"
                onClick={handleOpenPdfPack}
              >
                Download PDF pack
              </button>
            </div>
          </div>
        ) : null}

        <div className="sample-proposal-cart-bar">
          <div className="sample-proposal-cart-bar-copy">
            <span>
              {document.content.quoteId || document.code} · {selectedItemLabel}
            </span>
            <strong>{formatCurrency(quote.total, quote.currency)}</strong>
          </div>

          <div className="sample-proposal-cart-bar-actions">
            <button
              type="button"
              className="document-page-button document-page-button--secondary sample-proposal-cart-toggle"
              onClick={() => setIsCartOpen((current) => !current)}
              aria-expanded={isCartOpen}
              aria-controls={CART_DRAWER_ID}
            >
              {isCartOpen ? "Hide totals" : "Show totals"}
            </button>
            <a className="document-page-button sample-proposal-cart-accept" href={mailtoHref}>
              {document.ctaLabel || "Accept"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectShowcase;
