import { Brochure } from "../types/brochures";
import type { ProjectOptionAgenda } from "../types/documents";

const RHEEM_COPILOT_GIF_URL =
  "https://www.afstores.com/wp-content/uploads/2025/07/Copilot-gif.gif";

export interface SampleProposalFact {
  label: string;
  value: string;
}

export interface SampleProposalBrochureSection {
  id?: string;
  title: string;
  column: "left" | "right";
  paragraphs?: string[];
  bullets?: string[];
}

export interface SampleProposalBrochureContent {
  sections: SampleProposalBrochureSection[];
  footerNote?: string;
}

export interface SampleProposalOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  price: number;
  compareAtPrice?: number;
  priceLabel: string;
  facts: SampleProposalFact[];
  highlights: string[];
  brochure?: SampleProposalBrochureContent;
  agenda?: ProjectOptionAgenda;
}

export interface SampleProposalBundleOption {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  baseIds: string[];
  addOnIds: string[];
  price: number;
  priceLabel: string;
}

export interface SampleProposal {
  quoteCode: string;
  quoteId: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  introText: string;
  issuedOn: string;
  validUntil: string;
  notes: string;
  terms: string;
  acceptanceLine: string;
  currency: string;
  recipientEmail: string;
  pdfBasePath: string;
  defaultSelectedBaseIds: string[];
  defaultSelectedAddOnIds: string[];
  baseOptions: SampleProposalOption[];
  addOnOptions: SampleProposalOption[];
  bundleOptions: SampleProposalBundleOption[];
}

export const sampleBrochure: Brochure = {
  brochureCode: "PROMPT-BASICS-DEMO",
  status: "published",
  clientName: "AIM Digital Skills Guide",
  logoUrl: "",
  title: "Microcredential in Prompt Engineering Basics for Generative AI",
  subtitle:
    "A concise, print-ready course brochure designed for PDF export and client review.",
  duration: "8 Weeks Access | Self-Paced",
  deliveryMode: "Online",
  studyLoad: "4-5 Hours per week",
  priceLabel: "$1,115",
  ctas: [
    {
      id: "cta-1",
      label: "Book Now",
      url: "https://example.com/book",
    },
    {
      id: "cta-2",
      label: "Enquire Now",
      url: "https://example.com/enquire",
    },
  ],
  sections: [
    {
      id: "deliveryMode",
      title: "Delivery Mode",
      sourceClause: "",
      body:
        "This microcredential is delivered fully online through a guided learning platform, supported by live virtual sessions, practical activities, and self-paced materials that participants can access throughout the course window.",
      bullets: [],
    },
    {
      id: "learningOutcomes",
      title: "Learning Outcomes",
      sourceClause: "",
      body: "",
      bullets: [
        "Investigate prompt engineering techniques for generative AI.",
        "Devise effective prompts for practical workplace use cases.",
        "Use AI prompts to generate clearer, more targeted outputs.",
      ],
    },
    {
      id: "timeCommitment",
      title: "Time Commitment",
      sourceClause: "",
      body:
        "Access is provided for 8 weeks. Participants should allow approximately 4 to 5 hours per week to complete learning activities, apply new concepts, and work through assessment tasks.",
      bullets: [],
    },
    {
      id: "pathway",
      title: "Pathway",
      sourceClause: "",
      body:
        "This unit can contribute to a broader AI capability pathway and may be credited toward further professional learning, depending on your organisation’s training framework and enrolment arrangements.",
      bullets: [],
    },
    {
      id: "assessment",
      title: "Assessment",
      sourceClause: "",
      body:
        "Assessment is competency-based and may include applied knowledge checks, prompt design exercises, and scenario-based tasks that demonstrate practical use of generative AI in context.",
      bullets: [],
    },
  ],
  footerComplianceText:
    "Sample brochure only. Replace with your provider compliance text, accreditation details, and registered address before publishing.",
  adminEmail: "rushi@knowwhatson.com",
};

const RHEEM_ADD_ON_AGENDA_POSITIONING_LINE =
  "These add-ons are designed to ensure the team does not stop at awareness. The base session builds confidence and common language. The add-ons then turn that foundation into repeatable prompting skill, workflow-level thinking, and role-specific application, which is where real employee value starts to emerge.";

const RHEEM_BASE_SESSION_OUTCOMES = [
  "Feel more confident and less apprehensive about AI.",
  "Understand how Microsoft Copilot can support everyday work.",
  "Know how to write better prompts.",
  "Recognise safe-use and governance considerations.",
  "Identify practical finance-related use cases.",
  "Contribute ideas for future team-specific follow-up sessions.",
];

type RheemBaseAgendaVariant = "in-person" | "remote" | "esl-remote";

const createRheemBaseAgenda = (
  variant: RheemBaseAgendaVariant
): ProjectOptionAgenda => {
  const isRemote = variant !== "in-person";
  const isEslRemote = variant === "esl-remote";
  const deliveryMode = isRemote ? "Live Online" : "In Person";

  return {
    heading: isRemote
      ? isEslRemote
        ? "Remote Session for ESL Participants"
        : "Remote Session Agenda"
      : "Face-to-Face Session Agenda",
    subtitle: isRemote
      ? isEslRemote
        ? "Live online Copilot session for mixed-English-confidence participants, with smaller-group activities and more facilitator-led engagement."
        : "Live online AI fluency and Copilot foundation for a small remote cohort, adapted for mixed English confidence."
      : "In-person AI fluency and Copilot foundation for the Finance Team.",
    duration: "4 Hours",
    deliveryMode,
    whyThisMattersNow: isRemote
      ? isEslRemote
        ? "This remote format is designed for participants using English as a second language. The core content stays the same, but facilitation is more guided: plain-English language, slower pacing, written prompts in chat, smaller breakout activities, and more active engagement from our side to keep confidence and participation high across the group."
        : "This remote session is designed for a small 4-6 person cohort with mixed English confidence. It keeps the same workshop foundation as the face-to-face session, while using plain-English facilitation, slower pacing, written prompts in chat, visual walkthroughs, and recap checkpoints so the group can follow the material with less pressure."
      : undefined,
    blocks: [
      {
        id: isRemote ? "remote-hour-1" : "f2f-hour-1",
        timeLabel: "Hour 1",
        title: "Welcome, Context, and AI Fluency",
        focus:
          "Build shared language, reduce uncertainty, and create a practical starting point for the team.",
        bullets: [
          "What Microsoft Copilot is and where it fits in day-to-day work.",
          "What AI can and cannot do in a finance context.",
          "Common myths, concerns, and questions, including \"Will AI take my job?\"",
          "How to think about AI as a support tool rather than a replacement for judgement.",
          `Setting the tone for safe, practical, and realistic use${
            isRemote
              ? isEslRemote
                ? " in a smaller-group live online format with extra recap and language support."
                : " in a small-group live online cohort."
              : "."
          }`,
        ],
        outcome:
          "Participants leave with a clearer, lower-fear understanding of AI and a shared baseline for the rest of the session.",
      },
      {
        id: isRemote ? "remote-hour-2" : "f2f-hour-2",
        timeLabel: "Hour 2",
        title: "Prompting Basics and Guided Practice",
        focus:
          "Help participants learn how to ask Copilot for useful outputs in a simple, repeatable way.",
        bullets: [
          "A plain-English prompt structure participants can use immediately.",
          "How to give Copilot better context, instructions, and output expectations.",
          "Common prompting mistakes and how to avoid them.",
          `Guided examples using familiar work scenarios${
            isRemote
              ? isEslRemote
                ? " in a facilitated live-online format with written prompts shared in chat and smaller-group guided practice."
                : " in a facilitated live-online format with written prompts and recap notes shared in chat."
              : "."
          }`,
        ],
        examplesLabel: "Illustrative examples",
        examples: [
          "Drafting variance commentary.",
          "Summarising a finance policy.",
          "Rewriting a stakeholder email.",
          "Structuring a monthly update.",
        ],
        outcome:
          "Participants leave with a basic prompt framework and greater confidence using Copilot for simple work tasks.",
      },
      {
        id: isRemote ? "remote-hour-3" : "f2f-hour-3",
        timeLabel: "Hour 3",
        title: "Governance, Safe Use, and Finance Use Cases",
        focus:
          "Show where Copilot can help in finance work while reinforcing human review, accountability, and safe use.",
        bullets: [
          `Governance basics for AI use in a business setting${
            isRemote ? ", explained in low-jargon language." : "."
          }`,
          "Confidentiality, data sensitivity, and source quality.",
          "Why all outputs still require human checking.",
          "Where Copilot can assist across everyday finance tasks.",
        ],
        examplesLabel: "Illustrative finance use cases",
        examples: [
          "Forecasting support.",
          "Variance analysis commentary.",
          "Reporting summaries.",
          "Reconciliations and exception explanations.",
          "Policy summarisation.",
          "Invoice workflow communications.",
          "Scenario analysis framing.",
          "Stakeholder communication.",
        ],
        outcome:
          "Participants understand where Copilot can realistically add value and where human judgement must remain central.",
      },
      {
        id: isRemote ? "remote-hour-4" : "f2f-hour-4",
        timeLabel: "Hour 4",
        title: "From Business Process to AI Opportunity",
        focus:
          "Help the team identify practical opportunities for adoption without overcomplicating the first step.",
        bullets: [
          "How to spot repetitive, time-consuming, or documentation-heavy tasks.",
          "Translating business pain points into AI-supported opportunities.",
          "Identifying low-risk, high-value starting points.",
          "Recognising control points and approval steps.",
          "Introduction to what a lightweight Copilot-based knowledge assistant could look like.",
          `Capturing team questions, opportunities, and suggested next steps${
            isRemote
              ? isEslRemote
                ? " through more facilitator-led engagement and smaller-group discussion."
                : " through guided check-ins and recap moments."
              : "."
          }`,
        ],
        outcome:
          "Participants leave with a clearer view of what they could trial first, what should not be rushed, and where future skill-building could be focused.",
      },
    ],
    includedValueAdd: isRemote
      ? isEslRemote
        ? "Where helpful for comprehension and participation, this session can be delivered as one 4-hour live workshop or as two shorter live blocks. Activities are designed to run in smaller groups, with more facilitator prompting and more engagement pushed from our side."
        : "Where helpful for comprehension and engagement, this session can be delivered as one 4-hour live workshop or as two shorter live blocks, while preserving the same core workshop outcomes."
      : undefined,
    overallOutcomes: RHEEM_BASE_SESSION_OUTCOMES,
  };
};

const createRheemRemoteBrochure = (
  variant: "remote" | "esl-remote"
): SampleProposalBrochureContent => {
  const isEslRemote = variant === "esl-remote";

  return {
    sections: [
      {
        title: "Overview",
        column: "left",
        paragraphs: isEslRemote
          ? [
              "This live online session is designed for participants using English as a second language, while keeping the same core capability-uplift outcomes as the broader program. It is suitable for up to 10 participants, with activities structured in smaller groups so comprehension, comfort, and participation stay high.",
              "The format uses plain-English facilitation, clearer explanation-demo-practice cycles, written prompts in chat, and more active facilitator-led engagement so the group can build confidence without the session feeling rushed or abstract.",
            ]
          : [
              "This live online workshop gives a small remote or offshore cohort the same core agenda and learning outcomes as the face-to-face session, adapted for virtual delivery through facilitator-led input, guided exercises, live discussion, and chat-based interaction.",
              "It is designed for 4-6 participants with mixed English confidence, using plain-English facilitation, visual walkthroughs, written prompts in chat, and recap checkpoints to keep the workshop practical and easy to follow.",
            ],
      },
      {
        title: "Focus Areas",
        column: "right",
        bullets: isEslRemote
          ? [
              "Practical understanding of where Microsoft Copilot can support common Finance Team tasks.",
              "Prompt structures taught in a clearer, lower-jargon format with more guided support.",
              "Safe-use and governance expectations reinforced through slower pacing and active checking for understanding.",
              "Use cases across reporting, forecasting, reconciliations, policy summaries, invoice queries, and stakeholder communication.",
              "Smaller-group activity design so participants can practise with more facilitator support.",
            ]
          : [
              "Practical understanding of how Microsoft Copilot can support common Finance Team activities.",
              "Repeatable prompt structure that improves output quality in a live online setting.",
              "Safe-use principles and verification checks for Copilot-supported work.",
              "Use cases across reporting, forecasting, reconciliations, policy summaries, invoice queries, and stakeholder communication.",
              "Translating business processes into AI-supported tasks while keeping human review essential.",
            ],
      },
      {
        title: "Typical Activities",
        column: "left",
        bullets: isEslRemote
          ? [
              "Welcome, AI fluency, and myth-busting delivered in plain-English language with more recap pauses.",
              "Guided prompt practice using written prompts in chat and smaller-group exercises.",
              "Governance and finance use-case discussion with active facilitator prompting and clarification.",
              "Process translation, pilot identification, and next-step capture with more structured engagement support from our side.",
            ]
          : [
              "Welcome, AI fluency, and myth-busting to align the remote cohort.",
              "Guided prompt practice using examples relevant to the everyday work of the Finance Team, with written prompts shared in chat.",
              "Governance and finance use-case discussion across reporting, reconciliations, forecasting, and policy work.",
              "Process translation, pilot identification, and a grounded Copilot knowledge-assistant concept with immediate next steps.",
            ],
      },
      {
        title: "Outputs",
        column: "right",
        bullets: isEslRemote
          ? [
              "Greater confidence in using Microsoft Copilot in a lower-pressure online format.",
              "Practical examples participants can adapt to their own role.",
              "Clearer understanding of what to try first and what still needs human checking.",
              "More consistent shared language across a mixed-English-confidence cohort.",
              "Documented next steps for future follow-up or team-specific support.",
            ]
          : [
              "Greater confidence in using Microsoft Copilot for Finance Team tasks.",
              "Clearer understanding of what to try first and what to avoid.",
              "Practical examples participants can adapt to their own role.",
              "Shared language around prompting, governance, and safe adoption.",
              "Consistency with the face-to-face cohort in program objectives and standards.",
            ],
      },
      {
        title: "Included in the Fee",
        column: "right",
        bullets: isEslRemote
          ? [
              "One 45-minute delivery alignment call.",
              "Tailored virtual facilitation for up to 10 participants in a mixed-English-confidence cohort.",
              "Smaller-group activity design with more facilitator-pushed engagement.",
              "Digital participant workbook, prompt starter pack, written prompts in chat, and short post-session summary.",
              "Can be delivered as one 4-hour session or two shorter live blocks where helpful.",
            ]
          : [
              "One 45-minute delivery alignment call.",
              "Tailored virtual facilitation for a small 4-6 person cohort.",
              "Digital participant workbook, prompt starter pack, and written prompts in chat.",
              "Chat and activity facilitation plus a short post-session summary for the remote cohort.",
              "Can be delivered as one 4-hour session or two shorter live blocks where helpful.",
            ],
      },
    ],
    footerNote:
      "Prepared for Rheem Australia's Finance Team capability uplift program.",
  };
};

const RHEEM_ADDON_1_AGENDA: ProjectOptionAgenda = {
  heading: "Prompt Lab and Finance Team Prompt Directory",
  subtitle: "Repeatable prompting skill built around real Finance Team work.",
  duration: "90 Minutes",
  deliveryMode: "Hybrid",
  whyThisMattersNow:
    "This session is designed to move the team from broad awareness into repeatable skill. That matters because the market is no longer struggling with interest in AI. It is struggling with capability. LinkedIn’s 2025 Workplace Learning Report found that 49% of learning leaders are feeling pressure from a skills crisis, which makes structured, role-relevant skill-building far more valuable than one-off awareness alone.",
  sources: [
    {
      label: "LinkedIn 2025 Workplace Learning Report",
      url: "https://www.linkedin.com/business/talent/blog/learning-and-development/2025-workplace-learning-report",
    },
  ],
  contextNote: RHEEM_ADD_ON_AGENDA_POSITIONING_LINE,
  blocks: [
    {
      id: "addon-1-block-1",
      timeLabel: "0-10 min",
      title: "Reset the context and surface real pain points",
      bullets: [
        "Quick recap of the base session.",
        "What participants have understood, remembered, or tried since the session.",
        "What still feels vague, intimidating, or difficult.",
        "Identify the recurring pain points that are worth turning into practical prompts.",
      ],
    },
    {
      id: "addon-1-block-2",
      timeLabel: "10-25 min",
      title: "Why some prompts work and others fail",
      bullets: [
        "Show the difference between weak prompts and useful prompts.",
        "Explain how context, constraints, tone, output structure, and checking instructions improve quality.",
        "Demonstrate why prompting is a practical employee skill, not just a tool feature.",
      ],
    },
    {
      id: "addon-1-block-3",
      timeLabel: "25-45 min",
      title: "Build better prompts around real Finance Team work",
      bullets: [
        "Live prompt design around familiar finance scenarios.",
      ],
      examplesLabel: "Live examples",
      examples: [
        "Summarising a finance policy.",
        "Drafting variance commentary.",
        "Rewriting an internal stakeholder email.",
        "Structuring a monthly update.",
        "Summarising meeting notes into actions.",
      ],
    },
    {
      id: "addon-1-block-4",
      timeLabel: "45-60 min",
      title: "Guided rewrite clinic",
      bullets: [
        "Participants critique example prompts.",
        "Facilitator improves them live.",
        "Discussion focuses on what would actually save time in this team.",
      ],
    },
    {
      id: "addon-1-block-5",
      timeLabel: "60-75 min",
      title: "Converting individual prompts into reusable team assets",
      bullets: [
        "Identify which prompts can become repeatable templates.",
        "Group prompts into categories such as summarising and rewriting, communication support, analysis support, policy and process understanding, and meeting and follow-up support.",
      ],
    },
    {
      id: "addon-1-block-6",
      timeLabel: "75-90 min",
      title: "Prompt capture and takeaway planning",
      bullets: [
        "Confirm which prompts should go into the post-session directory.",
        "Prioritise what will be most useful in everyday work.",
        "Capture final examples and wording preferences.",
      ],
    },
  ],
  includedValueAdd:
    "A custom Finance Team Prompt Directory will be developed after the session, based on the pain points and repetitive tasks raised by participants. This creates a practical takeaway that staff can continue using after the workshop, rather than leaving with only notes.",
};

const RHEEM_ADDON_2_AGENDA: ProjectOptionAgenda = {
  heading:
    "Workflow Clinic, Controls Check, and Copilot Chatbot Follow-Along Demo",
  subtitle:
    "Workflow-level thinking with a practical no-code Copilot assistant lens.",
  duration: "90 Minutes",
  deliveryMode: "Hybrid",
  whyThisMattersNow:
    "This session helps the team move from using prompts to understanding how AI supports actual workflows. That matters because Microsoft’s 2025 Work Trend Index found that 82% of leaders say this is a pivotal year to rethink core aspects of strategy and operations with AI. It also matters because Microsoft’s current Copilot Studio guidance confirms that agents can be grounded in approved SharePoint knowledge sources, with authentication and permissions carried through the user context. That makes a lightweight no-code internal assistant a realistic concept, not just a future idea.",
  sources: [
    {
      label: "Microsoft 2025 Work Trend Index",
      url: "https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/",
    },
    {
      label: "Microsoft Copilot Studio SharePoint knowledge guidance",
      url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint",
    },
  ],
  contextNote: RHEEM_ADD_ON_AGENDA_POSITIONING_LINE,
  blocks: [
    {
      id: "addon-2-block-1",
      timeLabel: "0-10 min",
      title: "Shift from prompt skill to workflow thinking",
      bullets: [
        "Quick recap of what participants found useful in the base session.",
        "Introduce the question: where could Copilot support a workflow, not just a one-off task?",
        "Position the session around structured, low-risk improvement.",
      ],
    },
    {
      id: "addon-2-block-2",
      timeLabel: "10-30 min",
      title: "Workflow mapping clinic",
      bullets: [
        "Review 2-3 workflows relevant to the Finance Team.",
      ],
      examplesLabel: "Example workflows",
      examples: [
        "Month-end commentary preparation.",
        "Finance policy Q&A.",
        "Invoice exception handling.",
        "Stakeholder request triage.",
        "Forecasting support packs.",
      ],
    },
    {
      id: "addon-2-block-3",
      timeLabel: "30-45 min",
      title: "Controls and safe-use check",
      bullets: [
        "Which tasks are suitable for drafting or summarising support.",
        "Which outputs must always be verified.",
        "Where approval and judgement must remain with people.",
        "What should not be delegated without review.",
      ],
    },
    {
      id: "addon-2-block-4",
      timeLabel: "45-70 min",
      title: "Copilot chatbot follow-along demo",
      bullets: [
        "Follow along with a lightweight Finance Team knowledge-assistant concept.",
        "Show how approved Microsoft content can support policy, process, and reporting queries.",
        "Explain where licensing, access, and governance matter.",
      ],
      examplesLabel: "Illustrative questions",
      examples: [
        "Where is the latest policy on X?",
        "Summarise the process for Y.",
        "What are the key steps in this reporting cycle?",
      ],
    },
    {
      id: "addon-2-block-5",
      timeLabel: "70-85 min",
      title: "Shortlist realistic opportunities",
      bullets: [
        "Identify 1-2 assistant or workflow opportunities worth exploring further.",
        "Clarify what is practical now versus what would be overengineered.",
        "Capture dependencies and owners.",
      ],
    },
    {
      id: "addon-2-block-6",
      timeLabel: "85-90 min",
      title: "Close and next-step capture",
      bullets: [
        "Final reflections.",
        "Agreed areas for future exploration or internal follow-up.",
      ],
    },
  ],
  includedValueAdd:
    "This session helps Rheem move from general Copilot understanding into workflow-level thinking, while also giving participants practical exposure to what a no-code Copilot chatbot and lightweight retrieval-assisted assistant concept could look like in a business setting.",
};

const RHEEM_ADDON_3_AGENDA: ProjectOptionAgenda = {
  heading: "AI for Sustainability Reporting",
  subtitle:
    "Domain-specific AI support for drafting, comparison, and evidence-chasing work.",
  duration: "90 Minutes",
  deliveryMode: "Hybrid",
  whyThisMattersNow:
    "This session focuses on one of the strongest document-heavy use cases for Copilot: sustainability-related reporting support. Deloitte’s 2025 C-suite Sustainability Report found that 83% of executives increased sustainability investments over the last 12 months, and 81% said they are already using AI to further their company’s sustainability efforts. That makes this a highly relevant space for employees to understand where AI can support drafting, comparison, consolidation, and evidence-chasing work.",
  sources: [
    {
      label: "Deloitte | Technology for sustainability",
      url: "https://www.deloitte.com/us/en/insights/topics/leadership/technology-for-sustainability.html",
    },
    {
      label: "Deloitte | C-suite Sustainability Report",
      url: "https://www.deloitte.com/au/en/issues/climate/c-suite-sustainability-report.html",
    },
  ],
  contextNote: RHEEM_ADD_ON_AGENDA_POSITIONING_LINE,
  blocks: [
    {
      id: "addon-3-block-1",
      timeLabel: "0-10 min",
      title: "Why sustainability reporting is a practical AI use case",
      bullets: [
        "What makes this area well suited to Copilot support.",
        "Why reporting-related work is often document-heavy, cross-functional, and time-consuming.",
        "Where AI can help without replacing review, accountability, or sign-off.",
      ],
    },
    {
      id: "addon-3-block-2",
      timeLabel: "10-30 min",
      title: "Sustainability reporting task map",
      bullets: [
        "Walk through where Copilot may support common sustainability-reporting tasks.",
      ],
      examplesLabel: "Potential support areas",
      examples: [
        "Summarising guidance or policy documents.",
        "Comparing report versions.",
        "Identifying wording changes or gaps.",
        "Consolidating notes and evidence requests.",
        "Drafting stakeholder follow-ups.",
        "Structuring first-pass narrative sections.",
      ],
    },
    {
      id: "addon-3-block-3",
      timeLabel: "30-50 min",
      title: "Prompt patterns for reporting support",
      bullets: [
        "Build examples around summarising, comparing, evidence requests, and first-pass narrative structuring.",
      ],
      examplesLabel: "Prompt patterns",
      examples: [
        "Summarise and extract actions.",
        "Compare two draft versions.",
        "Prepare evidence request wording.",
        "Turn rough notes into a narrative structure.",
        "Highlight where evidence may still be missing.",
      ],
    },
    {
      id: "addon-3-block-4",
      timeLabel: "50-65 min",
      title: "Governance and review lens",
      bullets: [
        "What AI can assist with.",
        "What still needs human verification.",
        "How to avoid over-reliance in disclosure-related work.",
        "How to separate drafting support from formal accountability.",
      ],
    },
    {
      id: "addon-3-block-5",
      timeLabel: "65-80 min",
      title: "Practical strategy discussion",
      bullets: [
        "Which sustainability-reporting-related tasks the Finance Team could start with.",
        "Where Copilot could reduce admin load or improve clarity.",
        "Which tasks deserve prompt support now versus deeper workflow redesign later.",
      ],
    },
    {
      id: "addon-3-block-6",
      timeLabel: "80-90 min",
      title: "Takeaway and prompt directory capture",
      bullets: [
        "Confirm the highest-value prompt categories.",
        "Agree what should be included in the Sustainability Reporting Prompt Directory.",
        "Capture candidate next-step opportunities.",
      ],
    },
  ],
  includedValueAdd:
    "A Sustainability Reporting Prompt Directory will be developed as a takeaway resource, tailored to the likely reporting, drafting, comparison, and information-request tasks relevant to the team.",
};

export const rheemSampleProposal: SampleProposal = {
  quoteCode: "RHEEM-COPILOT-APR26",
  quoteId: "Q-2026-041",
  title: "Capability Uplifting Day",
  clientName: "Finance Team Sponsor",
  clientCompany: "Rheem Australia",
  clientEmail: "finance@rheem.example",
  introText:
    "A practical, governance-first Microsoft Copilot workshop with optional hybrid follow-up sessions that turn early capability uplift into tested Finance Team practice.",
  issuedOn: "2026-04-02",
  validUntil: "2026-04-30",
  notes:
    "This proposal is structured with the core workshop options first, followed by optional hybrid add-ons that can be layered in as a services cart.",
  terms:
    "This quote is valid for 28 days from issue. Workshop scope, participant numbers, travel, venue requirements, and licensing assumptions may require repricing if materially changed.",
  acceptanceLine: "Accepted by: __________________________",
  currency: "AUD",
  recipientEmail: "rushi@knowwhatson.com",
  pdfBasePath: "/studio/project/RHEEM22APR",
  defaultSelectedBaseIds: ["f2f-session"],
  defaultSelectedAddOnIds: [],
  baseOptions: [
    {
      id: "f2f-session",
      title: "Face-to-Face Session",
      subtitle: "AI Fluency and Microsoft Copilot for the Finance Team",
      description:
        "The strongest in-room entry point for building confidence, surfacing questions, and creating momentum with approximately 25 participants.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 7900,
      priceLabel: "$7,900 + GST",
      facts: [
        { label: "Duration", value: "4 Hours" },
        { label: "Delivery Mode", value: "In Person" },
        { label: "Cohort Size", value: "Approx. 25 participants" },
      ],
      highlights: [
        "Broad capability uplift with governance-first framing.",
        "Prompting, practical use cases, and safe-use checks in one session.",
        "Includes sponsor discovery, tailoring, materials, and post-session summary.",
      ],
      brochure: {
        sections: [
          {
            title: "Overview",
            column: "left",
            paragraphs: [
              "This in-person workshop is delivered at Rheem Australia for the Finance Team as a broad capability-uplift session designed to build shared language, practical confidence, and a governance-first foundation before moving into more tailored application work.",
              "The format is discussion-led and low-pressure, combining facilitator input, live examples, structured activities, and team reflection so beginners, early adopters, and sceptics can learn in the same room.",
            ],
          },
          {
            title: "Focus Areas",
            column: "right",
            bullets: [
              "Practical understanding of what Microsoft Copilot can and cannot do in the Finance Team environment.",
              "Simple prompting structure to improve output quality in everyday finance tasks.",
              "Governance, safe use, and human-review checks before relying on AI-generated content.",
              "Relevant use cases across reporting, forecasting, reconciliations, policy work, and stakeholder communication.",
              "Translating business processes into AI-ready tasks, control points, and realistic pilot opportunities.",
            ],
          },
          {
            title: "Typical Activities",
            column: "left",
            bullets: [
              "Welcome, business context, and AI fluency baseline setting.",
              "Guided prompting practice using variance commentary, policy summaries, and stakeholder updates.",
              "Governance walkthrough covering source quality, confidentiality, verification, and safe use.",
              "Practical process-to-opportunity mapping, including a lightweight Copilot knowledge-assistant concept and next steps.",
            ],
          },
          {
            title: "Outputs",
            column: "right",
            bullets: [
              "Shared understanding of Microsoft Copilot in the context of the Finance Team at Rheem.",
              "Practical prompt framework participants can apply immediately.",
              "Shortlist of relevant use cases and low-risk pilot opportunities.",
              "Clearer view of safe use, governance, and human-check requirements.",
              "Greater confidence to test Copilot in high-value finance tasks.",
            ],
          },
          {
            title: "Included in the Fee",
            column: "right",
            bullets: [
              "One 60-minute sponsor discovery and scoping call.",
              "Tailoring of examples to the context of the Finance Team at Rheem.",
              "4-hour in-person workshop facilitation plus digital participant workbook and prompt starter pack.",
              "Use-case capture and a short post-session summary with recommended next steps.",
            ],
          },
        ],
        footerNote:
          "Prepared for Rheem Australia's Finance Team capability uplift program.",
      },
      agenda: createRheemBaseAgenda("in-person"),
    },
    {
      id: "remote-session",
      title: "Remote Session",
      subtitle: "AI Fluency and Microsoft Copilot for a small remote finance cohort",
      description:
        "A live online version for a 4-6 person remote or offshore cohort, designed for mixed English confidence with plain-English facilitation, written prompts in chat, and optional split delivery where that better supports comprehension.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 7400,
      priceLabel: "$7,400 + GST",
      facts: [
        { label: "Duration", value: "4 Hours" },
        { label: "Delivery Mode", value: "Live Online" },
        { label: "Cohort Size", value: "4-6 participants" },
      ],
      highlights: [
        "Small-group remote cohort with plain-English facilitation and more recap/check-in moments.",
        "Written prompts, chat-based guidance, and visual walkthroughs to support mixed English confidence.",
        "Can be run as one 4-hour live workshop or two shorter live blocks.",
      ],
      brochure: createRheemRemoteBrochure("remote"),
      agenda: createRheemBaseAgenda("remote"),
    },
    {
      id: "esl-remote-session",
      title: "Remote Session for ESL Participants",
      subtitle: "AI Fluency and Microsoft Copilot for a supported remote cohort",
      description:
        "A live online version for up to 10 participants using English as a second language, with smaller breakout activities, clearer step-by-step facilitation, and more engagement we will actively push from our side.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 7400,
      priceLabel: "$7,400 + GST",
      facts: [
        { label: "Duration", value: "4 Hours" },
        { label: "Delivery Mode", value: "Live Online" },
        { label: "Cohort Size", value: "Up to 10 participants" },
      ],
      highlights: [
        "Designed for participants with mixed English confidence in a remote setting.",
        "Activities run in smaller groups with more facilitator prompting and stronger engagement from our side.",
        "Plain-English facilitation, written prompts in chat, and optional split delivery blocks.",
      ],
      brochure: createRheemRemoteBrochure("esl-remote"),
      agenda: createRheemBaseAgenda("esl-remote"),
    },
  ],
  addOnOptions: [
    {
      id: "addon-1",
      title: "Custom Prompt Library",
      subtitle: "Tailored prompt pack for Finance Team workflows",
      description:
        "A tailored prompt library built around Rheem's Finance Team workflows so participants leave with reusable prompt patterns for their most common tasks.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 3200,
      priceLabel: "$3,200 + GST",
      facts: [
        { label: "Duration", value: "90 Minutes" },
        { label: "Delivery Mode", value: "Hybrid" },
        { label: "Suggested Timing", value: "2 weeks after Session 1" },
      ],
      highlights: [
        "Build a reusable prompt library tailored to real Finance Team work.",
        "Turn workshop pain points into cleaner prompt templates and examples.",
        "Create a practical takeaway the team can reuse after the session.",
      ],
      brochure: {
        sections: [
          {
            title: "Overview",
            column: "left",
            paragraphs: [
              "This hybrid follow-up is designed to turn the first workshop into a practical prompt asset the Finance Team can keep using. Participants bring real tasks, examples, and recurring pain points so the session can shape a more tailored prompt library around the work they actually do.",
              "The main output is a Custom Prompt Library for Rheem's Finance Team, built from common workflows, prompt patterns, and examples surfaced through the session.",
            ],
          },
          {
            title: "Focus Areas",
            column: "right",
            bullets: [
              "Identifying repeated Finance Team tasks that benefit from reusable prompts.",
              "Translating participant pain points into clearer prompt structures and examples.",
              "Improving consistency, output quality, and confidence through guided prompt refinement.",
              "Creating prompt assets that can be reused after the session rather than staying workshop-only.",
            ],
          },
          {
            title: "Typical Activities",
            column: "left",
            bullets: [
              "Prompt review and rewrite exercises using Rheem-relevant examples.",
              "Live drafting of reusable prompt templates for recurring Finance Team tasks.",
              "Capture of common use cases, edge cases, and quality-control considerations.",
              "Structuring the prompt library so it works as a practical team resource.",
            ],
          },
          {
            title: "Outputs",
            column: "right",
            bullets: [
              "Custom Prompt Library tailored to the Finance Team at Rheem.",
              "Reusable prompt templates shaped around real participant needs.",
              "Better prompt consistency across recurring Finance Team workflows.",
              "A practical resource participants can keep using after the session.",
            ],
          },
          {
            title: "Included in the Fee",
            column: "right",
            bullets: [
              "Facilitation of the 90-minute hybrid session.",
              "Capture and synthesis of participant pain points and workflow examples.",
              "Development of a tailored Custom Prompt Library after the session.",
              "Delivery of the prompt library as a practical takeaway resource for participants.",
            ],
          },
        ],
        footerNote:
          "Prepared for Rheem Australia's Finance Team capability uplift program.",
      },
      agenda: RHEEM_ADDON_1_AGENDA,
    },
    {
      id: "addon-2",
      title: "Custom Agents + How to Build Copilot Agents Workshop",
      subtitle: "Practical workshop for designing and building useful agents",
      description:
        "A hands-on workshop showing the team how custom Copilot agents can support Finance Team work, plus a practical walkthrough of how to design and build them.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 3600,
      priceLabel: "$3,600 + GST",
      facts: [
        { label: "Duration", value: "90 Minutes" },
        { label: "Delivery Mode", value: "Hybrid" },
        { label: "Suggested Timing", value: "4-5 weeks after Session 1" },
      ],
      highlights: [
        "Explore where custom Copilot agents can help with Finance Team workflows.",
        "See how to design simple agents around approved content and clear guardrails.",
        "Give participants a practical workshop on how to build Copilot agents themselves.",
      ],
      brochure: {
        sections: [
          {
            title: "Overview",
            column: "left",
            paragraphs: [
              "This add-on is a practical workshop on Custom Agents and how to build Copilot agents that are useful in the Finance Team context. It moves beyond general AI awareness and focuses on where small, task-specific agents may help with approved knowledge, recurring questions, and guided workflow support.",
              "Participants work through how to identify useful agent opportunities, what content and controls matter, and how a simple Copilot agent can be structured and built in practice.",
            ],
          },
          {
            title: "Focus Areas",
            column: "right",
            bullets: [
              "Identifying Finance Team use cases suited to custom Copilot agents.",
              "Understanding the inputs, content sources, and guardrails needed for useful agents.",
              "Seeing how agents can support knowledge retrieval, drafting, and guided task flows.",
              "Learning the basics of how to build Copilot agents in a practical workshop format.",
              "Keeping governance, human review, and content control visible throughout the design process.",
            ],
          },
          {
            title: "Typical Activities",
            column: "left",
            bullets: [
              "Walkthrough of agent-ready Finance Team scenarios.",
              "Group discussion on agent scope, content, and safe-use boundaries.",
              "Guided workshop on how to build a simple Copilot agent.",
              "Review of practical design choices, governance checkpoints, and adoption barriers.",
            ],
          },
          {
            title: "Outputs",
            column: "right",
            bullets: [
              "Clearer view of where custom Copilot agents fit in the Finance Team workflow mix.",
              "Practical exposure to how useful agents can be structured and built.",
              "Starter ideas for Finance Team agent use cases and next-step pilots.",
              "Stronger understanding of the controls needed around custom agent use.",
            ],
          },
          {
            title: "Included in the Fee",
            column: "right",
            bullets: [
              "Facilitation of the 90-minute hybrid session.",
              "Workshop design focused on custom agent opportunities relevant to the Finance Team.",
              "Guided how-to-build-Copilot-agents walkthrough.",
              "Short capture of useful agent concepts, controls, and next-step considerations.",
            ],
          },
        ],
        footerNote:
          "Prepared for Rheem Australia's Finance Team capability uplift program.",
      },
      agenda: RHEEM_ADDON_2_AGENDA,
    },
    {
      id: "addon-3",
      title: "AI for Sustainability Reporting",
      subtitle: "Applied reporting workflows for drafting, comparison, and review",
      description:
        "A practical hybrid follow-up focused on how Microsoft Copilot can support sustainability-related reporting work in a structured, low-risk way. The session helps the Finance Team at Rheem explore drafting, summarising, comparing, consolidating, and preparing sustainability reporting content while keeping human review, governance, and sign-off firmly in place. It moves beyond general AI use and focuses on the document-heavy, cross-functional, narrative-intensive work that often sits around sustainability reporting and disclosure preparation.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      price: 2700,
      priceLabel: "$2,700 + GST",
      facts: [
        { label: "Duration", value: "90 Minutes" },
        { label: "Delivery Mode", value: "Hybrid" },
        { label: "Suggested Timing", value: "7-8 weeks after Session 1" },
      ],
      highlights: [
        "Guided prompt exercises for drafting, summarising, comparing, and evidence-chasing tasks.",
        "Discussion of safe use, quality control, and human verification in reporting workflows.",
        "Includes a tailored Sustainability Reporting Prompt Directory for the Finance Team at Rheem.",
        "Identifies practical sustainability-reporting use cases and recommended next steps.",
      ],
      brochure: {
        sections: [
          {
            title: "Overview",
            column: "left",
            paragraphs: [
              "A practical hybrid follow-up focused on how Microsoft Copilot can support sustainability-related reporting work in a structured, low-risk way. The session is designed to help the Finance Team at Rheem explore useful strategies for drafting, summarising, comparing, consolidating, and preparing sustainability reporting content while keeping human review, governance, and sign-off firmly in place.",
              "This session moves beyond general AI use and focuses on the types of document-heavy, cross-functional, narrative-intensive tasks that often sit around sustainability reporting and disclosure preparation.",
            ],
          },
          {
            title: "Focus Areas",
            column: "right",
            bullets: [
              "Using Copilot to support sustainability-related narrative drafting and refinement.",
              "Summarising lengthy guidance, policy documents, or internal source materials.",
              "Comparing report versions, identifying changes, and highlighting gaps or missing evidence.",
              "Preparing stakeholder information requests and follow-up prompts for cross-functional contributors.",
              "Structuring reporting workflows where AI can support speed and clarity without replacing review and accountability.",
            ],
          },
          {
            title: "Typical Activities",
            column: "left",
            bullets: [
              "Walkthrough of sustainability-reporting-related use cases relevant to the Finance Team.",
              "Guided prompt exercises for drafting, summarising, comparing, and evidence-chasing tasks.",
              "Discussion of safe use, quality control, and human verification in reporting workflows.",
              "Identification of practical sustainability-reporting activities where Copilot may provide immediate support.",
            ],
          },
          {
            title: "Outputs",
            column: "right",
            bullets: [
              "Sustainability Reporting Prompt Directory tailored to the Finance Team at Rheem.",
              "Practical strategies for using Copilot across sustainability-reporting-related tasks.",
              "Shortlist of sustainability-reporting use cases suitable for further testing or adoption.",
              "Clearer understanding of governance and review requirements in this context.",
            ],
          },
          {
            title: "Included in the Fee",
            column: "right",
            bullets: [
              "Facilitation of the 90-minute hybrid session.",
              "Tailoring of examples to sustainability-reporting-related tasks relevant to the Finance Team.",
              "Development of a tailored Sustainability Reporting Prompt Directory as a takeaway resource.",
              "Short summary of identified opportunities and recommended next steps.",
            ],
          },
        ],
        footerNote:
          "Prepared for Rheem Australia's Finance Team capability uplift program.",
      },
      agenda: RHEEM_ADDON_3_AGENDA,
    },
  ],
  bundleOptions: [
    {
      id: "hybrid-follow-up-bundle",
      title: "Hybrid Follow-Up Bundle",
      description:
        "Custom Prompt Library, Custom Agents workshop, and Sustainability Reporting add-ons booked together.",
      imageUrl: RHEEM_COPILOT_GIF_URL,
      baseIds: [],
      addOnIds: ["addon-1", "addon-2", "addon-3"],
      price: 8700,
      priceLabel: "$8,700 + GST",
    },
  ],
};
