import { portfolioContent } from "../data/portfolioContent";

export type LinkItem = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type DetailItem = {
  title: string;
  body: string;
};

export type ProofReference = {
  slug: CaseStudySlug;
  reason: string;
};

export type CaseStudySlug =
  | "whats-on-platform"
  | "ai-me"
  | "acu-admissions-ai"
  | "milli";

export type ServicePageSlug =
  | "ai-training"
  | "ai-fluency-workshops"
  | "genai-upskilling"
  | "ai-workshops"
  | "executive-ai-workshops"
  | "ai-consultants"
  | "ai-software-development"
  | "ai-keynote-speaker"
  | "ai-facilitator";

export type IndustryPageSlug =
  | "higher-education"
  | "government"
  | "professional-services"
  | "smes";

export type CityPageSlug =
  | "sydney"
  | "sydney-ai-training"
  | "sydney-ai-keynote-speaker"
  | "sydney-ai-consultants"
  | "sydney-ai-software-development";

export interface CaseStudyPageData {
  slug: CaseStudySlug;
  path: string;
  title: string;
  client: string;
  year: string;
  location: string;
  category: string;
  headline: string;
  summary: string;
  image: string;
  metrics: string[];
  challenge: string;
  approach: string[];
  outcome: string;
  relatedServices: LinkItem[];
}

export interface StructuredPageData {
  slug: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  answerBlock: string;
  audience: string[];
  outcomes: string[];
  formats: DetailItem[];
  topics: string[];
  proof: ProofReference[];
  faq: FaqItem[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryLinks: LinkItem[];
}

export interface ResourceGuide {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  href: string;
}

export const siteDetails = {
  origin: "https://rushi.knowwhatson.com",
  supportOrigin: "https://www.knowwhatson.com",
  name: "Rushi Vyas",
  company: "What's On!",
  title: "AI Trainer, Consultant, and Keynote Speaker",
  description:
    "Sydney-based AI training, AI fluency workshops, GenAI upskilling, AI software development, and keynote speaking for Australian organisations.",
  email: portfolioContent.contact.email,
  linkedin: portfolioContent.contact.linkedin,
  location: "Sydney, Australia",
  lastUpdatedIso: "2026-04-12",
  lastUpdatedLabel: "12 April 2026",
  portraitImage: "/images/presentation/rushi-vyas-intro-v2.png",
  openGraphImage: "/images/presentation/rushi-vyas-intro-v2.png",
};

export const primaryNavLinks: LinkItem[] = [
  { label: "AI Training", href: "/ai-training/" },
  { label: "AI Speaker", href: "/ai-keynote-speaker/" },
  { label: "Industries", href: "/industries/higher-education/" },
  { label: "Case Studies", href: "/case-studies/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const serviceLinks: LinkItem[] = [
  { label: "AI Training", href: "/ai-training/" },
  { label: "AI Fluency Workshops", href: "/ai-fluency-workshops/" },
  { label: "GenAI Upskilling", href: "/genai-upskilling/" },
  { label: "AI Workshops", href: "/ai-workshops/" },
  { label: "Executive AI Workshops", href: "/executive-ai-workshops/" },
  { label: "AI Consultants", href: "/ai-consultants/" },
  { label: "AI Software Development", href: "/ai-software-development/" },
  { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
  { label: "AI Facilitator", href: "/ai-facilitator/" },
];

export const industryLinks: LinkItem[] = [
  { label: "Higher Education", href: "/industries/higher-education/" },
  { label: "Government", href: "/industries/government/" },
  {
    label: "Professional Services",
    href: "/industries/professional-services/",
  },
  { label: "SMEs", href: "/industries/smes/" },
];

export const cityLinks: LinkItem[] = [
  { label: "Sydney hub", href: "/sydney/" },
  { label: "Sydney AI Training", href: "/sydney/ai-training/" },
  {
    label: "Sydney AI Keynote Speaker",
    href: "/sydney/ai-keynote-speaker/",
  },
  { label: "Sydney AI Consultants", href: "/sydney/ai-consultants/" },
  {
    label: "Sydney AI Software Development",
    href: "/sydney/ai-software-development/",
  },
];

export const homeProofStats = [
  "$32M in commercial outcomes supported across AI programs and products",
  "400+ UNSW Finance staff trained through role-specific AI upskilling",
  "92% engagement on UNSW's flagship AI symposium assistant",
  "Sydney-based delivery with work across government, higher education, and brands",
];

export const selectedClientLogos = portfolioContent.logoMarquee
  .filter((item) =>
    [
      "City of Sydney",
      "UNSW",
      "The University of Sydney",
      "UTS",
      "Australian Catholic University",
      "TAFE NSW",
      "Deloitte",
      "LinkedIn",
      "Optus",
      "HCF",
      "Humanitix",
    ].includes(item.name)
  )
  .map((item) => ({
    name: item.name,
    logo: item.logo || "",
  }));

export const featuredTestimonials = [
  portfolioContent.testimonials[0],
  portfolioContent.testimonials[1],
  portfolioContent.testimonials[4],
  portfolioContent.testimonials[6],
];

export const caseStudies: Record<CaseStudySlug, CaseStudyPageData> = {
  "whats-on-platform": {
    slug: "whats-on-platform",
    path: "/case-studies/whats-on-platform/",
    title: "What's On!",
    client: "What's On!",
    year: "2025",
    location: "Sydney and Australia-wide",
    category: "Founder-led AI engagement platform",
    headline:
      "Turning founder-led AI traction into repeatable delivery for government and university audiences.",
    summary:
      "What's On! combined AI engagement design, onboarding, partner enablement, and a repeatable go-to-market rhythm for public-sector and higher-education buyers.",
    image: "/images/work/whats-on-overview.svg",
    metrics: [
      "50+ paying partners in 90 days",
      "150,000+ migrant users supported",
      "APAC Top-3 AI Startup recognition",
    ],
    challenge:
      "The business needed more than a product demo. It needed a practical way to explain value, onboard partners, and show that AI could work inside high-trust environments.",
    approach: [
      "Built the go-to-market motion, onboarding path, demos, and partner enablement around real operational needs.",
      "Positioned the platform around human-centred public service outcomes instead of generic AI automation claims.",
      "Created repeatable proof points for universities, government organisations, and community-facing programs.",
    ],
    outcome:
      "The result was a stronger commercial story, faster partner adoption, and an AI platform that could be cited as credible, useful, and grounded in real service outcomes.",
    relatedServices: [
      { label: "AI Consultants", href: "/ai-consultants/" },
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
    ],
  },
  "ai-me": {
    slug: "ai-me",
    path: "/case-studies/ai-me/",
    title: "AI-me",
    client: "UNSW Sydney",
    year: "2025",
    location: "Sydney, Australia",
    category: "UNSW Sydney AI conference assistant",
    headline:
      "A digital guide for UNSW's flagship AI symposium that handled discovery, logistics, and sponsor surfacing in real time.",
    summary:
      "AI-me helped a 550-attendee symposium answer attendee questions quickly, reduce help-desk load, and make the event feel guided rather than overwhelming.",
    image: "/images/work/ai-me.svg",
    metrics: [
      "92% engagement",
      "1,007 questions answered in 3-5 seconds",
      "~30 hours of help-desk time saved",
    ],
    challenge:
      "The symposium needed a better way to help delegates navigate sessions, logistics, sponsors, and event discovery without relying on queues, printouts, or staff bottlenecks.",
    approach: [
      "Mapped the event journey across attendees, sponsors, and organisers.",
      "Configured a conference-specific assistant around approved content, discovery flows, and practical FAQs.",
      "Designed the experience to surface relevant sessions and sponsor moments without making the event feel over-engineered.",
    ],
    outcome:
      "AI-me became the default digital guide for the event and showed how AI can improve complex live experiences when the design stays useful, fast, and human-centred.",
    relatedServices: [
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
      { label: "AI Consultants", href: "/ai-consultants/" },
    ],
  },
  "acu-admissions-ai": {
    slug: "acu-admissions-ai",
    path: "/case-studies/acu-admissions-ai/",
    title: "ACU Admissions AI",
    client: "ACU",
    year: "2025",
    location: "Australia",
    category: "Admissions and lead-conversion assistant",
    headline:
      "Using conversational AI and gamified flows to turn curiosity into qualified student conversations.",
    summary:
      "ACU Admissions AI combined QR-to-mobile and kiosk flows to guide prospective students toward stronger degree-fit conversations and more useful lead capture.",
    image: "/images/work/acu-ai.svg",
    metrics: [
      "160% lift in qualified leads",
      "85% increase in Q&A engagement",
      "Higher-quality degree conversations",
    ],
    challenge:
      "Prospective students often arrive curious but under-informed. The admissions experience needed to create momentum quickly without overwhelming people with static information.",
    approach: [
      "Created a mobile-first assistant that could guide people through personalised prompts and degree discovery.",
      "Connected gamified interaction design with admissions intent, rather than treating AI as a novelty layer.",
      "Focused the experience on converting curiosity into a more useful next conversation with staff.",
    ],
    outcome:
      "The result was a more engaging enquiry journey and a measurable lift in lead quality, conversation quality, and admissions relevance.",
    relatedServices: [
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
      { label: "Higher Education", href: "/industries/higher-education/" },
    ],
  },
  milli: {
    slug: "milli",
    path: "/case-studies/milli/",
    title: "Milli",
    client: "Government of Karnataka",
    year: "2025",
    location: "Large-scale public event deployment",
    category: "Public event AI assistant",
    headline:
      "Helping delegates, exhibitors, policymakers, and the public navigate a large trade fair at scale.",
    summary:
      "Milli blended multilingual support, event guidance, and commercial discovery to help a major public event serve attendees while still driving useful business outcomes.",
    image: "/images/work/milli.svg",
    metrics: [
      "$32M in expo sales enabled",
      "500,000+ attendees served",
      "163 exhibitors across the event",
    ],
    challenge:
      "The event needed a practical way to support a huge volume of people across logistics, buyer interest, and exhibitor discovery without fragmenting the experience.",
    approach: [
      "Designed the assistant around real-world attendee needs, buyer journeys, and event-scale logistics.",
      "Used multilingual and context-aware guidance to make the experience accessible under pressure.",
      "Balanced public-service usability with commercial momentum so organisers and exhibitors both gained value.",
    ],
    outcome:
      "Milli showed how AI can operate effectively in large, messy, high-traffic environments when the underlying information design is disciplined and outcome-led.",
    relatedServices: [
      { label: "AI Consultants", href: "/ai-consultants/" },
      {
        label: "Government AI Programs",
        href: "/industries/government/",
      },
    ],
  },
};

export const servicePages: Record<ServicePageSlug, StructuredPageData> = {
  "ai-training": {
    slug: "ai-training",
    path: "/ai-training/",
    title: "AI Training for Australian Teams | Rushi Vyas",
    description:
      "Practical AI training for Australian teams across Sydney and beyond, designed for leaders, operators, educators, and non-technical teams.",
    eyebrow: "AI training",
    h1: "AI Training for Australian Teams",
    intro:
      "Practical AI training for leaders, operators, educators, and non-technical teams that need useful habits, strong judgement, and real workflow confidence.",
    answerBlock:
      "I deliver AI training that helps teams move from vague interest to usable capability. Programs are designed for Australian organisations that want practical uptake with tools like ChatGPT, Claude, Copilot, Gemini, and role-specific workflows, without turning the work into hype or jargon.",
    audience: [
      "HR and L&D teams that need a credible upskilling program",
      "Operational teams that want safe, practical AI use across daily work",
      "Universities and public-sector teams that need strong judgement around adoption",
      "Leaders who want their teams using AI with more confidence and less friction",
    ],
    outcomes: [
      "Clearer understanding of where AI genuinely helps and where it does not",
      "Role-specific prompting, review habits, and workflow design",
      "Improved confidence for non-technical teams",
      "A stronger internal adoption story for leaders and program owners",
    ],
    formats: [
      {
        title: "Introductory capability sessions",
        body:
          "Foundational sessions for teams that need common language, safe usage habits, and practical examples to get started well.",
      },
      {
        title: "Role-specific working sessions",
        body:
          "Applied training for finance, operations, strategy, student-facing, or service-facing teams that need relevant exercises rather than generic demos.",
      },
      {
        title: "Multi-session learning programs",
        body:
          "Structured AI training programs for organisations that need reinforcement, implementation support, and stronger follow-through after the first session.",
      },
    ],
    topics: [
      "Prompting and review habits",
      "AI fluency for non-technical teams",
      "Risk, judgement, and governance basics",
      "Workflow design for knowledge work",
      "Team adoption and change enablement",
      "Model choice across ChatGPT, Claude, Copilot, and Gemini",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "Shows practical AI delivery in a complex higher-education setting.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows repeatable AI delivery across public-sector and university audiences.",
      },
    ],
    faq: [
      {
        question: "Who is AI training for?",
        answer:
          "The strongest fit is organisations that want broad practical uptake: leadership teams, non-technical teams, universities, government groups, and cross-functional cohorts that need useful capability rather than only technical theory.",
      },
      {
        question: "Do you train technical teams as well?",
        answer:
          "Yes, but the value usually comes from bridging technical possibilities with business judgement, use-case prioritisation, and implementation reality rather than teaching foundational software engineering from scratch.",
      },
      {
        question: "Can the training be tailored to one sector or team?",
        answer:
          "Yes. Sector-specific and role-specific tailoring is one of the main differentiators. Sessions work best when the examples, risks, and workflow patterns match the audience in the room.",
      },
    ],
    primaryCtaLabel: "Book discovery call",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Fluency Workshops", href: "/ai-fluency-workshops/" },
      { label: "Sydney AI Training", href: "/sydney/ai-training/" },
      { label: "Higher Education", href: "/industries/higher-education/" },
    ],
  },
  "ai-fluency-workshops": {
    slug: "ai-fluency-workshops",
    path: "/ai-fluency-workshops/",
    title: "AI Fluency Workshops for Teams | Rushi Vyas",
    description:
      "AI fluency workshops for non-technical teams across Sydney and Australia, focused on confidence, judgement, and practical daily use.",
    eyebrow: "AI fluency workshops",
    h1: "AI Fluency Workshops for Teams",
    intro:
      "Hands-on AI fluency workshops for non-technical teams that want to use AI more confidently without losing context, quality, or judgement.",
    answerBlock:
      "AI fluency workshops help people become more capable around AI in real work, not just more familiar with the terminology. The goal is confidence, judgement, and useful experimentation for teams that need to adopt AI without becoming technical specialists.",
    audience: [
      "Non-technical teams exploring AI for the first time",
      "Leadership-sponsored capability programs that need practical uptake",
      "University staff and professional teams navigating AI change",
      "Government and community-facing teams that need safe adoption habits",
    ],
    outcomes: [
      "Stronger confidence for people who do not see themselves as technical",
      "A clearer sense of which tools and tasks fit AI well",
      "More disciplined prompting, review, and output checking",
      "A less intimidating starting point for broader adoption work",
    ],
    formats: [
      {
        title: "Introductory fluency workshop",
        body:
          "A practical first workshop that makes AI feel usable, relevant, and grounded in the audience's actual work.",
      },
      {
        title: "Manager and team-lead session",
        body:
          "A companion session for leaders who need to guide experimentation, set expectations, and handle adoption well.",
      },
      {
        title: "Applied follow-up workshop",
        body:
          "A second-stage session that converts initial interest into live role-specific workflows and stronger habits.",
      },
    ],
    topics: [
      "What AI fluency really means at work",
      "How to prompt clearly and review outputs critically",
      "When to trust, challenge, or constrain AI",
      "Using AI without feeling overwhelmed",
      "Human judgement and accountability in AI-rich environments",
      "Simple operating habits that make AI more useful day to day",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Demonstrates human-centred AI positioning in high-trust environments.",
      },
      {
        slug: "ai-me",
        reason:
          "Shows AI used practically inside a Sydney higher-education context.",
      },
    ],
    faq: [
      {
        question: "How is AI fluency different from generic AI training?",
        answer:
          "AI fluency focuses more explicitly on confidence, judgement, and practical daily use for non-technical teams. It is often the right entry point before deeper workflow or technical training.",
      },
      {
        question: "Do these workshops work for sceptical audiences?",
        answer:
          "Yes. In fact, sceptical audiences often respond best when the session stays grounded in real work, real risks, and clear examples rather than hype.",
      },
      {
        question: "Can AI fluency workshops be delivered onsite in Sydney?",
        answer:
          "Yes. Sydney delivery is a strong fit, and virtual or hybrid formats can be structured for interstate teams as well.",
      },
    ],
    primaryCtaLabel: "Request workshop outline",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      { label: "GenAI Upskilling", href: "/genai-upskilling/" },
      { label: "Sydney AI Training", href: "/sydney/ai-training/" },
    ],
  },
  "genai-upskilling": {
    slug: "genai-upskilling",
    path: "/genai-upskilling/",
    title: "GenAI Upskilling Programs | Rushi Vyas",
    description:
      "GenAI upskilling programs for Australian organisations that want practical capability with LLMs, agents, prompting, and workflow design.",
    eyebrow: "GenAI upskilling",
    h1: "GenAI Upskilling Programs",
    intro:
      "Structured GenAI upskilling for organisations that want more than a one-off workshop and need capability that can hold up in day-to-day work.",
    answerBlock:
      "GenAI upskilling works best when it combines training, implementation support, and clear internal language around how people should use LLMs well. These programs are designed for organisations that want stronger adoption across real work, not just awareness of the tools.",
    audience: [
      "L&D teams designing a longer AI capability pathway",
      "Leadership teams that need more than a one-off introduction",
      "Cross-functional teams learning to use ChatGPT, Claude, Copilot, or Gemini consistently",
      "Programs that need reinforcement, practical application, and measurable lift over time",
    ],
    outcomes: [
      "Clearer internal standards for safe, useful GenAI use",
      "Better translation from workshops into live workflows",
      "Higher confidence around prompting, review, and model choice",
      "Stronger adoption momentum across multiple teams or cohorts",
    ],
    formats: [
      {
        title: "Capability pathway design",
        body:
          "A staged upskilling structure that moves from fundamentals to applied practice and then into team-specific workflows.",
      },
      {
        title: "Cohort-based learning",
        body:
          "Programs for multiple teams or leadership cohorts that need a shared learning arc rather than fragmented sessions.",
      },
      {
        title: "Implementation follow-through",
        body:
          "Follow-up sessions that turn training into actual usage patterns, examples, and operating habits.",
      },
    ],
    topics: [
      "LLM fundamentals in plain English",
      "Model choice and task fit",
      "Prompting and evaluation",
      "GenAI workflow design",
      "Governance and safe-use guardrails",
      "AI adoption measurement and internal enablement",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows repeatable capability-building and enablement inside a real AI business.",
      },
      {
        slug: "acu-admissions-ai",
        reason:
          "Shows how structured GenAI use can connect to measurable operational outcomes.",
      },
    ],
    faq: [
      {
        question: "When should an organisation choose GenAI upskilling over a single workshop?",
        answer:
          "Choose upskilling when you need durable change: multiple teams, multiple sessions, reinforcement, clearer internal habits, and better translation from ideas into live work.",
      },
      {
        question: "Do you cover tools beyond ChatGPT?",
        answer:
          "Yes. The work can cover ChatGPT, Claude, Copilot, Gemini, and the workflow logic for choosing among them based on task, governance, and context.",
      },
      {
        question: "Can the program include leadership and staff streams?",
        answer:
          "Yes. Separate streams often work well, because leaders need adoption and governance clarity while teams need hands-on practice.",
      },
    ],
    primaryCtaLabel: "Get program proposal",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      {
        label: "Executive AI Workshops",
        href: "/executive-ai-workshops/",
      },
      { label: "Government", href: "/industries/government/" },
    ],
  },
  "ai-workshops": {
    slug: "ai-workshops",
    path: "/ai-workshops/",
    title: "AI Workshops for Teams | Rushi Vyas",
    description:
      "AI workshops for Australian teams that need a practical, tailored session for leadership, operations, education, or public-sector settings.",
    eyebrow: "AI workshops",
    h1: "AI Workshops for Teams",
    intro:
      "Tailored AI workshops for teams that want a practical working session rather than a generic AI talk.",
    answerBlock:
      "AI workshops are ideal when the goal is focused learning, alignment, or workflow design around a specific audience. They can be introductory or applied, but the common thread is that the room leaves with clearer judgement, sharper examples, and an immediate next step.",
    audience: [
      "Teams that need a focused AI session tied to real work",
      "Leadership or program owners who want a practical team workshop",
      "Organisations exploring adoption, workflow redesign, or capability lift",
      "Events and internal offsites that need a facilitator-led AI session",
    ],
    outcomes: [
      "Sharper team alignment around use cases and priorities",
      "Practical exercises tied to the audience's context",
      "A clearer sense of immediate next actions",
      "Less hype and more usable clarity in the room",
    ],
    formats: [
      {
        title: "Half-day workshop",
        body:
          "A focused session that combines explanation, examples, and applied workshopping around the team's own tasks.",
      },
      {
        title: "Leadership and team pair",
        body:
          "A combination format where leaders get strategic framing and teams get more practical exercises.",
      },
      {
        title: "Conference or capability workshop",
        body:
          "An AI workshop designed for internal programs, innovation days, summit breakouts, or stakeholder capability events.",
      },
    ],
    topics: [
      "How AI changes the work, not just the toolset",
      "Practical prompting and output review",
      "Use-case discovery",
      "Where AI helps, where it creates risk, and where it wastes time",
      "Workflow redesign and change enablement",
      "Sector-specific adoption patterns",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "Shows tailored AI design for a complex live audience environment.",
      },
      {
        slug: "milli",
        reason:
          "Shows AI used practically under event-scale and stakeholder complexity.",
      },
    ],
    faq: [
      {
        question: "What's the difference between AI workshops and AI training?",
        answer:
          "Training usually implies a broader or more structured learning pathway. Workshops are more focused, often shorter, and tailored to a specific question, audience, or team moment.",
      },
      {
        question: "Can AI workshops be built around our own use cases?",
        answer:
          "Yes. That is usually where the workshop becomes far more useful and memorable than an off-the-shelf session.",
      },
      {
        question: "Do you run virtual AI workshops as well?",
        answer:
          "Yes. Virtual, onsite, and hybrid formats are all possible depending on the audience and the level of interaction needed.",
      },
    ],
    primaryCtaLabel: "Enquire about workshop",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      {
        label: "Executive AI Workshops",
        href: "/executive-ai-workshops/",
      },
      { label: "AI Facilitator", href: "/ai-facilitator/" },
    ],
  },
  "executive-ai-workshops": {
    slug: "executive-ai-workshops",
    path: "/executive-ai-workshops/",
    title: "Executive AI Workshops for Leaders | Rushi Vyas",
    description:
      "Executive AI workshops for leadership teams and boards that need practical understanding, adoption priorities, and implementation judgement.",
    eyebrow: "Executive AI workshops",
    h1: "Executive AI Workshops for Leaders",
    intro:
      "Executive AI workshops for leadership teams, boards, and transformation sponsors that need clear decisions rather than generic future-of-AI noise.",
    answerBlock:
      "Executive AI workshops are built for leaders who need a practical view of what matters now: where AI can create leverage, where it creates risk, and how to guide adoption without losing strategic clarity. The best sessions give leaders a better operating view, not just a better vocabulary list.",
    audience: [
      "Executive teams and senior leaders",
      "Boards and advisory groups",
      "Transformation, innovation, and strategy sponsors",
      "Leaders preparing a wider organisational AI capability push",
    ],
    outcomes: [
      "Clearer understanding of practical AI opportunities and limits",
      "Better leadership language around adoption, governance, and measurement",
      "Sharper prioritisation across teams, workflows, and experiments",
      "A more grounded path from AI interest to organisational action",
    ],
    formats: [
      {
        title: "Executive briefing",
        body:
          "A concise strategic session for leaders who need orientation, key decisions, and a realistic view of what the organisation should focus on next.",
      },
      {
        title: "Leadership workshop",
        body:
          "A more interactive session with decision points, use-case prioritisation, and implementation discussion.",
      },
      {
        title: "Board or advisory presentation",
        body:
          "A high-signal session focused on governance, opportunity framing, and what meaningful leadership oversight actually looks like in practice.",
      },
    ],
    topics: [
      "How leaders should think about AI adoption",
      "Risk, governance, and accountability",
      "Where AI fits the organisation's operating model",
      "What not to delegate to AI",
      "Capability-building versus technology buying",
      "Measurement, ROI, and disciplined experimentation",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows AI positioned credibly for public-sector and higher-ed leadership audiences.",
      },
      {
        slug: "milli",
        reason:
          "Shows AI delivery inside a high-stakes, stakeholder-heavy environment.",
      },
    ],
    faq: [
      {
        question: "Are executive AI workshops technical?",
        answer:
          "They are technical enough to make good decisions, but the focus is leadership judgement, adoption logic, governance, and strategic clarity rather than engineering depth.",
      },
      {
        question: "Can these sessions be tailored to our sector?",
        answer:
          "Yes. Sector context changes the shape of the conversation significantly, especially across government, higher education, professional services, and SMEs.",
      },
      {
        question: "Do you also run the follow-on team workshops after the executive session?",
        answer:
          "Yes. That sequence often works well because leadership alignment and broader capability building need to reinforce each other.",
      },
    ],
    primaryCtaLabel: "Book leadership session",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
      { label: "AI Consultants", href: "/ai-consultants/" },
      { label: "Government", href: "/industries/government/" },
    ],
  },
  "ai-consultants": {
    slug: "ai-consultants",
    path: "/ai-consultants/",
    title: "AI Consultants for Australian Organisations | Rushi Vyas",
    description:
      "AI consulting for Australian organisations that need practical strategy, scoped delivery, workflow design, and implementation judgement.",
    eyebrow: "AI consultants",
    h1: "AI Consultants for Australian Organisations",
    intro:
      "Practical AI consulting for organisations that need scope, clarity, and implementation judgement across training, workflows, products, and delivery priorities.",
    answerBlock:
      "AI consulting is most useful when the real challenge is not whether AI exists, but what to do with it, where to start, and how to avoid wasted motion. I help organisations frame the right opportunities, shape credible programs, and move toward delivery with stronger judgement.",
    audience: [
      "Leaders deciding where AI should sit in the operating model",
      "Program owners shaping a scoped AI initiative",
      "Teams comparing training, workflow, and software priorities",
      "Organisations that need an experienced external view without empty hype",
    ],
    outcomes: [
      "Clearer use-case prioritisation and sequencing",
      "Better alignment between leadership ambition and operational reality",
      "Stronger scope definition for capability or software work",
      "A more disciplined path from idea to implementation",
    ],
    formats: [
      {
        title: "Discovery and scoping",
        body:
          "Short, focused consulting work to frame goals, identify priorities, and decide what should happen first.",
      },
      {
        title: "Adoption and workflow consulting",
        body:
          "Work focused on how teams should actually use AI, what habits need to change, and where capability or process redesign is needed.",
      },
      {
        title: "Product and delivery consulting",
        body:
          "Advisory work that shapes AI products, internal tools, event assistants, and knowledge workflows before or during delivery.",
      },
    ],
    topics: [
      "Use-case prioritisation",
      "AI readiness and adoption planning",
      "Workflow design",
      "Capability-building strategy",
      "Product framing and solution design",
      "Measurement and stakeholder alignment",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows the link between AI strategy, delivery, enablement, and commercial traction.",
      },
      {
        slug: "ai-me",
        reason:
          "Shows AI consulting translated into a live, useful, measurable experience.",
      },
    ],
    faq: [
      {
        question: "When should an organisation bring in an AI consultant?",
        answer:
          "Usually when the work is stuck between ambition and execution: too early to build blindly, but too important to leave vague.",
      },
      {
        question: "Do you only consult on software?",
        answer:
          "No. The work spans capability building, workflow design, leadership decision-making, and product or program scoping depending on what the organisation actually needs.",
      },
      {
        question: "Can AI consulting lead into training or software delivery?",
        answer:
          "Yes. That is often the best path, because strong consulting work sharpens the next step instead of treating each service in isolation.",
      },
    ],
    primaryCtaLabel: "Start scoped brief",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
      { label: "AI Training", href: "/ai-training/" },
      { label: "Sydney AI Consultants", href: "/sydney/ai-consultants/" },
    ],
  },
  "ai-software-development": {
    slug: "ai-software-development",
    path: "/ai-software-development/",
    title: "AI Software Development for Australian Organisations | Rushi Vyas",
    description:
      "Custom AI software development for Australian organisations, including assistants, knowledge systems, workflow tools, and event or service experiences.",
    eyebrow: "AI software development",
    h1: "AI Software Development for Australian Organisations",
    intro:
      "Custom AI software development for organisations that need useful assistants, knowledge systems, workflow tools, and event or service experiences that people will actually use.",
    answerBlock:
      "AI software development only creates value when the product design, information design, and workflow logic are strong. I work on custom AI assistants, event experiences, and internal or external tools that need to feel practical, trustworthy, and aligned with real user behaviour.",
    audience: [
      "Organisations building custom AI assistants or knowledge experiences",
      "Universities and public-sector teams needing guided service tools",
      "Programs that need RAG, event AI, conversational interfaces, or workflow support",
      "Leaders who want scoped custom AI delivery rather than generic tooling",
    ],
    outcomes: [
      "AI products shaped around actual user needs and operational contexts",
      "Stronger translation from content and knowledge into useful interfaces",
      "Clearer alignment between business goals and technical scope",
      "Measurable delivery outcomes rather than speculative prototypes",
    ],
    formats: [
      {
        title: "Discovery and solution framing",
        body:
          "Define the job to be done, the interaction model, the knowledge sources, and the operational constraints before build decisions harden.",
      },
      {
        title: "Custom assistant delivery",
        body:
          "Build assistants and AI surfaces for events, services, admissions, or internal workflows where content quality and user clarity matter.",
      },
      {
        title: "Product evolution support",
        body:
          "Refine, expand, and operationalise existing AI products so they become more useful, measurable, and scalable over time.",
      },
    ],
    topics: [
      "Custom AI assistants",
      "Knowledge systems and retrieval design",
      "Event AI and guided service experiences",
      "Workflow support tools",
      "Product strategy and UX for AI",
      "Operational rollout and enablement",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "Shows a Sydney AI assistant deployed for a complex live event.",
      },
      {
        slug: "acu-admissions-ai",
        reason:
          "Shows a conversion-focused AI assistant tied to measurable outcomes.",
      },
      {
        slug: "milli",
        reason:
          "Shows AI operating at public-event scale with commercial impact.",
      },
    ],
    faq: [
      {
        question: "What kinds of AI software do you build?",
        answer:
          "The strongest fit is custom assistants, guided knowledge tools, event or service experiences, and workflow support products where information quality and user trust matter.",
      },
      {
        question: "Do you work on both strategy and delivery?",
        answer:
          "Yes. That overlap is often where the work becomes more effective, because the product and the operating logic are designed together.",
      },
      {
        question: "Can software development be paired with internal training?",
        answer:
          "Yes. That is often useful when teams need both a product and the capability to use, govern, or support it well.",
      },
    ],
    primaryCtaLabel: "Request discovery sprint",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Consultants", href: "/ai-consultants/" },
      { label: "Case Studies", href: "/case-studies/" },
      {
        label: "Sydney AI Software Development",
        href: "/sydney/ai-software-development/",
      },
    ],
  },
  "ai-keynote-speaker": {
    slug: "ai-keynote-speaker",
    path: "/ai-keynote-speaker/",
    title: "AI Keynote Speaker in Australia | Rushi Vyas",
    description:
      "AI keynote speaker for Australian conferences, leadership events, universities, and internal summits, with practical, high-signal talks on AI adoption and strategy.",
    eyebrow: "AI keynote speaker",
    h1: "AI Keynote Speaker in Australia",
    intro:
      "A Sydney-based AI keynote speaker for conferences, leadership events, universities, and internal summits that need a practical view of AI rather than recycled hype.",
    answerBlock:
      "My talks are built for organisations and event teams that want substance, clarity, and useful provocation. The strongest keynotes connect AI to leadership, judgement, adoption, and the operating realities people are facing now, instead of repeating the same future-of-work clichés.",
    audience: [
      "Conference organisers and summit teams",
      "Leadership offsites and executive events",
      "Universities and higher-education forums",
      "Teams that want a keynote plus workshop or facilitation option",
    ],
    outcomes: [
      "A talk that feels current, practical, and relevant to the audience in the room",
      "Clearer language around AI adoption, judgement, and strategic trade-offs",
      "A strong opening, closing, or anchor session for an event program",
      "Optional continuity into a workshop, panel, or facilitation session",
    ],
    formats: [
      {
        title: "Conference keynote",
        body:
          "A polished keynote tailored to the event audience, sector, and level of AI maturity in the room.",
      },
      {
        title: "Leadership keynote plus Q&A",
        body:
          "A keynote designed to provoke useful conversation and leave leaders with sharper questions as well as clearer decisions.",
      },
      {
        title: "Keynote plus workshop or facilitation",
        body:
          "A combination format for organisations that want more than inspiration and need a stronger practical follow-through.",
      },
    ],
    topics: [
      "AI adoption and durable advantage",
      "Human judgement in an AI-rich environment",
      "How leaders should think about AI now",
      "AI fluency and workforce capability",
      "Agentic AI, measurement, and organisational discipline",
      "What separates useful AI from expensive theatre",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows a founder-operator perspective grounded in real AI delivery.",
      },
      {
        slug: "ai-me",
        reason:
          "Shows direct relevance to AI event and symposium audiences.",
      },
    ],
    faq: [
      {
        question: "What kinds of events are the best fit?",
        answer:
          "The strongest fit is leadership events, conferences, university forums, and sector gatherings where the audience wants practical clarity and a credible point of view on AI.",
      },
      {
        question: "Can the keynote be tailored to our audience?",
        answer:
          "Yes. Tailoring for audience maturity, sector context, and event purpose is part of what makes the keynote land properly.",
      },
      {
        question: "Do you also facilitate panels or workshops around the keynote?",
        answer:
          "Yes. That combination works well for event organisers who want a stronger bridge between inspiration and action.",
      },
    ],
    primaryCtaLabel: "Check availability",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Facilitator", href: "/ai-facilitator/" },
      {
        label: "Sydney AI Keynote Speaker",
        href: "/sydney/ai-keynote-speaker/",
      },
      { label: "About Rushi", href: "/about/" },
    ],
  },
  "ai-facilitator": {
    slug: "ai-facilitator",
    path: "/ai-facilitator/",
    title: "AI Facilitator for Workshops and Events | Rushi Vyas",
    description:
      "AI facilitator for workshops, panels, leadership discussions, and capability sessions across Sydney and Australia.",
    eyebrow: "AI facilitator",
    h1: "AI Facilitator for Workshops and Events",
    intro:
      "AI facilitation for organisations and event teams that need a room moved from surface-level interest into useful discussion, alignment, and action.",
    answerBlock:
      "Facilitation matters when the value is not just the content, but what the room does with it. I facilitate AI workshops, panels, strategy sessions, and stakeholder conversations where people need stronger clarity, better discussion quality, and a practical way to move forward together.",
    audience: [
      "Event organisers running AI panels or roundtables",
      "Leadership teams working through AI adoption questions",
      "Capability programs needing workshop facilitation rather than lecture-only delivery",
      "Cross-functional groups that need alignment around AI priorities",
    ],
    outcomes: [
      "Better discussion quality and clearer room dynamics",
      "A stronger bridge between keynote ideas and actionable next steps",
      "More disciplined stakeholder conversation around AI",
      "A session that feels guided, practical, and well-held",
    ],
    formats: [
      {
        title: "Workshop facilitation",
        body:
          "Facilitated sessions that combine explanation, structured discussion, and concrete outputs or decisions.",
      },
      {
        title: "Panel moderation",
        body:
          "AI panel moderation that keeps the discussion sharp, useful, and relevant to the audience instead of drifting into generic talking points.",
      },
      {
        title: "Leadership roundtable facilitation",
        body:
          "A guided leadership conversation for executive groups, advisory bodies, or sector cohorts navigating AI change together.",
      },
    ],
    topics: [
      "AI adoption priorities",
      "Stakeholder alignment",
      "Leadership and workforce capability",
      "Public-sector and higher-ed AI discussion",
      "Panel moderation and audience engagement",
      "Practical next-step design",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "Shows fluency with event audiences and AI-driven engagement experiences.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows a founder-operator perspective grounded in live delivery and stakeholder communication.",
      },
    ],
    faq: [
      {
        question: "Do you facilitate standalone workshops or only as part of a keynote?",
        answer:
          "Both. Some clients bring me in specifically to facilitate the room, while others pair facilitation with a keynote or capability session.",
      },
      {
        question: "Can you moderate AI panels for conferences and summits?",
        answer:
          "Yes. Panel moderation is a strong fit when the organiser wants a higher-quality discussion that still feels accessible to the audience.",
      },
      {
        question: "What makes facilitation different from speaking?",
        answer:
          "Speaking delivers a point of view. Facilitation helps the room think, decide, and move together. They often work well together, but they are different jobs.",
      },
    ],
    primaryCtaLabel: "Request facilitation",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
      { label: "AI Workshops", href: "/ai-workshops/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
};

export const industryPages: Record<IndustryPageSlug, StructuredPageData> = {
  "higher-education": {
    slug: "higher-education",
    path: "/industries/higher-education/",
    title: "AI Training and Consulting for Higher Education | Rushi Vyas",
    description:
      "AI training, keynote speaking, workshops, and software development for universities and higher-education organisations across Australia.",
    eyebrow: "Higher education",
    h1: "AI Training and Consulting for Higher Education",
    intro:
      "AI capability building, speaking, and product work for universities and higher-education teams that need practical adoption and credible delivery.",
    answerBlock:
      "Higher education needs a more nuanced AI approach than most sectors. The work touches staff capability, student experience, service design, governance, and academic context all at once. I help universities and higher-education teams build practical fluency, better conversations, and useful AI delivery in that reality.",
    audience: [
      "University leadership and faculty leaders",
      "Professional staff, capability teams, and operational groups",
      "Admissions, engagement, and service teams",
      "Higher-education conferences, schools, and teaching programs",
    ],
    outcomes: [
      "More grounded AI fluency across staff and leadership groups",
      "Stronger translation from AI interest into university-specific use cases",
      "Support for student-facing, event-facing, or knowledge-facing AI tools",
      "A more credible internal conversation around risk, value, and capability",
    ],
    formats: [
      {
        title: "Staff capability and fluency programs",
        body:
          "AI fluency, training, and upskilling for academic and professional staff who need confidence and judgement more than generic hype.",
      },
      {
        title: "University leadership briefings",
        body:
          "Leadership-focused sessions that connect AI to governance, operating priorities, workforce capability, and student experience.",
      },
      {
        title: "Custom AI tools and assistants",
        body:
          "Student-facing, event-facing, or workflow-support tools designed around the realities of higher-education environments.",
      },
    ],
    topics: [
      "AI fluency for university staff",
      "Student-facing AI experiences",
      "Admissions and event assistants",
      "Academic judgement and governance",
      "Capability-building across faculties and operations",
      "Human-centred AI inside complex institutions",
    ],
    proof: [
      {
        slug: "ai-me",
        reason: "UNSW Sydney symposium assistant with strong engagement data.",
      },
      {
        slug: "acu-admissions-ai",
        reason: "Admissions assistant tied to better lead quality.",
      },
    ],
    faq: [
      {
        question: "Which higher-education teams are the best fit?",
        answer:
          "Professional staff teams, leadership groups, faculty partners, admissions teams, and university event programs are all strong fits depending on the goal.",
      },
      {
        question: "Can the work span both training and software delivery?",
        answer:
          "Yes. That is often where the strongest value sits, because staff capability and practical product design reinforce each other.",
      },
      {
        question: "Is this relevant for both academic and operational contexts?",
        answer:
          "Yes. The work spans capability, service design, events, and institutional adoption challenges rather than treating higher education as one narrow use case.",
      },
    ],
    primaryCtaLabel: "Request sector brief",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
      { label: "Case Studies", href: "/case-studies/" },
    ],
  },
  government: {
    slug: "government",
    path: "/industries/government/",
    title: "AI Training and Consulting for Government | Rushi Vyas",
    description:
      "AI training, workshops, consulting, and practical AI delivery for government, councils, and public-sector organisations.",
    eyebrow: "Government",
    h1: "AI Training and Consulting for Government",
    intro:
      "AI capability building and practical AI delivery for government and public-sector teams that need useful adoption in high-trust environments.",
    answerBlock:
      "Government AI work only lands when the adoption logic is practical, the language is grounded, and the human context remains central. I work with public-sector teams on AI fluency, workshops, consulting, and useful AI delivery where trust, clarity, and service reality all matter.",
    audience: [
      "Councils and local-government teams",
      "Public-sector capability and innovation groups",
      "Leadership teams exploring AI adoption",
      "Government-facing service and event programs",
    ],
    outcomes: [
      "Practical AI fluency for staff and leadership teams",
      "A clearer public-sector conversation about where AI helps",
      "Better alignment between service goals and AI adoption choices",
      "AI experiences designed for real public-facing complexity",
    ],
    formats: [
      {
        title: "Government AI workshops",
        body:
          "Workshops and training sessions designed for real service environments, operational realities, and public-sector risk considerations.",
      },
      {
        title: "Leadership and innovation consulting",
        body:
          "Advisory work that helps public-sector teams prioritise where AI should sit in their service and transformation agenda.",
      },
      {
        title: "Public-facing AI tools and event experiences",
        body:
          "Custom assistants and AI experiences for event, service, and knowledge contexts where public usability matters.",
      },
    ],
    topics: [
      "AI fluency for public-sector teams",
      "Human-centred service delivery",
      "Government innovation and AI adoption",
      "Public trust and judgement",
      "Event and service assistants",
      "Stakeholder communication around AI",
    ],
    proof: [
      {
        slug: "milli",
        reason:
          "Shows AI delivery in a stakeholder-heavy public-event environment.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows human-centred AI framing for government-adjacent audiences.",
      },
    ],
    faq: [
      {
        question: "Can AI training be tailored to a public-sector audience?",
        answer:
          "Yes. That tailoring is essential because government teams need different examples, risk framing, and service logic than corporate-only audiences.",
      },
      {
        question: "Do you work with councils as well as larger public bodies?",
        answer:
          "Yes. Local government and broader public-sector programs can both be strong fits depending on the brief and delivery need.",
      },
      {
        question: "Is this only for innovation teams?",
        answer:
          "No. Capability-building, service teams, leadership, and event teams can all be relevant depending on the goal.",
      },
    ],
    primaryCtaLabel: "Book public-sector session",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      {
        label: "Executive AI Workshops",
        href: "/executive-ai-workshops/",
      },
      { label: "Sydney hub", href: "/sydney/" },
    ],
  },
  "professional-services": {
    slug: "professional-services",
    path: "/industries/professional-services/",
    title: "AI Training for Professional Services | Rushi Vyas",
    description:
      "AI training, workshops, and consulting for professional-services firms and knowledge-intensive teams that need better judgement and workflow leverage.",
    eyebrow: "Professional services",
    h1: "AI Training for Professional Services",
    intro:
      "AI capability and consulting for professional-services teams that need stronger judgement, clearer workflows, and better use of knowledge work.",
    answerBlock:
      "Professional-services teams benefit from AI when they improve leverage without lowering judgement. I help firms and knowledge-intensive teams use AI more effectively across analysis, drafting, review, internal knowledge work, and leadership decision-making.",
    audience: [
      "Consulting and advisory teams",
      "Knowledge workers handling research, analysis, and synthesis",
      "Leadership teams guiding AI adoption in professional contexts",
      "Capability owners designing staff upskilling programs",
    ],
    outcomes: [
      "Better prompting and review habits for knowledge work",
      "Stronger clarity around where AI improves leverage and where it erodes quality",
      "More useful internal workflows and examples",
      "A more disciplined team conversation around AI-assisted work",
    ],
    formats: [
      {
        title: "Team capability workshops",
        body:
          "AI training and workshops focused on knowledge work, analysis, synthesis, and practical leverage rather than gimmicks.",
      },
      {
        title: "Leadership adoption sessions",
        body:
          "Sessions for partners, directors, and senior leaders who need a grounded point of view on how their teams should use AI.",
      },
      {
        title: "Workflow consulting",
        body:
          "Consulting work that sharpens how teams use AI in high-judgement professional contexts without flattening quality.",
      },
    ],
    topics: [
      "AI for analysts and advisors",
      "Drafting and review discipline",
      "Knowledge leverage without quality drift",
      "Model choice and workflow fit",
      "Governance and accountability",
      "Capability-building for sceptical teams",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows AI framed around outcomes, enablement, and repeatable adoption.",
      },
      {
        slug: "acu-admissions-ai",
        reason:
          "Shows AI design connected to operational conversion outcomes.",
      },
    ],
    faq: [
      {
        question: "Is this relevant for highly analytical teams?",
        answer:
          "Yes. Analytical and advisory teams often benefit significantly from stronger prompting, review habits, and a clearer sense of where AI should and should not be trusted.",
      },
      {
        question: "Can the training be tailored to one function, such as finance or strategy?",
        answer:
          "Yes. Function-specific tailoring is often what turns general interest into real adoption.",
      },
      {
        question: "Do you cover governance and risk as well as practical usage?",
        answer:
          "Yes. That balance is especially important in professional-services environments where output quality and accountability matter.",
      },
    ],
    primaryCtaLabel: "Request sector brief",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      { label: "AI Consultants", href: "/ai-consultants/" },
      {
        label: "Executive AI Workshops",
        href: "/executive-ai-workshops/",
      },
    ],
  },
  smes: {
    slug: "smes",
    path: "/industries/smes/",
    title: "AI Training and Workshops for SMEs | Rushi Vyas",
    description:
      "AI training, workshops, and consulting for SMEs that want practical AI adoption without overbuying or overcomplicating the work.",
    eyebrow: "SMEs",
    h1: "AI Training and Workshops for SMEs",
    intro:
      "Practical AI workshops, training, and consulting for SMEs that want useful traction without over-engineering the work.",
    answerBlock:
      "SMEs usually do not need a giant AI transformation deck. They need practical choices, faster capability lift, and a realistic view of what can create leverage now. I help SMEs identify the strongest AI opportunities, train teams well, and avoid wasted motion.",
    audience: [
      "Founder-led and growth-stage businesses",
      "Small business groups and capability programs",
      "Operational teams that want AI to save time and improve clarity",
      "SMEs comparing training, consulting, and software options",
    ],
    outcomes: [
      "Clearer near-term AI opportunities",
      "Practical team capability without unnecessary complexity",
      "More confidence around tools, tasks, and priorities",
      "Better judgement about whether training, consulting, or custom software is the right next step",
    ],
    formats: [
      {
        title: "Small business workshops",
        body:
          "AI workshops designed to help SMEs understand where AI can improve service, marketing, operations, and internal efficiency.",
      },
      {
        title: "Founder or leadership session",
        body:
          "A focused session to help owners or senior leaders decide where to invest time, money, and attention first.",
      },
      {
        title: "Practical consulting and rollout support",
        body:
          "Consulting for SMEs that want to scope a useful next step without turning the work into a heavyweight transformation project.",
      },
    ],
    topics: [
      "AI for small business workflows",
      "Practical prompting and review habits",
      "Low-friction team adoption",
      "Use-case prioritisation",
      "Customer service, marketing, and internal efficiency",
      "When to build versus when to train",
    ],
    proof: [
      {
        slug: "whats-on-platform",
        reason:
          "Shows a founder-led approach to practical AI commercialisation.",
      },
      {
        slug: "milli",
        reason:
          "Shows AI used to guide large volumes of people through a complex environment.",
      },
    ],
    faq: [
      {
        question: "Is this only for large organisations?",
        answer:
          "No. SMEs often benefit quickly when the work stays practical and focused on a few high-value tasks rather than broad AI ambition.",
      },
      {
        question: "Can you help us decide if we even need custom AI software?",
        answer:
          "Yes. Often the best first step is capability lift or workflow design rather than a custom build.",
      },
      {
        question: "Do you run SME workshops in Sydney?",
        answer:
          "Yes. Sydney is the main base, and workshops can also be delivered virtually or for broader Australian cohorts.",
      },
    ],
    primaryCtaLabel: "Request sector brief",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Workshops", href: "/ai-workshops/" },
      { label: "AI Training", href: "/ai-training/" },
      { label: "Sydney hub", href: "/sydney/" },
    ],
  },
};

export const cityPages: Record<CityPageSlug, StructuredPageData> = {
  sydney: {
    slug: "sydney",
    path: "/sydney/",
    title: "AI Services in Sydney | Rushi Vyas",
    description:
      "Sydney-based AI training, workshops, consulting, software development, and keynote speaking for teams, leaders, universities, and event organisers.",
    eyebrow: "Sydney, Australia",
    h1: "AI Services in Sydney",
    intro:
      "Sydney-based AI training, workshops, consulting, software development, and speaking for organisations that want practical outcomes rather than AI theatre.",
    answerBlock:
      "Sydney is the core delivery base. The work spans leadership workshops, AI fluency, capability-building, keynote speaking, and custom AI experiences for organisations across the city and wider Australian market.",
    audience: [
      "Sydney leadership teams and program sponsors",
      "Universities, councils, and public-sector teams",
      "SMEs and professional-services firms",
      "Conference and event organisers looking for a Sydney-based AI speaker or facilitator",
    ],
    outcomes: [
      "Local Sydney delivery with strong higher-ed and government relevance",
      "Better alignment between AI ambition and real organisational use",
      "Clearer pathways across training, consulting, software, and speaking",
      "A single local point of contact for practical AI capability work",
    ],
    formats: [
      {
        title: "Onsite Sydney sessions",
        body:
          "In-person delivery across Sydney for leadership teams, staff capability programs, university audiences, and events.",
      },
      {
        title: "Sydney plus interstate hybrid delivery",
        body:
          "A Sydney-based core program with virtual or hybrid support for broader Australian teams.",
      },
      {
        title: "Sector-specific local work",
        body:
          "Particularly strong fit for higher education, government, SMEs, and event programs with a Sydney footprint.",
      },
    ],
    topics: [
      "AI training in Sydney",
      "AI keynote speaker in Sydney",
      "AI consulting in Sydney",
      "AI software development in Sydney",
      "AI workshops for Sydney teams",
      "AI fluency for universities and government",
    ],
    proof: [
      {
        slug: "ai-me",
        reason: "UNSW Sydney proof with strong AI event metrics.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Sydney-founded platform work with national public-sector relevance.",
      },
    ],
    faq: [
      {
        question: "Are you based in Sydney?",
        answer:
          "Yes. Sydney is the main operating base and the primary local SEO focus for this site.",
      },
      {
        question: "Do you work only in Sydney?",
        answer:
          "No. Sydney is the base, but the work can extend Australia-wide through travel, virtual delivery, or hybrid formats.",
      },
      {
        question: "Which Sydney audiences are the best fit?",
        answer:
          "Leadership teams, universities, councils, public-sector programs, SMEs, and event organisers are all strong fits depending on the brief.",
      },
    ],
    primaryCtaLabel: "Book discovery call",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "Sydney AI Training", href: "/sydney/ai-training/" },
      {
        label: "Sydney AI Keynote Speaker",
        href: "/sydney/ai-keynote-speaker/",
      },
      { label: "Contact", href: "/contact/" },
    ],
  },
  "sydney-ai-training": {
    slug: "sydney-ai-training",
    path: "/sydney/ai-training/",
    title: "AI Training in Sydney for Teams and Leaders | Rushi Vyas",
    description:
      "Sydney AI training for teams, leaders, universities, and public-sector organisations that need practical capability and confident adoption.",
    eyebrow: "Sydney AI training",
    h1: "AI Training in Sydney for Teams and Leaders",
    intro:
      "Practical AI training in Sydney for teams, leaders, universities, and public-sector organisations that want useful capability rather than generic awareness.",
    answerBlock:
      "I deliver AI training in Sydney for organisations that need a practical, locally relevant capability program. The strongest fit is teams that want confident usage, clearer judgement, and a better bridge from AI interest into day-to-day work.",
    audience: [
      "Sydney HR and L&D teams",
      "Sydney universities and education teams",
      "City-based public-sector and leadership groups",
      "Sydney SMEs and knowledge teams looking for useful AI uptake",
    ],
    outcomes: [
      "Practical AI confidence for Sydney-based teams",
      "Sector-relevant examples tied to local higher-ed and public-sector contexts",
      "Stronger team adoption habits across real workflows",
      "Clearer next steps after the session instead of loose enthusiasm",
    ],
    formats: [
      {
        title: "Onsite team training in Sydney",
        body:
          "In-person sessions for city teams that want a more interactive, practical, room-based format.",
      },
      {
        title: "Sydney leadership and staff pathways",
        body:
          "A two-level training model where leaders get strategic alignment and teams get more applied capability work.",
      },
      {
        title: "Cross-campus or cross-office delivery",
        body:
          "A Sydney anchor session plus follow-up virtual or hybrid delivery for broader cohorts.",
      },
    ],
    topics: [
      "AI training for Sydney teams",
      "AI fluency for non-technical staff",
      "Prompting and review habits",
      "Leadership alignment on AI adoption",
      "University and public-sector examples",
      "Role-specific workflow design",
    ],
    proof: [
      {
        slug: "ai-me",
        reason: "UNSW Sydney proof for practical AI delivery in the city.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows repeatable AI capability work with public-sector relevance.",
      },
    ],
    faq: [
      {
        question: "Do you deliver onsite AI training in Sydney?",
        answer:
          "Yes. Onsite Sydney sessions are a core fit, especially for workshops, staff capability programs, and leadership briefings.",
      },
      {
        question: "Can the training be tailored to universities or councils in Sydney?",
        answer:
          "Yes. Sydney-specific higher-ed and public-sector relevance is one of the strongest differentiators in this work.",
      },
      {
        question: "Is virtual delivery still available for Sydney teams?",
        answer:
          "Yes. Virtual and hybrid delivery are both available depending on the team structure and program design.",
      },
    ],
    primaryCtaLabel: "Book discovery call",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Training", href: "/ai-training/" },
      { label: "Sydney hub", href: "/sydney/" },
      { label: "Higher Education", href: "/industries/higher-education/" },
    ],
  },
  "sydney-ai-keynote-speaker": {
    slug: "sydney-ai-keynote-speaker",
    path: "/sydney/ai-keynote-speaker/",
    title: "AI Keynote Speaker in Sydney | Rushi Vyas",
    description:
      "Sydney AI keynote speaker for conferences, leadership events, universities, and summits that want practical AI insight with real substance.",
    eyebrow: "Sydney AI keynote speaker",
    h1: "AI Keynote Speaker in Sydney",
    intro:
      "A Sydney-based AI keynote speaker for conferences, university events, internal summits, and leadership gatherings that want a practical point of view on AI.",
    answerBlock:
      "If you need an AI keynote speaker in Sydney, the strongest fit is usually a session that combines substance with audience clarity. I work best when the brief needs grounded insight on AI adoption, leadership, capability, and what actually creates value beyond the noise.",
    audience: [
      "Sydney conference and event organisers",
      "University forums and symposiums",
      "Leadership offsites and executive gatherings",
      "Sector events that want a keynote plus facilitation or workshop option",
    ],
    outcomes: [
      "A local Sydney speaker with real AI delivery experience",
      "A talk that feels current, practical, and audience-aware",
      "Optional continuity into workshops, panels, and facilitation",
      "A stronger event anchor for AI-related programs",
    ],
    formats: [
      {
        title: "Sydney conference keynote",
        body:
          "A keynote tailored to the event's audience, purpose, and sector context, with delivery designed for clarity and energy rather than hype.",
      },
      {
        title: "Keynote plus panel moderation",
        body:
          "A combined format for Sydney events that want both a clear point of view and a stronger moderated discussion afterwards.",
      },
      {
        title: "Keynote plus capability session",
        body:
          "For internal events and leadership programs that need a more practical follow-through after the main talk.",
      },
    ],
    topics: [
      "AI adoption for Sydney leadership audiences",
      "Human judgement and AI",
      "AI fluency and workforce capability",
      "Leadership, governance, and practical use",
      "What separates AI value from AI theatre",
      "Sector-specific AI talks for higher ed, government, and SMEs",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "UNSW Sydney proof that connects directly to local event credibility.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows a founder-operator perspective grounded in practical delivery.",
      },
    ],
    faq: [
      {
        question: "Are you available for Sydney conferences and university events?",
        answer:
          "Yes. Sydney is the primary base, so local conference, campus, and leadership-event delivery is a strong fit.",
      },
      {
        question: "Can the keynote be customised for our audience?",
        answer:
          "Yes. Audience fit is one of the most important parts of the brief, especially in Sydney where event audiences can vary widely between leadership, higher-ed, government, and SME contexts.",
      },
      {
        question: "Do you also facilitate the session after the keynote?",
        answer:
          "Yes. Workshops, panels, and moderated discussions can be paired with the keynote when that would make the program stronger.",
      },
    ],
    primaryCtaLabel: "Check availability",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Keynote Speaker", href: "/ai-keynote-speaker/" },
      { label: "AI Facilitator", href: "/ai-facilitator/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  "sydney-ai-consultants": {
    slug: "sydney-ai-consultants",
    path: "/sydney/ai-consultants/",
    title: "AI Consultants in Sydney | Rushi Vyas",
    description:
      "Sydney AI consultants for organisations that need practical AI strategy, scoped delivery, and stronger implementation judgement.",
    eyebrow: "Sydney AI consultants",
    h1: "AI Consultants in Sydney",
    intro:
      "Sydney AI consulting for organisations that need practical scope, stronger use-case decisions, and a clearer path from ambition to implementation.",
    answerBlock:
      "The value of AI consulting in Sydney often comes down to focus. Teams know AI matters, but they are unsure which opportunities to prioritise, how to scope the work, or whether to begin with training, product, or process. I help sharpen that decision-making and move the work toward a useful next step.",
    audience: [
      "Sydney leadership and innovation teams",
      "Universities, councils, and public-sector groups",
      "SMEs and professional-services firms",
      "Programs that need discovery, framing, and delivery logic",
    ],
    outcomes: [
      "Stronger scope definition and use-case prioritisation",
      "A clearer bridge between leadership ambition and delivery reality",
      "Better fit between consulting, training, and software decisions",
      "More confidence in the next implementation step",
    ],
    formats: [
      {
        title: "Sydney AI discovery work",
        body:
          "Focused discovery and framing for local teams that need sharper direction before committing to build or rollout.",
      },
      {
        title: "Leadership and program consulting",
        body:
          "Consulting that helps sponsors and internal leaders align around the right priorities, constraints, and next actions.",
      },
      {
        title: "Product and workflow consulting",
        body:
          "Advisory work for teams exploring custom assistants, internal AI tools, or better workflow design.",
      },
    ],
    topics: [
      "AI consulting in Sydney",
      "Use-case prioritisation",
      "AI readiness and adoption",
      "Workflow design",
      "Leadership alignment",
      "Capability versus product decisions",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "Sydney proof for AI discovery translated into a live event experience.",
      },
      {
        slug: "whats-on-platform",
        reason:
          "Shows repeatable AI scope and delivery logic across public-facing contexts.",
      },
    ],
    faq: [
      {
        question: "Do you consult only on software projects?",
        answer:
          "No. The work spans scope, training, adoption, workflows, and delivery priorities depending on what the organisation actually needs.",
      },
      {
        question: "Can the consulting be delivered onsite in Sydney?",
        answer:
          "Yes. Sydney-based discovery sessions, leadership workshops, and scoping conversations are all available onsite.",
      },
      {
        question: "Can AI consulting lead into a workshop or build phase?",
        answer:
          "Yes. That is often the most useful sequence, because the consulting sharpens what should happen next.",
      },
    ],
    primaryCtaLabel: "Start scoped brief",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      { label: "AI Consultants", href: "/ai-consultants/" },
      {
        label: "Sydney AI Software Development",
        href: "/sydney/ai-software-development/",
      },
      { label: "Sydney hub", href: "/sydney/" },
    ],
  },
  "sydney-ai-software-development": {
    slug: "sydney-ai-software-development",
    path: "/sydney/ai-software-development/",
    title: "AI Software Development in Sydney | Rushi Vyas",
    description:
      "Sydney AI software development for custom assistants, knowledge systems, and practical AI experiences built for Australian organisations.",
    eyebrow: "Sydney AI software development",
    h1: "AI Software Development in Sydney",
    intro:
      "Custom AI software development in Sydney for organisations that need assistants, knowledge systems, and AI experiences that people will actually use.",
    answerBlock:
      "Sydney AI software development works best when the product design is grounded in real tasks, real information, and real user behaviour. I work on custom AI experiences for events, admissions, services, and internal workflows where clarity and trust matter as much as the technology stack.",
    audience: [
      "Sydney organisations exploring custom AI assistants",
      "Universities, public-sector teams, and service programs",
      "Event teams needing conversational AI experiences",
      "Leaders who want scoped product work rather than a generic AI add-on",
    ],
    outcomes: [
      "Custom AI experiences aligned to real user behaviour",
      "Stronger translation from content and knowledge into usable interfaces",
      "Better product scope before build decisions harden",
      "A practical path from AI strategy to delivery",
    ],
    formats: [
      {
        title: "Sydney discovery sprint",
        body:
          "A short sprint to define the job to be done, key user journeys, knowledge sources, and the right first release shape.",
      },
      {
        title: "Custom assistant build",
        body:
          "Delivery of AI assistants or guided knowledge tools for event, service, or operational contexts.",
      },
      {
        title: "Experience refinement and rollout",
        body:
          "Improvement of an existing AI experience so it becomes more useful, measurable, and easier to support.",
      },
    ],
    topics: [
      "Custom AI assistants in Sydney",
      "RAG and knowledge experience design",
      "Event AI",
      "Admissions and service assistants",
      "AI product strategy",
      "Operational rollout and enablement",
    ],
    proof: [
      {
        slug: "ai-me",
        reason:
          "A Sydney-built event assistant with strong live engagement outcomes.",
      },
      {
        slug: "acu-admissions-ai",
        reason:
          "Shows measurable uplift from a tailored AI admissions experience.",
      },
    ],
    faq: [
      {
        question: "What kinds of AI software projects are the best fit in Sydney?",
        answer:
          "The strongest fit is custom assistants, knowledge tools, event experiences, and workflow-support products where information design and user trust matter.",
      },
      {
        question: "Do you work on both product framing and delivery?",
        answer:
          "Yes. That overlap is often what makes the work stronger, because the product, use case, and adoption logic are shaped together.",
      },
      {
        question: "Can software development be paired with internal training?",
        answer:
          "Yes. That is often useful when the organisation also needs capability lift and internal confidence around the product.",
      },
    ],
    primaryCtaLabel: "Request discovery sprint",
    primaryCtaHref: "/contact/",
    secondaryLinks: [
      {
        label: "AI Software Development",
        href: "/ai-software-development/",
      },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Sydney hub", href: "/sydney/" },
    ],
  },
};

export const resourceGuides: ResourceGuide[] = [
  {
    slug: "ai-training-brief",
    title: "How to brief AI training for a non-technical team",
    summary:
      "The highest-value AI training briefs explain audience, current maturity, preferred delivery format, and what people should be able to do differently after the session.",
    bullets: [
      "Start with the audience and the work they actually do.",
      "Name the tools already in use or under consideration.",
      "Decide whether the goal is awareness, confidence, workflow change, or leadership alignment.",
      "Include any risk, governance, or sector-specific constraints that matter.",
    ],
    href: "/contact/",
  },
  {
    slug: "executive-ai-session",
    title: "What executive teams should expect from an AI workshop",
    summary:
      "An executive session should leave leaders with sharper priorities, a clearer adoption lens, and better judgement about where AI genuinely helps.",
    bullets: [
      "The session should explain trade-offs, not just trends.",
      "Leadership teams need language for governance, capability, and measurement.",
      "The best executive workshops connect AI to the operating model.",
      "A useful session usually identifies one or two next decisions, not ten vague ideas.",
    ],
    href: "/executive-ai-workshops/",
  },
  {
    slug: "speaker-briefing",
    title: "How to choose an AI keynote speaker who will actually land",
    summary:
      "A good AI keynote speaker should understand the audience's maturity, avoid recycled hype, and leave the room with stronger judgement rather than louder buzzwords.",
    bullets: [
      "Ask for audience tailoring, not a generic future-of-AI talk.",
      "Check whether the speaker has delivery experience, not only commentary.",
      "Decide whether you need a keynote, facilitation, workshop, or a combination.",
      "Build the rest of the program around what the audience should do afterwards.",
    ],
    href: "/ai-keynote-speaker/",
  },
];

export const footerLinkGroups = [
  {
    title: "Services",
    links: [
      serviceLinks[0],
      serviceLinks[1],
      serviceLinks[5],
      serviceLinks[6],
      serviceLinks[7],
    ],
  },
  {
    title: "Sectors",
    links: industryLinks,
  },
  {
    title: "Sydney",
    links: cityLinks,
  },
  {
    title: "Explore",
    links: [
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Resources", href: "/resources/" },
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];
