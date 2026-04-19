import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProposalBrochureDocument from "../../components/documents/ProposalBrochureDocument";
import QuoteDocument from "../../components/documents/QuoteDocument";
import { buildProjectBrochurePage, isProjectDocument, normalizeProjectContent } from "../../lib/projectDocuments";
import { getStudioAppOrigin } from "../../lib/studioAppOrigin";
import type { StudioDocument } from "../../types/documents";
import type {
  ProjectAction,
  ProjectActionKind,
  ProjectActivityFeed,
} from "../../types/clientApp";
import {
  buildInvoiceViewModel,
  getClientProjectDocument,
  getProjectAccess,
  getProjectActivity,
  getProjectOverviewSummary,
  postClientProjectAction,
  postClientProjectMessage,
  saveClientParticipant,
  unlockClientProject,
} from "../lib/clientApi";
import { openStudioExternalUrl } from "../lib/nativeBridge";

type WorkspaceTab = "overview" | "proposal" | "invoice" | "messages" | "presentation";

const activityDateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

const formatActivityDate = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return activityDateFormatter.format(parsed);
};

const DecisionPanel = ({
  pending,
  submitError,
  note,
  setNote,
  onSubmit,
}: {
  pending: boolean;
  submitError: string | null;
  note: string;
  setNote: (value: string) => void;
  onSubmit: (kind: ProjectActionKind) => void;
}) => (
  <section className="studio-app-decision-panel">
    <div className="studio-app-panel-heading">
      <div>
        <p className="studio-app-eyebrow">Client Decision</p>
        <h3>Send your response back into the studio.</h3>
      </div>
    </div>

    <label className="studio-app-field">
      <span>Note</span>
      <textarea
        rows={4}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Add context, approval notes, or the specific changes you need."
      />
    </label>

    {submitError ? <p className="studio-app-error">{submitError}</p> : null}

    <div className="studio-app-sheet-actions">
      <button
        type="button"
        className="studio-app-button"
        disabled={pending}
        onClick={() => onSubmit("approve")}
      >
        {pending ? "Sending..." : "Approve"}
      </button>
      <button
        type="button"
        className="studio-app-button studio-app-button--ghost"
        disabled={pending}
        onClick={() => onSubmit("request_changes")}
      >
        Request changes
      </button>
    </div>
  </section>
);

const ProjectWorkspacePage = () => {
  const { code = "" } = useParams();
  const normalizedCode = decodeURIComponent(code).trim().toUpperCase();
  const [documentRecord, setDocumentRecord] = useState<StudioDocument | null>(null);
  const [activity, setActivity] = useState<ProjectActivityFeed>({
    participant: null,
    messages: [],
    actions: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [needsParticipant, setNeedsParticipant] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [unlockPending, setUnlockPending] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [participantPending, setParticipantPending] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [messageDraft, setMessageDraft] = useState("");
  const [messagePending, setMessagePending] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [decisionPending, setDecisionPending] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const access = await getProjectAccess(normalizedCode);

        if (!active) {
          return;
        }

        if (!access.accessible) {
          setIsLocked(true);
          setNeedsParticipant(false);
          setDocumentRecord(null);
          setActivity({
            participant: null,
            messages: [],
            actions: [],
          });
          return;
        }

        setIsLocked(false);
        setNeedsParticipant(!access.participant);

        const [project, nextActivity] = await Promise.all([
          getClientProjectDocument(normalizedCode),
          getProjectActivity(normalizedCode),
        ]);

        if (!active) {
          return;
        }

        setDocumentRecord(project);
        setActivity(nextActivity);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load this client workspace right now."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (normalizedCode) {
      void loadProject();
    } else {
      setLoading(false);
      setErrorMessage("Project code is required.");
    }

    return () => {
      active = false;
    };
  }, [normalizedCode]);

  const projectDocument =
    documentRecord && isProjectDocument(documentRecord) ? documentRecord : null;
  const projectContent =
    projectDocument ? normalizeProjectContent(projectDocument.content) : null;
  const selectedBaseOption =
    projectContent &&
    (projectContent.baseOptions.find((option) =>
      projectContent.defaultSelectedBaseIds.includes(option.id)
    ) ||
      projectContent.baseOptions[0] ||
      null);
  const proposalData =
    projectDocument && selectedBaseOption
      ? buildProjectBrochurePage(projectDocument, selectedBaseOption)
      : null;
  const invoiceViewModel = documentRecord ? buildInvoiceViewModel(documentRecord) : null;
  const overviewSummary = documentRecord
    ? getProjectOverviewSummary(documentRecord)
    : null;
  const projectTabs = useMemo(() => {
    const tabs: Array<{ id: WorkspaceTab; label: string }> = [
      { id: "overview", label: "Overview" },
      { id: "proposal", label: "Proposal" },
      { id: "invoice", label: "Invoice" },
      { id: "messages", label: "Messages" },
    ];

    if (projectContent?.projectVariant === "presentation") {
      tabs.push({ id: "presentation", label: "Presentation" });
    }

    return tabs;
  }, [projectContent?.projectVariant]);

  const mergedTimeline = useMemo(() => {
    const items = [
      ...activity.messages.map((message) => ({
        id: message.id,
        kind: "message" as const,
        createdAt: message.createdAt,
        payload: message,
      })),
      ...activity.actions.map((action) => ({
        id: action.id,
        kind: "action" as const,
        createdAt: action.createdAt,
        payload: action,
      })),
    ];

    return items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  }, [activity.actions, activity.messages]);

  const handleUnlock = async () => {
    try {
      setUnlockPending(true);
      setPasswordError(null);
      const access = await unlockClientProject(normalizedCode, password);
      setIsLocked(false);
      setNeedsParticipant(!access.participant);

      if (access.participant) {
        window.location.reload();
      }
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
    try {
      setParticipantPending(true);
      setParticipantError(null);
      await saveClientParticipant(normalizedCode, participantName, participantEmail);
      window.location.reload();
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

  const appendAction = (action: ProjectAction) => {
    setActivity((current) => ({
      ...current,
      actions: [...current.actions, action],
    }));
  };

  const handleDecision = async (kind: ProjectActionKind) => {
    try {
      setDecisionPending(true);
      setDecisionError(null);
      const action = await postClientProjectAction(normalizedCode, kind, decisionNote);
      appendAction(action);
      setDecisionNote("");
      setActiveTab("messages");
    } catch (error) {
      setDecisionError(
        error instanceof Error
          ? error.message
          : "Unable to save that decision right now."
      );
    } finally {
      setDecisionPending(false);
    }
  };

  const handleMessageSubmit = async () => {
    try {
      setMessagePending(true);
      setMessageError(null);
      const message = await postClientProjectMessage(normalizedCode, messageDraft);
      setActivity((current) => ({
        ...current,
        messages: [...current.messages, message],
      }));
      setMessageDraft("");
    } catch (error) {
      setMessageError(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now."
      );
    } finally {
      setMessagePending(false);
    }
  };

  if (loading) {
    return (
      <section className="studio-app-page">
        <div className="studio-app-empty">
          <h3>Loading workspace...</h3>
          <p>Checking access and pulling the latest studio state.</p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="studio-app-page">
        <div className="studio-app-empty">
          <h3>Project unavailable</h3>
          <p>{errorMessage}</p>
          <Link to="/" className="studio-app-button">
            Back to Studio
          </Link>
        </div>
      </section>
    );
  }

  if (isLocked) {
    return (
      <section className="studio-app-page">
        <div className="studio-app-panel studio-app-panel--narrow">
          <p className="studio-app-eyebrow">Locked project</p>
          <h2>{normalizedCode}</h2>
          <p>Enter the password Rushi shared with you to unlock this workspace.</p>

          <label className="studio-app-field">
            <span>Project password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>

          {passwordError ? <p className="studio-app-error">{passwordError}</p> : null}

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
            <Link to="/" className="studio-app-button studio-app-button--ghost">
              Back to Studio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (needsParticipant) {
    return (
      <section className="studio-app-page">
        <div className="studio-app-panel studio-app-panel--narrow">
          <p className="studio-app-eyebrow">Identify yourself</p>
          <h2>{normalizedCode}</h2>
          <p>Add your name and email so your messages and approvals are attributable.</p>

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

          {participantError ? <p className="studio-app-error">{participantError}</p> : null}

          <div className="studio-app-sheet-actions">
            <button
              type="button"
              className="studio-app-button"
              disabled={participantPending}
              onClick={() => {
                void handleParticipantSave();
              }}
            >
              {participantPending ? "Saving..." : "Enter workspace"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!projectDocument || !projectContent || !proposalData || !invoiceViewModel) {
    return null;
  }

  const presentationUrl = `${getStudioAppOrigin()}/studio/project/${encodeURIComponent(
    normalizedCode
  )}`;
  const remoteUrl = `${getStudioAppOrigin()}/remote?code=${encodeURIComponent(
    normalizedCode
  )}${
    projectContent.presentation.publicSessionId
      ? `&session=${encodeURIComponent(projectContent.presentation.publicSessionId)}`
      : ""
  }`;

  return (
    <section className="studio-app-page studio-app-page--workspace">
      <div className="studio-app-workspace-hero">
        <div>
          <Link to="/" className="studio-app-backlink">
            Back to Studio
          </Link>
          <p className="studio-app-eyebrow">{projectDocument.clientCompany || "Studio Project"}</p>
          <h2>{projectDocument.title}</h2>
        </div>

        <div className="studio-app-workspace-meta">
          <span>{projectDocument.code}</span>
          <strong>{activity.participant?.name || "Client"}</strong>
        </div>
      </div>

      <div className="studio-app-tabs" role="tablist" aria-label="Project sections">
        {projectTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`studio-app-tab${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="studio-app-workspace-grid">
          <section className="studio-app-panel">
            <div className="studio-app-panel-heading">
              <div>
                <p className="studio-app-eyebrow">Project Summary</p>
                <h3>Live studio overview</h3>
              </div>
            </div>

            <div className="studio-app-summary-grid">
              <div>
                <span>Project code</span>
                <strong>{projectDocument.code}</strong>
              </div>
              <div>
                <span>Client</span>
                <strong>{projectDocument.clientCompany || projectDocument.clientName}</strong>
              </div>
              <div>
                <span>Variant</span>
                <strong>{projectContent.projectVariant}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{projectDocument.status}</strong>
              </div>
            </div>

            {overviewSummary?.intro ? (
              <p className="studio-app-overview-copy">{overviewSummary.intro}</p>
            ) : null}

            {overviewSummary?.supportingDownloads.length ? (
              <div className="studio-app-downloads">
                <p className="studio-app-eyebrow">Supporting downloads</p>
                {overviewSummary.supportingDownloads.map((download) => (
                  <a
                    key={download.id}
                    className="studio-app-download-link"
                    href={download.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{download.label}</span>
                    <strong>{download.metaText || "Open"}</strong>
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          <DecisionPanel
            pending={decisionPending}
            submitError={decisionError}
            note={decisionNote}
            setNote={setDecisionNote}
            onSubmit={(kind) => {
              void handleDecision(kind);
            }}
          />
        </div>
      ) : null}

      {activeTab === "proposal" ? (
        <div className="studio-app-document-stack">
          <ProposalBrochureDocument brochure={proposalData} />
          <DecisionPanel
            pending={decisionPending}
            submitError={decisionError}
            note={decisionNote}
            setNote={setDecisionNote}
            onSubmit={(kind) => {
              void handleDecision(kind);
            }}
          />
        </div>
      ) : null}

      {activeTab === "invoice" ? (
        <div className="studio-app-document-stack">
          <QuoteDocument quote={invoiceViewModel.quote} previewMode />
          <DecisionPanel
            pending={decisionPending}
            submitError={decisionError}
            note={decisionNote}
            setNote={setDecisionNote}
            onSubmit={(kind) => {
              void handleDecision(kind);
            }}
          />
        </div>
      ) : null}

      {activeTab === "messages" ? (
        <div className="studio-app-workspace-grid">
          <section className="studio-app-panel">
            <div className="studio-app-panel-heading">
              <div>
                <p className="studio-app-eyebrow">Project Thread</p>
                <h3>Messages and decisions</h3>
              </div>
            </div>

            <div className="studio-app-timeline">
              {mergedTimeline.length ? (
                mergedTimeline.map((item) =>
                  item.kind === "message" ? (
                    <article key={item.id} className="studio-app-timeline-item">
                      <div className="studio-app-timeline-meta">
                        <strong>{item.payload.authorName}</strong>
                        <span>{formatActivityDate(item.createdAt)}</span>
                      </div>
                      <p>{item.payload.body}</p>
                    </article>
                  ) : (
                    <article
                      key={item.id}
                      className="studio-app-timeline-item studio-app-timeline-item--action"
                    >
                      <div className="studio-app-timeline-meta">
                        <strong>
                          {item.payload.kind === "approve" ? "Approved" : "Requested changes"}
                        </strong>
                        <span>{formatActivityDate(item.createdAt)}</span>
                      </div>
                      <p>
                        {item.payload.authorName}
                        {item.payload.note ? `: ${item.payload.note}` : " submitted a response."}
                      </p>
                    </article>
                  )
                )
              ) : (
                <div className="studio-app-empty studio-app-empty--tight">
                  <p>No messages or client decisions yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="studio-app-panel">
            <div className="studio-app-panel-heading">
              <div>
                <p className="studio-app-eyebrow">New message</p>
                <h3>Send a note back to Rushi</h3>
              </div>
            </div>

            <label className="studio-app-field">
              <span>Message</span>
              <textarea
                rows={8}
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder="Share a question, confirmation, or update."
              />
            </label>

            {messageError ? <p className="studio-app-error">{messageError}</p> : null}

            <div className="studio-app-sheet-actions">
              <button
                type="button"
                className="studio-app-button"
                disabled={messagePending}
                onClick={() => {
                  void handleMessageSubmit();
                }}
              >
                {messagePending ? "Sending..." : "Send message"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "presentation" ? (
        <div className="studio-app-workspace-grid">
          <section className="studio-app-panel">
            <div className="studio-app-panel-heading">
              <div>
                <p className="studio-app-eyebrow">Presentation</p>
                <h3>Open the live deck or synced remote.</h3>
              </div>
            </div>

            <p className="studio-app-overview-copy">
              This project is configured as a presentation variant. The live deck
              remains on the website, while the app gives clients a direct path into
              it after project unlock.
            </p>

            <div className="studio-app-sheet-actions">
              <button
                type="button"
                className="studio-app-button"
                onClick={() => {
                  void openStudioExternalUrl(presentationUrl);
                }}
              >
                Open presentation
              </button>
              <button
                type="button"
                className="studio-app-button studio-app-button--ghost"
                onClick={() => {
                  void openStudioExternalUrl(remoteUrl);
                }}
              >
                Open remote
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
};

export default ProjectWorkspacePage;
