import type {
  DocumentLibraryMeta,
  ProjectBrochureSection,
  ProjectBundleOption,
  ProjectDocumentContent,
  ProjectOption,
  ProjectRecommendedTimeline,
  StudioDocument,
  StudioLibraryCard,
} from "../types/documents";

export const TECHNET_PROJECT_CODE = "TECHNET2026";
export const TECHNET_PROJECT_RETIRED_CODE = "TECHNET26";
export const TECHNET_PROJECT_CARD_LOGO_URL = "/images/studio/technet-logo.png";
export const TECHNET_PROJECT_PDF_LOGO_URL =
  "https://images.squarespace-cdn.com/content/v1/6903054ee9b29271b4b8fc95/fd606521-77c5-42fe-85a0-4bfe4920f265/Tech-Net-Conference-2026.webp?format=1500w";
export const TECHNET_PROJECT_CATEGORY = "Event AI & Engagement";
export const TECHNET_PROJECT_STATUS_LABEL = "Code required";
export const TECHNET_PROJECT_CLIENT = "TechNet Australia";
export const TECHNET_PROJECT_ORGANISATION = "TechNet Australia";
export const TECHNET_PROJECT_TITLE = "TechNet Australia 2026";
const TECHNET_PROJECT_CARD_BANNER_URL =
  "https://static01.nyt.com/images/2019/01/03/business/03Techfix-illo/03Techfix-illo-superJumbo.gif";
const TECHNET_PROJECT_CASE_STUDY_URL =
  "/files/business-case-conference-chatbots.pdf";

export const TECHNET_PROJECT_REFERENCE_MD = `# TechNet Conference 2026
## Proposal and Quote for an AI-Powered Conference Event Assistant

## Executive summary

This proposal outlines a tailored AI-powered event assistant for TechNet Conference 2026, designed to support a polished three-day conference experience for delegates, exhibitors, sponsors and organisers from Wednesday 2 December to Friday 4 December 2026. The solution provides a practical, easy-to-access chatbot that helps attendees find the information they need quickly, reduces repetitive conference-day queries, and improves how participants navigate the program, showcase, sponsors, workshops, tours, venue logistics, and supporting activities.

## Event context

TechNet Australia 2026 is a professional conference environment for technical and scientific staff working across tertiary institutions. The event audience is expected to include university technical staff, professional staff, research support teams, educators, institutional stakeholders, sponsors and conference attendees.

In that setting, delegates typically need fast access to program information, session timings, speaker details, venue logistics, registration guidance, showcase and sponsor information, workshops and tours, directions, accommodation and dinner details, and common event FAQs. The proposed event assistant is designed to meet those needs in a way that feels practical, credible and aligned with a national higher education conference.

## Event details

**Event**
TechNet Conference 2026

**Dates**
Wednesday 2 December to Friday 4 December 2026

**Venue**
Roundhouse, UNSW Sydney

**Location**
UNSW Sydney, Kensington NSW 2052, Australia

## Base Chatbot Software

### AI-Powered Conference Event Assistant

The Base Chatbot Software is the recommended core deployment for TechNet Conference 2026.

It provides a dedicated event-specific chatbot configured using approved conference content supplied by the organiser. The assistant is designed to answer attendee questions about agenda items, session timings, speakers, room locations, registration, logistics, exhibitors, sponsors and event FAQs through a simple conversational interface.

Attendees would access the assistant through a mobile-friendly web link and QR code placed across conference communications, printed signage or registration points. This keeps access simple and avoids the need for an app download.

For organisers, the base deployment provides a practical digital support layer that can reduce repetitive attendee questions, improve discoverability across the three-day conference, and support a more organised event experience. It is scoped as one TechNet Conference 2026 deployment across the live event window from Wednesday 2 December to Friday 4 December 2026, with optional support for kiosk activation, stronger branding, post-event access and lightweight insights.

| Included in Base Chatbot Software | Description |
|---|---|
| Dedicated TechNet event assistant | One event-specific AI-powered chatbot configured for TechNet Conference 2026 |
| Mobile web access | Browser-based attendee access via direct link and QR code |
| Event content setup | Setup using approved website and RAG content covering program, speakers, venue, showcase, sponsors, workshops, tours, directions and FAQs |
| Attendee Q&A capability | Natural-language responses for program, timings, speakers, logistics and common event questions |
| Session and activity discovery | Helps attendees identify relevant sessions, networking moments, showcase entries, sponsors, workshops, tours or activities |
| Standard event branding | Light visual styling aligned to the TechNet event identity |
| One review round | One structured client review round before launch |
| Event-day remote support | Remote support during the agreed live operating window |
| Minor same-day content changes | Limited updates supplied by a nominated TechNet contact during the conference |
| Post-event closeout | Basic wrap-up and service closeout after the event |
| CSV content template | Required CSV template supplied on acceptance for chatbot content preparation |

## Base price

| Item | Detail |
|---|---|
| Scope | One event-specific AI-powered conference assistant for TechNet Conference 2026 across Wednesday 2 December to Friday 4 December 2026 |
| Delivery assumptions | Browser-based access only, one review round, website content due by Friday 9 October 2026, RAG source content due by Friday 16 October 2026, and final approved content supplied by Friday 13 November 2026 |
| Support assumptions | Remote support included for up to 6 hours during the agreed live event window |
| Price | **$13,900 AUD ex GST** |

## Add-Ons

### 1. Kiosk Mode and Deployment Support
**Standalone price:** **$2,400 AUD ex GST**

**What it includes**
Kiosk-optimised display mode for one conference location, setup guidance, and support for one staffed or self-serve information point.

**Why it may be useful for TechNet**
Useful where TechNet wants a visible on-site activation at registration, the exhibition area or an information desk.

### 2. Additional Event-Day Support Hours
**Standalone price:** **$1,050 AUD ex GST**

**What it includes**
An additional 4 hours of remote support beyond the base allowance.

**Why it may be useful for TechNet**
Helpful where the event program extends across a full day and organisers want additional flexibility for live changes or support requests.

### 3. Post-Event Insights Summary
**Standalone price:** **$1,250 AUD ex GST**

**What it includes**
A concise written summary of usage patterns, common attendee questions, recurring themes and practical recommendations.

**Why it may be useful for TechNet**
Supports internal review and future event planning with lightweight, actionable insights.

### 4. Exhibitor and Sponsor Discovery Module
**Standalone price:** **$1,450 AUD ex GST**

**What it includes**
A structured content layer that helps attendees discover exhibitors and sponsors by category, offering or relevance, based on organiser-supplied information.

**Why it may be useful for TechNet**
Useful where the conference has an active sponsor or exhibitor presence and wants stronger attendee engagement with supporting partners.

### 5. Content Refresh Pack
**Standalone price:** **$950 AUD ex GST**

**What it includes**
One additional structured refresh of the chatbot knowledge base after the initial build and prior to final launch.

**Why it may be useful for TechNet**
Useful where speakers, timings, room allocations or event details may still shift after the initial content load.

### 6. Extended Post-Event Access
**Standalone price:** **$790 AUD ex GST**

**What it includes**
Keeps the assistant live for 14 days after the event with approved follow-up resources or event information.

**Why it may be useful for TechNet**
Useful where organisers want delegates to access event information or follow-up materials after the conference.

### 7. Premium Branded Interface
**Standalone price:** **$1,100 AUD ex GST**

**What it includes**
Enhanced visual styling aligned more closely to the TechNet event identity and approved brand assets.

**Why it may be useful for TechNet**
Improves presentation quality and makes the assistant feel more integrated into the event experience.

### 8. Feedback and Engagement Module
**Standalone price:** **$1,350 AUD ex GST**

**What it includes**
Simple in-chat prompts to capture attendee feedback, usefulness ratings or quick pulse-check responses.

**Why it may be useful for TechNet**
Useful where organisers want light-touch engagement capture during or immediately after the event.

## Package options

### Recommended Package
**Final package price:** **$16,900 AUD ex GST**

**Included**
- Base Chatbot Software
- Premium Branded Interface
- Content Refresh Pack
- Post-Event Insights Summary
- Extended Post-Event Access

**Best suited for**
A polished three-day conference deployment where TechNet wants a stronger branded experience, some flexibility during final preparation, and useful post-event visibility.

### Enhanced Package
**Final package price:** **$20,950 AUD ex GST**

**Included**
- Base Chatbot Software
- Premium Branded Interface
- Content Refresh Pack
- Post-Event Insights Summary
- Extended Post-Event Access
- Kiosk Mode and Deployment Support
- Additional Event-Day Support Hours
- Exhibitor and Sponsor Discovery Module
- Feedback and Engagement Module

**Best suited for**
A higher-touch deployment where TechNet wants stronger on-site visibility, broader event-day support and more attendee engagement features.

## Delivery approach and timeline

| Stage | Timing |
|---|---|
| Kick-off, scope confirmation and content-owner alignment | Week of Monday 21 September 2026 |
| Website content due from client | Friday 9 October 2026 |
| RAG source content due from client | Friday 16 October 2026 |
| Content structuring, site map and knowledge-base preparation | Week of Monday 19 October 2026 |
| Website build and chatbot MVP | Week of Monday 26 October 2026 |
| RAG ingestion, conversation design and internal QA | Week of Monday 2 November 2026 |
| Client review and refinement | Week of Monday 9 November 2026 |
| Final approved changes due from client | Friday 13 November 2026 |
| Go-live | Wednesday 18 November 2026 |
| Live conference support window | Wednesday 2 December to Friday 4 December 2026 |
| Post-event closeout | By Friday 11 December 2026 |
| Optional post-event summary | By Tuesday 15 December 2026, if selected |

## Content collection deadlines

- **Website content due by Friday 9 October 2026**: approved homepage and about copy, registration links, venue and directions copy, CTA links, branding assets, and decisions on the key public conference pages and their order.
- **RAG source content due by Friday 16 October 2026**: program draft, speakers, showcase and exhibitor information, sponsors, workshops and tours, FAQs, transport and directions, dinner and accommodation details, and the source PDFs, CSVs or documents required for ingestion.
- **Final approved changes due by Friday 13 November 2026**: the final signed-off website content, chatbot updates, link changes and approved refinements required before launch.

## Assumptions and exclusions

### Assumptions

- TechNet will provide approved website content by Friday 9 October 2026 and approved RAG source content by Friday 16 October 2026.
- TechNet will provide agenda, session, speaker, exhibitor, sponsor, workshop, tour, directions, venue and FAQ content in the required editable formats or CSV template.
- A CSV template will be supplied on acceptance.
- One nominated client contact will coordinate approvals, content decisions and event-day updates.
- The assistant will be deployed as a browser-based event tool accessed by QR code and direct link.
- This quote covers one TechNet Conference 2026 deployment spanning Wednesday 2 December to Friday 4 December 2026 only.
- Pricing assumes a chatbot-first event scope rather than a deeply integrated event platform build.

### Exclusions

- Native app development
- Automated integrations with registration, ticketing, CRM or institutional systems
- Formal security architecture documentation, certification, or compliance assurance documentation
- Accessibility certification or formal conformance testing
- Hardware supply, kiosk hardware hire, connectivity provisioning or venue AV support
- Custom dashboards or advanced analytics beyond the optional post-event insights summary
- Live translation or multilingual deployment unless separately scoped

## Next steps

Please confirm the preferred option:

- Base Chatbot Software
- Recommended Package
- Enhanced Package

Following confirmation, a short kick-off session would be scheduled and the CSV content template would be issued for event data preparation.

## Commercial terms

**Quote validity**
30 days from date of issue.

**Payment terms**
20% in advance, with the remaining payment due within 14 days of go-live delivery unless otherwise agreed in writing.

**Delivery dependency**
Delivery depends on timely receipt of approved conference content, feedback, approvals, and access from the client.

**Support assumptions**
Base pricing includes remote support during the agreed live conference operating window only. Additional support can be added if required.

**GST**
All pricing is exclusive of GST.
`;

const createSections = (
  sections: Array<{
    title: string;
    column: "left" | "right";
    paragraphs?: string[];
    bullets?: string[];
  }>,
  prefix: string
): ProjectBrochureSection[] =>
  sections.map((section) => ({
    id: `${prefix}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: section.title,
    column: section.column,
    paragraphs: section.paragraphs || [],
    bullets: section.bullets || [],
  }));

const createOption = (option: ProjectOption): ProjectOption => ({
  imageUrl: TECHNET_PROJECT_CARD_BANNER_URL,
  ...option,
});

const TECHNET_RECOMMENDED_TIMELINE: ProjectRecommendedTimeline = {
  eyebrow: "Implementation timeline",
  heading: "TechNet Conference Delivery Roadmap",
  intro:
    "A structured delivery timeline designed around TechNet Conference 2026 at Roundhouse, UNSW Sydney, running from Wednesday, December 2 to Friday, December 4, 2026. The target go-live is Wednesday, November 18, 2026, giving TechNet a full two-week validation buffer before the conference opens.",
  closingNote:
    "Website content is due by Friday, October 9, 2026, RAG source content is due by Friday, October 16, 2026, final approved changes are due by Friday, November 13, 2026, and the website plus conference assistant should go live on Wednesday, November 18, 2026 so TechNet has a full two-week launch buffer before the event begins on Wednesday, December 2, 2026.",
  phases: [
    {
      id: "technet-phase-1",
      label: "Phase 1",
      timing: "Week of September 21, 2026",
      title: "Scoping and Delivery Planning",
      summary:
        "Confirm scope, conference goals, content owners, approval flow, delivery cadence, and launch expectations so the website and chatbot can move without rework.",
      deliverables: [
        "Kick-off session with TechNet stakeholders and confirmed delivery plan",
        "Named content owners, approval pathway, and implementation priorities",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-2",
      label: "Phase 2",
      timing: "Friday, October 9, 2026",
      title: "Website Content Due from Client",
      summary:
        "Receive the approved public-facing website inputs required to shape the conference experience and page structure before build begins.",
      deliverables: [
        "Approved homepage and about copy, registration links, venue and directions copy, CTA links, and branding assets",
        "Confirmed key conference pages and page-order decisions for the website build",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-3",
      label: "Phase 3",
      timing: "Friday, October 16, 2026",
      title: "RAG Source Content Due from Client",
      summary:
        "Receive the approved source material required to power the chatbot knowledge base and RAG layer with event-specific answers.",
      deliverables: [
        "Program draft, speakers, showcase or exhibitor information, sponsors, workshops and tours, FAQs, transport and directions, and dinner or accommodation details",
        "Source PDFs, CSVs, documents, and structured content ready for ingestion and knowledge-base preparation",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-4",
      label: "Phase 4",
      timing: "Week of October 19, 2026",
      title: "Content Structuring and Knowledge-Base Preparation",
      summary:
        "Structure the website information architecture, clean the source content, and prepare the RAG knowledge base so the build can move with clear foundations.",
      deliverables: [
        "Website site map, page structure, and normalized conference content set",
        "RAG-ready knowledge-base preparation across approved conference source material",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-5",
      label: "Phase 5",
      timing: "Week of October 26, 2026",
      title: "Website Build and Chatbot MVP",
      summary:
        "Build the first working conference website and attendee-facing chatbot MVP, including the QR-code access path and the core answers needed for TechNet use.",
      deliverables: [
        "Working website draft and chatbot MVP for TechNet Conference 2026",
        "Initial QA pass across navigation, links, key journeys, and mobile access",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-6",
      label: "Phase 6",
      timing: "Week of November 2, 2026",
      title: "RAG Ingestion, Conversation Design and Internal QA",
      summary:
        "Load the approved source content, refine conversation flows, and pressure-test the attendee experience before it goes to client review.",
      deliverables: [
        "RAG ingestion, structured response pathways, and conference conversation design",
        "Internal QA across test scenarios for program, sponsors, showcase, workshops, tours, directions, and logistics",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-7",
      label: "Phase 7",
      timing: "Week of November 9, 2026",
      title: "Client Review and Refinement",
      summary:
        "Review the website and chatbot with TechNet, capture feedback, and complete the final refinement pass before launch preparation closes.",
      deliverables: [
        "Client review round and refinement pass across the website and chatbot experience",
        "Final approved changes due from TechNet by Friday, November 13, 2026",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-8",
      label: "Phase 8",
      timing: "Wednesday, November 18, 2026",
      title: "Go-Live and Launch Buffer",
      summary:
        "Release the website and conference assistant two weeks before the event so TechNet has time for final checks, QR testing, and launch confidence before delegates arrive.",
      deliverables: [
        "Production go-live of the website and TechNet conference assistant",
        "Two-week launch buffer before the conference opens on Wednesday, December 2, 2026",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-9",
      label: "Phase 9",
      timing: "December 2 to December 4, 2026",
      title: "Live Conference Support Window",
      summary:
        "Support the live conference across the three-day event window, with coverage aligned to the agreed operating periods and approved same-day updates.",
      deliverables: [
        "Live support coverage during the agreed conference operating window",
        "Approved same-day updates and operational support during TechNet Conference 2026",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
    {
      id: "technet-phase-10",
      label: "Phase 10",
      timing: "By December 15, 2026",
      title: "Post-Event Closeout and Optional Insights",
      summary:
        "Close the deployment cleanly after the conference, with basic closeout completed within five business days and the optional insights summary delivered within seven business days if selected.",
      deliverables: [
        "Basic post-event closeout completed by Friday, December 11, 2026",
        "Optional insights summary delivered by Tuesday, December 15, 2026 if selected",
      ],
      relatedOptionIds: [],
      relatedOptionMatch: "any",
    },
  ],
};

const TECHNET_BASE_OPTION_ID = "base-chatbot-software";
const TECHNET_ADD_ON_IDS = {
  kiosk: "addon-kiosk-mode",
  support: "addon-support-hours",
  insights: "addon-post-event-insights",
  discovery: "addon-exhibitor-sponsor-discovery",
  refresh: "addon-content-refresh",
  extendedAccess: "addon-extended-access",
  brandedInterface: "addon-premium-interface",
  feedback: "addon-feedback-module",
} as const;

const TECHNET_BASE_OPTIONS: ProjectOption[] = [
  createOption({
    id: TECHNET_BASE_OPTION_ID,
    title: "Base Chatbot Software",
    subtitle: "AI-Powered Conference Event Assistant",
    description:
      "A dedicated TechNet event assistant configured from approved conference content so attendees can get fast answers across the program, venue, sponsors, and event logistics.",
    price: 13900,
    facts: [
      {
        label: "Deployment",
        value: "Three-day conference · 2-4 Dec 2026",
      },
      {
        label: "Access",
        value: "Mobile web link + QR code",
      },
      {
        label: "Support Window",
        value: "Remote support up to 6 hours",
      },
    ],
    highlights: [
      "Helps delegates quickly find agenda details, timings, speaker information, room locations, registration guidance, exhibitors, sponsors, and FAQs.",
      "Configured from organiser-approved content and launched as a simple browser experience without requiring an app download.",
      "Creates a practical digital support layer that reduces repetitive event-day questions and improves conference navigation.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "The base deployment creates a dedicated TechNet conference assistant that attendees can access through a mobile-friendly web experience and QR code across the event journey.",
            "It is designed to make conference information easier to access in the moment, helping attendees move between sessions, logistics, exhibitors, sponsors, and support touchpoints with less friction.",
          ],
        },
        {
          title: "What the Assistant Covers",
          column: "right",
          bullets: [
            "Agenda information, session timings, speaker details, room locations, and event logistics.",
            "Registration guidance, venue navigation, exhibitor information, sponsor information, and common FAQs.",
            "Session and activity discovery support that helps delegates find relevant talks, networking moments, exhibitors, or supporting activities.",
            "Natural-language attendee Q&A designed for quick event-day use on mobile.",
          ],
        },
        {
          title: "Access and Setup",
          column: "left",
          bullets: [
            "Browser-based attendee access through a direct link and QR code placement across conference communications and signage.",
            "Setup using approved agenda, speaker, venue, exhibitor, sponsor, and FAQ content supplied by TechNet.",
            "A required CSV template is issued on acceptance to structure chatbot content preparation.",
            "One structured client review round is included before launch.",
          ],
        },
        {
          title: "Event-Day Support",
          column: "right",
          bullets: [
            "Remote support is included for up to 6 hours during the agreed live event window.",
            "Minor same-day content changes can be supplied by a nominated TechNet contact.",
            "Post-event closeout is included after the conference.",
            "The deployment is scoped for one TechNet Conference 2026 only, across Wednesday 2 December to Friday 4 December 2026.",
          ],
        },
        {
          title: "Included in Base",
          column: "right",
          bullets: [
            "Dedicated TechNet event assistant configured for TechNet Australia 2026.",
            "Browser-based access through a direct link and QR code.",
            "Standard event branding aligned to the TechNet identity.",
            "A practical support layer that improves discoverability, navigation, and operational clarity on the day.",
          ],
        },
      ],
      TECHNET_BASE_OPTION_ID
    ),
  }),
];

const TECHNET_ADD_ON_OPTIONS: ProjectOption[] = [
  createOption({
    id: TECHNET_ADD_ON_IDS.kiosk,
    title: "Kiosk Mode and Deployment Support",
    subtitle: "Add a visible on-site activation point",
    description:
      "A kiosk-optimised display mode with setup guidance and support for one staffed or self-serve conference information point.",
    price: 2400,
    facts: [
      { label: "Deployment", value: "One conference location" },
      { label: "Format", value: "Staffed or self-serve info point" },
      { label: "Best For", value: "Registration or exhibition area" },
    ],
    highlights: [
      "Creates a clear on-site activation point for attendees who prefer a fixed-location interaction.",
      "Useful at registration, an information desk, or the exhibition area.",
      "Adds more visibility to the assistant within high-traffic spaces.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on extends the conference assistant into a kiosk-ready mode for a single conference location.",
            "It is designed for TechNet teams that want a visible physical activation point alongside the attendee mobile experience.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "Kiosk-optimised display mode for a larger shared screen.",
            "Setup guidance for one conference location.",
            "Support for either a staffed or self-serve information point.",
          ],
        },
        {
          title: "Event Value",
          column: "left",
          bullets: [
            "Improves visibility at registration, in the exhibition area, or at an information desk.",
            "Helps reduce repetitive attendee questions at on-site support points.",
            "Gives TechNet a more tangible conference activation around the assistant.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "One kiosk-mode configuration.",
            "Deployment guidance for one location.",
            "Support aligned to one staffed or self-serve information point.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.kiosk
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.support,
    title: "Additional Event-Day Support Hours",
    subtitle: "Extend remote coverage beyond the base window",
    description:
      "Adds 4 extra hours of remote support for longer conference coverage or more operational flexibility on the day.",
    price: 1050,
    facts: [
      { label: "Support", value: "Additional 4 hours" },
      { label: "Format", value: "Remote event-day support" },
      { label: "Best For", value: "Longer conference programs" },
    ],
    highlights: [
      "Useful where the TechNet program runs across a full day with multiple support peaks.",
      "Adds flexibility for late changes, additional requests, or extended live coverage.",
      "Strengthens event-day responsiveness without changing the core build.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on extends the live support window beyond the remote allowance included in the base deployment.",
            "It is designed for conference days that need more flexibility, longer coverage, or extra operational confidence.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "An extra 4 hours of remote support.",
            "More room for live content changes or support requests.",
            "Additional coverage for longer conference programs or late-day activities.",
          ],
        },
        {
          title: "Event Value",
          column: "left",
          bullets: [
            "Supports smoother event-day operations when the program is dynamic.",
            "Helps TechNet respond faster to live support needs during busier windows.",
            "Reduces pressure on the base support window when the event extends.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "4 additional hours of remote support.",
            "Coverage aligned to the agreed extended operating window.",
            "Extra flexibility for live event support needs.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.support
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.insights,
    title: "Post-Event Insights Summary",
    subtitle: "Capture question themes and practical follow-up recommendations",
    description:
      "A concise written summary of usage patterns, common attendee questions, recurring themes, and practical recommendations.",
    price: 1250,
    facts: [
      { label: "Output", value: "Written summary" },
      { label: "Timing", value: "Post-event closeout" },
      { label: "Best For", value: "Internal review and planning" },
    ],
    highlights: [
      "Turns live conference usage into a lightweight internal review asset.",
      "Surfaces what attendees asked most often and where content gaps appeared.",
      "Supports future TechNet planning with practical, actionable insights.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on provides a concise post-event summary based on how attendees used the conference assistant.",
            "It gives TechNet a practical view of question patterns, recurring themes, and opportunities to refine future deployments.",
          ],
        },
        {
          title: "What It Covers",
          column: "right",
          bullets: [
            "Usage patterns and common attendee questions.",
            "Recurring themes, content gaps, and practical observations.",
            "Recommendations that support future event planning.",
          ],
        },
        {
          title: "Post-Event Value",
          column: "left",
          bullets: [
            "Supports internal review after the conference closes.",
            "Helps TechNet understand where the assistant added value.",
            "Creates a lightweight feedback loop without a custom dashboard build.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "Concise written summary.",
            "Question-theme and usage-pattern analysis.",
            "Practical recommendations for future events.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.insights
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.discovery,
    title: "Exhibitor and Sponsor Discovery Module",
    subtitle: "Improve partner discoverability across the conference",
    description:
      "A structured content layer that helps attendees discover exhibitors and sponsors by category, offering, or relevance.",
    price: 1450,
    facts: [
      { label: "Focus", value: "Exhibitors + sponsors" },
      { label: "Format", value: "Structured content layer" },
      { label: "Best For", value: "Active partner presence" },
    ],
    highlights: [
      "Makes it easier for delegates to find relevant supporting partners.",
      "Useful where exhibitors and sponsors are an active part of the conference experience.",
      "Supports stronger engagement with partner organisations using organiser-supplied information.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on introduces a structured discovery layer for exhibitors and sponsors inside the assistant experience.",
            "It is designed for conferences where attendee engagement with supporting partners matters as part of the overall event outcome.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "Discovery support by category, offering, or relevance.",
            "A clearer path for attendees to explore supporting partners.",
            "Content built from organiser-supplied exhibitor and sponsor information.",
          ],
        },
        {
          title: "Event Value",
          column: "left",
          bullets: [
            "Strengthens attendee engagement with supporting partners.",
            "Improves discoverability beyond static lists or signage alone.",
            "Helps partner participation feel more integrated into the conference journey.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "Structured exhibitor and sponsor content layer.",
            "Discovery pathways based on organiser-approved information.",
            "A stronger attendee experience around partner visibility.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.discovery
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.refresh,
    title: "Content Refresh Pack",
    subtitle: "One additional structured update before launch",
    description:
      "One extra structured refresh of the chatbot knowledge base after the initial build and before final launch.",
    price: 950,
    facts: [
      { label: "Update Type", value: "One structured refresh" },
      { label: "Scope", value: "Knowledge-base update" },
      { label: "Best For", value: "Late schedule or speaker changes" },
    ],
    highlights: [
      "Useful when speakers, timings, room allocations, or event details are still moving.",
      "Adds a clean extra update pass beyond the initial content build.",
      "Helps keep the assistant aligned to the final approved event information.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on provides one extra structured refresh of the chatbot knowledge base after the initial build phase.",
            "It is designed for conferences where agenda details, speakers, or logistics may still shift before final launch.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "One additional structured content refresh.",
            "A cleaner way to handle meaningful late changes.",
            "More confidence that the assistant reflects the latest approved information.",
          ],
        },
        {
          title: "Event Value",
          column: "left",
          bullets: [
            "Reduces delivery pressure when event details change late.",
            "Helps maintain accuracy across sessions, speakers, rooms, and FAQs.",
            "Supports a more dependable attendee experience close to go-live.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "One additional structured refresh.",
            "Update pass across the relevant knowledge base.",
            "Alignment to the latest approved event information within scope.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.refresh
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.extendedAccess,
    title: "Extended Post-Event Access",
    subtitle: "Keep the assistant live for 14 days after the conference",
    description:
      "Extends the assistant for 14 days after the event with approved follow-up resources or event information.",
    price: 790,
    facts: [
      { label: "Access Window", value: "14 days post-event" },
      { label: "Format", value: "Browser-based follow-up access" },
      { label: "Best For", value: "Resources and follow-up questions" },
    ],
    highlights: [
      "Keeps the assistant useful after the conference rather than ending access immediately.",
      "Supports follow-up resources and post-event questions without a separate workflow.",
      "Adds a light-touch extension without turning the deployment into an ongoing product rollout.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on keeps the conference assistant live for 14 days after the event.",
            "It is designed for post-event follow-up, resource sharing, and a smoother delegate handoff after the conference closes.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "14 additional days of assistant access.",
            "Support for approved follow-up resources or event information.",
            "Continued access for delegates with late questions after the event.",
          ],
        },
        {
          title: "Post-Event Value",
          column: "left",
          bullets: [
            "Extends the usefulness of the build beyond event day.",
            "Supports a cleaner transition from live assistance into follow-up communication.",
            "Keeps event information accessible without forcing attendees through multiple channels.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "14 days of continued access.",
            "Support for approved post-event content.",
            "Extended availability for follow-up questions within scope.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.extendedAccess
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.brandedInterface,
    title: "Premium Branded Interface",
    subtitle: "A stronger event identity across the attendee experience",
    description:
      "Enhanced visual styling aligned more closely to the TechNet event identity and approved brand assets.",
    price: 1100,
    facts: [
      { label: "Upgrade", value: "Enhanced interface styling" },
      { label: "Format", value: "TechNet-aligned web app UI" },
      { label: "Best For", value: "Higher-polish attendee experience" },
    ],
    highlights: [
      "Improves presentation quality and makes the assistant feel more integrated into the event experience.",
      "Aligns the interface more closely to TechNet branding and approved visual assets.",
      "Delivers a stronger branded experience without changing the underlying functionality.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on enhances the assistant interface so it feels more clearly aligned to the TechNet event identity.",
            "It is designed for teams that want a stronger branded experience than the lighter default styling treatment.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "Enhanced visual styling aligned to approved TechNet assets.",
            "A more polished attendee-facing web experience.",
            "Stronger consistency with conference communications and signage.",
          ],
        },
        {
          title: "Experience Value",
          column: "left",
          bullets: [
            "Makes the assistant feel more event-ready and integrated.",
            "Improves the first impression when delegates open the experience.",
            "Helps the assistant sit more naturally within the broader TechNet identity.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "Enhanced branded interface styling.",
            "Closer alignment to approved event brand assets.",
            "A higher-polish attendee experience.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.brandedInterface
    ),
  }),
  createOption({
    id: TECHNET_ADD_ON_IDS.feedback,
    title: "Feedback and Engagement Module",
    subtitle: "Capture light attendee sentiment through the assistant",
    description:
      "Simple in-chat prompts to capture attendee feedback, usefulness ratings, or quick pulse-check responses.",
    price: 1350,
    facts: [
      { label: "Capture", value: "In-chat prompts" },
      { label: "Timing", value: "During or after the event" },
      { label: "Best For", value: "Light-touch engagement capture" },
    ],
    highlights: [
      "Introduces low-friction prompts that gather quick attendee signals without a separate survey platform.",
      "Useful where TechNet wants lightweight feedback during or immediately after the conference.",
      "Supports event review with practical sentiment and usefulness signals from delegates.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            "This add-on introduces lightweight in-chat prompts so delegates can share quick feedback through the assistant itself.",
            "It is designed to capture a simple pulse on usefulness and experience quality without adding a large separate workflow.",
          ],
        },
        {
          title: "What It Adds",
          column: "right",
          bullets: [
            "Simple in-chat prompts for attendee feedback.",
            "Usefulness ratings or quick pulse-check responses.",
            "A low-friction way to gather light-touch engagement signals.",
          ],
        },
        {
          title: "Event Value",
          column: "left",
          bullets: [
            "Makes feedback collection easier and more immediate.",
            "Supports post-event review with lightweight attendee input.",
            "Helps identify friction points or positive experience moments more quickly.",
          ],
        },
        {
          title: "Included",
          column: "right",
          bullets: [
            "In-chat prompt setup.",
            "Light attendee sentiment capture.",
            "A practical feedback layer for review and improvement planning.",
          ],
        },
      ],
      TECHNET_ADD_ON_IDS.feedback
    ),
  }),
];

const TECHNET_BUNDLE_OPTIONS: ProjectBundleOption[] = [
  {
    id: "recommended-package",
    title: "Recommended Package",
    description:
      "Base chatbot plus premium branding, one content refresh, post-event insights, and 14-day extended access.",
    imageUrl: TECHNET_PROJECT_CARD_BANNER_URL,
    baseIds: [TECHNET_BASE_OPTION_ID],
    addOnIds: [
      TECHNET_ADD_ON_IDS.brandedInterface,
      TECHNET_ADD_ON_IDS.refresh,
      TECHNET_ADD_ON_IDS.insights,
      TECHNET_ADD_ON_IDS.extendedAccess,
    ],
    price: 16900,
  },
  {
    id: "enhanced-package",
    title: "Enhanced Package",
    description:
      "Recommended package plus kiosk deployment support, extra remote event-day coverage, exhibitor and sponsor discovery, and in-chat engagement prompts.",
    imageUrl: TECHNET_PROJECT_CARD_BANNER_URL,
    baseIds: [TECHNET_BASE_OPTION_ID],
    addOnIds: [
      TECHNET_ADD_ON_IDS.brandedInterface,
      TECHNET_ADD_ON_IDS.refresh,
      TECHNET_ADD_ON_IDS.insights,
      TECHNET_ADD_ON_IDS.extendedAccess,
      TECHNET_ADD_ON_IDS.kiosk,
      TECHNET_ADD_ON_IDS.support,
      TECHNET_ADD_ON_IDS.discovery,
      TECHNET_ADD_ON_IDS.feedback,
    ],
    price: 20950,
  },
];

export const isTechnetProjectPublicCode = (code: string) =>
  code.trim().toUpperCase() === TECHNET_PROJECT_CODE;

export const isTechnetProjectRetiredCode = (code: string) =>
  code.trim().toUpperCase() === TECHNET_PROJECT_RETIRED_CODE;

export const createTechnetProjectLibraryMeta = (): DocumentLibraryMeta => ({
  isListed: true,
  cardCompany: TECHNET_PROJECT_CLIENT,
  cardTitle: TECHNET_PROJECT_TITLE,
  cardCategory: TECHNET_PROJECT_CATEGORY,
  cardStatusLabel: TECHNET_PROJECT_STATUS_LABEL,
  cardSummary:
    "AI-powered conference event assistant for TechNet Conference 2026.",
  cardLogoUrl: TECHNET_PROJECT_CARD_LOGO_URL,
});

export const createTechnetProjectLibraryCard = (
  values?: Partial<StudioLibraryCard>
): StudioLibraryCard => ({
  id: values?.id || "fallback-technet-australia-2026",
  engagementId: values?.engagementId ?? null,
  code: TECHNET_PROJECT_CODE,
  kind: "project",
  documentStatus: "published",
  updatedAt: values?.updatedAt,
  ...createTechnetProjectLibraryMeta(),
});

export const createTechnetProjectContent = (): ProjectDocumentContent => ({
  mode: "project",
  projectVariant: "proposal",
  quoteId: TECHNET_PROJECT_CODE,
  logoUrl: TECHNET_PROJECT_PDF_LOGO_URL,
  issuedOn: "2026-04-04",
  validUntil: "2026-05-04",
  introText:
    "A tailored AI-powered event assistant for TechNet Conference 2026, designed to support a polished three-day conference experience for delegates, exhibitors, sponsors and organisers from Wednesday 2 December to Friday 4 December 2026.",
  notes:
    "The assistant is scoped as a browser-based TechNet Conference 2026 deployment with QR-code access, one structured review round, a required CSV content template, client website content due by Friday 9 October 2026, client RAG source content due by Friday 16 October 2026, final approved changes due by Friday 13 November 2026, and a target go-live on Wednesday 18 November 2026.",
  terms:
    "Pricing is exclusive of GST. Delivery depends on timely receipt of approved conference content, feedback, approvals, and access from the client. Payment terms are 20% in advance, with the remaining payment due within 14 days of go-live delivery unless otherwise agreed in writing.",
  acceptanceLine: "Accepted by: __________________________",
  currency: "AUD",
  gstMode: "exclusive",
  brochureFooterNote:
    "Prepared for TechNet Australia for TechNet Conference 2026 at Roundhouse, UNSW Sydney.",
  supportingDocsText: "",
  supportingDownloads: [
    {
      id: "technet-case-study",
      label: "Download Case Study",
      url: TECHNET_PROJECT_CASE_STUDY_URL,
      metaText: "AI-Driven Conference Engagement",
    },
  ],
  referenceBrochureMarkdown: TECHNET_PROJECT_REFERENCE_MD,
  generatedBrochureMarkdown: "",
  lastGeneratedAt: "",
  referenceSource: "override",
  presentation: {
    remoteEnabled: false,
    theme: "default",
    branding: {
      speakerName: "",
      website: "",
      tagline: "",
      footerMode: "none",
    },
    slides: [],
  },
  defaultSelectedBaseIds: [TECHNET_BASE_OPTION_ID],
  defaultSelectedAddOnIds: [],
  recommendedTimeline: TECHNET_RECOMMENDED_TIMELINE,
  baseOptions: TECHNET_BASE_OPTIONS,
  addOnOptions: TECHNET_ADD_ON_OPTIONS,
  bundleOptions: TECHNET_BUNDLE_OPTIONS,
  quoteLineOverrides: [],
  libraryMeta: createTechnetProjectLibraryMeta(),
});

export const createTechnetProjectDocumentSeed = (): StudioDocument => ({
  kind: "project",
  code: TECHNET_PROJECT_CODE,
  status: "published",
  title: TECHNET_PROJECT_TITLE,
  clientName: TECHNET_PROJECT_CLIENT,
  clientCompany: TECHNET_PROJECT_ORGANISATION,
  clientEmail: "",
  ctaLabel: "Accept via email",
  adminEmail: "rushi@knowwhatson.com",
  content: createTechnetProjectContent(),
});
