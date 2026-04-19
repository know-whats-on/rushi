import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import KeynotePresentationExperience from "../components/studio/KeynotePresentationExperience";
import ProjectShowcase from "../components/studio/ProjectShowcase";
import {
  convertLegacyDocumentToProject,
  getPublicDocumentByCode,
  isLegacyStudioSampleCode,
} from "../lib/documents";
import { isProjectDocument, normalizeProjectContent } from "../lib/projectDocuments";
import type { StudioDocument } from "../types/documents";
import "../components/styles/PublicExperience.css";
import "../components/styles/DocumentStudio.css";

type PublicDocumentPageProps = {
  portfolioHref?: string;
  studioHref?: string;
};

const PublicDocumentPage = ({
  portfolioHref = "/",
  studioHref = "/studio",
}: PublicDocumentPageProps = {}) => {
  const { code = "" } = useParams();
  const [searchParams] = useSearchParams();
  const decodedCode = decodeURIComponent(code);
  const [documentRecord, setDocumentRecord] = useState<StudioDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shouldRedirectLegacySample = isLegacyStudioSampleCode(decodedCode);
  const mode = (searchParams.get("mode") || "").trim().toLowerCase();
  const sessionId = searchParams.get("session") || "";

  useEffect(() => {
    if (shouldRedirectLegacySample) {
      return;
    }

    let active = true;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const nextDocument = await getPublicDocumentByCode(decodedCode);

        if (!active) {
          return;
        }

        setDocumentRecord(
          nextDocument ? convertLegacyDocumentToProject(nextDocument) : null
        );
      } catch (loadError) {
        if (!active) {
          return;
        }

        setErrorMessage(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this shared project right now."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      active = false;
    };
  }, [decodedCode, shouldRedirectLegacySample]);

  if (shouldRedirectLegacySample) {
    return <Navigate to={studioHref} replace />;
  }

  if (mode === "remote") {
    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("code", decodedCode.toUpperCase());

    if (sessionId.trim()) {
      nextSearchParams.set("session", sessionId.trim().toUpperCase());
    }

    return <Navigate to={`/remote?${nextSearchParams.toString()}`} replace />;
  }

  if (loading) {
    return (
      <main className="public-page">
        <section className="public-panel">
          <h2>Loading project...</h2>
        </section>
      </main>
    );
  }

  if (errorMessage || !documentRecord) {
    return (
      <main className="public-page">
        <section className="public-panel">
          <h2>Project not found</h2>
          <p>{errorMessage || "This code does not match a published project."}</p>
          <div className="public-action-row">
            <Link className="public-button" to={studioHref}>
              Back to studio
            </Link>
            <Link className="public-button public-button--secondary" to={portfolioHref}>
              Back to portfolio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (isProjectDocument(documentRecord)) {
    const normalizedContent = normalizeProjectContent(documentRecord.content);

    if (normalizedContent.projectVariant === "presentation") {
      return (
        <KeynotePresentationExperience
          projectDocument={{
            ...documentRecord,
            content: normalizedContent,
          }}
          heroKicker={documentRecord.clientCompany || "Studio Presentation"}
        />
      );
    }
  }

  return (
    <ProjectShowcase
      projectDocument={documentRecord}
      heroKicker={documentRecord.clientCompany || "Studio Project"}
    />
  );
};

export default PublicDocumentPage;
