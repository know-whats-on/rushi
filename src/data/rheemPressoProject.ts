import type {
  DocumentLibraryMeta,
  ProjectDocumentContent,
  ProjectPresentationSlide,
  ProjectPresentationVisualItem,
  StudioDocument,
} from "../types/documents";
import {
  RHEEM_PROJECT_CARD_LOGO_URL,
  RHEEM_PROJECT_PDF_LOGO_URL,
} from "./rheemProject";

export const RHEEMPRESSO_PROJECT_CODE = "RHEEMPRESSO";
export const RHEEMPRESSO_PROJECT_TITLE =
  "Microsoft 365 Copilot for the Finance Team";
export const RHEEMPRESSO_PROJECT_CLIENT = "Rheem Australia";

const EMPTY_LIBRARY_META: DocumentLibraryMeta = {
  isListed: false,
  cardCompany: "",
  cardTitle: "",
  cardCategory: "",
  cardStatusLabel: "",
  cardSummary: "",
  cardLogoUrl: "",
};

const bullets = (value: string) =>
  value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

const noteLines = (...values: string[]) =>
  values
    .flatMap((value) =>
      value
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .filter(Boolean);

const detailCard = (
  label: string,
  note: string,
  detail: string,
  group?: string,
  value?: string,
  metric?: number,
  meta: Partial<ProjectPresentationVisualItem> = {}
): ProjectPresentationVisualItem => ({
  label,
  note,
  detail,
  group,
  value,
  metric,
  ...meta,
});

const QUESTION_STAGE = {
  cardState: "question",
  disableCardReveal: true,
} as const;

const ANSWER_STAGE = {
  cardState: "answer",
  disableCardReveal: true,
} as const;

const NO_CAPABILITY_SUMMARY = {
  showCapabilitySummary: false,
} as const;

const RHEEMPRESSO_SLIDES: ProjectPresentationSlide[] = [
  {
    id: "rheem-01-title",
    layout: "title",
    kicker: "00:00-00:05",
    title: "Microsoft 365 Copilot for the Finance Team",
    subtitle: "A Rheem-ready workshop on better prompting, safer use, and smarter first pilots.",
    bullets: [
      "Finance-first and task-led",
      "Microsoft 365 Copilot only",
      "Prompting, governance, use cases, and pilot selection",
    ],
    sections: [],
    visual: {
      variant: "network-hero",
      items: [
        { label: "AI fluency", value: "Know where it helps" },
        { label: "Prompt craft", value: "Ask for usable output" },
        { label: "Safe use", value: "Keep judgement in the loop" },
        { label: "Pilot design", value: "Choose the right first move" },
      ],
    },
    speakerNotes: noteLines(
      "Set the tone early: this is a working session for the finance team, not a generic AI talk.",
      "The aim is not to remove judgement. The aim is to improve how finance work gets started, structured, checked, and shared."
    ),
  },
  {
    id: "rheem-02-why-finance",
    layout: "evidence",
    kicker: "00:05-00:10",
    title: "Why finance teams feel the lift quickly",
    subtitle: "Copilot earns attention where work is repetitive, explanation-heavy, and always under review.",
    bullets: [
      "Recurring commentary, packs, reconciliations, and follow-ups create blank-page load",
      "The gain is a stronger first draft, not less accountability",
      "Time only matters if the review step stays disciplined",
    ],
    sections: [],
    caption: "Ask the room which finance task still feels most manual or repetitive today.",
    callouts: [
      { value: "Recurring", label: "The same work shows up every month" },
      { value: "Narrative-heavy", label: "Finance still spends time explaining the numbers" },
      { value: "Reviewable", label: "Good first pilots stay easy to inspect" },
    ],
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard(
          "Recurring prep",
          "The same setup happens again and again",
          "Month-end packs, policy digests, board notes, and stakeholder updates often start from scratch even when the task pattern is familiar."
        ),
        detailCard(
          "Commentary drafting",
          "Narrative work is still real work",
          "Finance teams spend time turning tables into explanation. Copilot can accelerate the first pass without replacing the analyst."
        ),
        detailCard(
          "Cross-team updates",
          "Clarity matters beyond finance",
          "A large share of finance effort goes into translating status, risk, and decisions for other parts of the business."
        ),
        detailCard(
          "Analysis support",
          "The job is still human judgement",
          "Copilot can help organise comparison, summarise findings, and surface hypotheses so analysts can spend more time validating what matters."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Frame the opportunity as time returned to analysis, communication, and review quality.",
      "Keep reminding the room that faster drafting is useful only when the finance team still trusts the finish."
    ),
  },
  {
    id: "rheem-03-pulse-check",
    layout: "evidence",
    kicker: "00:10-00:15",
    title: "Quick pulse check before we dive in",
    subtitle: "Get a read on confidence, scepticism, and where the room wants extra help.",
    bullets: bullets(
      "Who is new to Copilot; who has tried it lightly; who wants proof before they buy in"
    ),
    sections: [],
    caption: "Use a show of hands or fast poll so the pace matches the room.",
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "New to Copilot",
          "Needs the basics first",
          "Spend more time on what Copilot can actually do, where it fits, and how to inspect output before trusting it.",
          "Profile"
        ),
        detailCard(
          "Tried it lightly",
          "Needs stronger prompts",
          "These participants usually believe the tool has potential but have not yet seen what structured prompting does to output quality.",
          "Profile"
        ),
        detailCard(
          "Interested but cautious",
          "Needs proof and guardrails",
          "This group wants concrete use cases, clearer limits, and reassurance that control stays with the finance team.",
          "Profile"
        ),
      ],
    },
    speakerNotes: noteLines(
      "Use this pulse check to set the room, not to judge it.",
      "The workshop lands best when scepticism, curiosity, and inexperience all feel expected."
    ),
  },
  {
    id: "rheem-04-roadmap",
    layout: "evidence",
    kicker: "00:15-00:20",
    title: "How the session moves",
    subtitle: "Four hours, one arc: understand it, prompt it, govern it, pilot it.",
    bullets: bullets(
      "Hour 1 shared language; Hour 2 prompt craft; Hour 3 safe use and finance scenarios; Hour 4 pilot design and next steps"
    ),
    sections: [],
    visual: {
      variant: "roadmap-timeline",
      items: [
        detailCard(
          "AI fluency",
          "What the tool is really good for",
          "Start with the mental model so later demos and decisions make sense instead of feeling like disconnected tricks.",
          "Hour 1"
        ),
        detailCard(
          "Prompt craft",
          "How to ask for usable output",
          "Build a repeatable prompting habit with examples the team can reuse the next time real work lands.",
          "Hour 2"
        ),
        detailCard(
          "Safe use + scenarios",
          "How finance uses it without losing control",
          "Move from prompt quality into permissions, review discipline, and the finance workflows where Copilot can actually help.",
          "Hour 3"
        ),
        detailCard(
          "Pilot design",
          "How to start well",
          "Finish with process mapping, team discussion, and a better filter for which pilot deserves to go first.",
          "Hour 4"
        ),
      ],
    },
    speakerNotes: noteLines(
      "Walk the room through the shape of the day so nobody is guessing where this is headed.",
      "The sequence matters: shared language first, then skill, then guardrails, then adoption."
    ),
  },
  {
    id: "rheem-05-outcomes",
    layout: "capabilities",
    kicker: "00:20-00:25",
    title: "What the team should leave with",
    subtitle: "Sharper judgement, better prompts, and a credible place to start.",
    bullets: [
      "A shared model of where Copilot helps in finance",
      "A repeatable prompt structure for real work",
      "A stronger review habit for safe use",
      "A shortlist of pilots worth trying first",
    ],
    sections: [],
    callouts: [
      { value: "Shared language", label: "One mental model across the team" },
      { value: "Prompt habit", label: "A structure people can use tomorrow" },
      { value: "Review habit", label: "Better checks before output is used" },
      { value: "Pilot filter", label: "A clearer sense of where to begin" },
    ],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Know the fit",
          "Spot strong and weak use cases",
          "The team should be able to tell the difference between support work that suits Copilot and work that still needs heavier human ownership."
        ),
        detailCard(
          "Prompt with structure",
          "Stop relying on vague asks",
          "The team should leave with a simple pattern for setting context, task, output shape, and review expectations."
        ),
        detailCard(
          "Review with discipline",
          "Keep the human in the loop",
          "Everyone should know what must still be checked before numbers, claims, or sensitive content move forward."
        ),
        detailCard(
          "Choose the first pilot well",
          "Start where trust can grow",
          "The strongest first pilots are repetitive, contained, reviewable, and easy to score after a small test."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Anchor the session around capability and judgement, not hype.",
      "If people leave with only excitement and no operating habit, the session has underdelivered."
    ),
  },
  {
    id: "rheem-06-what-it-is",
    layout: "split-2",
    kicker: "00:25-00:30",
    title: "Copilot's job is support, not autonomy",
    subtitle: "Set the expectation now and the rest of the workshop gets easier.",
    bullets: [],
    sections: [
      {
        id: "rheem-06-is",
        heading: "What it does well",
        bullets: [
          "Drafts, summarises, restructures, and explains",
          "Works inside the Microsoft 365 flow people already use",
          "Helps with first-pass output, not final accountability",
        ],
      },
      {
        id: "rheem-06-is-not",
        heading: "What it never removes",
        bullets: [
          "Human judgement on finance decisions",
          "Checks on facts, numbers, audience fit, and sensitivity",
          "Approval, escalation, and final sign-off",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Frame Copilot as an assistant inside existing work, not an autopilot layer floating above it.",
      "This distinction makes every later governance conversation easier."
    ),
  },
  {
    id: "rheem-07-collaborators",
    layout: "evidence",
    kicker: "00:30-00:35",
    title: "The shift is from clicking to collaborating",
    subtitle: "The useful skill is learning how to work through dialogue instead of only menus and forms.",
    bullets: [
      "Ask clearly",
      "Refine on purpose",
      "Challenge the first answer before you trust it",
    ],
    sections: [],
    visual: {
      variant: "workflow-evolution",
      items: [
        detailCard(
          "Traditional tool",
          "You click, it executes",
          "Classic software is powerful, but it mostly waits for direct instruction and structured inputs."
        ),
        detailCard(
          "Drafting assistant",
          "It gives you a first pass",
          "Copilot helps start work faster by drafting structure, language, and summaries that the user can then shape."
        ),
        detailCard(
          "Thinking partner",
          "You steer the exchange",
          "The real uplift appears when users learn to compare options, tighten instructions, and challenge the response instead of taking the first draft at face value."
        ),
      ],
    },
    speakerNotes: noteLines(
      "This is the mindset shift for the day.",
      "The tool is more conversational, which means user skill matters more than it did with traditional software."
    ),
  },
  {
    id: "rheem-08-copilot-or-cothinker",
    layout: "evidence",
    kicker: "00:35-00:40",
    title: "Knowledge check 1: Which tasks are Co-Pilot work and which are Co-Thinker work?",
    subtitle: "Classify each scenario before we reveal the mode.",
    bullets: [],
    sections: [],
    caption: "Ask the room to classify the scenarios first, then explain why each one fits its mode.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard(
          "Draft a month-end update",
          "Drafting task",
          "This is primarily execution support. The value is speed, structure, and a stronger starting draft for review.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 1",
          }
        ),
        detailCard(
          "Stress-test a difficult decision",
          "Framing task",
          "This is about options, trade-offs, and what still needs judgement rather than about producing a finished artefact.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 2",
          }
        ),
        detailCard(
          "Summarise a policy change",
          "Translation task",
          "This is well-suited to support mode when the policy owner still validates the result before the team relies on it.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 3",
          }
        ),
        detailCard(
          "Challenge a process redesign",
          "Challenge task",
          "The purpose is to test assumptions, surface blind spots, and pressure-check the thinking before action is taken.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 4",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "This check introduces the two modes the room will keep using for the rest of the workshop.",
      "Drafting and summarising lean Co-Pilot. Challenge, framing, and trade-off work lean Co-Thinker."
    ),
  },
  {
    id: "rheem-08a-copilot-or-cothinker-answer",
    layout: "evidence",
    kicker: "00:35-00:40",
    title: "Knowledge check 1 answer: Co-Pilot or Co-Thinker?",
    subtitle: "Drafting and summarising lean Co-Pilot. Framing and challenge lean Co-Thinker.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard(
          "Draft a month-end update",
          "Drafting task",
          "This is primarily execution support. The value is speed, structure, and a stronger starting draft for review.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Pilot",
          }
        ),
        detailCard(
          "Stress-test a difficult decision",
          "Framing task",
          "This is about options, trade-offs, and what still needs judgement rather than about producing a finished artefact.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Thinker",
          }
        ),
        detailCard(
          "Summarise a policy change",
          "Translation task",
          "This is well-suited to support mode when the policy owner still validates the result before the team relies on it.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Pilot",
          }
        ),
        detailCard(
          "Challenge a process redesign",
          "Challenge task",
          "The purpose is to test assumptions, surface blind spots, and pressure-check the thinking before action is taken.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Thinker",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "Use the answer slide to make the distinction feel practical rather than theoretical.",
      "The room should be able to name which mode a task needs before they start prompting."
    ),
  },
  {
    id: "rheem-09-plain-english-modes",
    layout: "split-2",
    kicker: "00:40-00:45",
    title: "Two modes, one tool",
    subtitle: "Strong teams switch modes on purpose instead of expecting one default behaviour.",
    bullets: [],
    sections: [
      {
        id: "rheem-09-pilot",
        heading: "Co-Pilot mode",
        bullets: [
          "Best for drafting, summarising, formatting, and preparation",
          "Useful when the output shape is already fairly clear",
          "The gain is speed into a first pass that a human can refine",
        ],
      },
      {
        id: "rheem-09-thinker",
        heading: "Co-Thinker mode",
        bullets: [
          "Best for options, challenge, trade-offs, and reframing",
          "Useful when the team needs help thinking, not just drafting",
          "The gain is better questions, not just faster output",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Invite one real finance task from the room and classify it together.",
      "That makes the language feel operational instead of abstract."
    ),
  },
  {
    id: "rheem-10-myth-busting",
    layout: "split-2",
    kicker: "00:45-00:50",
    title: "What this workshop is not promising",
    subtitle: "We are not automating finance judgement away.",
    bullets: [],
    sections: [
      {
        id: "rheem-10-myth",
        heading: "Unhelpful story",
        bullets: [
          "AI will replace finance end to end",
          "The last reviewer will become optional",
          "Approval can be handed to the system once the drafts improve",
        ],
      },
      {
        id: "rheem-10-reality",
        heading: "Practical reality",
        bullets: [
          "Copilot speeds support work, not sign-off",
          "Humans still own judgement, accuracy, and escalation",
          "Trust grows fastest through contained, reviewable pilots",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Name the fear briefly and then ground the room in the practical reality of how finance work is actually governed.",
      "The workshop should leave people more confident, not more fatalistic."
    ),
  },
  {
    id: "rheem-11-proof-points",
    layout: "evidence",
    kicker: "00:50-00:55",
    title: "Where early value usually shows up",
    subtitle: "Treat these as directional gains, then test them against Rheem workflows.",
    bullets: [
      "Document digestion",
      "Narrative drafting",
      "Exception triage",
      "Cross-team communication",
    ],
    sections: [],
    caption: "The goal is not to chase a headline metric. It is to spot where time and focus can genuinely come back to the team.",
    visual: {
      variant: "impact-compare",
      items: [
        { label: "Policy and document digestion", value: "Faster", note: "Less time spent extracting what matters", metric: 64 },
        { label: "Pack and commentary drafting", value: "Cleaner start", note: "Less blank-page effort before review", metric: 58 },
        { label: "Reconciliation triage", value: "Earlier focus", note: "Exceptions can surface faster for investigation", metric: 44 },
        { label: "Stakeholder communications", value: "Sharper handoff", note: "Updates move toward audience-ready language sooner", metric: 52 },
      ],
    },
    speakerNotes: noteLines(
      "Use this slide to reinforce pattern recognition rather than to sell fantasy ROI.",
      "The useful question is where Rheem finance work maps onto these same shapes."
    ),
  },
  {
    id: "rheem-12-scenario-map",
    layout: "capabilities",
    kicker: "00:55-01:00",
    title: "Five scenario families we will keep coming back to",
    subtitle: "The same examples will show up in demos, checks, and pilot design.",
    bullets: [
      "Keep looking for repeatable and reviewable work",
      "Reuse the same scenarios so the pattern becomes obvious",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Monthly packs and commentary",
          "Narrative support",
          "A strong pattern because the team already knows the numbers and can review the draft against known material."
        ),
        detailCard(
          "Policy and process Q&A",
          "Document digestion",
          "Useful when long guidance needs to become something the team can actually navigate and reuse."
        ),
        detailCard(
          "Stakeholder updates",
          "Audience fit",
          "Helpful when finance needs clearer handoffs to leaders, partners, or operational teams."
        ),
        detailCard(
          "Reconciliation and variance",
          "Exception focus",
          "A strong finance scenario because it speeds investigation without removing the analyst from the decision."
        ),
        detailCard(
          "Meeting recap and follow-up",
          "Context retention",
          "Useful when actions, owners, and next steps regularly get buried in conversation and email threads."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Ask participants to mentally star the two scenario families that matter most to them.",
      "The repetition is deliberate so the workshop feels like one joined-up story."
    ),
  },
  {
    id: "rheem-13-transition-hour-2",
    layout: "statement",
    kicker: "01:00-01:03",
    title: "Hour 2: Prompting that produces usable output",
    titleLines: ["Hour 2", "Prompting that produces", "usable output"],
    subtitle: "The jump from novelty to value usually happens at the prompt.",
    bullets: [],
    sections: [],
    caption: "Shift the room from what Copilot is to how they will actually work with it.",
    speakerNotes: noteLines(
      "Make this feel like a practical skill hour.",
      "The point is not to memorise jargon. The point is to ask for output that is easier to use and easier to check."
    ),
  },
  {
    id: "rheem-14-prompting-basics",
    layout: "evidence",
    kicker: "01:03-01:08",
    title: "Why vague asks fall apart",
    subtitle: "Weak prompts create generic drafts, extra cleanup, and false confidence.",
    bullets: [
      "Too little context makes the model guess",
      "No audience creates tone problems",
      "No output shape makes review slower",
    ],
    sections: [],
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard("Vague ask", "Generic output", "A short, underspecified request usually produces bland language and weak assumptions."),
        detailCard("Missing audience", "Wrong tone or level", "A technically decent draft can still miss the mark if the model does not know who the output is for."),
        detailCard("Missing output shape", "Messy review", "When the response format is undefined, the user has to spend more time restructuring the answer after it arrives."),
        detailCard("Missing review cue", "Unsafe first pass", "Finance prompts improve when the model is told to separate facts, assumptions, and checks that still belong to a person."),
      ],
    },
    speakerNotes: noteLines(
      "Normalise the common experience: people try the tool once, ask something underspecified, and decide it is weak.",
      "This is the moment to show that prompt quality changes the value equation."
    ),
  },
  {
    id: "rheem-15-anatomy",
    layout: "evidence",
    kicker: "01:08-01:13",
    title: "The five parts of a finance-ready prompt",
    subtitle: "Give the model enough shape to draft well and enough structure to be checked.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Business context", "What is happening here?", "Name the task, period, document, dataset, or decision so the request is anchored in something real."),
        detailCard("Requested outcome", "What do you want back?", "Use a clear action verb and describe the job you want completed, not just the topic."),
        detailCard("Audience", "Who is this for?", "Tone, detail level, and format should shift depending on who will read the result."),
        detailCard("Output shape", "How should it come back?", "Ask for bullets, a table, a short email, a summary box, or another structure that makes checking easier."),
        detailCard("Review cue", "What still needs a human check?", "Tell the model to separate facts, inference, assumptions, and any areas that still need validation."),
      ],
    },
    speakerNotes: noteLines(
      "Walk one real finance example through all five parts so the model becomes memorable.",
      "The simplest rule is to prompt like a capable colleague who still needs good instructions."
    ),
  },
  {
    id: "rheem-16-kc-missing",
    layout: "evidence",
    kicker: "01:13-01:18",
    title: "Knowledge check 2: What would you add to this prompt?",
    subtitle: 'Prompt on screen: "Write variance commentary."',
    bullets: [],
    sections: [],
    caption: "Ask what has to be added before the draft becomes useful for finance work.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Write variance commentary",
          "The raw prompt",
          "Let the room react to how little the model has been told. The point is not that the prompt is wrong, but that it is incomplete for finance work.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Prompt on screen",
          }
        ),
        detailCard(
          "What is missing before you would trust the draft?",
          "The question",
          "Participants should call out the missing ingredients before the answer slide lands.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Your call",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "Do not let the room answer with only one missing piece.",
      "The teaching point is that finance-ready prompts usually need context, audience, output shape, boundaries, and a review cue."
    ),
  },
  {
    id: "rheem-16a-kc-missing-answer",
    layout: "evidence",
    kicker: "01:13-01:18",
    title: "Knowledge check 2 answer: What is missing?",
    subtitle: "A finance-ready prompt adds five ingredients before the draft is worth reviewing.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Business context", "Anchor the task", "State the period, report, dataset, or business situation so the commentary is tied to something real.", undefined, undefined, undefined, {
          answerLabel: "Missing ingredient",
        }),
        detailCard("Audience", "Aim the draft correctly", "Say who will read it so the tone and detail level fit the audience from the start.", undefined, undefined, undefined, {
          answerLabel: "Missing ingredient",
        }),
        detailCard("Output format", "Shape the response", "Ask for a short executive summary, bullet points, a table, or another format that speeds review.", undefined, undefined, undefined, {
          answerLabel: "Missing ingredient",
        }),
        detailCard("Boundaries", "Limit what the model should infer", "Set scope, tone, and what should not be assumed so the model does not overreach.", undefined, undefined, undefined, {
          answerLabel: "Missing ingredient",
        }),
        detailCard("Review instructions", "Make checking easier", "Ask the model to separate facts, likely causes, and items that still need human validation.", undefined, undefined, undefined, {
          answerLabel: "Missing ingredient",
        }),
      ],
    },
    speakerNotes: noteLines(
      "This is the answer slide, not a list of options.",
      "Drive home the idea that the shortest prompt is not usually the most efficient prompt in finance work."
    ),
  },
  {
    id: "rheem-17-rtf",
    layout: "evidence",
    kicker: "01:18-01:23",
    title: "A simple pattern to remember: R-T-F",
    subtitle: "Role, task, and format are enough to lift most first-pass prompts.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Role", "Set the vantage point", "Example: act like a finance analyst preparing a concise month-end summary for a senior stakeholder."),
        detailCard("Task", "State the job clearly", "Use direct verbs such as compare, summarise, draft, rewrite, explain, or organise."),
        detailCard("Format", "Shape the return", "Ask for a table, bullet list, short narrative, or another structure that makes review easier."),
      ],
    },
    speakerNotes: noteLines(
      "R-T-F is not the only pattern, but it is easy to remember under pressure.",
      "Model one example live so people can hear how it sounds in practice."
    ),
  },
  {
    id: "rheem-18-weak-to-strong",
    layout: "split-2",
    kicker: "01:28-01:35",
    title: "Weak prompt vs stronger prompt",
    subtitle: "The same job changes quality fast once the request has structure.",
    bullets: [],
    sections: [
      {
        id: "rheem-18-weak",
        heading: "Weak prompt",
        bullets: [
          'Write variance commentary',
          "No period, report, or audience",
          "No expected output shape",
          "No cue for what still needs checking",
        ],
      },
      {
        id: "rheem-18-strong",
        heading: "Stronger prompt",
        bullets: [
          "Act like a finance analyst preparing commentary for the monthly CFO pack",
          "Use the attached variance table for March and the notes from business unit leads",
          "Draft four bullets plus a short driver table",
          "Separate confirmed facts, likely causes, and items to verify before sign-off",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Make the stronger prompt feel realistic, not perfect.",
      "The goal is to show what a usable first pass sounds like, not to create one magic sentence."
    ),
  },
  {
    id: "rheem-19-demo-policy",
    layout: "evidence",
    kicker: "01:35-01:42",
    title: "Demo 1: Turn a policy into a finance FAQ",
    subtitle: "A strong early use case because the draft is easy to inspect and easy to improve.",
    bullets: [
      "Translate a long policy into the questions the team actually asks",
      "Ask the model to flag ambiguity instead of hiding it",
      "Keep policy-owner review in the flow",
    ],
    sections: [],
    caption: "This is translation support, not policy approval.",
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard("Source document", "Long and formal", "Start with an approved policy or process document that the team is comfortable summarising."),
        detailCard("Key obligations", "Pull the essentials out", "Ask for the main responsibilities, timing, exceptions, and critical steps in plain language."),
        detailCard("Finance FAQ", "Make it usable", "Turn the result into likely questions and direct answers the team can navigate quickly."),
        detailCard("Owner review", "Keep the last check human", "The policy owner still checks accuracy, nuance, and whether anything important has been compressed away."),
      ],
    },
    speakerNotes: noteLines(
      "This scenario lands well because the value is obvious and the review step is natural.",
      "The human review step should sound like part of the design, not an afterthought."
    ),
  },
  {
    id: "rheem-20-demo-email",
    layout: "evidence",
    kicker: "01:42-01:49",
    title: "Demo 2: Draft a stakeholder update from rough notes",
    subtitle: "Use Copilot as a drafting partner and a clarity coach.",
    bullets: [
      "Start from rough facts, not perfect prose",
      "Refine for clarity, tone, and audience fit",
      "Check numbers, claims, and implied commitments before sending",
    ],
    sections: [],
    caption: "The audience test is simple: is the draft clearer, tighter, and safer to send?",
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard("Rough notes", "Use what you already have", "Start with the facts, open issues, and audience so the model is shaping real material instead of inventing context."),
        detailCard("First draft", "Get to structure faster", "Ask for a concise email with a clear opening, the main message, and any required asks or next steps."),
        detailCard("Rewrite pass", "Tune tone and sequence", "Use follow-up prompts to shorten, soften, sharpen, or better sequence the message for the audience."),
        detailCard("Human send check", "The last mile stays human", "Before it leaves finance, someone still checks numbers, claims, timing, and whether the wording creates unintended commitments."),
      ],
    },
    speakerNotes: noteLines(
      "This demo works because the value is immediately visible.",
      "People can usually tell within seconds whether the draft is clearer than what they would have written from scratch."
    ),
  },
  {
    id: "rheem-21-practice-loop",
    layout: "split-3",
    kicker: "01:49-01:57",
    title: "Practice loop: improve three real prompts",
    subtitle: "Observe, model, try, and debrief.",
    bullets: [],
    sections: [
      {
        id: "rheem-21-policy",
        heading: "Prompt 1",
        bullets: [
          "Policy Q&A",
          "Turn a long document into a usable first pass",
        ],
      },
      {
        id: "rheem-21-update",
        heading: "Prompt 2",
        bullets: [
          "Monthly update",
          "Aim it at the right audience and tone",
        ],
      },
      {
        id: "rheem-21-commentary",
        heading: "Prompt 3",
        bullets: [
          "Variance commentary",
          "Separate fact, inference, and checks still required",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Keep the exercise lightweight and practical.",
      "People do not need perfect prompts. They need prompts that are materially better than the first instinctive version."
    ),
  },
  {
    id: "rheem-22-kc-stronger-prompt",
    layout: "split-2",
    kicker: "01:57-02:02",
    title: "Knowledge check 3: Which prompt would you trust more?",
    subtitle: "Both ask for the same job. Only one sets the model up to help properly.",
    bullets: [],
    sections: [
      {
        id: "rheem-22-a",
        heading: "Prompt A",
        bullets: [
          "Write commentary for the CFO on this month's variances",
          "No table reference",
          "No output format",
          "No instruction on what still needs checking",
        ],
      },
      {
        id: "rheem-22-b",
        heading: "Prompt B",
        bullets: [
          "Act like a finance analyst preparing commentary for the monthly CFO pack",
          "Use the attached variance table for March and the notes from each business unit",
          "Draft four bullets and a short table of the top drivers",
          "Separate confirmed facts, likely causes, and items to verify before sign-off",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Ask the room which prompt they would trust more before you reveal the answer slide.",
      "The point is not length for its own sake. The point is better setup for both drafting and checking."
    ),
  },
  {
    id: "rheem-22a-kc-stronger-prompt-answer",
    layout: "evidence",
    kicker: "01:57-02:02",
    title: "Knowledge check 3 answer: Prompt B is stronger",
    subtitle: "It wins because it improves both the draft and the checking workflow.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Prompt A", "Short and vague", "Prompt A names the topic but leaves too much room for the model to guess the structure and level of confidence.", "Option", "A", undefined, {
          answerLabel: "Not strongest",
          answerState: "neutral",
        }),
        detailCard("Prompt B", "Clearer and safer", "Prompt B defines the role, inputs, audience, output shape, and validation cue, so the answer arrives closer to ready for human review.", "Option", "B", undefined, {
          answerLabel: "Strongest prompt",
          answerState: "correct",
        }),
        detailCard("Why it wins", "Review is easier", "A stronger prompt reduces cleanup and makes it clearer what the human still needs to verify before using the output.", "Reason", undefined, undefined, {
          answerLabel: "Reason",
          answerState: "supporting",
        }),
        detailCard("What to look for", "Use the same criteria every time", "Role, task, audience, output shape, and verification requirements are a reliable basis for comparing prompts.", "Checklist", undefined, undefined, {
          answerLabel: "Checklist",
          answerState: "supporting",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Make the evaluation criteria explicit so people can reuse it after the workshop.",
      "Prompt B is better because it makes the task easier to draft and easier to review."
    ),
  },
  {
    id: "rheem-23-validation",
    layout: "evidence",
    kicker: "02:02-02:08",
    title: "Validation and refinement",
    subtitle: "The first answer is a draft, not the finish line.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Check logic", "Does the response actually hold together?", "Look for weak causal claims, leaps in reasoning, or conclusions that are stronger than the inputs justify."),
        detailCard("Check facts", "Are the details right?", "Treat numbers, dates, named policies, and explicit claims as things to verify rather than trust automatically."),
        detailCard("Check fit", "Is this the right answer for this audience?", "A tidy answer can still be wrong if it is pitched to the wrong level, tone, or purpose."),
        detailCard("Refine next", "Improve the follow-up prompt", "If the answer is close, sharpen the next prompt instead of starting from zero and throwing away useful structure."),
      ],
    },
    speakerNotes: noteLines(
      "Iterative prompting should sound normal here, not like backtracking.",
      "Good users check, tighten, and rerun instead of assuming the first answer has to be perfect."
    ),
  },
  {
    id: "rheem-24-transition-hour-3",
    layout: "statement",
    kicker: "02:13-02:16",
    title: "Hour 3: Safe use and finance scenarios",
    titleLines: ["Hour 3", "Safe use and", "finance scenarios"],
    subtitle: "Better prompts matter, but they are only half the story.",
    bullets: [],
    sections: [],
    caption: "Move the room from output quality into risk judgement and workflow design.",
    speakerNotes: noteLines(
      "Use this transition to make the next point explicit: a better prompt does not remove the need for safe use.",
      "Finance adoption only sticks when prompting skill and judgement skill grow together."
    ),
  },
  {
    id: "rheem-25-governance",
    layout: "evidence",
    kicker: "02:16-02:22",
    title: "Safe use in finance starts with judgement",
    subtitle: "A polished answer is still risky if the task, inputs, or audience are wrong.",
    bullets: [
      "Know what should and should not be used",
      "Start from material you trust",
      "Check before the output travels",
      "Keep sign-off with people",
    ],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Task fit", "Choose the right job", "Not every finance task should go near Copilot. Safe use starts with picking the right job, not just using the feature."),
        detailCard("Input quality", "Feed it reliable material", "A polished answer built on weak notes, mismatched data, or stale documents is still weak."),
        detailCard("Review discipline", "Check before use", "Numbers, claims, tone, and sensitive content all need a human pass before the output becomes action."),
        detailCard("Human accountability", "Approval never transfers", "Copilot can accelerate drafting and analysis support, but it does not own approval, escalation, or final judgement."),
      ],
    },
    speakerNotes: noteLines(
      "Keep this grounded in everyday finance behaviour rather than abstract policy language.",
      "The team should hear that safe use is what enables adoption, not what slows it down."
    ),
  },
  {
    id: "rheem-26-traps",
    layout: "evidence",
    kicker: "02:22-02:28",
    title: "Four traps that catch smart teams",
    subtitle: "Plausible output still needs disciplined review.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Confidence trap", "It sounds polished, so it feels correct", "Style is not evidence. A clean answer can still be unsupported, incomplete, or aimed at the wrong audience."),
        detailCard("Guessing trap", "The model fills gaps too smoothly", "When inputs are thin, the model may invent connective tissue that sounds reasonable but has not been verified."),
        detailCard("Speed trap", "Fast output feels like progress", "Teams can start moving drafts along too quickly when the answer arrives in a polished format."),
        detailCard("Single-reviewer trap", "One person does not challenge the draft", "Sensitive or high-impact outputs improve when another reviewer or owner pressure-tests the result before it travels."),
      ],
    },
    speakerNotes: noteLines(
      "Ask which trap feels most likely in the room's own workflow.",
      "The goal is to make safe use feel like an operating habit rather than a warning label."
    ),
  },
  {
    id: "rheem-27-kc-human-check",
    layout: "evidence",
    kicker: "02:28-02:33",
    title: "Knowledge check 4: Which checks never leave the human?",
    subtitle: "Pick the checks that stay human even when Copilot helps with the draft.",
    bullets: [],
    sections: [],
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Numbers and facts", "Always check", "Any output that influences reporting, planning, or escalation still needs a person to verify the underlying detail.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 1",
        }),
        detailCard("Audience fit", "Always check", "A technically correct answer can still be wrong for the room, tone, or level of detail it is pitched at.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 2",
        }),
        detailCard("Sensitive content", "Always check", "Someone still needs to decide whether the task, the handling, and the destination are appropriate.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 3",
        }),
        detailCard("Final sign-off", "Always human-owned", "Approval and accountability stay with the finance team even when Copilot accelerated the first pass.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 4",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Let the room answer it first, then use the answer slide to make the obvious point explicit.",
      "By now the room should feel that these checks belong to people by design."
    ),
  },
  {
    id: "rheem-27a-kc-human-check-answer",
    layout: "evidence",
    kicker: "02:28-02:33",
    title: "Knowledge check 4 answer: All four stay human-owned",
    subtitle: "The answer is all four, even when Copilot helps with the first draft.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Numbers and facts", "Always check", "Any output that influences reporting, planning, or escalation still needs a person to verify the underlying detail.", undefined, undefined, undefined, {
          answerLabel: "Human check",
        }),
        detailCard("Audience fit", "Always check", "A technically correct answer can still be wrong for the room, tone, or level of detail it is pitched at.", undefined, undefined, undefined, {
          answerLabel: "Human check",
        }),
        detailCard("Sensitive content", "Always check", "Someone still needs to decide whether the task, the handling, and the destination are appropriate.", undefined, undefined, undefined, {
          answerLabel: "Human check",
        }),
        detailCard("Final sign-off", "Always human-owned", "Approval and accountability stay with the finance team even when Copilot accelerated the first pass.", undefined, undefined, undefined, {
          answerLabel: "Human-owned",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Do not overcomplicate this answer slide.",
      "The message is simple: better drafts do not change who owns these checks."
    ),
  },
  {
    id: "rheem-28-security-trimming",
    layout: "evidence",
    kicker: "02:33-02:39",
    title: "Permissions still shape what Copilot can see",
    subtitle: "Copilot works inside the access model people already have.",
    bullets: [
      "Different users can get different answers",
      "Poor permissions stay poor permissions",
      "Copilot can expose oversharing that was already sitting there",
    ],
    sections: [],
    visual: {
      variant: "permissions-funnel",
      items: [
        detailCard("Organisation controls", "The outer guardrail", "Tenant and policy settings shape what the environment allows and how information should be handled."),
        detailCard("User permissions", "Who is allowed to access what", "Copilot cannot rescue an access model that is already broader than it should be."),
        detailCard("Available content", "What the user can reach right now", "The quality and scope of the answer depend on the files, sites, and material the user is allowed to see."),
        detailCard("Generated result", "What appears in the response", "What comes back is still shaped by access, by input quality, and by how the user framed the task."),
      ],
    },
    speakerNotes: noteLines(
      "Keep this conceptual rather than technical.",
      "The useful point is that Copilot follows the environment; it does not magically fix permissions problems."
    ),
  },
  {
    id: "rheem-29-oversharing",
    layout: "split-2",
    kicker: "02:39-02:45",
    title: "Oversharing risk and least privilege",
    subtitle: "The safer path is disciplined access, not blind confidence.",
    bullets: [],
    sections: [
      {
        id: "rheem-29-risk",
        heading: "Where the risk begins",
        bullets: [
          "Access is broader than it needs to be",
          "Shared sites and links are harder to govern than people realise",
          "Sensitive finance content lives in places too many people can reach",
        ],
      },
      {
        id: "rheem-29-response",
        heading: "What better looks like",
        bullets: [
          "Review access before scaling usage",
          "Tighten permissions to the people who genuinely need them",
          "Treat least privilege as an adoption enabler, not a blocker",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Use one concrete example so the risk feels real.",
      "The audience should leave seeing least privilege as part of better adoption, not as separate from it."
    ),
  },
  {
    id: "rheem-30-governance-stack",
    layout: "evidence",
    kicker: "02:45-02:51",
    title: "Controls that make adoption more credible",
    subtitle: "Sensitivity labels, DLP, retention, and monitoring exist so teams can move faster with less regret.",
    bullets: [],
    sections: [],
    visual: {
      variant: "governance-stack",
      items: [
        detailCard("Sensitivity labels", "Signal and protect critical content", "Labels help people recognise what they are handling and can enforce the treatment expected for confidential material."),
        detailCard("DLP policies", "Reduce risky movement of data", "These controls help stop sensitive information moving in the wrong way or to the wrong place."),
        detailCard("Retention and records", "Keep the right trail", "Copilot-assisted work still sits inside broader record, audit, and evidence expectations."),
        detailCard("Monitoring and acceptable use", "Make the rules visible", "Control is strongest when users understand what is expected and leaders reinforce those boundaries consistently."),
      ],
    },
    speakerNotes: noteLines(
      "People do not need platform depth here.",
      "They do need to understand that real controls exist and that those controls are part of why broader use can be trusted."
    ),
  },
  {
    id: "rheem-31-kc-governance-mini-case",
    layout: "evidence",
    kicker: "02:51-02:56",
    title: "Knowledge check 5: A confidential document lands in Copilot",
    subtitle: "A user wants a summary of a highly confidential file. What should happen next?",
    bullets: [],
    sections: [],
    caption: "Discuss the scenario first, then reveal the path you would want a strong team to follow.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Summarise a highly confidential file", "The scenario", "A user asks Copilot to summarise material that sits at the sensitive end of finance work.", undefined, undefined, undefined, {
          audienceEyebrow: "Scenario",
        }),
        detailCard("What would you check before the task proceeds?", "Your decision", "The right answer is a sequence of governance checks, not an instinctive yes.", undefined, undefined, undefined, {
          audienceEyebrow: "Think it through",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Keep this as a real scenario, not a multiple-choice trivia card.",
      "The answer slide should feel like a professional path rather than a reveal."
    ),
  },
  {
    id: "rheem-31a-kc-governance-mini-case-answer",
    layout: "evidence",
    kicker: "02:51-02:56",
    title: "Knowledge check 5 answer: Use a five-check path",
    subtitle: "The right move is to verify the task before it proceeds, and escalate when the checks do not clear.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "decision-gates",
      items: [
        detailCard("Confirm permission", "Does this person have the right access?", "Start with whether the user should be working with this material at all.", "Step"),
        detailCard("Confirm sensitivity", "How tightly is the content protected?", "Check labels, handling expectations, and whether the task fits the material.", "Step"),
        detailCard("Confirm audience", "Who will see the output?", "A task that is acceptable for one audience may be unacceptable for another.", "Step"),
        detailCard("Decide if it should proceed", "Not every valid access means valid use", "Pause if the task is unnecessary, poorly framed, or likely to move sensitive information in the wrong way.", "Step"),
        detailCard("Escalate when unclear", "Do not improvise on confidential work", "If anything about the task, handling, or destination feels wrong, stop and escalate rather than guessing.", "Step"),
      ],
    },
    speakerNotes: noteLines(
      "Make the fifth check explicit: sometimes the right answer is not to proceed.",
      "This is what good governance looks like in practice, not in policy language."
    ),
  },
  {
    id: "rheem-32-use-case-analysis",
    layout: "capabilities",
    kicker: "02:56-03:03",
    title: "Finance use case 1: analysis and reporting",
    subtitle: "Structured support is strongest when it gives analysts more time for interpretation and action.",
    bullets: [
      "Use it to explain, compare, summarise, and structure",
      "Keep final interpretation with the analyst",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Spreadsheet support", "Explain formulas and speed repetitive prep", "Copilot can help unpack formulas, suggest structure, and reduce the time spent on low-value spreadsheet friction."),
        detailCard("Model and DAX help", "Get unstuck faster", "It can support exploration and explain logic while the analyst still validates the measure, filter, and output."),
        detailCard("Reporting summaries", "Move faster from pack to story", "Dense reporting decks and monthly packs can be turned into a tighter first-pass narrative for human review."),
        detailCard("Insight framing", "Create room for thinking", "The real gain is not typing less. It is having more attention left for interpretation, decision support, and action."),
      ],
    },
    speakerNotes: noteLines(
      "This cluster works because it is familiar, structured, and reviewable.",
      "Keep saying out loud that speed only counts when the analysis remains trustworthy."
    ),
  },
  {
    id: "rheem-33-use-case-reconciliation",
    layout: "evidence",
    kicker: "03:03-03:10",
    title: "Finance use case 2: reconciliation and variance",
    subtitle: "A strong example of AI support inside a real finance workflow.",
    bullets: [
      "Map categories across mismatched data sources",
      "Surface exceptions faster",
      "Draft an investigation view for human review",
    ],
    sections: [],
    caption: "The draft accelerates investigation. It does not replace the team's judgement.",
    visual: {
      variant: "reconciliation-workflow",
      items: [
        detailCard("Ledger extract", "Finance source", "The base ledger usually arrives with its own labels, timing, and coding assumptions.", "Input"),
        detailCard("Comparison file", "Secondary source", "The supporting source often uses different language or structure, which makes a clean comparison slower than it should be.", "Input"),
        detailCard("Map and compare", "Normalise the categories", "Copilot can help line up categories, highlight mismatches, and structure an exception list for review.", "Engine"),
        detailCard("Draft exception view", "Show where to investigate", "The first-pass output should point to the key discrepancies and what may explain them without pretending the work is finished.", "Output"),
        detailCard("Review and resolve", "Human judgement stays here", "The finance team still checks the records, confirms the cause, and decides what action or escalation is needed.", "Human"),
      ],
    },
    speakerNotes: noteLines(
      "This is one of the strongest finance-specific scenarios because it sits inside a real workflow rather than a generic productivity example.",
      "Narrate how AI helps align, summarise, and prioritise without ever owning the final interpretation."
    ),
  },
  {
    id: "rheem-34-use-case-meetings",
    layout: "capabilities",
    kicker: "03:10-03:16",
    title: "Finance use case 3: meetings, communications, and follow-through",
    subtitle: "Finance work is not only numbers. It is also explanation, coordination, and follow-up.",
    bullets: [
      "Recap the conversation",
      "Capture owners and next steps",
      "Turn notes into clear communication",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Meeting recap", "Compress the conversation", "Summaries help people who were present move faster and people who were absent catch up without chasing context."),
        detailCard("Action tracker", "Make owners visible", "Structured follow-up is one of the easiest ways to turn meeting notes into operational value."),
        detailCard("Drafted updates", "Turn notes into shareable language", "Copilot can move rough notes toward crisp narrative without asking someone to start from zero."),
        detailCard("Audience tuning", "Match the message to the reader", "Finance work often needs translation across leaders, business partners, and operational teams."),
      ],
    },
    speakerNotes: noteLines(
      "Expand the mental model beyond spreadsheets.",
      "The strongest teams use Copilot to support explanation and coordination as well as analysis."
    ),
  },
  {
    id: "rheem-35-demo-walkthrough",
    layout: "evidence",
    kicker: "03:16-03:24",
    title: "Demo 3: one end-to-end finance workflow",
    subtitle: "Prompting, review, and judgement have to work together in one flow.",
    bullets: [
      "Choose one scenario stack",
      "Narrate each handoff clearly",
      "Make the human checkpoints explicit",
    ],
    sections: [],
    caption: "The goal is not magic. The goal is a repeatable working pattern.",
    visual: {
      variant: "workflow-evolution",
      items: [
        detailCard("Set the task", "Start from context", "Give the model the scenario, the audience, the working material, and the job that needs to be done."),
        detailCard("Create the draft", "Ask for structure", "Shape the answer into an output that is easy for a finance reviewer to check."),
        detailCard("Review the draft", "Pause on the risk points", "Check numbers, logic, assumptions, tone, and anything that could create a misleading next step."),
        detailCard("Move the work forward", "Use it with judgement", "Only after review should the draft become a message, a report section, or a decision-support input."),
      ],
    },
    speakerNotes: noteLines(
      "The full flow matters more than the single prompt.",
      "Keep repeating that prompting, checking, and judgement are one pattern, not three separate ideas."
    ),
  },
  {
    id: "rheem-36-kc-risk-match",
    layout: "split-2",
    kicker: "03:24-03:29",
    title: "Knowledge check 6: Match the risk to the scenario",
    subtitle: "Different finance tasks fail in different ways.",
    bullets: [],
    sections: [
      {
        id: "rheem-36-scenarios",
        heading: "Scenarios to match",
        bullets: [
          "Policy summary",
          "Variance commentary",
          "Reconciliation review",
          "Stakeholder email",
        ],
      },
      {
        id: "rheem-36-risks",
        heading: "Possible risk checks",
        bullets: [
          "Ambiguity and owner review",
          "Numeric and inference check",
          "Data alignment and permissions",
          "Tone and unsupported claims",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Give the room a beat to match them mentally before you move to the answer slide.",
      "The teaching point is that review discipline changes with the workflow."
    ),
  },
  {
    id: "rheem-36a-kc-risk-match-answer",
    layout: "evidence",
    kicker: "03:24-03:29",
    title: "Knowledge check 6 answer: The risk changes with the workflow",
    subtitle: "Each scenario has a different main review pressure to watch for.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Policy summary", "Ambiguity + owner review", "The main risk is losing nuance or misreading the policy unless the right owner reviews the output.", undefined, undefined, undefined, {
          answerLabel: "Resolved match",
        }),
        detailCard("Variance commentary", "Numeric + inference check", "The pressure point is sounding more certain than the numbers and explanations can support.", undefined, undefined, undefined, {
          answerLabel: "Resolved match",
        }),
        detailCard("Reconciliation review", "Data alignment + permissions", "The risk is treating mismatched categories or restricted content as if the comparison is already clean.", undefined, undefined, undefined, {
          answerLabel: "Resolved match",
        }),
        detailCard("Stakeholder email", "Tone + unsupported claims", "The danger is promising too much, implying certainty too early, or pitching the wrong tone for the audience.", undefined, undefined, undefined, {
          answerLabel: "Resolved match",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Use this answer slide to reinforce that good review is scenario-specific.",
      "The right check depends on the work, not just on the tool."
    ),
  },
  {
    id: "rheem-37-transition-hour-4",
    layout: "statement",
    kicker: "03:29-03:32",
    title: "Hour 4: From examples to a first pilot",
    titleLines: ["Hour 4", "From examples to", "a first pilot"],
    subtitle: "Examples are useful. Adoption starts when the team can choose where to begin.",
    bullets: [],
    sections: [],
    caption: "Shift the room from interesting use cases to a credible first move.",
    speakerNotes: noteLines(
      "This is where the workshop becomes operationally useful.",
      "The room now needs a better filter for what deserves to go first."
    ),
  },
  {
    id: "rheem-38-process-opportunity",
    layout: "evidence",
    kicker: "03:32-03:38",
    title: "From business process to AI opportunity",
    subtitle: "Good first pilots are repetitive, contained, and easy to evaluate.",
    bullets: [],
    sections: [],
    visual: {
      variant: "roadmap-timeline",
      items: [
        detailCard("Find repeated work", "Look for a recurring task", "The best pilot usually sits inside work that already happens often enough to be worth improving."),
        detailCard("Inspect the inputs", "Know what the task runs on", "Document-heavy and pattern-based tasks are stronger when the inputs are already easy to identify."),
        detailCard("Place the support point", "Choose where Copilot helps", "Pick the point where drafting, summarising, comparing, or organising would create a real lift."),
        detailCard("Keep the control point", "Name where the human stays in charge", "The most credible pilots keep a clear validation or approval step in the design from day one."),
      ],
    },
    speakerNotes: noteLines(
      "Walk the room from task to input to support point to control point.",
      "The best first pilot is not the fanciest. It is the one the team can run and evaluate cleanly."
    ),
  },
  {
    id: "rheem-39-process-map",
    layout: "evidence",
    kicker: "03:38-03:45",
    title: "A lightweight worksheet for pilot design",
    subtitle: "A simple structure is enough to surface a credible first test.",
    bullets: [],
    sections: [],
    visual: {
      variant: "worksheet-flow",
      items: [
        detailCard("Task", "What recurring work are we mapping?", "Name the finance task in one sentence so the room is solving the same problem."),
        detailCard("Inputs", "What material does it depend on?", "List the reports, notes, policies, or datasets the task needs."),
        detailCard("Pain point", "Where does the current workflow drag?", "Capture the friction that makes the task slow, unclear, repetitive, or inconsistent."),
        detailCard("Support point", "Where could Copilot help?", "Identify the point where drafting, summarising, comparing, or organising would add real value."),
        detailCard("Human control point", "Where does judgement stay?", "Make the review, approval, or escalation step explicit so the pilot stays safe."),
        detailCard("Success signal", "How will we know it worked?", "Choose one or two signs of success before the pilot starts."),
      ],
    },
    speakerNotes: noteLines(
      "Keep the worksheet simple.",
      "The room is not doing full transformation design here. The value is surfacing a candidate pilot with clear control points."
    ),
  },
  {
    id: "rheem-40-group-exercise",
    layout: "evidence",
    kicker: "03:45-03:55",
    title: "Group exercise: map one finance workflow",
    subtitle: "Choose a workflow where Copilot can help without weakening judgement or controls.",
    bullets: [
      "Month-end commentary",
      "Policy Q&A",
      "Reconciliation review",
      "Stakeholder updates",
    ],
    sections: [],
    caption: "Seven minutes to map. Three minutes to report back.",
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Month-end commentary", "Narrative plus review", "A strong candidate when the team already knows the material and wants a faster path to a good first draft."),
        detailCard("Policy Q&A", "Grounded explanation", "A strong candidate when the team needs faster access to approved knowledge with clear owner review."),
        detailCard("Reconciliation review", "Faster issue triage", "A strong candidate when mismatches are repetitive and the team can validate the comparison logic quickly."),
        detailCard("Stakeholder updates", "Clearer communication", "A strong candidate when the pain is drafting speed, structure, and tone rather than final approval."),
      ],
    },
    speakerNotes: noteLines(
      "Ask the room to choose one workflow and fill in the worksheet.",
      "Keep the discussion anchored to value plus control, not novelty."
    ),
  },
  {
    id: "rheem-41-kc-pilot",
    layout: "evidence",
    kicker: "04:02-04:08",
    title: "Knowledge check 7: Which two are the strongest first pilots?",
    subtitle: "Pick the options that are repetitive, reviewable, and easy to govern.",
    bullets: [],
    sections: [],
    caption: "Ask which candidate is strongest and why before showing the scorecard.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "pilot-scorecard",
      items: [
        detailCard(
          "Draft monthly commentary",
          "Reviewable and repeatable",
          "A strong first pilot because the inputs are known, the draft is easy to inspect, and the human sign-off point is clear.",
          "Candidate",
          "Strong first pilot",
          88,
          {
            audienceEyebrow: "Candidate 1",
          }
        ),
        detailCard(
          "Automate sign-off decisions",
          "High risk and low trust",
          "This is a poor first pilot because it hands too much judgement away before the team has earned trust in the workflow.",
          "Candidate",
          "Weak first pilot",
          18,
          {
            audienceEyebrow: "Candidate 2",
          }
        ),
        detailCard(
          "Policy Q&A assistant",
          "Contained and useful",
          "A strong first pilot when the content is approved, access is clear, and the owner review pattern is defined.",
          "Candidate",
          "Strong first pilot",
          82,
          {
            audienceEyebrow: "Candidate 3",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "The right answer is two strong pilots, not one.",
      "The room should hear clearly that automating sign-off is the wrong first move."
    ),
  },
  {
    id: "rheem-41a-kc-pilot-answer",
    layout: "evidence",
    kicker: "04:02-04:08",
    title: "Knowledge check 7 answer: Start with the reviewable work",
    subtitle: "Monthly commentary and policy Q&A are stronger first pilots than anything that tries to automate approval.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "pilot-scorecard",
      items: [
        detailCard(
          "Draft monthly commentary",
          "Reviewable and repeatable",
          "A strong first pilot because the inputs are known, the draft is easy to inspect, and the human sign-off point is clear.",
          "Candidate",
          "Strong first pilot",
          88,
          {
            answerLabel: "Strong first pilot",
            answerState: "correct",
          }
        ),
        detailCard(
          "Automate sign-off decisions",
          "High risk and low trust",
          "This is a poor first pilot because it hands too much judgement away before the team has earned trust in the workflow.",
          "Candidate",
          "Weak first pilot",
          18,
          {
            answerLabel: "Weak first pilot",
            answerState: "neutral",
          }
        ),
        detailCard(
          "Policy Q&A assistant",
          "Contained and useful",
          "A strong first pilot when the content is approved, access is clear, and the owner review pattern is defined.",
          "Candidate",
          "Strong first pilot",
          82,
          {
            answerLabel: "Strong first pilot",
            answerState: "correct",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "Use this answer slide to reinforce the pilot filter one more time.",
      "The wrong first move is anything that tries to automate judgement or approval before trust exists."
    ),
  },
  {
    id: "rheem-42-adoption",
    layout: "capabilities",
    kicker: "04:08-04:15",
    title: "Adoption sticks when teams learn together",
    subtitle: "Momentum grows when teams test, share, and coach each other on real work.",
    bullets: [
      "Build the baseline",
      "Test on real work",
      "Share what works",
      "Create local champions",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "adoption-loop",
      items: [
        detailCard("Build the baseline", "Shared language first", "The team needs a common baseline before prompt quality and pilot quality can improve together."),
        detailCard("Test on real work", "Use the tool in the flow", "Small, repeatable experiments build better judgement than abstract conversations alone."),
        detailCard("Share prompts and examples", "Reuse what works", "Wins become scalable when the team captures strong prompts, reviewed outputs, and caution points."),
        detailCard("Coach peers", "Champions keep momentum alive", "Office hours, short reviews, and peer support help the habit stick after the workshop ends."),
      ],
    },
    speakerNotes: noteLines(
      "Ask participants to name one thing they will test this week.",
      "The adoption loop matters because a single workshop is not enough by itself."
    ),
  },
  {
    id: "rheem-43-wrap",
    layout: "closing",
    kicker: "04:15-04:20",
    title: "Final check and wrap",
    subtitle: "Copilot helps most when the task is clear, the review step is strong, and the human stays firmly in the loop.",
    bullets: [
      "Start with repetitive, contained, reviewable work",
      "Prompt with context, task, format, and boundaries",
      "Check facts, numbers, audience fit, and sensitive content before use",
      "Pick one pilot, one prompt, and one check step for next week",
    ],
    sections: [],
    caption: "Close by asking each participant to write down one use case, one prompt, and one review step.",
    visual: {
      variant: "closing-orbit",
      items: [
        { label: "Prompt well" },
        { label: "Review well" },
        { label: "Pilot wisely" },
        { label: "Share wins" },
      ],
    },
    speakerNotes: noteLines(
      "Use the wrap to consolidate the whole day in one sentence: better prompts plus stronger judgement equals better use.",
      "Close on clear next steps, not just a recap."
    ),
  },
  {
    id: "rheem-44-appendix-patterns",
    layout: "evidence",
    kicker: "Appendix",
    title: "Two prompt patterns for more complex work",
    subtitle: "Optional depth for higher-stakes tasks that need more scaffolding than R-T-F.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "R-I-S-E",
          "Role, Input, Steps, Expectation",
          "Useful when the task needs a stronger step-by-step structure than a simple first-pass request."
        ),
        detailCard(
          "C-R-E-A-T-E",
          "Context, Requirements, Expectations, Audience, Tone, Examples",
          "Useful when the task is more complex, high-stakes, or especially sensitive to audience and examples."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Keep this in the appendix as stretch material rather than a required framework.",
      "R-T-F gets most people moving. These patterns help when more scaffolding is needed."
    ),
  },
  {
    id: "rheem-45-appendix-prompt-library",
    layout: "evidence",
    kicker: "Appendix",
    title: "Prompt library habits",
    subtitle: "Saved prompts turn one workshop into repeatable team capability.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Keep the good ones", "Do not rewrite from zero every time", "Save high-quality prompts for recurring finance workflows instead of reinventing them under deadline pressure."),
        detailCard("Share examples", "Make success visible", "Teams learn faster when strong prompts and reviewed outputs are easy to find and easy to copy."),
        detailCard("Capture the edits", "Save the judgement, not just the words", "Record why a prompt improved so the next person inherits the reasoning as well as the phrasing."),
      ],
    },
    speakerNotes: noteLines(
      "This slide is about reinforcement after the session.",
      "The more reusable the prompts become, the faster confidence builds."
    ),
  },
  {
    id: "rheem-46-appendix-assistant",
    layout: "evidence",
    kicker: "Appendix",
    title: "A lightweight knowledge assistant concept",
    subtitle: "A grounded assistant works best when the content, access model, and owner review are already clear.",
    bullets: [
      "Best suited to policy and process Q&A",
      "Needs approved content and clear ownership",
      "Should stay within licensing, access, and content-quality constraints",
    ],
    sections: [],
    visual: {
      variant: "systems-stack",
      items: [
        detailCard("Approved content", "Trusted knowledge base", "Start with content the organisation is comfortable grounding answers on.", "Layer"),
        detailCard("Access model", "Right people, right reach", "The assistant should respect the same permissions discipline as the rest of the environment.", "Layer"),
        detailCard("Constrained response", "Useful without overclaiming", "Good answers should point people to the right guidance without pretending to own final approval.", "Layer"),
        detailCard("Owner escalation", "Know when a person must step in", "The assistant is strongest when it knows when a policy owner or reviewer needs to take over.", "Layer"),
      ],
    },
    speakerNotes: noteLines(
      "Present this as a concept, not a promise of instant deployment.",
      "The main idea is grounded assistance for approved content, with clear access and clear escalation paths."
    ),
  },
];

export const createRheemPressoProjectContent = (): ProjectDocumentContent => ({
  mode: "project",
  projectVariant: "presentation",
  quoteId: RHEEMPRESSO_PROJECT_CODE,
  logoUrl: RHEEM_PROJECT_PDF_LOGO_URL,
  issuedOn: "2026-04-11",
  validUntil: "2026-12-31",
  introText:
    "A tailored Microsoft 365 Copilot workshop deck for the Rheem Australia Finance Team.",
  notes:
    "Designed as a hidden presentation experience with fullscreen desktop presenting and an optional paired mobile remote.",
  terms:
    "Shared as a hidden studio presentation. The Rheem proposal remains available separately under the standard project code.",
  acceptanceLine: "",
  currency: "AUD",
  gstMode: "exclusive",
  brochureFooterNote: "",
  supportingDocsText: "",
  supportingDownloads: [],
  referenceBrochureMarkdown: "",
  generatedBrochureMarkdown: "",
  lastGeneratedAt: "",
  referenceSource: "override",
  presentation: {
    remoteEnabled: true,
    publicSessionId: "PUBLIC",
    theme: "rheem-red",
    branding: {
      speakerName: "Rushi Vyas",
      website: "rushi.knowwhatson.com",
      tagline: "Human + Business + AI = Intelligence",
      footerMode: "all",
    },
    slides: RHEEMPRESSO_SLIDES,
  },
  defaultSelectedBaseIds: [],
  defaultSelectedAddOnIds: [],
  recommendedTimeline: undefined,
  baseOptions: [],
  addOnOptions: [],
  bundleOptions: [],
  quoteLineOverrides: [],
  libraryMeta: EMPTY_LIBRARY_META,
});

export const createRheemPressoProjectDocumentSeed = (): StudioDocument => ({
  kind: "project",
  code: RHEEMPRESSO_PROJECT_CODE,
  status: "published",
  title: RHEEMPRESSO_PROJECT_TITLE,
  clientName: RHEEMPRESSO_PROJECT_CLIENT,
  clientCompany: RHEEMPRESSO_PROJECT_CLIENT,
  clientEmail: "",
  ctaLabel: "Email Rushi",
  adminEmail: "rushi@knowwhatson.com",
  content: createRheemPressoProjectContent(),
});

export const isRheemPressoProjectPublicCode = (code: string) =>
  code.trim().toUpperCase() === RHEEMPRESSO_PROJECT_CODE;

export const RHEEMPRESSO_PROJECT_CARD_LOGO_URL = RHEEM_PROJECT_CARD_LOGO_URL;
