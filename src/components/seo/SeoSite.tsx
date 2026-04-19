import type { ReactNode } from "react";
import { portfolioContent } from "../../data/portfolioContent";
import {
  caseStudies,
  cityLinks,
  footerLinkGroups,
  featuredTestimonials,
  homeProofStats,
  primaryNavLinks,
  resourceGuides,
  selectedClientLogos,
  serviceLinks,
  siteDetails,
  type CaseStudyPageData,
  type LinkItem,
  type StructuredPageData,
} from "../../seo/content";

const ArrowLink = ({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
}) => (
  <a className={`seo-link-button seo-link-button--${variant}`} href={href}>
    <span>{label}</span>
    <span aria-hidden="true">→</span>
  </a>
);

const SectionHeading = ({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) => (
  <div className="seo-section-heading">
    <p className="seo-eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {intro ? <p className="seo-section-intro">{intro}</p> : null}
  </div>
);

const MetaLine = () => (
  <div className="seo-meta-line">
    <span>By {siteDetails.name}</span>
    <span>{siteDetails.location}</span>
    <span>Updated {siteDetails.lastUpdatedLabel}</span>
  </div>
);

const ProofRail = () => (
  <section className="seo-band seo-band--logos" aria-label="Selected client logos">
    <div className="seo-shell">
      <div className="seo-logo-rail">
        {[...selectedClientLogos, ...selectedClientLogos].map((logo, index) => (
          <div className="seo-logo-rail-item" key={`${logo.name}-${index}`}>
            <img src={logo.logo} alt={logo.name} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FooterLinks = ({ links }: { links: LinkItem[] }) => (
  <ul className="seo-footer-links">
    {links.map((link) => (
      <li key={link.href}>
        <a href={link.href}>{link.label}</a>
      </li>
    ))}
  </ul>
);

const RelatedLinks = ({
  heading,
  links,
}: {
  heading: string;
  links: LinkItem[];
}) => (
  <section className="seo-band">
    <div className="seo-shell">
      <SectionHeading
        eyebrow="Explore next"
        title={heading}
        intro="Related pages that help buyers move from first interest to a clear next step."
      />
      <div className="seo-link-grid">
        {links.map((link) => (
          <a className="seo-link-grid-item" href={link.href} key={link.href}>
            <strong>{link.label}</strong>
            <span>Open page</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

const FaqList = ({ items }: { items: StructuredPageData["faq"] }) => (
  <div className="seo-faq-list">
    {items.map((item) => (
      <details className="seo-faq-item" key={item.question}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </div>
);

const ProofList = ({ references }: { references: StructuredPageData["proof"] }) => (
  <div className="seo-proof-list">
    {references.map((reference) => {
      const study = caseStudies[reference.slug];

      return (
        <a className="seo-proof-item" href={study.path} key={study.slug}>
          <div className="seo-proof-image">
            <img src={study.image} alt={study.title} loading="lazy" />
          </div>
          <div className="seo-proof-copy">
            <p className="seo-proof-kicker">
              {study.client} · {study.year}
            </p>
            <h3>{study.title}</h3>
            <p>{reference.reason}</p>
            <ul>
              {study.metrics.slice(0, 2).map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </div>
        </a>
      );
    })}
  </div>
);

const QuoteStrip = () => (
  <section className="seo-band seo-band--muted">
    <div className="seo-shell">
      <SectionHeading
        eyebrow="Client feedback"
        title="Trusted by teams that needed AI to become useful fast."
      />
      <div className="seo-quote-grid">
        {featuredTestimonials.map((item) => (
          <blockquote className="seo-quote" key={`${item.name}-${item.role}`}>
            <p>{item.text}</p>
            <footer>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

const CalloutBand = ({
  title,
  copy,
  primary,
  secondary,
}: {
  title: string;
  copy: string;
  primary: LinkItem;
  secondary?: LinkItem;
}) => (
  <section className="seo-band seo-band--cta">
    <div className="seo-shell seo-cta-band">
      <div>
        <p className="seo-eyebrow">Next step</p>
        <h2>{title}</h2>
        <p className="seo-section-intro">{copy}</p>
      </div>
      <div className="seo-actions">
        <ArrowLink href={primary.href} label={primary.label} />
        {secondary ? (
          <ArrowLink href={secondary.href} label={secondary.label} variant="secondary" />
        ) : null}
      </div>
    </div>
  </section>
);

const HeroActions = ({
  primary,
  secondary,
  tertiary,
}: {
  primary: LinkItem;
  secondary?: LinkItem;
  tertiary?: LinkItem;
}) => (
  <div className="seo-actions">
    <ArrowLink href={primary.href} label={primary.label} />
    {secondary ? (
      <ArrowLink href={secondary.href} label={secondary.label} variant="secondary" />
    ) : null}
    {tertiary ? (
      <ArrowLink href={tertiary.href} label={tertiary.label} variant="ghost" />
    ) : null}
  </div>
);

const Footer = () => (
  <footer className="seo-footer">
    <div className="seo-shell seo-footer-grid">
      <div className="seo-footer-brand">
        <p className="seo-eyebrow">Sydney, Australia</p>
        <h2>{siteDetails.name}</h2>
        <p>
          AI training, AI fluency workshops, custom AI software development, and
          keynote speaking for Australian organisations that want practical outcomes.
        </p>
        <div className="seo-actions">
          <ArrowLink href="/contact/" label="Book discovery call" />
          <ArrowLink href="/case-studies/" label="View case studies" variant="ghost" />
        </div>
      </div>
      {footerLinkGroups.map((group) => (
        <div key={group.title}>
          <p className="seo-footer-title">{group.title}</p>
          <FooterLinks links={group.links} />
        </div>
      ))}
      <div>
        <p className="seo-footer-title">Contact</p>
        <FooterLinks
          links={[
            { label: siteDetails.email, href: `mailto:${siteDetails.email}` },
            { label: "LinkedIn", href: siteDetails.linkedin },
            { label: "Case studies", href: "/case-studies/" },
          ]}
        />
      </div>
    </div>
  </footer>
);

export const SeoLayout = ({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) => (
  <div className="seo-site">
    <header className="seo-header">
      <div className="seo-shell seo-header-inner">
        <a className="seo-brand" href="/">
          <span>Rushi</span>
          <span>Vyas</span>
        </a>
        <nav className="seo-nav" aria-label="Primary">
          {primaryNavLinks.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href);

            return (
              <a
                className={`seo-nav-link${active ? " is-active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a className="seo-header-cta" href="/contact/">
          Book discovery call
        </a>
      </div>
    </header>
    <main>{children}</main>
    <Footer />
  </div>
);

export const SeoHomePage = () => (
  <>
    <section className="seo-home-hero">
      <div className="seo-shell seo-home-hero-inner">
        <div className="seo-home-copy">
          <p className="seo-eyebrow">
            Sydney-based AI trainer, consultant, and keynote speaker
          </p>
          <h1>
            Make AI useful across your team, not just impressive in a demo.
          </h1>
          <p className="seo-home-lede">
            I help Australian organisations build practical AI capability through
            training, fluency workshops, GenAI upskilling, consulting, speaking,
            and custom AI software development.
          </p>
          <HeroActions
            primary={{ label: "Book discovery call", href: "/contact/" }}
            secondary={{ label: "Explore AI training", href: "/ai-training/" }}
            tertiary={{ label: "View case studies", href: "/case-studies/" }}
          />
          <MetaLine />
        </div>
        <div className="seo-home-portrait-wrap">
          <img
            className="seo-home-portrait"
            src={siteDetails.portraitImage}
            alt="Portrait of Rushi Vyas"
          />
        </div>
      </div>
    </section>

    <ProofRail />

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Why teams enquire"
          title="One Sydney-based operator across training, speaking, consulting, and AI delivery."
          intro="The work is built for organisations that want one credible point of view across leadership conversations, team capability, and practical product or workflow outcomes."
        />
        <div className="seo-stat-list">
          {homeProofStats.map((item) => (
            <div className="seo-stat-list-item" key={item}>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Core offers"
          title="Pick the service that matches the buying intent."
          intro="The site is structured so HR and L&D, executive teams, SMEs, tech leaders, and event organisers can reach the right page without guessing."
        />
        <div className="seo-link-grid">
          {serviceLinks.map((service) => (
            <a className="seo-link-grid-item" href={service.href} key={service.href}>
              <strong>{service.label}</strong>
              <span>Open service page</span>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Case studies"
          title="Real proof across higher education, government, and public-facing AI."
          intro="These are the projects that give the training, consulting, speaking, and software work more credibility."
        />
        <div className="seo-case-study-grid">
          {Object.values(caseStudies).map((study) => (
            <a className="seo-case-study-card" href={study.path} key={study.slug}>
              <div className="seo-case-study-image">
                <img src={study.image} alt={study.title} loading="lazy" />
              </div>
              <div className="seo-case-study-copy">
                <p className="seo-eyebrow">{study.client}</p>
                <h3>{study.title}</h3>
                <p>{study.summary}</p>
                <ul>
                  {study.metrics.slice(0, 2).map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Audience fit"
          title="Built for the actual buying committees."
          intro="Different decision-makers land with different language. The site makes that explicit instead of forcing one vague message onto everyone."
        />
        <div className="seo-audience-grid">
          <div className="seo-audience-item">
            <h3>HR and L&amp;D</h3>
            <p>AI training, AI fluency, GenAI upskilling, capability programs.</p>
          </div>
          <div className="seo-audience-item">
            <h3>Executive teams</h3>
            <p>Executive AI workshops, keynote speaking, adoption priorities, consulting.</p>
          </div>
          <div className="seo-audience-item">
            <h3>SMEs</h3>
            <p>Practical AI workshops, consulting, and low-friction capability lift.</p>
          </div>
          <div className="seo-audience-item">
            <h3>Tech and product leaders</h3>
            <p>Custom AI assistants, product framing, scoped delivery, workflow tools.</p>
          </div>
          <div className="seo-audience-item">
            <h3>Event organisers</h3>
            <p>AI speaker, keynote, facilitator, moderated panel, and audience engagement.</p>
          </div>
        </div>
      </div>
    </section>

    <QuoteStrip />

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Sydney first"
          title="The primary local SEO focus is Sydney."
          intro="Sydney is the real base and the local landing point for training, speaking, consulting, and software development. The city pages are built to reflect that honestly."
        />
        <div className="seo-link-grid">
          {cityLinks.map((cityLink) => (
            <a className="seo-link-grid-item" href={cityLink.href} key={cityLink.href}>
              <strong>{cityLink.label}</strong>
              <span>Open Sydney page</span>
            </a>
          ))}
        </div>
      </div>
    </section>

    <CalloutBand
      title="Tell me the audience, the city, the timeline, and the result you need."
      copy="That is enough to shape the right next step, whether it is a workshop, keynote, consulting brief, or a custom AI product conversation."
      primary={{ label: "Book discovery call", href: "/contact/" }}
      secondary={{ label: "View case studies", href: "/case-studies/" }}
    />
  </>
);

export const SeoAboutPage = () => {
  const recentHighlights = [...portfolioContent.experience]
    .sort((left, right) => Number(right.year) - Number(left.year))
    .slice(0, 5);

  return (
    <>
      <section className="seo-page-hero seo-page-hero--portrait">
        <div className="seo-shell seo-page-hero-inner">
          <div>
            <p className="seo-eyebrow">About Rushi</p>
            <h1>Practical AI leadership shaped by strategy, systems thinking, and live delivery.</h1>
            <p className="seo-page-lede">
              Sydney-based AI trainer, consultant, keynote speaker, and founder who
              helps organisations turn AI interest into practical capability and better
              products.
            </p>
            <HeroActions
              primary={{ label: "Book discovery call", href: "/contact/" }}
              secondary={{ label: "AI keynote speaker", href: "/ai-keynote-speaker/" }}
              tertiary={{ label: "AI training", href: "/ai-training/" }}
            />
            <MetaLine />
          </div>
          <div className="seo-page-portrait-wrap">
            <img
              className="seo-page-portrait"
              src={siteDetails.portraitImage}
              alt="Rushi Vyas portrait"
            />
          </div>
        </div>
      </section>

      <section className="seo-band">
        <div className="seo-shell seo-two-column-copy">
          <SectionHeading
            eyebrow="Positioning"
            title="A personal authority site with real delivery proof behind it."
          />
          <div>
            <p>
              The positioning is intentionally hybrid in capability and single in entity:
              Rushi is the public-facing authority for AI training, AI fluency, keynote
              speaking, facilitation, consulting, and practical AI delivery.
            </p>
            <p>
              The work draws on experience across higher education, government,
              innovation, market strategy, and product design. That makes the talks and
              workshops more grounded, especially for rooms that want practical judgement
              instead of generic AI optimism.
            </p>
          </div>
        </div>
      </section>

      <ProofRail />

      <section className="seo-band seo-band--muted">
        <div className="seo-shell">
          <SectionHeading
            eyebrow="Selected highlights"
            title="The recent years made the current offer credible."
            intro="A few of the proof points that matter most for buyers evaluating authority, relevance, and delivery fit."
          />
          <div className="seo-timeline">
            {recentHighlights.map((item) => (
              <article className="seo-timeline-item" key={`${item.year}-${item.company}`}>
                <p className="seo-eyebrow">{item.year}</p>
                <h3>{item.highlight}</h3>
                <p>{item.company}</p>
                <ul>
                  {item.bullets.slice(0, 3).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="seo-band">
        <div className="seo-shell">
          <SectionHeading
            eyebrow="How the work shows up"
            title="One operator across speaking, capability building, and AI implementation."
          />
          <div className="seo-detail-grid">
            <article>
              <h3>Speaking and facilitation</h3>
              <p>
                Practical keynotes, moderated discussions, and workshop facilitation for
                audiences that want a stronger point of view on AI adoption.
              </p>
            </article>
            <article>
              <h3>Capability and fluency</h3>
              <p>
                AI training and fluency programs for leaders, non-technical teams,
                universities, and public-sector cohorts.
              </p>
            </article>
            <article>
              <h3>Consulting and delivery</h3>
              <p>
                Consulting and product work that moves teams from AI interest toward
                clearer scopes, stronger workflows, and more useful custom experiences.
              </p>
            </article>
          </div>
        </div>
      </section>

      <QuoteStrip />

      <RelatedLinks
        heading="The pages buyers usually read next"
        links={[
          { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
          { label: "AI Training", href: "/ai-training/" },
          { label: "Case Studies", href: "/case-studies/" },
          { label: "Contact", href: "/contact/" },
        ]}
      />
    </>
  );
};

export const SeoStructuredPage = ({
  page,
  supportingLinks,
}: {
  page: StructuredPageData;
  supportingLinks?: LinkItem[];
}) => (
  <>
    <section className="seo-page-hero">
      <div className="seo-shell seo-page-hero-inner">
        <div>
          <p className="seo-eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="seo-page-lede">{page.intro}</p>
          <HeroActions
            primary={{ label: page.primaryCtaLabel, href: page.primaryCtaHref }}
            secondary={page.secondaryLinks[0]}
            tertiary={{ label: "View case studies", href: "/case-studies/" }}
          />
          <MetaLine />
        </div>
        <div className="seo-answer-panel">
          <p>{page.answerBlock}</p>
        </div>
      </div>
    </section>

    <ProofRail />

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Who this is for"
          title={`${page.h1} that match the audience and the buying intent.`}
        />
        <div className="seo-detail-grid">
          {page.audience.map((item) => (
            <article key={item}>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="What improves"
          title="The outcome is stronger judgement plus a more useful next step."
        />
        <div className="seo-outcome-list">
          {page.outcomes.map((item) => (
            <div className="seo-outcome-item" key={item}>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Delivery formats"
          title="A session shape that suits the room, not just the keyword."
        />
        <div className="seo-detail-grid">
          {page.formats.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell seo-two-column-copy">
        <SectionHeading
          eyebrow="What gets covered"
          title="Topics shaped for practical Australian adoption."
        />
        <div className="seo-topic-list">
          {page.topics.map((topic) => (
            <p key={topic}>{topic}</p>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Proof"
          title="Relevant case studies and delivery examples."
          intro="The strongest pages show the work, not just the promise."
        />
        <ProofList references={page.proof} />
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Frequently asked"
          title="Useful questions before someone reaches out."
        />
        <FaqList items={page.faq} />
      </div>
    </section>

    <RelatedLinks
      heading="Keep moving through the site"
      links={supportingLinks || page.secondaryLinks}
    />

    <CalloutBand
      title="If the brief is still fuzzy, that is normal."
      copy="A good first conversation usually clarifies whether the next step should be training, a workshop, consulting, a keynote, or a discovery sprint."
      primary={{ label: page.primaryCtaLabel, href: page.primaryCtaHref }}
      secondary={{ label: "View case studies", href: "/case-studies/" }}
    />
  </>
);

export const SeoCaseStudiesPage = () => (
  <>
    <section className="seo-page-hero">
      <div className="seo-shell seo-page-hero-inner">
        <div>
          <p className="seo-eyebrow">Case studies</p>
          <h1>Clean HTML proof for training buyers, event organisers, and AI decision-makers.</h1>
          <p className="seo-page-lede">
            These case studies exist to make the offer easier to trust. They show
            measurable outcomes, real contexts, and the kinds of organisations the work
            already fits.
          </p>
          <HeroActions
            primary={{ label: "Book discovery call", href: "/contact/" }}
            secondary={{ label: "AI software development", href: "/ai-software-development/" }}
            tertiary={{ label: "AI training", href: "/ai-training/" }}
          />
          <MetaLine />
        </div>
        <div className="seo-answer-panel">
          <p>
            Search and AI answer engines cite pages more easily when the proof is easy to
            crawl. That is why the work below lives as clean page-level HTML instead of
            only inside a slider or visual showcase.
          </p>
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <div className="seo-case-study-grid">
          {Object.values(caseStudies).map((study) => (
            <a className="seo-case-study-card" href={study.path} key={study.slug}>
              <div className="seo-case-study-image">
                <img src={study.image} alt={study.title} loading="lazy" />
              </div>
              <div className="seo-case-study-copy">
                <p className="seo-eyebrow">
                  {study.client} · {study.year}
                </p>
                <h2>{study.title}</h2>
                <p>{study.summary}</p>
                <ul>
                  {study.metrics.map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <QuoteStrip />
  </>
);

export const SeoCaseStudyPage = ({ study }: { study: CaseStudyPageData }) => (
  <>
    <section className="seo-page-hero">
      <div className="seo-shell seo-page-hero-inner">
        <div>
          <p className="seo-eyebrow">
            {study.client} · {study.year}
          </p>
          <h1>{study.title}</h1>
          <p className="seo-page-lede">{study.headline}</p>
          <HeroActions
            primary={{ label: "Book discovery call", href: "/contact/" }}
            secondary={{ label: "View all case studies", href: "/case-studies/" }}
            tertiary={study.relatedServices[0]}
          />
          <MetaLine />
        </div>
        <div className="seo-case-study-hero-image">
          <img src={study.image} alt={study.title} loading="eager" />
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell seo-two-column-copy">
        <SectionHeading
          eyebrow={study.category}
          title="The challenge"
          intro={study.summary}
        />
        <div>
          <p>{study.challenge}</p>
          <p>
            <strong>Location:</strong> {study.location}
          </p>
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Approach"
          title="What was done to make the AI useful."
        />
        <div className="seo-detail-grid">
          {study.approach.map((item) => (
            <article key={item}>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Impact"
          title="The measurable signal that makes the story worth citing."
        />
        <div className="seo-outcome-list">
          {study.metrics.map((metric) => (
            <div className="seo-outcome-item" key={metric}>
              <strong>{metric}</strong>
            </div>
          ))}
        </div>
        <div className="seo-case-study-outcome">
          <p>{study.outcome}</p>
        </div>
      </div>
    </section>

    <RelatedLinks
      heading="Related next steps"
      links={[
        ...study.relatedServices,
        { label: "Case Studies", href: "/case-studies/" },
        { label: "Contact", href: "/contact/" },
      ]}
    />
  </>
);

export const SeoResourcesPage = () => (
  <>
    <section className="seo-page-hero">
      <div className="seo-shell seo-page-hero-inner">
        <div>
          <p className="seo-eyebrow">Resources</p>
          <h1>Short practical guides for buyers shaping AI training, workshops, and speaking briefs.</h1>
          <p className="seo-page-lede">
            This hub exists to answer the early questions clearly so the enquiry can
            become more precise before the first call.
          </p>
          <HeroActions
            primary={{ label: "Book discovery call", href: "/contact/" }}
            secondary={{ label: "AI training", href: "/ai-training/" }}
            tertiary={{ label: "AI keynote speaker", href: "/ai-keynote-speaker/" }}
          />
          <MetaLine />
        </div>
        <div className="seo-answer-panel">
          <p>
            Helpful, citable pages usually answer the obvious buyer questions in plain
            language. These guides are written with that in mind.
          </p>
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell">
        <div className="seo-detail-grid">
          {resourceGuides.map((guide) => (
            <article key={guide.slug}>
              <p className="seo-eyebrow">Guide</p>
              <h2>{guide.title}</h2>
              <p>{guide.summary}</p>
              <ul>
                {guide.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <a className="seo-inline-link" href={guide.href}>
                Open next step
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-band seo-band--muted">
      <div className="seo-shell">
        <SectionHeading
          eyebrow="Useful questions"
          title="Three common early-stage questions."
        />
        <FaqList
          items={[
            {
              question: "Should we begin with training, consulting, or software?",
              answer:
                "Start with the smallest thing that creates useful clarity. For some teams that is training. For others it is a scoped consulting brief or a discovery sprint before any build work starts.",
            },
            {
              question: "How much tailoring matters in AI capability work?",
              answer:
                "A lot. Tailoring is often what separates a forgettable AI session from one that actually changes behaviour.",
            },
            {
              question: "What should an event organiser send in an AI speaker brief?",
              answer:
                "Audience type, event goal, session length, what should happen in the room afterwards, and anything the speaker should avoid or lean into.",
            },
          ]}
        />
      </div>
    </section>
  </>
);

export const SeoContactPage = () => (
  <>
    <section className="seo-page-hero">
      <div className="seo-shell seo-page-hero-inner">
        <div>
          <p className="seo-eyebrow">Contact</p>
          <h1>Tell me the audience, the city, and the outcome you want.</h1>
          <p className="seo-page-lede">
            That is usually enough to figure out whether the right next step is an AI
            workshop, training program, keynote, consulting brief, or discovery sprint.
          </p>
          <HeroActions
            primary={{ label: "Email Rushi", href: `mailto:${siteDetails.email}` }}
            secondary={{ label: "LinkedIn", href: siteDetails.linkedin }}
            tertiary={{ label: "View case studies", href: "/case-studies/" }}
          />
          <MetaLine />
        </div>
        <div className="seo-answer-panel">
          <p>
            Best fits right now include AI training, AI fluency workshops, GenAI
            upskilling, keynote speaking, facilitation, consulting, and custom AI
            software delivery. Sydney is the primary base, with Australia-wide support
            where it makes sense.
          </p>
        </div>
      </div>
    </section>

    <section className="seo-band">
      <div className="seo-shell seo-detail-grid">
        <article>
          <p className="seo-eyebrow">Direct contact</p>
          <h2>Email and LinkedIn</h2>
          <p>
            <a className="seo-inline-link" href={`mailto:${siteDetails.email}`}>
              {siteDetails.email}
            </a>
          </p>
          <p>
            <a className="seo-inline-link" href={siteDetails.linkedin}>
              LinkedIn profile
            </a>
          </p>
        </article>
        <article>
          <p className="seo-eyebrow">Best starting brief</p>
          <h2>What to send</h2>
          <ul>
            <li>The audience or team</li>
            <li>The city or delivery mode</li>
            <li>The goal of the session or project</li>
            <li>Your preferred timing</li>
          </ul>
        </article>
        <article>
          <p className="seo-eyebrow">Services</p>
          <h2>Common enquiry types</h2>
          <ul>
            <li>AI training and AI fluency workshops</li>
            <li>Executive AI workshops and keynotes</li>
            <li>AI consulting and scoped discovery</li>
            <li>Custom AI assistants and software delivery</li>
          </ul>
        </article>
      </div>
    </section>

    <RelatedLinks
      heading="Useful pages before you send the brief"
      links={[
        { label: "AI Training", href: "/ai-training/" },
        { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
        { label: "Case Studies", href: "/case-studies/" },
        { label: "Resources", href: "/resources/" },
      ]}
    />
  </>
);
