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
    id: "rheem-00-countdown",
    layout: "countdown",
    countdown: {
      targetAt: "2026-04-22T11:00:00+10:00",
      timeZone: "Australia/Sydney",
      autoAdvance: true,
      showTargetLabel: false,
    },
    kicker: "Rheem Australia · RHEEMPRESSO",
    title: "Microsoft 365 Copilot for the Finance Team",
    titleLines: ["Microsoft 365 Copilot", "for the Finance Team"],
    bullets: [],
    sections: [],
    speakerNotes: noteLines(
      "This opening slide counts down to the Rheem session start at 11:00 AM Sydney time on 22 April 2026.",
      "The deck advances automatically into the title slide when the countdown reaches zero."
    ),
  },
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
    subtitle: "The work is recurring, review-heavy, and often starts with messy inputs.",
    bullets: [
      "Month-end packs, commentary, and forecast updates keep asking for a first draft",
      "Manual Excel prep, SAP drill-down, and reconciliations create repeatable friction",
      "The lift comes from better starting structure while judgement stays with finance",
    ],
    sections: [],
    caption: "Ask the room which of these four workflows still feels the most manual today.",
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard(
          "Reporting packs",
          "Recurring commentary starts from zero too often",
          "Monthly updates, board packs, and management commentary ask for the same narrative shape every cycle."
        ),
        detailCard(
          "Forecasting support",
          "Scenario work needs structure before judgement",
          "Copilot can help organise assumptions, comparisons, and first-pass explanations without making the decision."
        ),
        detailCard(
          "Reconciliation review",
          "Exceptions are repetitive before they are insightful",
          "The early work is often matching, summarising, and triaging mismatches before the analyst can investigate properly."
        ),
        detailCard(
          "Excel and data prep",
          "Low-value friction steals time from analysis",
          "Formatting extracts, tracing formulas, and stitching inputs together still absorb time that should go into interpretation."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Frame the opportunity as time returned to analysis and review quality, not as automation for its own sake.",
      "Use this slide to anchor the session in the workflows the team actually repeats every month."
    ),
  },
  {
    id: "rheem-03-pulse-check",
    layout: "evidence",
    kicker: "00:10-00:15",
    title: "What the room asked for before we started",
    subtitle: "The survey says: keep it practical, finance-specific, and safe.",
    bullets: [
      "Most people have already tried Copilot, but confidence is still mixed",
      "The room wants real reporting, forecasting, and reconciliation examples",
      "Accuracy, privacy, and governance matter more than hype",
    ],
    sections: [],
    caption: "Use this snapshot to show that the session is built around the team's own priorities.",
    callouts: [
      { value: "9", label: "Use Copilot regularly" },
      { value: "4", label: "Use it occasionally" },
      { value: "3", label: "Have only tried it lightly" },
    ],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Reporting and monthly updates",
          "Top requested example",
          "11 respondents want pack, commentary, and monthly reporting examples anchored in real finance work."
        ),
        detailCard(
          "Forecasting and scenario analysis",
          "Second strongest request",
          "8 respondents want help structuring assumptions, comparisons, and scenario thinking."
        ),
        detailCard(
          "Reconciliations and exceptions",
          "High-priority workflow",
          "6 respondents want faster exception handling, variance explanation, and review support."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Make it clear that the deck was tuned to what the team actually asked for.",
      "This is a useful place to say out loud that the room wants practical proof, not a generic productivity talk."
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
    stageDisplay: NO_CAPABILITY_SUMMARY,
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
    title: "Knowledge check 1: Which mode would you choose first?",
    subtitle: "Some tasks need drafting support, some need challenge, and some stay human-owned.",
    bullets: [],
    sections: [],
    caption: "Ask the room to place each scenario before you reveal the mode.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard(
          "Draft month-end commentary",
          "Support draft",
          "The analyst already owns the story and review path, so the value is a faster first pass rather than a delegated judgement call.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 1",
          }
        ),
        detailCard(
          "Pressure-test a forecast",
          "Challenge draft",
          "This is about probing assumptions, surfacing downside cases, and sharpening discussion before leaders commit to a view.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 2",
          }
        ),
        detailCard(
          "Summarise a policy change",
          "Translation draft",
          "This can be useful support work if the policy owner still checks nuance, scope, and audience fit before the team relies on it.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Scenario 3",
          }
        ),
        detailCard(
          "Approve a revenue exception",
          "Decision ownership",
          "Copilot can organise background material, but the approval itself stays with the person who owns the commercial and control judgement.",
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
      "The room should hear that support mode, challenge mode, and final judgement are not interchangeable."
    ),
  },
  {
    id: "rheem-08a-copilot-or-cothinker-answer",
    layout: "evidence",
    kicker: "00:35-00:40",
    title: "Knowledge check 1 answer: Choose the right mode",
    subtitle: "Support, challenge, and final judgement are not the same kind of work.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard(
          "Draft month-end commentary",
          "Support draft",
          "This is classic Co-Pilot territory because the output shape is known and the human review point is clear.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Pilot",
          }
        ),
        detailCard(
          "Pressure-test a forecast",
          "Challenge draft",
          "This leans Co-Thinker because the real value is in testing assumptions, surfacing alternatives, and sharpening judgement.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Thinker",
          }
        ),
        detailCard(
          "Summarise a policy change",
          "Translation draft",
          "This still leans Co-Pilot because the task is translation and structuring, not deciding what the policy means without owner review.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Co-Pilot",
          }
        ),
        detailCard(
          "Approve a revenue exception",
          "Decision ownership",
          "Copilot can inform the discussion, but the approval itself stays human because accountability and escalation sit with finance leaders.",
          undefined,
          undefined,
          undefined,
          {
            answerLabel: "Human-owned call",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "Use the answer slide to make the distinction feel practical rather than theoretical.",
      "The room should be able to name when they want drafting help, challenge help, or no delegation of judgement at all."
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
      "Policy and document digestion",
      "Reporting commentary",
      "Reconciliation triage",
      "Stakeholder updates",
    ],
    sections: [],
    caption: "The goal is not to chase a headline metric. It is to spot where time and focus can genuinely come back to the team.",
    visual: {
      variant: "impact-compare",
      items: [
        { label: "Policy/document digestion", value: "Faster", note: "Less time spent extracting what matters", metric: 62 },
        { label: "Reporting commentary", value: "Cleaner start", note: "Less blank-page effort before review", metric: 62 },
        { label: "Reconciliation triage", value: "Earlier focus", note: "Exceptions surface sooner for investigation", metric: 62 },
        { label: "Stakeholder updates", value: "Sharper handoff", note: "Drafts move toward audience-ready language faster", metric: 62 },
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
    subtitle: "These are the workflows Rheem finance asked to see in the session.",
    bullets: [
      "Stay close to repeatable and reviewable work",
      "Use examples the team can recognise and reuse after the session",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Monthly reporting and commentary",
          "Pack-to-story support",
          "Monthly packs and commentary were the clearest repeated workflow in the survey, which makes them a strong thread for demos and pilots."
        ),
        detailCard(
          "Forecasting and scenario support",
          "Structure assumptions before discussion",
          "Useful when the team needs to compare options, explain forecast movement, and test scenarios without rebuilding the story from zero."
        ),
        detailCard(
          "Reconciliation and exception handling",
          "Triage the mismatch first",
          "A strong finance scenario because it speeds comparison, exception review, and early investigation without removing the analyst from the decision."
        ),
        detailCard(
          "Excel reporting and data prep",
          "Remove spreadsheet friction",
          "Good for formula explanation, report setup, data shaping, and repetitive prep that clogs the month-end rhythm."
        ),
        detailCard(
          "Policy and process Q&A",
          "Turn guidance into usable answers",
          "Strong when approved finance guidance needs to be easier to find, explain, and reuse without losing owner review."
        ),
      ],
    },
    speakerNotes: noteLines(
      "Ask participants to mentally star the two scenarios they most want to take back into their own role.",
      "Communication examples can still appear, but these five themes are now the core spine for the workshop."
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
    title: "Knowledge check 2: What is still missing from this prompt?",
    subtitle: 'Prompt on screen: "Use the March variance table and BU notes to draft CFO commentary."',
    bullets: [],
    sections: [],
    caption: "Ask what still has to be added before the draft becomes safe and genuinely useful for finance work.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard(
          "Almost usable prompt",
          "Better, but still incomplete",
          "The prompt now has context and evidence, but it still leaves too much unsaid about boundaries, materiality, and review.",
          undefined,
          undefined,
          undefined,
          {
            audienceEyebrow: "Prompt on screen",
          }
        ),
        detailCard(
          "What would you add before you trust the draft?",
          "The question",
          "Participants should call out the missing safeguards before the answer slide lands.",
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
      "The teaching point is that a decent prompt can still be unsafe if it does not tell the model where inference should stop and review should begin."
    ),
  },
  {
    id: "rheem-16a-kc-missing-answer",
    layout: "evidence",
    kicker: "01:13-01:18",
    title: "Knowledge check 2 answer: What is missing?",
    subtitle: "The gaps are mostly about boundaries, evidence, and review discipline.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Materiality threshold", "Decide what matters", "Tell the model which movements count as noteworthy so it does not over-amplify noise.", undefined, undefined, undefined, {
          answerLabel: "Add threshold",
        }),
        detailCard("Audience and tone", "Aim it correctly", "Name the reader and tone so the draft does not default to generic finance language.", undefined, undefined, undefined, {
          answerLabel: "Set audience",
        }),
        detailCard("Source boundary", "Say what evidence it can use", "Make clear whether the model should stay inside the table and notes or bring in broader context.", undefined, undefined, undefined, {
          answerLabel: "Name evidence",
        }),
        detailCard("Confidence split", "Separate fact from inference", "Ask it to distinguish confirmed numbers, management explanation, and open hypotheses.", undefined, undefined, undefined, {
          answerLabel: "Split certainty",
        }),
        detailCard("Sign-off checks", "Flag what still needs review", "Tell it what must still be validated before the note can be used in the pack.", undefined, undefined, undefined, {
          answerLabel: "Protect review",
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
    title: "Demo 2: Build month-end commentary from rough inputs",
    subtitle: "Use Copilot to turn tables, notes, and open issues into a reviewable first pass.",
    bullets: [
      "Start from real pack inputs, not polished prose",
      "Ask for structure, drivers, and questions that still need checking",
      "Keep the final numbers and claims under human review",
    ],
    sections: [],
    caption: "The win is a tighter first draft for review, not commentary that bypasses finance judgement.",
    visual: {
      variant: "workflow-shift",
      items: [
        detailCard("Pack inputs", "Use the real material", "Start with the variance table, business unit notes, and any known issues instead of asking for generic commentary."),
        detailCard("Structured draft", "Get to a usable first pass faster", "Ask for a short executive summary, driver bullets, and a small table of items that still need confirmation."),
        detailCard("Refine the explanation", "Sharpen tone and logic", "Use follow-up prompts to tighten wording, remove overreach, and separate confirmed facts from likely causes."),
        detailCard("Human review", "Numbers and judgement stay with finance", "Before the draft goes into a pack, someone still validates the figures, the explanations, and anything that could be misread."),
      ],
    },
    speakerNotes: noteLines(
      "This demo should feel close to the reporting pain the room described in the survey.",
      "Keep the review step visible so the audience hears that good commentary still depends on finance judgement."
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
    subtitle: "Both are plausible. One is stronger because it protects the review step.",
    bullets: [],
    sections: [
      {
        id: "rheem-22-a",
        heading: "Prompt A",
        bullets: [
          "Draft March CFO commentary using the attached variance table and BU notes",
          "Keep it concise and suitable for the monthly pack",
          "Summarise the main drivers in four bullets",
          "No instruction on what is confirmed versus still tentative",
        ],
      },
      {
        id: "rheem-22-b",
        heading: "Prompt B",
        bullets: [
          "Draft March CFO commentary using the attached variance table and BU notes",
          "Summarise the main drivers in four bullets plus a short table",
          "Separate confirmed facts, management explanations, and open checks",
          "Flag any gaps that must be validated before sign-off",
        ],
      },
    ],
    speakerNotes: noteLines(
      "Ask the room which prompt they would trust more before you reveal the answer slide.",
      "The point is not length for its own sake. The point is whether the prompt makes the review step safer."
    ),
  },
  {
    id: "rheem-22a-kc-stronger-prompt-answer",
    layout: "evidence",
    kicker: "01:57-02:02",
    title: "Knowledge check 3 answer: Prompt B is stronger",
    subtitle: "It wins because it gives finance a cleaner review path, not just a longer prompt.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Prompt A", "Usable but lighter", "Prompt A is workable, but it still leaves the confidence model blurry and gives the reviewer less help.", "Option", "A", undefined, {
          answerLabel: "Usable, but lighter",
          answerState: "neutral",
        }),
        detailCard("Prompt B", "Safer to trust", "Prompt B earns more trust because it organises the answer around evidence, explanation, and what still needs checking.", "Option", "B", undefined, {
          answerLabel: "Safer first draft",
          answerState: "correct",
        }),
        detailCard("Why B wins", "Review is easier", "The stronger prompt does more than shape the draft. It makes it obvious where human validation still belongs.", "Reason", undefined, undefined, {
          answerLabel: "Reason",
          answerState: "supporting",
        }),
        detailCard("What to compare", "Use the same criteria every time", "Check for source clarity, output structure, confidence splitting, and a sign-off cue whenever you compare prompts.", "Checklist", undefined, undefined, {
          answerLabel: "Checklist",
          answerState: "supporting",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Make the evaluation criteria explicit so people can reuse it after the workshop.",
      "Prompt B is better because it makes the task easier to review, not just easier to write."
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
    subtitle: "The survey made the priority order clear: accuracy first, then privacy, governance, and human accountability.",
    bullets: [
      "Accuracy comes before speed",
      "Use only material and audiences that are appropriate",
      "Respect governance and compliance boundaries",
      "Keep approval and accountability with people",
    ],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Accuracy first", "Wrong numbers break trust fastest", "If output touches reporting, forecasting, or explanations, the figures, logic, and source detail still need a human check."),
        detailCard("Privacy and confidentiality", "Know what should stay contained", "Sensitive finance material needs the right handling, audience, and permission path before Copilot is brought into the task."),
        detailCard("Governance and compliance", "Use the controls that already exist", "Labels, approved workflows, and acceptable-use expectations matter because they keep the team moving inside known boundaries."),
        detailCard("Human accountability", "The role does not disappear", "Copilot can remove blank-page effort, but approval, escalation, and professional judgement stay with the finance team."),
      ],
    },
    speakerNotes: noteLines(
      "Keep this grounded in the exact concerns people raised: accuracy, privacy, governance, and fear of losing control of the work.",
      "The room should hear that safe use is what makes wider adoption credible rather than what slows it down."
    ),
  },
  {
    id: "rheem-26-traps",
    layout: "evidence",
    kicker: "02:22-02:28",
    title: "Four traps that matter most in this room",
    subtitle: "The survey concerns are practical, not abstract.",
    bullets: [],
    sections: [],
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Accuracy trap", "Fluent output can still be wrong", "A polished answer can hide bad arithmetic, weak logic, or unsupported explanations unless someone checks the source detail."),
        detailCard("Privacy trap", "Convenience can outrun judgement", "It is easy to paste or summarise material too casually unless the team is clear on what is appropriate to handle and share."),
        detailCard("Governance trap", "Good intentions still need guardrails", "When teams improvise their own usage patterns, inconsistency and compliance risk creep in quickly."),
        detailCard("Over-reliance trap", "Fast drafting is not final thinking", "If people stop challenging the first answer, the tool starts shaping the conclusion more than it should."),
      ],
    },
    speakerNotes: noteLines(
      "Ask which trap feels most likely inside reporting, forecasting, or reconciliation work.",
      "This is a good moment to say explicitly that faster drafting should not make the analyst smaller."
    ),
  },
  {
    id: "rheem-27-kc-human-check",
    layout: "evidence",
    kicker: "02:28-02:33",
    title: "Knowledge check 4: Where is the delegation boundary?",
    subtitle: "Place each step on the ladder from strong AI assist to fully human-owned.",
    bullets: [],
    sections: [],
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Draft the first-pass summary", "Closest to strong AI assist", "Turning a known table into a structured first draft is usually where Copilot can help furthest.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 1",
        }),
        detailCard("Suggest likely drivers", "Useful, but needs verification", "Copilot can help surface possible explanations, but finance still has to confirm which ones really hold.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 2",
        }),
        detailCard("Judge audience suitability", "Sensitivity and context matter", "Someone still needs to decide whether the content, destination, and timing are appropriate.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 3",
        }),
        detailCard("Approve final release", "Accountability stays here", "Approval, escalation, and sign-off remain human even when Copilot helped earlier in the workflow.", undefined, undefined, undefined, {
          audienceEyebrow: "Option 4",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Let the room place each step before you reveal the answer ladder.",
      "The useful teaching point is that delegation is not one line; it moves by task."
    ),
  },
  {
    id: "rheem-27a-kc-human-check-answer",
    layout: "evidence",
    kicker: "02:28-02:33",
    title: "Knowledge check 4 answer: The boundary shifts by task",
    subtitle: "Copilot can help more with structure than with judgement, sensitivity, or approval.",
    bullets: [],
    sections: [],
    stageDisplay: ANSWER_STAGE,
    visual: {
      variant: "quiz-grid",
      items: [
        detailCard("Draft the first-pass summary", "Closest to strong AI assist", "This is where Copilot can often help furthest because the task is structured and the review step is still obvious.", undefined, undefined, undefined, {
          answerLabel: "Strong AI assist",
        }),
        detailCard("Suggest likely drivers", "Useful, but needs verification", "This can save time, but finance still has to test whether the explanation is supported by the evidence.", undefined, undefined, undefined, {
          answerLabel: "Assist, then verify",
        }),
        detailCard("Judge audience suitability", "Sensitivity and context matter", "This stays with humans because it depends on context, confidentiality, tone, and organisational judgement.", undefined, undefined, undefined, {
          answerLabel: "Human judgement",
        }),
        detailCard("Approve final release", "Accountability stays here", "Approval and accountability stay human-owned even when Copilot accelerated everything before that point.", undefined, undefined, undefined, {
          answerLabel: "Human-owned",
        }),
      ],
    },
    speakerNotes: noteLines(
      "Keep the ladder simple and practical.",
      "The message is that delegation gets lighter as judgement, sensitivity, and accountability rise."
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
      variant: "governance-stack",
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
    title: "Knowledge check 5: A sensitive board draft lands in Copilot",
    subtitle: "The file is accessible. Does that automatically make the task appropriate?",
    bullets: [],
    sections: [],
    caption: "Discuss the scenario first, then reveal the path you would want a strong team to follow.",
    stageDisplay: QUESTION_STAGE,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Summarise a board draft with pricing and forecast assumptions", "The scenario", "A finance leader wants a quick summary of sensitive board-prep material that is already accessible in the environment.", undefined, undefined, undefined, {
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
    subtitle: "This is where the survey pain points showed up most clearly.",
    bullets: [
      "Use it to organise, explain, summarise, and draft",
      "Keep final interpretation with the analyst",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Excel reporting friction", "Reduce the blank manual prep", "Copilot can help explain formulas, suggest report structure, and speed the repetitive spreadsheet tasks that come before real analysis."),
        detailCard("Manual data prep", "Get messy inputs into working shape", "It can help compare headers, outline clean-up steps, and turn scattered extracts into a clearer prep plan before human validation."),
        detailCard("SAP drill-down support", "Surface where to look next", "When teams are checking transactions and chasing drivers, Copilot can help structure findings and questions for faster investigation."),
        detailCard("Pack-to-story synthesis", "Move faster from numbers to explanation", "Dense monthly packs can become a tighter first-pass narrative that the analyst then pressure-tests and improves."),
      ],
    },
    speakerNotes: noteLines(
      "This slide should feel recognisable to anyone dealing with packs, Excel friction, and report preparation.",
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
      "Compare SAP, customer, or debtor records across mismatched sources",
      "Surface blocked-order and month-end exceptions faster",
      "Draft a triage view for human investigation",
    ],
    sections: [],
    caption: "The draft accelerates investigation. It does not replace the team's judgement.",
    visual: {
      variant: "reconciliation-workflow",
      items: [
        detailCard("SAP or ledger extract", "Primary finance source", "Month-end review usually starts with a base extract that carries its own codes, timing, and account logic.", "Input"),
        detailCard("Customer or supporting file", "Secondary view of the same story", "Debtor reports, customer statements, or operational extracts often describe the same issue differently, which slows clean comparison.", "Input"),
        detailCard("Compare and triage", "Line up categories and exceptions", "Copilot can help normalise labels, flag blocked-order style mismatches, and draft the investigation view with likely causes and open questions.", "Engine"),
        detailCard("Review and resolve", "Human judgement stays here", "Finance still checks the records, confirms the root cause, and decides what correction, follow-up, or escalation is needed.", "Human"),
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
    title: "Finance use case 3: forecasting and scenario support",
    subtitle: "Copilot can help structure the thinking without owning the forecast.",
    bullets: [
      "Organise assumptions and key drivers",
      "Compare scenarios without rebuilding the story from zero",
      "Keep approvals, commitments, and calls with finance leaders",
    ],
    sections: [],
    stageDisplay: NO_CAPABILITY_SUMMARY,
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Baseline forecast", "Start from the current view", "Bring the current forecast, assumptions, and business context together so the model is shaping the real situation."),
        detailCard("Scenario options", "Explore upside, downside, and sensitivity", "Copilot can help lay out what changes across scenarios and where the biggest assumptions sit."),
        detailCard("Driver explanation", "Turn numbers into a clear narrative", "Use it to draft what changed, why it changed, and what still needs evidence before the story is shared."),
        detailCard("Finance decision check", "The call stays human", "The tool can structure options, but finance leaders still decide what goes into the forecast and how much confidence to place in it."),
      ],
    },
    speakerNotes: noteLines(
      "This replaces the lighter communications example as a core use case because the survey pulled forecasting much higher.",
      "Keep reminding the room that scenario support is useful precisely because the final call still belongs to finance."
    ),
  },
  {
    id: "rheem-35-demo-walkthrough",
    layout: "evidence",
    kicker: "03:16-03:24",
    title: "Demo 3: one end-to-end finance workflow",
    subtitle: "From messy inputs to a reviewed finance output.",
    bullets: [
      "Start with real data and notes",
      "Make the review checkpoints explicit",
      "Finish with something ready to share only after validation",
    ],
    sections: [],
    caption: "The goal is a repeatable working pattern the team can actually adopt.",
    visual: {
      variant: "workflow-evolution",
      items: [
        detailCard("Gather the inputs", "Reports, notes, and extracts", "Begin with the month-end tables, forecast assumptions, or reconciliation files the team already uses."),
        detailCard("Prepare the draft", "Organise and structure the work", "Ask Copilot to summarise the drivers, draft the first commentary, or lay out the scenario comparison in a format built for review."),
        detailCard("Validate with finance judgement", "Check numbers, logic, and sensitivity", "Pause on the risk points before anything travels: facts, assumptions, privacy, tone, and whether the inference is justified."),
        detailCard("Share the reviewed output", "Only after the check step", "Once validated, the draft can become a pack note, a scenario summary, or an exception update that is ready to use."),
      ],
    },
    speakerNotes: noteLines(
      "This slide should make the workflow feel local to the room rather than theoretical.",
      "Keep repeating that prompting, checking, and judgement are one pattern, not three separate ideas."
    ),
  },
  {
    id: "rheem-36-kc-risk-match",
    layout: "split-2",
    kicker: "03:24-03:29",
    title: "Knowledge check 6: Match the risk to the scenario",
    subtitle: "The trap changes with the workflow.",
    bullets: [],
    sections: [
      {
        id: "rheem-36-scenarios",
        heading: "Scenarios to match",
        bullets: [
          "Policy Q&A response",
          "Monthly variance note",
          "Customer reconciliation triage",
          "Downside forecast summary",
        ],
      },
      {
        id: "rheem-36-risks",
        heading: "Possible risk checks",
        bullets: [
          "Data alignment and access scope",
          "Assumption drift and false precision",
          "Ambiguity and policy-owner review",
          "Numeric support and causal inference",
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
    layout: "split-2",
    kicker: "03:24-03:29",
    title: "Knowledge check 6 answer: The risk changes with the workflow",
    subtitle: "Each scenario has a different main review pressure to watch for.",
    bullets: [],
    sections: [
      {
        id: "rheem-36a-match-left",
        heading: "Resolved matches",
        bullets: [
          "Policy Q&A response -> Ambiguity and policy-owner review",
          "Monthly variance note -> Numeric support and causal inference",
        ],
      },
      {
        id: "rheem-36a-match-right",
        heading: "Resolved matches",
        bullets: [
          "Customer reconciliation triage -> Data alignment and access scope",
          "Downside forecast summary -> Assumption drift and false precision",
        ],
      },
    ],
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
      "Forecast or scenario support",
      "Reconciliation review",
      "Excel reporting automation",
      "Policy and process Q&A",
    ],
    sections: [],
    caption: "Seven minutes to map. Three minutes to report back.",
    visual: {
      variant: "framework-cards",
      items: [
        detailCard("Month-end commentary", "Narrative plus review", "A strong candidate when the team already knows the material and wants a faster path to a good first draft."),
        detailCard("Forecast scenario support", "Structured comparison", "A strong candidate when the assumptions are known and the team wants a clearer way to compare and explain scenarios."),
        detailCard("Reconciliation review", "Faster issue triage", "A strong candidate when mismatches are repetitive and the team can validate the comparison logic quickly."),
        detailCard("Excel reporting automation", "Reduce repetitive prep", "A strong candidate when the report shape is stable and the team can inspect the draft output before using it."),
      ],
    },
    speakerNotes: noteLines(
      "Ask the room to choose one workflow and fill in the worksheet.",
      "Policy and process Q&A stays a valid option, but keep the visible exercise list focused on the four strongest survey-backed workflows.",
      "Keep the discussion anchored to value plus control, not novelty."
    ),
  },
  {
    id: "rheem-41-kc-pilot",
    layout: "evidence",
    kicker: "04:02-04:08",
    title: "Knowledge check 7: Which two are the strongest first pilots?",
    subtitle: "Pick the candidates that are repetitive, contained, and easy to review.",
    bullets: [],
    sections: [],
    caption: "Ask which candidates are strongest and why before showing the scorecard.",
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
          "Blocked-order prioritisation assistant",
          "Tempting, but operationally riskier",
          "This is more tempting than automating sign-off, but customer impact and escalation logic still make it a second-wave pilot.",
          "Candidate",
          "Second-wave pilot",
          56,
          {
            audienceEyebrow: "Candidate 2",
          }
        ),
        detailCard(
          "Excel reporting prep assistant",
          "Structured and inspectable",
          "A strong first pilot when the report shape is stable, the inputs are known, and the team can validate the draft output before it is used.",
          "Candidate",
          "Strong first pilot",
          79,
          {
            audienceEyebrow: "Candidate 3",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "The right answer is two strong pilots, not one.",
      "The room should hear clearly that operationally consequential workflows can be good later, but not as the first trust-building pilot."
    ),
  },
  {
    id: "rheem-41a-kc-pilot-answer",
    layout: "evidence",
    kicker: "04:02-04:08",
    title: "Knowledge check 7 answer: Start with the reviewable work",
    subtitle: "Monthly commentary and Excel reporting prep beat higher-impact workflows that are harder to govern on day one.",
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
          "Blocked-order prioritisation assistant",
          "Tempting, but operationally riskier",
          "Useful idea, but customer impact and escalation logic make it better as a second-wave pilot after the team has built more trust.",
          "Candidate",
          "Second-wave pilot",
          56,
          {
            answerLabel: "Second-wave pilot",
            answerState: "neutral",
          }
        ),
        detailCard(
          "Excel reporting prep assistant",
          "Structured and inspectable",
          "A strong first pilot when the report shape is stable, the inputs are known, and the team can validate the draft output before it is used.",
          "Candidate",
          "Strong first pilot",
          79,
          {
            answerLabel: "Strong first pilot",
            answerState: "correct",
          }
        ),
      ],
    },
    speakerNotes: noteLines(
      "Use this answer slide to reinforce the pilot filter one more time.",
      "The wrong first move is a workflow whose commercial or control impact is harder to govern before trust exists."
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
      variant: "framework-cards",
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
    layout: "split-2",
    kicker: "Appendix",
    title: "Two prompt patterns for more complex work",
    subtitle: "Optional depth for higher-stakes tasks that need more scaffolding than R-T-F.",
    bullets: [],
    sections: [
      {
        id: "rheem-44-rise",
        heading: "R-I-S-E",
        bullets: [
          "Role",
          "Input",
          "Steps",
          "Expectation",
        ],
      },
      {
        id: "rheem-44-create",
        heading: "C-R-E-A-T-E",
        bullets: [
          "Context",
          "Requirements",
          "Expectations",
          "Audience",
          "Tone",
          "Examples",
        ],
      },
    ],
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
