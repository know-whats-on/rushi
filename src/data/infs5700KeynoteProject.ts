import type {
  DocumentLibraryMeta,
  ProjectDocumentContent,
  ProjectPresentationSlide,
  StudioDocument,
  StudioLibraryCard,
} from "../types/documents";

export const INFS5700_KEYNOTE_PROJECT_CODE = "INFS5700";
export const INFS5700_KEYNOTE_CARD_LOGO_URL =
  "/images/studio/unsw-sydney-card-logo.png";
export const INFS5700_KEYNOTE_SPEAKER_PHOTO_URL =
  "/images/presentation/rushi-vyas-intro-v2.png";
export const INFS5700_KEYNOTE_PDF_LOGO_URL =
  "https://www.edigitalagency.com.au/wp-content/uploads/new-UNSW-logo-horizontal-png-large-size.png";
export const INFS5700_KEYNOTE_CATEGORY = "Presentation";
export const INFS5700_KEYNOTE_STATUS_LABEL = "Code required";
export const INFS5700_KEYNOTE_CLIENT = "UNSW Sydney";
export const INFS5700_KEYNOTE_ORGANISATION = "UNSW Sydney";
export const INFS5700_KEYNOTE_TITLE =
  "Six Big Questions shaping the Future of Analytics in the AI Era";

const INFS5700_KEYNOTE_SLIDES: ProjectPresentationSlide[] = [
  {
    id: "slide-0-countdown",
    layout: "countdown",
    countdown: {
      targetAt: "2026-04-13T06:00:00.000Z",
      timeZone: "Australia/Sydney",
      autoAdvance: true,
      showTargetLabel: false,
    },
    kicker: "UNSW Sydney · INFS5700",
    title: "Analytics in the AI-first era!",
    titleLines: ["Analytics in the AI-first era!"],
    bullets: [],
    sections: [],
    speakerNotes: [
      "This opening slide counts down to the 4 PM Sydney start time.",
      "The presenter view advances automatically to the title slide when the timer reaches zero.",
    ],
  },
  {
    id: "slide-1",
    layout: "title",
    kicker: "UNSW Sydney · INFS5700",
    title:
      "6 Big Questions Shaping the Future of Business Analytics in the Age of AI",
    titleLines: [
      "6 Big Questions",
      "Shaping the Future of",
      "Business Analytics",
      "in the Age of AI",
    ],
    subtitle:
      "How AI is changing work, decisions, data, and competitive advantage",
    bullets: [
      "How AI is changing work, decisions, data, and competitive advantage",
      "One central idea: in the age of AI, clean, governed, machine-readable data becomes more valuable, not less",
    ],
    sections: [],
    visual: {
      variant: "network-hero",
      items: [
        { label: "Workflows", value: "AI-assisted" },
        { label: "Decisions", value: "Real-time" },
        { label: "Data", value: "Governed" },
        { label: "Advantage", value: "Compounding" },
      ],
    },
    speakerNotes: [
      "This is not a tools talk. It is a strategy talk about what AI changes in analytics.",
      "My core argument is simple: in the AI era, clean, governed, machine-readable data becomes more valuable, not less.",
      "I am going to use six questions because the right questions are more useful than the hype cycle.",
      "AI amplifies whatever system you already have, so strong systems compound and weak systems get exposed faster.",
    ],
  },
  {
    id: "slide-0-intro",
    layout: "intro",
    kicker: "Speaker intro",
    title: "Rushi Vyas",
    subtitle: "Orchestrating Human, Business & Artifical Intelligence",
    mediaUrl: INFS5700_KEYNOTE_SPEAKER_PHOTO_URL,
    bullets: [],
    sections: [],
    speakerNotes: [
      "I work at the intersection of human intelligence, business systems, and AI, so this topic sits right in the middle of my day-to-day work.",
      "The logos on screen show the range of contexts where I have seen this shift play out: government, universities, and commercial teams.",
      "So what I want to share today is practical and strategic, not another tools demo.",
      "Let me move quickly into the six questions that I think matter most.",
    ],
  },
  {
    id: "slide-2",
    layout: "evidence",
    title: "Why this matters now",
    titleLines: ["Why this matters now"],
    bullets: [
      "Analytics is shifting from reporting to decision support",
      "AI is compressing routine analytical work",
      "Trust, governance, and data readiness are becoming strategic differentiators",
    ],
    sections: [],
    caption:
      "Most organizations are seeing efficiency and insight gains before they are seeing direct revenue impact.",
    sourceLabel: "Source: Deloitte, State of Generative AI in the Enterprise, 2026",
    callouts: [
      {
        value: "66%",
        label: "Productivity + efficiency gains from GenAI",
      },
      {
        value: "53%",
        label: "Improved insights + decisions",
      },
      {
        value: "20%",
        label: "Increased revenue so far",
      },
    ],
    visual: {
      variant: "workflow-shift",
      items: [
        {
          label: "Reporting",
          note: "Historical view",
          detail:
            "Reporting stays useful, but it is becoming baseline hygiene rather than the source of advantage.",
          speakerNotes: [
            "Reporting does not disappear, but it becomes baseline hygiene.",
            "If all we do is describe the past, AI will commoditize that layer of work very quickly.",
          ],
        },
        {
          label: "Dashboards",
          note: "Performance view",
          detail:
            "Dashboards still orient teams, but AI is rapidly compressing the work needed to build and summarize them.",
          speakerNotes: [
            "Dashboards still matter, but AI is compressing the effort required to build and summarize them.",
            "That means the value shifts from producing the dashboard to deciding what the dashboard should change.",
          ],
        },
        {
          label: "Decision support",
          note: "Action guidance",
          detail:
            "Decision support rises in value because it links analysis to action, trade-offs, and timing.",
          speakerNotes: [
            "Decision support is where analytics becomes more strategic.",
            "This is the move from showing the number to guiding the action, the trade-off, and the timing.",
          ],
        },
        {
          label: "AI-assisted workflows",
          note: "Embedded workflow layer",
          detail:
            "The frontier is analytics embedded directly into workflows so recommendations arrive inside the work itself.",
          speakerNotes: [
            "The frontier is analytics showing up inside the workflow itself.",
            "Instead of people stopping work to go find insight, the insight starts meeting them in the work.",
          ],
        },
      ],
    },
    speakerNotes: [
      "This shift is already happening now, not five years from now.",
      "Analytics is moving from describing performance toward shaping decisions in real time.",
      "The Deloitte figures matter because efficiency gains are showing up faster than revenue transformation.",
      "So the next question is: what work changes first when that shift takes hold?",
    ],
  },
  {
    id: "slide-3",
    layout: "question",
    kicker: "Q1",
    title:
      "What work in analytics will AI automate, and what work becomes more valuable because of it?",
    titleLines: [
      "What work in analytics",
      "will AI automate,",
      "and what work becomes more valuable",
      "because of it?",
    ],
    bullets: [
      "AI compresses routine analytical production",
      "It increases the value of judgment, framing, and decision-making",
      "The future analyst is not just a dashboard builder",
      "The future analyst is a decision translator",
    ],
    sections: [],
    visual: {
      variant: "workflow-evolution",
      items: [
        {
          label: "Manual analysis",
          note: "Repetitive production",
          detail:
            "Repetitive production work is the first layer to be compressed by automation.",
          speakerNotes: [
            "The first layer to get compressed is repetitive production work.",
            "Anything formulaic, repeatable, and rules-based is exactly where automation moves fastest.",
          ],
        },
        {
          label: "AI-assisted analysis",
          note: "Drafting and synthesis",
          detail:
            "AI accelerates first drafts and synthesis, but it still needs human validation.",
          speakerNotes: [
            "AI is excellent at accelerating first drafts, summaries, and synthesis.",
            "But speed is not the same as trust, so validation still matters.",
          ],
        },
        {
          label: "Decision translation",
          note: "Judgment + action",
          detail:
            "The premium shifts toward framing the problem, judging the output, and helping others act on it.",
          speakerNotes: [
            "The premium shifts toward framing the problem, judging the output, and helping others act on it.",
            "That is why I describe the future analyst as a decision translator, not just a dashboard builder.",
          ],
        },
      ],
    },
    speakerNotes: [
      "I would reframe the replacement question into a task-and-capability question.",
      "AI compresses production work much faster than it replaces whole roles.",
      "So the analyst who grows in value is the one who can frame, judge, and translate.",
      "The next slide shows why reshaping work is the immediate story, not mass elimination.",
    ],
  },
  {
    id: "slide-4",
    layout: "evidence",
    title: "AI is reshaping more jobs than it is replacing",
    titleLines: ["AI is reshaping more jobs", "than it is replacing"],
    bullets: [],
    sections: [],
    caption:
      "AI is changing the mix of work faster than it is removing work entirely.",
    sourceLabel: "Source: BCG 2026; IMF SDN 2026",
    callouts: [
      {
        value: "1 in 10",
        label: "Job vacancies in advanced economies now demand at least one new skill",
      },
    ],
    visual: {
      variant: "impact-compare",
      items: [
        {
          label: "Jobs likely to be reshaped by AI",
          value: "50%–55%",
          note: "Next 2–3 years",
          metric: 55,
        },
        {
          label: "Jobs potentially eliminated",
          value: "10%–15%",
          note: "Five years from now or later",
          metric: 15,
        },
      ],
    },
    speakerNotes: [
      "The immediate story is reshaping work, not simply removing work.",
      "Employers are already rewarding new skill mixes that combine analytics capability with AI fluency.",
      "That makes judgment, framing, and translation more valuable, not less valuable.",
      "But none of that scales if the underlying data is not actually usable.",
    ],
  },
  {
    id: "slide-5",
    layout: "question",
    kicker: "Q2",
    title:
      "What does AI-ready data really mean, and why will it separate leaders from laggards?",
    titleLines: [
      "What does AI-ready data",
      "really mean, and why will it",
      "separate leaders from laggards?",
    ],
    bullets: [
      "AI-ready data is not just available data",
      "It is structured, governed, traceable, and decision-usable",
      "AI amplifies both good data and bad data",
      "Data quality is becoming strategic infrastructure",
    ],
    sections: [],
    visual: {
      variant: "data-foundation",
      items: [
        {
          label: "Structured",
          detail:
            "Consistent formats and fields let machines use the data without constant manual cleanup.",
          speakerNotes: [
            "AI-ready data starts with structure.",
            "If the fields, formats, and labels are inconsistent, the model spends its energy compensating for mess instead of creating value.",
          ],
        },
        {
          label: "Governed",
          detail:
            "Ownership, permissions, and policy controls are clear enough for trusted AI use at scale.",
          speakerNotes: [
            "Governance answers the question of who owns the data, who can use it, and under what rules.",
            "Without that layer, people may get access to AI, but they do not get trusted scale.",
          ],
        },
        {
          label: "Traceable",
          detail:
            "Teams can trace where the data came from, how it moved, and what changed it.",
          speakerNotes: [
            "Traceability means we can explain where the data came from and what changed it.",
            "That matters because confidence in AI outputs depends on confidence in the data lineage behind them.",
          ],
        },
        {
          label: "Monitorable",
          detail:
            "Quality, drift, and downstream risk can be monitored continuously rather than found too late.",
          speakerNotes: [
            "And finally, the data has to be monitorable.",
            "If drift, quality, and downstream risk are invisible, teams discover problems too late to trust the system.",
          ],
        },
      ],
    },
    speakerNotes: [
      "This is the central systems question in the whole deck, so it is worth slowing down here.",
      "Having data is not the same as having decision-usable data.",
      "AI-ready data is structured, governed, traceable, and monitorable enough to support trusted action.",
      "That is why the next slide is really about project survival, not just technical readiness.",
    ],
  },
  {
    id: "slide-6",
    layout: "evidence",
    title: "The AI-ready data gap will decide which projects survive",
    titleLines: [
      "The AI-ready data gap will decide",
      "which projects survive",
    ],
    bullets: [],
    sections: [],
    caption:
      "The gap between experimentation and transformation is largely a data and operating-model gap.",
    sourceLabel: "Source: Gartner 2025; Deloitte 2026",
    callouts: [
      {
        value: "60%",
        label: "AI projects likely to be abandoned by 2026 without AI-ready data",
      },
      {
        value: "34%",
        label: "Organizations using AI to deeply transform the business",
      },
      {
        value: "37%",
        label: "Still using AI at a surface level with little process change",
      },
    ],
    visual: {
      variant: "maturity-staircase",
      items: [
        {
          group: "Level 1",
          label: "Fragmented",
          metric: 1,
          detail:
            "Data is scattered, inconsistent, and too dependent on manual workarounds to support reliable AI use.",
          speakerNotes: [
            "At the fragmented stage, teams are still stitching things together with manual workarounds.",
            "That makes any AI use fragile because the foundations are unstable from the start.",
          ],
        },
        {
          group: "Level 2",
          label: "Documented",
          metric: 2,
          detail:
            "Definitions and assets are clearer, but quality and access are still uneven across workflows.",
          speakerNotes: [
            "Documented is better, because at least the assets and definitions are clearer.",
            "But if access and quality are still uneven, the AI system still inherits inconsistency.",
          ],
        },
        {
          group: "Level 3",
          label: "Governed",
          metric: 3,
          detail:
            "Policies, ownership, and access controls exist, making higher-trust use cases more feasible.",
          speakerNotes: [
            "Governed data is where higher-trust use cases start to become realistic.",
            "Ownership, permissions, and controls create the conditions for trusted deployment.",
          ],
        },
        {
          group: "Level 4",
          label: "AI-ready",
          metric: 4,
          detail:
            "The data is usable, controlled, and observable enough to support monitored AI deployment at scale.",
          speakerNotes: [
            "AI-ready is not perfect data. It is usable, controlled, and observable data.",
            "That is the level where deployment can move from pilot theater into monitored scale.",
          ],
        },
      ],
    },
    speakerNotes: [
      "The staircase matters because data maturity is a progression, not a binary state.",
      "The anchor statistic here is the 60 percent abandonment risk when AI-ready data is missing.",
      "It also explains why so many firms stay at surface-level AI instead of reaching deep transformation.",
      "The next question is not just about data quality. It is about where trust should stop and where human review must begin.",
    ],
  },
  {
    id: "slide-7",
    layout: "question",
    kicker: "Q3",
    title:
      "Who gets to decide where AI should and should not be used in decision-making?",
    titleLines: [
      "Who gets to decide where AI",
      "should and should not be used",
      "in decision-making?",
    ],
    bullets: [
      "The issue is no longer only what AI can do",
      "The issue is where AI should be trusted",
      "Not every prediction should trigger action",
      "Not every decision should be automated",
    ],
    sections: [],
    visual: {
      variant: "decision-gates",
      items: [
        {
          label: "Prediction",
          detail:
            "The model output is a starting point, not the decision itself.",
          speakerNotes: [
            "A prediction is a starting point, not a decision.",
            "The mistake many teams make is treating model output as if it already carries permission to act.",
          ],
        },
        {
          label: "Review gate",
          detail:
            "A review gate checks whether the output is safe, sufficient, and appropriate to use.",
          speakerNotes: [
            "The review gate is where trust gets tested.",
            "This is where we ask whether the output is safe enough, complete enough, and appropriate enough to use.",
          ],
        },
        {
          label: "Human accountability",
          detail:
            "Someone still owns the decision, the consequences, and the logic for trusting the system.",
          speakerNotes: [
            "Human accountability has to remain explicit.",
            "Someone still owns the decision, the consequences, and the reasoning for trusting the system.",
          ],
        },
        {
          label: "Decision action",
          detail:
            "Only after controls and accountability are clear should prediction turn into action.",
          speakerNotes: [
            "Only after those controls are clear should prediction turn into action.",
            "That is how we separate useful automation from reckless automation.",
          ],
        },
      ],
    },
    speakerNotes: [
      "This is an analytics design problem, not just a policy conversation.",
      "Prediction on its own is not enough. The workflow needs explicit trust boundaries.",
      "Not every recommendation should trigger action, and not every decision should be automated.",
      "That is why governance is now becoming operational rather than theoretical.",
    ],
  },
  {
    id: "slide-8",
    layout: "evidence",
    title: "AI governance is becoming operational, not theoretical",
    titleLines: [
      "AI governance is becoming",
      "operational, not theoretical",
    ],
    bullets: [],
    sections: [],
    caption:
      "As AI moves deeper into real workflows, governance becomes part of operational design.",
    sourceLabel:
      "Source: Australian Government / DTA, March–April 2026",
    callouts: [
      {
        value: "Implementation",
        label: "Governance is shifting toward accountability, transparency, and workflow controls",
      },
    ],
    visual: {
      variant: "governance-timeline",
      items: [
        {
          value: "26 Mar 2026",
          label: "Australian Government AI transparency statements page updated",
          detail:
            "Transparency moved into operational practice, signaling that accountability is now expected in delivery, not only in policy.",
          speakerNotes: [
            "This March update matters because transparency is moving from principle into operational practice.",
            "It signals that accountability is now expected in delivery, not just in a policy document.",
          ],
        },
        {
          value: "1 Apr 2026",
          label: "Government response to Senate Select Committee on AI published",
          detail:
            "The national response reinforced that governance, oversight, and accountability are now part of deployment.",
          speakerNotes: [
            "Then in early April, the national response reinforced the same direction of travel.",
            "Governance, oversight, and accountability are becoming part of deployment design itself.",
          ],
        },
      ],
    },
    speakerNotes: [
      "I want governance to feel current and concrete here, not abstract.",
      "The message is that governance now sits inside delivery rather than being bolted on after the fact.",
      "Trust has to be designed into AI-assisted workflows from the start.",
      "Once we accept that, the next question is what actually limits scale in practice.",
    ],
  },
  {
    id: "slide-9",
    layout: "question",
    kicker: "Q4",
    title:
      "What hidden dependencies will shape how far AI in analytics can really scale?",
    titleLines: [
      "What hidden dependencies",
      "will shape how far AI",
      "in analytics can really scale?",
    ],
    bullets: [
      "The visible AI tool is rarely the bottleneck",
      "The system underneath it usually is",
      "Infrastructure, integration, compute, permissions, and operating model matter",
      "AI adoption is a systems challenge, not just a tooling challenge",
    ],
    sections: [],
    visual: {
      variant: "systems-stack",
      items: [
        {
          label: "AI app",
          note: "Visible layer",
          detail:
            "The visible tool is what people notice first, but it is rarely the real scaling constraint.",
          speakerNotes: [
            "The AI app is the visible layer, so it gets most of the attention.",
            "But the visible tool is rarely the thing that decides whether scale is possible.",
          ],
        },
        {
          label: "Data pipelines",
          note: "Reliable access",
          detail:
            "If pipelines are unreliable or fragmented, AI outputs become inconsistent and hard to trust.",
          speakerNotes: [
            "Reliable pipelines are what turn a clever demo into a dependable system.",
            "If pipeline quality is weak, output quality becomes inconsistent and trust drops quickly.",
          ],
        },
        {
          label: "Compute and security",
          note: "Infrastructure",
          detail:
            "Scaling AI depends on compute access, security controls, and the ability to operate safely.",
          speakerNotes: [
            "Scale also depends on compute access, security controls, and the ability to operate safely.",
            "That layer is less visible, but it is often where real adoption friction shows up.",
          ],
        },
        {
          label: "Operating model",
          note: "Role redesign",
          detail:
            "Without clear ownership, incentives, and process redesign, adoption stays stuck in pilots.",
          speakerNotes: [
            "And then there is the operating model, which is where many pilots stall.",
            "If ownership, incentives, and process redesign stay fuzzy, adoption stays trapped in experimentation.",
          ],
        },
      ],
    },
    speakerNotes: [
      "The demo is usually not the hard part.",
      "The real challenge is everything underneath the demo: pipelines, permissions, compute, security, and operating model.",
      "That is why AI adoption is a systems challenge, not simply a tooling challenge.",
      "The next slide shows that even infrastructure outside the company starts to matter at scale.",
    ],
  },
  {
    id: "slide-10",
    layout: "evidence",
    title: "AI scale depends on infrastructure far beyond the model itself",
    titleLines: [
      "AI scale depends on infrastructure",
      "far beyond the model itself",
    ],
    bullets: [],
    sections: [],
    caption:
      "AI scale is constrained by energy, compute, infrastructure, and local operating realities.",
    sourceLabel:
      "Source: IEA Electricity 2026; Axios / Harvard-MIT poll, 3 Apr 2026",
    callouts: [
      {
        value: "3.6%",
        label: "Annual global electricity growth, 2026-2030",
      },
      {
        value: "~2%",
        label: "Annual U.S. electricity growth through 2030",
      },
      {
        value: "~50%",
        label: "Share of U.S. growth from data centres",
      },
    ],
    visual: {
      variant: "infrastructure-growth",
      items: [
        {
          label: "Global electricity demand growth",
          value: "3.6%",
          note: "Annual, 2026–2030",
          metric: 3.6,
        },
        {
          label: "U.S. electricity demand growth",
          value: "~2%",
          note: "Annual through 2030",
          metric: 2,
        },
        {
          label: "Demand growth from data centres",
          value: "~50%",
          note: "Share of U.S. growth",
          metric: 50,
        },
      ],
    },
    speakerNotes: [
      "I like this slide because it makes AI scale feel physical, not just digital.",
      "Those three figures remind us that compute ambition runs into energy, infrastructure, and operating constraints.",
      "Infrastructure readiness includes power, capacity, security, and local acceptance.",
      "That is one reason adoption will spread faster than durable advantage.",
    ],
  },
  {
    id: "slide-11",
    layout: "question",
    kicker: "Q5",
    title:
      "Which organizations will actually turn AI into differentiated advantage, and why will most not?",
    titleLines: [
      "Which organizations will actually",
      "turn AI into differentiated advantage,",
      "and why will most not?",
    ],
    bullets: [
      "Most firms will adopt some AI",
      "Few will convert it into durable advantage",
      "Leaders redesign workflows, data, governance, and operating models",
      "Laggards focus on tools without transformation",
    ],
    sections: [],
    visual: {
      variant: "leaders-laggards",
      items: [
        { group: "Leaders", label: "Workflow redesign" },
        { group: "Leaders", label: "Governed deployment" },
        { group: "Laggards", label: "Tool accumulation" },
        { group: "Laggards", label: "Disconnected pilots" },
      ],
    },
    speakerNotes: [
      "This is really the gap between activity and transformation.",
      "Access to AI will spread broadly, but durable advantage will not spread evenly.",
      "The dividing line is workflow redesign, governed deployment, and operating-model change.",
      "That is why the next slide separates adoption metrics from actual value creation.",
    ],
  },
  {
    id: "slide-12",
    layout: "evidence",
    title: "The gap between adoption and advantage is where winners emerge",
    titleLines: [
      "The gap between adoption and advantage",
      "is where winners emerge",
    ],
    bullets: [],
    sections: [],
    caption:
      "AI adoption is spreading faster than durable business advantage.",
    sourceLabel: "Source: Deloitte 2026",
    callouts: [
      {
        value: "66%",
        label: "Productivity + efficiency gains",
      },
      {
        value: "53%",
        label: "Better insights + decisions",
      },
      {
        value: "20%",
        label: "Increased revenue",
      },
      {
        value: "34%",
        label: "Deep business transformation",
      },
    ],
    visual: {
      variant: "adoption-value-gap",
      items: [
        {
          group: "Adoption",
          label: "Productivity and efficiency",
          value: "66%",
          metric: 66,
        },
        {
          group: "Value",
          label: "Improved decisions",
          value: "53%",
          metric: 53,
        },
        {
          group: "Value",
          label: "Revenue impact",
          value: "20%",
          metric: 20,
        },
      ],
    },
    speakerNotes: [
      "These numbers show that adoption benefits appear before strategic advantage does.",
      "A lot of firms will look successful on activity metrics long before they have durable advantage.",
      "That is why deep transformation matters more than surface-level usage.",
      "The final question, then, comes back to people and agency.",
    ],
  },
  {
    id: "slide-13",
    layout: "question",
    kicker: "Q6",
    title: "Do AI agents reduce human agency, or expand it?",
    titleLines: [
      "Do AI agents reduce",
      "human agency,",
      "or expand it?",
    ],
    bullets: [
      "AI can be used to replace effort",
      "Or it can be used to expand leverage",
      "The future depends on how organizations redesign work",
      "The strongest professionals will use AI to create more value, not just faster output",
    ],
    sections: [],
    visual: {
      variant: "human-plus-system",
      items: [
        {
          label: "Replace effort",
          detail:
            "AI can be used narrowly to reduce labor while leaving the work model mostly unchanged.",
          speakerNotes: [
            "One path is to use AI narrowly to replace effort while leaving the work model mostly unchanged.",
            "That path may cut cost, but it does not automatically expand human capability.",
          ],
        },
        {
          label: "Expand leverage",
          detail:
            "It can also expand the complexity, experimentation, and output that one person can handle.",
          speakerNotes: [
            "The stronger path is to use AI to expand leverage.",
            "That means one person can handle more complexity, more experimentation, and more output with good judgment.",
          ],
        },
        {
          label: "Redesign roles",
          detail:
            "The highest upside comes when organizations rethink who does what and how decisions flow.",
          speakerNotes: [
            "The real upside comes when organizations redesign roles instead of just speeding up old tasks.",
            "That is where AI becomes a force for better systems, not just faster artifacts.",
          ],
        },
        {
          label: "Create more value",
          detail:
            "The strongest professionals use AI to produce better outcomes, not only faster artifacts.",
          speakerNotes: [
            "The strongest professionals will use AI to create more value, not simply produce output faster.",
            "That is the difference between automation as substitution and automation as amplification.",
          ],
        },
      ],
    },
    speakerNotes: [
      "I would frame this final question around leverage and agency, not just automation.",
      "There is a big difference between replacement logic and redesign logic.",
      "My view is that AI is most powerful when it multiplies high-agency people.",
      "The next slide shows why that conversation now extends into the world of agents.",
    ],
  },
  {
    id: "slide-14",
    layout: "evidence",
    title: "Agentic AI adoption is rising faster than disciplined measurement",
    titleLines: [
      "Agentic AI adoption is rising faster",
      "than disciplined measurement",
    ],
    bullets: [],
    sections: [],
    caption:
      "Interest in agentic AI is accelerating, but measurement discipline still lags behind deployment ambition.",
    sourceLabel:
      "Source: Thomson Reuters Future of Professionals Report 2026",
    callouts: [
      {
        value: "15%",
        label: "Current agentic AI use",
      },
      {
        value: "53%",
        label: "Planning or considering agentic AI",
      },
      {
        value: "77%",
        label: "Expect agentic AI central to workflow by 2030",
      },
      {
        value: "18%",
        label: "Currently collect AI ROI metrics",
      },
    ],
    visual: {
      variant: "agentic-readiness",
      items: [
        {
          group: "Current",
          label: "Current use",
          value: "15%",
          metric: 15,
          detail:
            "Agentic AI is still early in real deployment, even though interest is high.",
          speakerNotes: [
            "Agentic AI is still early in actual deployment.",
            "So despite the noise, real implementation maturity is still relatively low today.",
          ],
        },
        {
          group: "Planned",
          label: "Planning or considering",
          value: "53%",
          metric: 53,
          detail:
            "A large middle group is actively exploring where agents may fit into professional workflows.",
          speakerNotes: [
            "What is striking is the size of the middle group that is actively exploring agents.",
            "That tells us the experimentation wave is moving much faster than the proof-of-value wave.",
          ],
        },
        {
          group: "Future",
          label: "Central by 2030",
          value: "77%",
          metric: 77,
          detail:
            "The expectation of future centrality is much higher than today’s actual implementation maturity.",
          speakerNotes: [
            "The 2030 expectation is dramatically higher than current maturity.",
            "That gap is where a lot of strategic optimism is sitting right now.",
          ],
        },
        {
          group: "Measurement",
          label: "Collect ROI metrics",
          value: "18%",
          metric: 18,
          detail:
            "Measurement discipline remains weak, which is one reason value still lags ambition.",
          speakerNotes: [
            "And then comes the discipline problem: only a small group is actually measuring ROI today.",
            "That is one reason ambition is still outrunning realized value.",
          ],
        },
      ],
    },
    speakerNotes: [
      "This slide is really about the gap between ambition and discipline.",
      "Interest in agentic AI is clearly rising, but measurement maturity is still low.",
      "If we want better human outcomes, we need better redesign and better measurement at the same time.",
      "So let me close by translating all six questions into what they mean for the analyst in the room.",
    ],
  },
  {
    id: "slide-15",
    layout: "capabilities",
    title: "What these six questions mean for the future analyst",
    titleLines: [
      "What these six questions mean",
      "for the future analyst",
    ],
    bullets: [
      "Works across structured and unstructured data",
      "Evaluates AI outputs, not just generates",
      "Understands governance, lineage + risk",
      "Translates analysis into action",
    ],
    sections: [],
    caption:
      "In a world full of AI-generated outputs, trusted analysts become even more valuable.",
    callouts: [
      {
        value: "Data discipline",
        label: "Builds reliable, machine-usable foundations",
      },
      {
        value: "Decision judgment",
        label: "Knows where AI should and should not be trusted",
      },
      {
        value: "Communication power",
        label: "Turns analysis into aligned action",
      },
    ],
    visual: {
      variant: "capability-pillars",
      items: [
        {
          group: "Capability",
          label: "Data discipline",
          note: "Structured + unstructured data fluency",
          detail:
            "Trusted analysts can move across messy, structured, and unstructured data without losing reliability.",
          speakerNotes: [
            "First, the future analyst needs strong data discipline.",
            "That means working across messy, structured, and unstructured data without losing reliability.",
          ],
        },
        {
          group: "Capability",
          label: "Decision judgment",
          note: "Evaluation + trust boundaries",
          detail:
            "The role increasingly depends on deciding where AI should be trusted, challenged, or constrained.",
          speakerNotes: [
            "Second, the future analyst needs decision judgment.",
            "The role now includes deciding where AI should be trusted, challenged, or constrained.",
          ],
        },
        {
          group: "Capability",
          label: "Communication power",
          note: "Analysis into action",
          detail:
            "The final advantage comes from turning analysis into aligned action, not simply generating output.",
          speakerNotes: [
            "Third, the future analyst needs communication power.",
            "The real advantage comes from turning analysis into aligned action, not just generating output.",
          ],
        },
      ],
    },
    speakerNotes: [
      "This is where I would broaden the analyst role beyond dashboard building.",
      "The three anchor capabilities are data discipline, decision judgment, and communication power.",
      "Together, they connect trust, governance, and action in an AI-rich environment.",
      "And that is why judgment becomes more valuable, not less valuable, as AI spreads.",
    ],
  },
  {
    id: "slide-16",
    layout: "closing",
    title:
      "“The winners of the AI era won’t just use more AI, they will make decisions with better data, stronger judgement and with clearer accountability”",
    titleLines: [
      "“The winners of the AI era",
      "won’t just use more AI,",
      "they will make decisions",
      "with better data, stronger judgement",
      "and with clearer accountability”",
    ],
    bullets: [],
    sections: [],
    caption: "",
    speakerNotes: [
      "This is the closing synthesis, not another recap slide.",
      "I would slow down on the phrases better data, stronger judgment, and clearer accountability.",
      "Those three ideas are really the operating logic of advantage in the AI era.",
      "Let the line land, and then hand the room forward rather than backward.",
    ],
  },
  {
    id: "slide-17",
    layout: "statement",
    title: "AI-native Analysts of Tomorrow.",
    titleLines: ["AI-native", "Analysts of Tomorrow."],
    bullets: [],
    sections: [],
    caption: "",
    speakerNotes: [
      "I would use this as the final challenge to the room.",
      "AI-native is not a future label that arrives one day. It is a posture people start building now.",
      "The invitation is to develop data discipline, judgment, and agency before the market forces that shift on you.",
    ],
  },
  {
    id: "slide-18",
    layout: "qr",
    title: "Connect with me on LinkedIn",
    titleLines: ["Connect with me", "on LinkedIn"],
    subtitle: "Scan to stay in touch after the session.",
    qrValue: "https://www.linkedin.com/in/therushivyas/",
    qrLabel: "linkedin.com/in/therushivyas",
    bullets: [],
    sections: [],
    caption: "",
    speakerNotes: [
      "If this sparked something useful, feel free to connect with me after the session.",
      "I will pause for a moment so people at the back can scan the code as well.",
      "Thank you for the time, and I would be very happy to continue the conversation afterward.",
    ],
  },
];

export const createInfs5700KeynoteProjectLibraryMeta =
  (): DocumentLibraryMeta => ({
    isListed: true,
    cardCompany: INFS5700_KEYNOTE_CLIENT,
    cardTitle: INFS5700_KEYNOTE_TITLE,
    cardCategory: INFS5700_KEYNOTE_CATEGORY,
    cardStatusLabel: INFS5700_KEYNOTE_STATUS_LABEL,
    cardSummary:
      "A presentation on how AI is reshaping analytics work, data readiness, governance, and competitive advantage.",
    cardLogoUrl: INFS5700_KEYNOTE_CARD_LOGO_URL,
  });

export const createInfs5700KeynoteProjectLibraryCard = (
  values?: Partial<StudioLibraryCard>
): StudioLibraryCard => ({
  id: values?.id || "fallback-infs5700-keynote",
  engagementId: values?.engagementId ?? null,
  code: INFS5700_KEYNOTE_PROJECT_CODE,
  kind: "project",
  documentStatus: "published",
  updatedAt: values?.updatedAt,
  ...createInfs5700KeynoteProjectLibraryMeta(),
});

export const createInfs5700KeynoteProjectContent =
  (): ProjectDocumentContent => ({
    mode: "project",
    projectVariant: "presentation",
    quoteId: INFS5700_KEYNOTE_PROJECT_CODE,
    logoUrl: INFS5700_KEYNOTE_PDF_LOGO_URL,
    issuedOn: "2026-04-08",
    validUntil: "2026-12-31",
    introText:
      "A presentation exploring how AI is reshaping business analytics, decision-making, data readiness, and long-term competitive advantage.",
    notes:
      "Designed as a live presentation experience with fullscreen desktop presenting and a paired mobile remote for speaker notes and slide control.",
    terms:
      "Shared through the studio as a presentation project. The deck can be opened directly on desktop and paired with a mobile remote using the session link.",
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
      theme: "breathing-hue",
      branding: {
        speakerName: "Rushi Vyas",
        website: "rushi.knowwhatson.com",
        tagline: "Human + Business + AI = Intelligence",
        footerMode: "all",
      },
      slides: INFS5700_KEYNOTE_SLIDES,
    },
    defaultSelectedBaseIds: [],
    defaultSelectedAddOnIds: [],
    recommendedTimeline: undefined,
    baseOptions: [],
    addOnOptions: [],
    bundleOptions: [],
    quoteLineOverrides: [],
    libraryMeta: createInfs5700KeynoteProjectLibraryMeta(),
  });

export const createInfs5700KeynoteProjectDocumentSeed =
  (): StudioDocument => ({
    kind: "project",
    code: INFS5700_KEYNOTE_PROJECT_CODE,
    status: "published",
    title: INFS5700_KEYNOTE_TITLE,
    clientName: INFS5700_KEYNOTE_CLIENT,
    clientCompany: INFS5700_KEYNOTE_ORGANISATION,
    clientEmail: "",
    ctaLabel: "Email Rushi",
    adminEmail: "rushi@knowwhatson.com",
    content: createInfs5700KeynoteProjectContent(),
  });

export const isInfs5700KeynoteProjectPublicCode = (code: string) =>
  code.trim().toUpperCase() === INFS5700_KEYNOTE_PROJECT_CODE;
