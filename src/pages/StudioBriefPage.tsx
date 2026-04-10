import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import "../components/styles/PublicExperience.css";
import "../components/styles/DocumentStudio.css";
import "../components/styles/StudioLibrary.css";
import {
  buildStudioBriefMailto,
  isStudioBriefEmailValid,
  isStudioBriefWebsiteValid,
  studioBudgetOptions,
} from "../lib/studioBrief";

const StudioBriefPage = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    companyWebsite: "",
    contactEmail: "",
    timeline: "",
    budgetRange: "",
    brief: "",
    website: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!form.name.trim()) {
      setSubmitError("Name is required.");
      return;
    }

    if (!form.company.trim()) {
      setSubmitError("Company is required.");
      return;
    }

    if (!form.companyWebsite.trim()) {
      setSubmitError("Company website is required.");
      return;
    }

    if (!isStudioBriefWebsiteValid(form.companyWebsite)) {
      setSubmitError("Enter a valid company website.");
      return;
    }

    if (!form.contactEmail.trim()) {
      setSubmitError("Contact email is required.");
      return;
    }

    if (!isStudioBriefEmailValid(form.contactEmail)) {
      setSubmitError("Enter a valid contact email.");
      return;
    }

    if (!form.timeline.trim()) {
      setSubmitError("Timeline is required.");
      return;
    }

    if (!form.budgetRange.trim()) {
      setSubmitError("Budget range is required.");
      return;
    }

    if (!form.brief.trim()) {
      setSubmitError("Brief is required.");
      return;
    }

    try {
      const nextMailtoHref = buildStudioBriefMailto({
        name: form.name,
        company: form.company,
        companyWebsite: form.companyWebsite,
        contactEmail: form.contactEmail,
        phone: "",
        service: "Project Brief",
        timeline: form.timeline,
        budgetRange: form.budgetRange,
        brief: form.brief,
      });

      setMailtoHref(nextMailtoHref);
      setSubmitSuccess(true);

      window.location.href = nextMailtoHref;
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit your brief right now."
      );
    }
  };

  return (
    <main className="studio-page studio-page--public">
      <header className="studio-topbar studio-library-topbar">
        <Link to="/" className="studio-topbar-brand">
          RV
        </Link>
        <nav className="studio-topbar-links">
          <Link to="/">Portfolio</Link>
          <Link to="/studio">Studio</Link>
        </nav>
      </header>

      <section className="public-page public-page--narrow studio-brief-page">
        <section className="public-panel studio-brief-panel">
          <div className="studio-brief-heading">
            <p className="studio-library-label">Brief</p>
            <h1>Send a brief.</h1>
            <p>This sends a project brief directly to Rushi for review.</p>
          </div>

          {submitSuccess && mailtoHref ? (
            <div className="studio-brief-success-panel">
              <p className="studio-success-copy">
                Your email draft should open automatically. If it does not, use the
                link below to open it manually.
              </p>
              <div className="public-action-row">
                <a className="public-button" href={mailtoHref}>
                  Open Email Draft
                </a>
                <Link className="public-button public-button--secondary" to="/">
                  Go Home Now
                </Link>
              </div>
            </div>
          ) : (
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
                  Company
                  <input
                    value={form.company}
                    onChange={(event) => updateField("company", event.target.value)}
                    autoComplete="organization"
                    placeholder="Company"
                  />
                </label>

                <label>
                  Company website
                  <input
                    value={form.companyWebsite}
                    onChange={(event) =>
                      updateField("companyWebsite", event.target.value)
                    }
                    autoComplete="url"
                    placeholder="knowwhatson.com"
                  />
                </label>

                <label>
                  Contact email
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) =>
                      updateField("contactEmail", event.target.value)
                    }
                    autoComplete="email"
                    placeholder="name@company.com"
                  />
                </label>

                <label>
                  Timeline
                  <input
                    value={form.timeline}
                    onChange={(event) => updateField("timeline", event.target.value)}
                    placeholder="Within 2 weeks"
                  />
                </label>

                <label>
                  Budget range
                  <select
                    value={form.budgetRange}
                    onChange={(event) => updateField("budgetRange", event.target.value)}
                  >
                    <option value="">Select budget</option>
                    {studioBudgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="public-field-span-2">
                  Brief
                  <textarea
                    rows={8}
                    value={form.brief}
                    onChange={(event) => updateField("brief", event.target.value)}
                    placeholder="What should this page help the client review or approve?"
                  />
                </label>

                <label style={{ display: "none" }}>
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

              <div className="public-action-row">
                <button className="public-button" type="submit">
                  Submit
                </button>
                <Link className="public-button public-button--secondary" to="/studio">
                  Back to studio
                </Link>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
};

export default StudioBriefPage;
