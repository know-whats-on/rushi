import type {
  DocumentLibraryMeta,
  ProjectBrochureSection,
  ProjectBundleOption,
  ProjectDocumentContent,
  ProjectOption,
  StudioDocument,
  StudioLibraryCard,
} from "../types/documents";

export const UNSW_ASSESSMENT_PROJECT_CODE = "UNSWZIXIU";
export const UNSW_ASSESSMENT_PROJECT_CARD_LOGO_URL =
  "/images/studio/unsw-istm-card-logo.png";
export const UNSW_ASSESSMENT_PROJECT_PDF_LOGO_URL =
  "https://www.edigitalagency.com.au/wp-content/uploads/new-UNSW-logo-horizontal-png-large-size.png";
export const UNSW_ASSESSMENT_PROJECT_CATEGORY = "Education AI & Assessment";
export const UNSW_ASSESSMENT_PROJECT_STATUS_LABEL = "Code required";
export const UNSW_ASSESSMENT_PROJECT_CLIENT = "UNSW Business School";
export const UNSW_ASSESSMENT_PROJECT_ORGANISATION = "UNSW Business School";
export const UNSW_ASSESSMENT_PROJECT_SCHOOL =
  "School of Information Systems and Technology Management";
export const UNSW_ASSESSMENT_PROJECT_TITLE =
  "University Assessment for the AI-first Era";
const UNSW_ASSESSMENT_PROJECT_CARD_BANNER_URL =
  "https://cdn.dribbble.com/userupload/42470575/file/original-a95ed16a737974c1697e16dee4868d8f.gif";

export const UNSW_ASSESSMENT_PROJECT_REFERENCE_MD = `# Moderated AI-Assisted Oral Assessment Platform
## Proposal and Commercial Quote for UNSW Business School - School of Information Systems and Technology Management

## 1. Executive summary

This proposal sets out a practical, university-ready oral assessment platform for the School of Information Systems and Technology Management within UNSW Business School. The proposed solution brings together oral assessment setup, tutorial and group administration, student recording workflows, debate audience participation, transcript generation, and AI-assisted rubric review in one staff-governed system. It is designed to reduce manual coordination, support tutor consistency, and make oral assessment delivery more scalable while keeping academic judgement with teachers and tutors.

Commercially, the proposal is structured primarily as an implementation, configuration, and handover engagement rather than a licence-heavy software arrangement. The base quote is intended to take the School through setup, pilot readiness, and handover, with any future management, refinements, or change requests available separately if required.

## 2. Client context and need

Oral assessment is academically valuable, but operationally difficult to run at scale. Within a School environment that includes multiple courses, tutorials, tutors, group formats, live debates, and moderated marking requirements, the work often becomes fragmented across spreadsheets, documents, ad hoc recording tools, and manual review processes.

For the School of Information Systems and Technology Management, the practical need is for a single platform that supports the full lifecycle of oral assessment delivery: course and tutorial administration, group and debate management, rubric handling, student participation, transcript review, and moderated AI-assisted feedback support. The requirement is not for autonomous grading. It is for a structured platform that helps staff work more consistently, more efficiently, and with better visibility across oral performance evidence.

This is particularly relevant where the School needs to:

- reduce inconsistent and labour-intensive oral assessment administration
- manage tutors, groups, and oral formats more effectively at scale
- reduce the time spent on transcription and first-pass rubric review
- support stronger tutor feedback and moderation practices
- enable debate-specific live participation and audience engagement
- preserve human oversight while using AI to assist staff decision-making

## 3. Base Platform Software

### AI-Assisted Oral Assessment Platform

The Base Platform Software is the recommended core scope for the School.

It is proposed as a browser-based oral assessment platform that centralises course administration, tutorial operations, oral assessment setup, student recording, debate audience mode, transcript review, and AI-assisted rubric marking within one role-based environment.

Teachers would use the platform to create and manage courses, tutorials, class lists, oral assignments, rubrics, tutor roles, submissions, and grades. Tutors would use it to manage tutorial groups, debate groups, debate settings, and staff-facing review workflows. Students would use it to complete solo or group oral assessments and participate in practice sessions where enabled. For debate classes, the rest of the class would access a simplified audience mode for round-by-round voting and live reactions.

Operationally, the base scope is intended to reduce administrative load, improve marking consistency across tutors, speed up transcript and review preparation, and provide a clearer evidence trail for moderated assessment. It is the recommended base scope because it includes the full set of core capabilities needed for a credible school-level deployment, while keeping broader integrations and expansion items as optional later-stage decisions.

| Included in Base Platform Software | Description | Primary User |
|---|---|---|
| Course administration | Create, edit, archive, and manage courses and linked oral assignments | Teacher |
| Tutorial administration | Create, edit, archive, and manage tutorials within courses | Teacher |
| Class list management | Upload and manage class lists for active teaching periods | Teacher |
| Group management | Create, edit, archive, and manage groups within tutorials, including reusable group structures | Teacher / Tutor |
| Role and permission management | Assign and manage teacher, tutor, and student access, including tutor role control | Teacher |
| Oral assessment setup | Configure group debates, solo debates, group presentations, solo presentations, group viva voce, and solo viva voce assessments | Teacher |
| Rubric upload and management | Upload, edit, archive, and manage marking rubrics via CSV, with reusable rubric templates | Teacher |
| Recording and submission capture | Start recording and complete solo or group oral assessments within the platform | Student |
| Mock and practice mode | Enable practice oral assessments and familiarisation sessions before live assessment where configured | Student |
| Submissions and grades management | Create, edit, archive, and manage submissions, grades, and assessment records | Teacher / Tutor |
| Debate configuration | Create and manage debate groups, allocate "For" and "Against" positions, and configure rounds, speaking times, and break durations | Tutor / Teacher |
| Debate audience participation mode | Public-facing audience view for round-by-round voting, preset emoji reactions, and live support movement during break periods | Debate Audience |
| AI transcript generation | Generate a transcript from recorded speech and responses for staff review | Teacher / Tutor |
| AI-assisted rubric review | Map transcript evidence to rubric criteria, show colour-coded transcript highlighting, support criterion filtering, and provide an AI-suggested score | Teacher / Tutor |
| Feedback support tools | Surface likely strengths and improvement areas to support more structured feedback drafting | Teacher / Tutor |
| Handover-ready admin setup | Deliver the initial configured environment, implementation documentation, and handover materials for School use | School Administrators / Teaching Team |

## 4. User roles and workflows

### Teachers

Teachers use the platform as the academic control point for setup, oversight, and final review.

- Create, edit, archive, and manage courses, tutorials, class lists, tutor roles, oral assignments, rubrics, submissions, and grades.
- Configure assessment formats across debates, presentations, and viva voce tasks.
- Upload rubrics via CSV and maintain rubric versions over time.
- Review transcripts, rubric-linked evidence, AI-suggested scores, and feedback prompts.
- Moderate tutor-entered grades and control whether any results are released to students.

### Tutors

Tutors use the platform as the operational layer for tutorial delivery and marking support.

- Create, edit, archive, and manage tutorial groups and debate groups.
- Allocate "For" and "Against" positions for debates.
- Configure debate rounds, speaking times, and break periods.
- Review submissions, transcripts, AI-linked rubric evidence, and staff-assistive scoring suggestions.
- Create, edit, archive, and manage grades and submissions within delegated permissions.

### Students

Students use the platform to participate in oral assessment and prepare through practice.

- Start recording and complete solo or group oral assessments.
- Participate in individual or group assessment formats depending on assessment design.
- Complete mock or practice sessions where enabled.
- View scores and performance outputs for mock or practice assessments.
- For live or summative assessments, do not see AI-marked results by default unless staff choose to release them.

### Debate audiences

Debate audiences use a simplified public-facing interface during debate activities.

- Vote between rounds during configured break periods.
- Send preset emoji reactions during debate sessions.
- View round-by-round audience support and how sentiment shifts over the course of the debate.
- Participate without access to staff marking views or academic administration controls.

## 5. AI assessment and feedback workflow

The AI workflow is designed as a staff-assistive review layer, not as an automated grading engine. Its purpose is to reduce first-pass manual effort, improve consistency, and give teachers and tutors a clearer evidence base when reviewing oral performance.

### End-to-end workflow

1. **Recording and capture**  
   The student completes a solo or group oral assessment in the platform. Speech and responses are captured as part of the assessment record.

2. **Transcript generation**  
   The platform generates a transcript of the oral response for staff review. This reduces the need for manual note-taking and makes oral evidence easier to revisit.

3. **Rubric mapping**  
   The transcript is analysed against the selected rubric so staff can see which parts of the response appear relevant to each criterion.

4. **Colour-coded transcript highlighting**  
   Teachers and tutors can view transcript lines with colour-coded underlining mapped to rubric criteria, helping them inspect the underlying evidence more quickly.

5. **AI-suggested scoring and criterion filtering**  
   The platform presents an AI-suggested score as a draft input only. Staff can also filter transcript lines by rubric criterion to focus on specific dimensions of performance.

6. **Strengths and improvement insights**  
   The platform surfaces what appears to have been done well and what could be improved, helping staff prepare clearer and more structured feedback.

7. **Teacher and tutor review and oversight**  
   Staff review the transcript, rubric evidence, and AI suggestions before determining the final outcome. Final academic judgement remains with authorised teaching staff.

This approach is intended to support consistency and moderation across multiple tutors without treating AI outputs as final grades. The staff-facing design is deliberately transparent: the platform shows the evidence trail behind the suggestion, not just a score.

## 6. Base price

All pricing below is in AUD excluding GST.

The commercial structure below is intentionally set up as a lower-friction university delivery model: milestone-based, handover-led, and centred on implementation rather than a heavy ongoing licence commitment.

| Scope | Delivery assumptions | Support assumptions | Price |
|---|---|---|---:|
| One-off implementation / setup | Discovery, workflow confirmation, configuration of role-based course, tutorial, class list, group, rubric, submission, oral assessment, debate audience, transcript, and AI-assisted review workflows for the initial School deployment | Includes implementation-period support and milestone reviews during delivery | $29,997 |
| Handover and post-delivery stabilisation | Admin handover, delivery pack, knowledge transfer, and initial post-delivery support | Includes 30 days of post-handover clarification and defect rectification support. Ongoing management, new feature work, and change requests are not included | $9,999 |
| **First-year total** | **Base Platform Software** | **Handover-led commercial model** | **$39,996** |

### Indicative milestone payment structure

| Milestone | Delivery point | Amount |
|---|---|---:|
| Milestone 1 | Discovery and confirmed workflow scope | $9,999 |
| Milestone 2 | Configured build ready for review | $9,999 |
| Milestone 3 | Pilot-ready release | $9,999 |
| Milestone 4 | Handover, training walkthrough, and post-delivery stabilisation commencement | $9,999 |

Where custom scope creates a total that does not divide evenly into milestone-friendly amounts, any residual balance can be carried into the final milestone.

## 7. Add-Ons

All add-ons below are optional and priced separately in AUD excluding GST.

| Add-On name | What it includes | Why it may be useful for UNSW | Standalone price in AUD ex GST |
|---|---|---|---:|
| Scale-Up Ready configuration | Configuration and deployment planning to support future expansion beyond the initial School, including scalable course structures, role models, and environment planning assumptions for additional faculties or schools | Useful if UNSW expects the platform to begin within one School and later expand more broadly | $9,999 |
| Multi-modal AI review support | An enhanced AI review layer that extends beyond transcript-only analysis to provide richer staff-assistive context across language use, pacing, emphasis, speech variation, and broader oral delivery signals | Useful where oral communication quality and delivery style are important dimensions of assessment and staff want more review context | $9,999 |
| Mock assessment practice module | A dedicated student practice mode with guided mock sessions, familiarisation workflows, and rehearsal support before live assessment | Useful for students who have not previously completed oral assessment in this type of platform and would benefit from a lower-risk practice environment | $6,999 |
| Staff training and onboarding modules | Staff and tutor onboarding sessions, role-based training materials, and practical implementation guidance for convenors, teaching staff, and tutors | Useful for smoother adoption, stronger tutor consistency, and reduced operational friction during rollout | $4,999 |
| Moodle integration pathway | Discovery, design, and scoped implementation of an agreed initial Moodle connection point, subject to university integration processes, approvals, and technical access | Useful if the School wants a clearer path to reducing manual administration through Moodle over time | $9,999 |

These add-ons have been intentionally limited to a small number of practical options. The aim is to keep the commercial structure clear for the School while allowing selected enhancements where they materially improve rollout readiness, student preparation, future scalability, or staff-assistive review depth.

## 8. Package options

All package pricing below are in AUD excluding GST.

| Package | What is included | Who it is best suited for | Final package price in AUD ex GST |
|---|---|---|---:|
| Recommended | Base Platform Software; Mock assessment practice module; Staff training and onboarding modules | Best suited to an initial School deployment where student readiness and staff adoption are the main priorities | **$49,995** |
| Enhanced | Base Platform Software; Scale-Up Ready configuration; Mock assessment practice module; Staff training and onboarding modules; Moodle integration pathway | Best suited to a School deployment that wants strong initial rollout support and a clearer path to broader institutional use | **$69,993** |

### Indicative package milestone alignment

- **Recommended package:** five milestone invoices of $9,999
- **Enhanced package:** seven milestone invoices of $9,999

Multi-modal AI review support can be added as a standalone enhancement where the School wants a more advanced staff-assistive review layer without changing the core rollout package.

## 9. Delivery approach and indicative timeline

Indicative timeline: **10 to 12 weeks** from formal kick-off to pilot readiness, assuming timely approvals, content inputs, and feedback within the agreed review windows.

| Stage | Indicative timing |
|---|---|
| Discovery and requirements confirmation | Weeks 1-2 |
| Design and workflow mapping | Weeks 2-3 |
| Build and configuration | Weeks 3-7 |
| Testing and review | Weeks 7-9 |
| Pilot readiness | Weeks 9-10 |
| Training and handover | Weeks 10-11 |
| Initial live use or pilot delivery | From Week 11 onward, aligned to the agreed teaching period |

This timeline is intended as a practical guide rather than a fixed promise. Delivery timing depends on timely feedback, provision of inputs, and access to relevant School stakeholders.

## 10. Assumptions and exclusions

### Assumptions

- The initial quote is for the School of Information Systems and Technology Management only.
- The proposed deployment is browser-based.
- UNSW will provide course structures, class list formats, rubric files, assessment rules, and stakeholder access required for setup and review.
- One or more nominated UNSW stakeholders will provide timely approvals and consolidated feedback during delivery.
- AI-assisted outputs are used to support staff review and moderation, not to replace academic judgement.
- Students may view scores and performance outputs for mock or practice assessments.
- Students do not see AI-marked results for live or summative assessments by default unless staff choose to release them.
- Final grading decisions, moderation decisions, and release controls remain with authorised teaching staff.
- Any future management, support beyond the included stabilisation period, or additional change requests would be separately scoped and charged.

### Exclusions

- Production Moodle integration unless the Moodle integration pathway add-on is selected and is approved through university processes.
- Enterprise SSO, identity management, or institution-wide access architecture.
- Formal data residency commitments, security certifications, compliance certifications, or accessibility certification.
- Guaranteed model accuracy, automated grade finalisation, or fully autonomous marking.
- Native mobile app development.
- Multi-School or multi-faculty rollout beyond the initial School unless separately scoped.
- Ongoing platform administration, content updates, feature changes, or enhancement delivery after handover unless separately agreed.

## 11. Next steps

1. Confirm the preferred commercial option: Base Platform Software, Recommended, or Enhanced.
2. Nominate a small UNSW decision group for workflow confirmation, review, and approval.
3. Schedule a kick-off workshop to confirm assessment formats, rubric inputs, milestone dates, and pilot priorities.

## 12. Commercial terms

- **Quote validity:** 30 days from date of issue.  
- **Payment terms:** Invoices are issued on milestone delivery and are payable within 14 days.  
- **Milestone-friendly structure:** Commercials are structured in $9,999 milestone increments where practical. Any residual balance for custom scope can be included in the final milestone.  
- **Feedback window:** UNSW will have 7 calendar days following each milestone delivery to provide consolidated feedback, approval comments, or change requests relevant to that milestone.  
- **Scheduling impact of delayed feedback:** If consolidated feedback is delayed beyond the 7-day review window, subsequent milestone dates may move accordingly. For scheduling purposes, a milestone may be treated as accepted if no material feedback is received within that review period.  
- **Delivery dependency:** Delivery depends on timely receipt of content, rubric files, stakeholder decisions, test data, and access to nominated School representatives.  
- **Support assumptions:** The base quote includes implementation-period support and a limited post-handover stabilisation period only. Ongoing management, administration, content changes, enhancement work, or future development are not included unless separately agreed.  
- **Scope changes:** Any change to agreed scope, workflow design, feature set, integration requirement, or rollout footprint will be assessed and separately quoted before work proceeds.  
- **Phased expansion:** Broader rollout across additional courses, Schools, or faculties can be scoped as a later phase if required.  
- **GST:** All pricing is exclusive of GST.
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
  imageUrl: UNSW_ASSESSMENT_PROJECT_CARD_BANNER_URL,
  ...option,
});

const createBundle = (
  option: ProjectBundleOption
): ProjectBundleOption => ({
  imageUrl: UNSW_ASSESSMENT_PROJECT_CARD_BANNER_URL,
  ...option,
});

const UNSW_ASSESSMENT_BASE_OPTION_ID =
  "ai-assisted-oral-assessment-platform";
const UNSW_ASSESSMENT_ADD_ON_IDS = {
  scaleUp: "scale-up-ready-configuration",
  multimodal: "multi-modal-ai-review-support",
  practice: "mock-assessment-practice-module",
  training: "staff-training-and-onboarding-modules",
  moodle: "moodle-integration-pathway",
} as const;

const UNSW_ASSESSMENT_BASE_OPTIONS: ProjectOption[] = [
  createOption({
    id: UNSW_ASSESSMENT_BASE_OPTION_ID,
    title: "AI-Assisted Oral Assessment Platform",
    subtitle:
      "Browser-based oral assessment delivery and staff-governed AI review",
    description:
      "A university-ready platform that centralises course setup, tutorial workflows, student recording, debate participation, transcript generation, and AI-assisted rubric review in one moderated environment.",
    price: 39996,
    facts: [
      { label: "Delivery", value: "Browser-based platform" },
      { label: "Timeline", value: "10 to 12 weeks to pilot readiness" },
      { label: "Commercial model", value: "Implementation + handover" },
    ],
    highlights: [
      "Centralises courses, tutorials, groups, rubrics, recordings, submissions, and grades in one role-based system.",
      "Supports debates, presentations, viva voce formats, and optional audience participation without moving final judgement away from staff.",
      "Reduces transcription and first-pass review effort while strengthening tutor consistency and moderation visibility.",
    ],
    brochureSections: createSections(
      [
        {
          title: "Overview",
          column: "left",
          paragraphs: [
            `The base scope gives ${UNSW_ASSESSMENT_PROJECT_SCHOOL} a browser-based oral assessment platform that supports setup, delivery, review, and handover inside one staff-governed system.`,
            "It is designed as an implementation-led engagement rather than a licence-heavy software arrangement, taking the School through workflow confirmation, build, pilot readiness, and stabilisation support.",
          ],
        },
        {
          title: "Included in Base",
          column: "right",
          bullets: [
            "Course, tutorial, class list, and group administration",
            "Role and permission management for teachers, tutors, and students",
            "Oral assessment setup across debates, presentations, and viva voce formats",
            "Recording capture, submissions, grades, and reusable rubric upload workflows",
            "Debate audience participation mode with voting and preset reactions",
            "Initial configured environment, handover documentation, and stabilisation support",
          ],
        },
        {
          title: "AI Review Workflow",
          column: "left",
          bullets: [
            "Generate transcripts from recorded oral responses for staff review",
            "Map transcript evidence against rubric criteria",
            "Show colour-coded highlighting linked to rubric dimensions",
            "Present AI-suggested scores as draft-only inputs with criterion filtering",
            "Surface strengths and improvement areas while keeping final judgement with authorised staff",
          ],
        },
        {
          title: "Delivery Approach",
          column: "right",
          paragraphs: [
            "The indicative rollout is 10 to 12 weeks from kick-off to pilot readiness, assuming timely approvals, rubric inputs, and consolidated stakeholder feedback.",
          ],
          bullets: [
            "Weeks 1-2: discovery and requirements confirmation",
            "Weeks 2-3: design and workflow mapping",
            "Weeks 3-7: build and configuration",
            "Weeks 7-9: testing and review",
            "Weeks 10-11: training, handover, and stabilisation start",
          ],
        },
        {
          title: "Governance and Commercials",
          column: "left",
          bullets: [
            "Structured as milestone-based implementation and handover rather than an ongoing platform licence",
            "AI outputs are staff-assistive only and do not replace academic judgement",
            "Students do not see AI-marked live results unless staff choose to release them",
            "Quote validity is 30 days and milestone invoices are payable within 14 days",
            "Ongoing management, future changes, and broader rollouts are separately scoped",
          ],
        },
      ],
      UNSW_ASSESSMENT_BASE_OPTION_ID
    ),
  }),
];

const UNSW_ASSESSMENT_ADD_ON_OPTIONS: ProjectOption[] = [
  createOption({
    id: UNSW_ASSESSMENT_ADD_ON_IDS.scaleUp,
    title: "Scale-Up Ready configuration",
    subtitle:
      "Future-proof the initial deployment for wider School or faculty rollout",
    description:
      "Configuration and deployment planning that prepares the platform for expansion beyond the first School deployment through scalable course structures, role models, and environment planning assumptions.",
    price: 9999,
    facts: [
      { label: "Focus", value: "Future expansion" },
      { label: "Scope", value: "Configuration + rollout planning" },
      { label: "Best for", value: "Broader UNSW adoption" },
    ],
    highlights: [
      "Creates a cleaner path from one-School pilot to broader institutional use.",
      "Sets up scalable course, role, and environment assumptions earlier in the rollout.",
      "Reduces rework if UNSW later extends the platform to additional Schools or faculties.",
    ],
    brochureSections: createSections(
      [
        {
          title: "What it includes",
          column: "left",
          bullets: [
            "Scalable course and tutorial structure planning",
            "Role model design for broader teaching-team adoption",
            "Environment planning assumptions for future School or faculty expansion",
          ],
        },
        {
          title: "Why it matters",
          column: "right",
          paragraphs: [
            "This add-on is useful when UNSW expects the platform to begin within one School and later expand more broadly. It helps the initial setup carry less structural debt into later rollout phases.",
          ],
        },
      ],
      UNSW_ASSESSMENT_ADD_ON_IDS.scaleUp
    ),
  }),
  createOption({
    id: UNSW_ASSESSMENT_ADD_ON_IDS.multimodal,
    title: "Multi-modal AI review support",
    subtitle:
      "Go beyond transcript-only review with richer delivery-signal context",
    description:
      "An enhanced AI review layer that extends beyond transcript analysis to surface pacing, emphasis, speech variation, and broader oral delivery signals as extra staff-assistive context.",
    price: 9999,
    facts: [
      { label: "Focus", value: "Delivery signal analysis" },
      { label: "Scope", value: "Enhanced AI review layer" },
      { label: "Best for", value: "Communication-heavy assessment" },
    ],
    highlights: [
      "Adds richer context for staff where oral delivery quality is an assessed dimension.",
      "Extends the review model beyond language content alone.",
      "Keeps the output assistive and reviewable rather than autonomous.",
    ],
    brochureSections: createSections(
      [
        {
          title: "What it includes",
          column: "left",
          bullets: [
            "Additional context across language use, pacing, and emphasis",
            "Broader delivery-signal support for staff review",
            "Extra oral communication insight without removing teacher oversight",
          ],
        },
        {
          title: "Why it matters",
          column: "right",
          paragraphs: [
            "This is useful where oral communication quality and delivery style matter alongside rubric content, and staff want more review context before making final academic judgements.",
          ],
        },
      ],
      UNSW_ASSESSMENT_ADD_ON_IDS.multimodal
    ),
  }),
  createOption({
    id: UNSW_ASSESSMENT_ADD_ON_IDS.practice,
    title: "Mock assessment practice module",
    subtitle:
      "Give students a lower-risk rehearsal environment before live assessment",
    description:
      "A dedicated student practice mode with guided mock sessions, familiarisation workflows, and rehearsal support before live oral assessment activity.",
    price: 6999,
    facts: [
      { label: "Focus", value: "Student readiness" },
      { label: "Scope", value: "Practice + familiarisation" },
      { label: "Best for", value: "First-time oral assessment users" },
    ],
    highlights: [
      "Lets students rehearse before live assessment begins.",
      "Reduces avoidable friction for unfamiliar oral assessment workflows.",
      "Supports a smoother rollout when student confidence is a priority.",
    ],
    brochureSections: createSections(
      [
        {
          title: "What it includes",
          column: "left",
          bullets: [
            "Guided mock sessions and rehearsal workflows",
            "Practice participation before live assessment",
            "Familiarisation support for students using the platform for the first time",
          ],
        },
        {
          title: "Why it matters",
          column: "right",
          paragraphs: [
            "This add-on is useful where students would benefit from a lower-risk practice environment before high-stakes oral assessment begins.",
          ],
        },
      ],
      UNSW_ASSESSMENT_ADD_ON_IDS.practice
    ),
  }),
  createOption({
    id: UNSW_ASSESSMENT_ADD_ON_IDS.training,
    title: "Staff training and onboarding modules",
    subtitle:
      "Support adoption, tutor consistency, and smoother operational rollout",
    description:
      "Role-based onboarding sessions, practical training materials, and implementation guidance for convenors, teaching staff, and tutors.",
    price: 4999,
    facts: [
      { label: "Focus", value: "Adoption and consistency" },
      { label: "Scope", value: "Training + materials" },
      { label: "Best for", value: "Rollout readiness" },
    ],
    highlights: [
      "Helps teaching teams adopt the platform with less friction.",
      "Supports stronger tutor consistency during marking and moderation.",
      "Pairs well with the practice module for a smoother first deployment.",
    ],
    brochureSections: createSections(
      [
        {
          title: "What it includes",
          column: "left",
          bullets: [
            "Role-based staff and tutor onboarding sessions",
            "Practical implementation guidance for convenors and teaching teams",
            "Training materials to support ongoing internal use after handover",
          ],
        },
        {
          title: "Why it matters",
          column: "right",
          paragraphs: [
            "This add-on is useful where adoption quality, tutor consistency, and operational confidence matter as much as the software build itself.",
          ],
        },
      ],
      UNSW_ASSESSMENT_ADD_ON_IDS.training
    ),
  }),
  createOption({
    id: UNSW_ASSESSMENT_ADD_ON_IDS.moodle,
    title: "Moodle integration pathway",
    subtitle:
      "Scope an initial Moodle connection without overcommitting early build risk",
    description:
      "Discovery, design, and scoped implementation of an agreed initial Moodle connection point, subject to university processes, approvals, and technical access.",
    price: 9999,
    facts: [
      { label: "Focus", value: "Integration pathway" },
      { label: "Scope", value: "Discovery + scoped connection" },
      { label: "Best for", value: "Reduced manual administration" },
    ],
    highlights: [
      "Creates a clearer path to reducing duplicated manual administration over time.",
      "Keeps integration work scoped around an agreed first connection point.",
      "Respects university approval and technical access dependencies.",
    ],
    brochureSections: createSections(
      [
        {
          title: "What it includes",
          column: "left",
          bullets: [
            "Discovery and design for an agreed initial Moodle connection point",
            "Scoped implementation subject to university process and technical access",
            "A more concrete pathway to longer-term workflow reduction",
          ],
        },
        {
          title: "Why it matters",
          column: "right",
          paragraphs: [
            "This add-on is useful where the School wants a clearer path to reducing manual administration through Moodle over time without treating full integration as part of the base rollout.",
          ],
        },
      ],
      UNSW_ASSESSMENT_ADD_ON_IDS.moodle
    ),
  }),
];

const UNSW_ASSESSMENT_BUNDLE_OPTIONS: ProjectBundleOption[] = [
  createBundle({
    id: "recommended-package",
    title: "Recommended",
    description:
      "Base platform plus mock assessment practice and staff onboarding. Best suited to an initial School deployment where student readiness and staff adoption are the main priorities.",
    baseIds: [UNSW_ASSESSMENT_BASE_OPTION_ID],
    addOnIds: [
      UNSW_ASSESSMENT_ADD_ON_IDS.practice,
      UNSW_ASSESSMENT_ADD_ON_IDS.training,
    ],
    price: 49995,
  }),
  createBundle({
    id: "enhanced-package",
    title: "Enhanced",
    description:
      "Recommended package plus scale-up-ready configuration and a Moodle integration pathway. Best suited to a School deployment that wants strong initial rollout support and a clearer path to broader institutional use.",
    baseIds: [UNSW_ASSESSMENT_BASE_OPTION_ID],
    addOnIds: [
      UNSW_ASSESSMENT_ADD_ON_IDS.scaleUp,
      UNSW_ASSESSMENT_ADD_ON_IDS.practice,
      UNSW_ASSESSMENT_ADD_ON_IDS.training,
      UNSW_ASSESSMENT_ADD_ON_IDS.moodle,
    ],
    price: 69993,
  }),
];

export const isUnswAssessmentProjectPublicCode = (code: string) =>
  code.trim().toUpperCase() === UNSW_ASSESSMENT_PROJECT_CODE;

export const createUnswAssessmentProjectLibraryMeta =
  (): DocumentLibraryMeta => ({
    isListed: true,
    cardCompany: UNSW_ASSESSMENT_PROJECT_CLIENT,
    cardTitle: UNSW_ASSESSMENT_PROJECT_TITLE,
    cardCategory: UNSW_ASSESSMENT_PROJECT_CATEGORY,
    cardStatusLabel: UNSW_ASSESSMENT_PROJECT_STATUS_LABEL,
    cardSummary:
      "AI-assisted oral assessment platform for UNSW Business School, combining recording workflows, transcript review, moderation support, and rollout-ready governance.",
    cardLogoUrl: UNSW_ASSESSMENT_PROJECT_CARD_LOGO_URL,
  });

export const createUnswAssessmentProjectLibraryCard = (
  values?: Partial<StudioLibraryCard>
): StudioLibraryCard => ({
  id: values?.id || "fallback-unsw-assessment",
  engagementId: values?.engagementId ?? null,
  code: UNSW_ASSESSMENT_PROJECT_CODE,
  kind: "project",
  documentStatus: "published",
  updatedAt: values?.updatedAt,
  ...createUnswAssessmentProjectLibraryMeta(),
});

export const createUnswAssessmentProjectContent =
  (): ProjectDocumentContent => ({
    mode: "project",
    projectVariant: "proposal",
    quoteId: UNSW_ASSESSMENT_PROJECT_CODE,
    logoUrl: UNSW_ASSESSMENT_PROJECT_PDF_LOGO_URL,
    issuedOn: "2026-04-04",
    validUntil: "2026-05-04",
    introText:
      "A university-ready oral assessment platform that centralises oral assessment setup, tutorial workflows, recording, debate participation, transcript generation, and AI-assisted rubric review for UNSW Business School.",
    notes:
      "The commercial structure is milestone-based, handover-led, and implementation-focused rather than licence-heavy. The base quote is intended to take the School through setup, pilot readiness, handover, and limited post-delivery stabilisation, with future management or change requests scoped separately.",
    terms:
      "Pricing is in AUD excluding GST. Quote validity is 30 days from issue. Milestone invoices are payable within 14 days. Delivery depends on timely receipt of rubric files, content inputs, stakeholder access, and consolidated feedback within the agreed review windows. Ongoing administration, enhancement work, and broader multi-School rollout are not included unless separately agreed.",
    acceptanceLine: "Accepted by: __________________________",
    currency: "AUD",
    gstMode: "exclusive",
    brochureFooterNote: `Prepared for ${UNSW_ASSESSMENT_PROJECT_CLIENT} - ${UNSW_ASSESSMENT_PROJECT_SCHOOL}.`,
    supportingDocsText: "All pricing is in AUD excluding GST.",
    referenceBrochureMarkdown: UNSW_ASSESSMENT_PROJECT_REFERENCE_MD,
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
    defaultSelectedBaseIds: [UNSW_ASSESSMENT_BASE_OPTION_ID],
    defaultSelectedAddOnIds: [],
    baseOptions: UNSW_ASSESSMENT_BASE_OPTIONS,
    addOnOptions: UNSW_ASSESSMENT_ADD_ON_OPTIONS,
    bundleOptions: UNSW_ASSESSMENT_BUNDLE_OPTIONS,
    quoteLineOverrides: [],
    libraryMeta: createUnswAssessmentProjectLibraryMeta(),
  });

export const createUnswAssessmentProjectDocumentSeed =
  (): StudioDocument => ({
    kind: "project",
    code: UNSW_ASSESSMENT_PROJECT_CODE,
    status: "published",
    title: UNSW_ASSESSMENT_PROJECT_TITLE,
    clientName: UNSW_ASSESSMENT_PROJECT_CLIENT,
    clientCompany: UNSW_ASSESSMENT_PROJECT_ORGANISATION,
    clientEmail: "",
    ctaLabel: "Accept via email",
    adminEmail: "rushi@knowwhatson.com",
    content: createUnswAssessmentProjectContent(),
  });
