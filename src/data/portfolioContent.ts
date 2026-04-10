export type SocialLinkKind = "linkedin" | "website" | "email";

export interface HeroContent {
  greeting: string;
  firstName: string;
  lastName?: string;
  eyebrow: string;
  accent: string;
  supportingPrimary: string;
  supportingSecondary?: string;
  badges?: HeroBadge[];
}

export interface HeroBadge {
  alt: string;
  src: string;
  variant?: "wide";
}

export interface Capability {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  mobileBannerUrl?: string;
  mobileBannerUrls?: string[];
  mobileBannerSequence?: {
    src: string;
    durationMs?: number;
    fit?: "cover" | "contain";
  }[];
}

export interface ExperienceLogo {
  alt: string;
  src?: string;
  label?: string;
}

export interface ExperienceItem {
  year: string;
  company: string;
  highlight: string;
  bullets: string[];
  logos: ExperienceLogo[];
  logoLayout?: "row" | "grid-2x2";
}

export interface FeaturedWorkItem {
  title: string;
  category: string;
  summary: string;
  metrics: string[];
  image: string;
  link?: string;
}

export interface BrandProofItem {
  name: string;
  logo?: string;
}

export interface ToolStackItem {
  label: string;
  image: string;
}

export interface TestimonialItem {
  text: string;
  name: string;
  role: string;
}

export interface ContactDetails {
  email: string;
  linkedin: string;
  website: string;
  location: string;
  education: string[];
}

export interface SocialLink {
  kind: SocialLinkKind;
  label: string;
  href: string;
}

export interface HeroAvatarStyle {
  hoodieColor: string;
  pantsColor: string;
  eyeColor: string;
  capColor: string;
  computerColor: string;
  keyLightColor: string;
  glowColor: string;
  rimColor: string;
  darkFeatureColor: string;
  stubbleStrength: number;
  hideNodePatterns: string[];
  darkNodePatterns: string[];
  darkMaterialPatterns: string[];
}

export interface PortfolioContent {
  meta: {
    title: string;
    initials: string;
    loaderBands: string[][];
    linkedinDisplay: string;
    resumePath: string;
  };
  hero: HeroContent;
  about: string;
  aboutMobile: string;
  logoMarquee: BrandProofItem[];
  capabilities: Capability[];
  experience: ExperienceItem[];
  featuredWork: FeaturedWorkItem[];
  brandProof: BrandProofItem[];
  toolStack: ToolStackItem[];
  testimonials: TestimonialItem[];
  contact: ContactDetails;
  socialLinks: SocialLink[];
  heroAvatarStyle: HeroAvatarStyle;
}

export const portfolioContent: PortfolioContent = {
  meta: {
    title: "Rushi Vyas — Artificial & Human Intelligence for Leadership",
    initials: "RV",
    loaderBands: [
      [
        "Leadership",
        "Workshops",
        "Capability Building",
        "Strategy",
        "Playbooks",
        "Coaching",
        "Governance",
        "Operations",
        "Transformation",
        "Adoption",
      ],
      [
        "AI Fluency",
        "Prompting",
        "LLMs",
        "Agents",
        "Automation",
        "Retrieval",
        "Knowledge Systems",
        "Model Choice",
        "AI Safety",
        "Workflow Design",
      ],
      [
        "Systems Thinking",
        "Design Thinking",
        "Human-centred Approach",
        "Service Design",
        "Behaviour Change",
        "Prototyping",
        "Innovation Strategy",
        "Organisational Readiness",
        "Change Leadership",
        "Research",
      ],
    ],
    linkedinDisplay: "linkedin.com/in/therushivyas",
    resumePath: "/Rushi_Sydney_OpenAI_GTM.pdf",
  },
  hero: {
    greeting: "Hello! I'm",
    firstName: "RUSHI",
    eyebrow: "Human & Business",
    accent: "LEADERSHIP",
    supportingPrimary: "Intelligence for",
    badges: [
      {
        alt: "Certified ChatGPT Expert badge",
        src: "/images/badges/chatgpt-badge.png",
      },
      {
        alt: "Claude Certified AI badge",
        src: "/images/badges/claude-badge.png",
        variant: "wide",
      },
      {
        alt: "Applied AI Generate Reports with AI Agents badge",
        src: "/images/badges/copilot-agents-badge.png",
      },
      {
        alt: "Applied AI Business Workflows badge",
        src: "/images/badges/copilot-workflows-badge.png",
      },
    ],
  },
  about:
    "I help organisations turn AI ambition into practical, human-centred strategy. My work has supported more than $32M in commercial outcomes across governments, universities, and brands including Karnataka Government, the City of Parramatta, City of Sydney, Deloitte, LinkedIn, Optus, HCF, Humanitix, UNSW, the University of Sydney, UTS, ACU, and TAFE NSW. Drawing on seven years across innovation, market research, and consumer behaviour, I help teams build resilient, scalable solutions that keep people at the centre.",
  aboutMobile:
    "I help organisations turn AI ambition into practical and human-centered strategy",
  logoMarquee: [
    {
      name: "Karnataka Government",
      logo: "/images/logos/karnataka-government.png",
    },
    {
      name: "Sozio Artificial Intelligence",
      logo: "/images/logos/sozio.png",
    },
    {
      name: "City of Parramatta",
      logo: "/images/logos/city-of-parramatta.png",
    },
    {
      name: "Spotify",
      logo: "/images/logos/spotify.png",
    },
    {
      name: "TikTok",
      logo: "/images/logos/tiktok.png",
    },
    {
      name: "Optus",
      logo: "/images/logos/optus.png",
    },
    {
      name: "HCF",
      logo: "/images/logos/hcf.png",
    },
    {
      name: "Transport Canberra",
      logo: "/images/logos/transport-canberra.png",
    },
    {
      name: "Tas Transport",
      logo: "/images/logos/tas-transport.png",
    },
    {
      name: "CDC NT",
      logo: "/images/logos/nt-transport.png",
    },
    {
      name: "Adelaide Metro",
      logo: "/images/logos/adelaide-transport.png",
    },
    {
      name: "Transperth",
      logo: "/images/logos/transperth.png",
    },
    {
      name: "Public Transport Victoria",
      logo: "/images/logos/ptv.png",
    },
    {
      name: "Translink",
      logo: "/images/logos/qld-transport.png",
    },
    {
      name: "Opal",
      logo: "/images/logos/opal.png",
    },
    {
      name: "MyGig",
      logo: "/images/logos/mygig.png",
    },
    {
      name: "City of Sydney",
      logo: "/images/logos/city-of-sydney.png",
    },
    {
      name: "Prime Video",
      logo: "/images/logos/prime-video.png",
    },
    {
      name: "UNSW Founders",
      logo: "/images/logos/unsw-founders.png",
    },
    {
      name: "Aussizz Migration",
      logo: "/images/logos/aussizz.png",
    },
    {
      name: "Humanitix",
      logo: "/images/logos/humanitix.png",
    },
    {
      name: "Australian Catholic University",
      logo: "/images/logos/acu.png",
    },
    {
      name: "TAFE NSW",
      logo: "/images/logos/tafe-nsw.png",
    },
    {
      name: "University of Sydney Careers Centre",
      logo: "/images/logos/usyd-careers-centre.png",
    },
    {
      name: "High Commission of India",
      logo: "/images/logos/high-commission-of-india.png",
    },
    {
      name: "MentorAll",
      logo: "/images/logos/mentorall.png",
    },
    {
      name: "UNSW College",
      logo: "/images/logos/unsw-college.png",
    },
    {
      name: "German Cooperation India",
      logo: "/images/logos/giz-india-germany.png",
    },
    {
      name: "FiBL Switzerland",
      logo: "/images/logos/fibl-switzerland.png",
    },
    {
      name: "giz",
      logo: "/images/logos/giz.png",
    },
    {
      name: "LinkedIn",
      logo: "/images/logos/linkedin.png",
    },
    {
      name: "Coca-Cola",
      logo: "/images/logos/coca-cola.png",
    },
    {
      name: "Deloitte",
      logo: "/images/logos/deloitte.png",
    },
    {
      name: "ALDI",
      logo: "/images/logos/aldi.png",
    },
    {
      name: "Coles Group",
      logo: "/images/logos/coles-group.png",
    },
    {
      name: "Woolworths Group",
      logo: "/images/logos/woolworths-group.png",
    },
    {
      name: "Tata",
      logo: "/images/logos/tata-marquee.png",
    },
    {
      name: "Starbucks",
      logo: "/images/logos/starbucks-marquee.png",
    },
    {
      name: "Bridgestone",
      logo: "/images/logos/bridgestone-marquee.png",
    },
    {
      name: "Colgate-Palmolive",
      logo: "/images/logos/colgate-palmolive-marquee.png",
    },
  ],
  capabilities: [
    {
      title: "AI Capability Development",
      subtitle: "AI fluency for non-technical teams",
      description:
        "Training non-technical teams to use AI with confidence through practical workshops, clear use cases, and simple operating habits that turn curiosity into everyday capability.",
      tags: [
        "AI fluency",
        "Non-technical training",
        "Team coaching",
        "Workflow design",
        "Playbooks",
        "Change enablement",
      ],
      mobileBannerSequence: [
        {
          src: "/images/services/ai-capability/copilot.gif",
          durationMs: 6000,
          fit: "cover",
        },
        {
          src: "/images/services/ai-capability/gemini.gif",
          durationMs: 2510,
          fit: "cover",
        },
        {
          src: "/images/services/ai-capability/claude.gif",
          durationMs: 800,
          fit: "contain",
        },
        {
          src: "/images/services/ai-capability/chatgpt.webp",
          durationMs: 2400,
          fit: "cover",
        },
      ],
    },
    {
      title: "Market & Product Strategy",
      subtitle: "Navigating complexity into clear GTM direction",
      description:
        "Helping teams navigate complex market, product, and go-to-market decisions through research, positioning, and strategy design that connects customer reality to execution.",
      tags: [
        "Market research",
        "Consumer behaviour",
        "GTM strategy",
        "Product positioning",
        "Growth planning",
        "Stakeholder alignment",
      ],
      mobileBannerUrl:
        "https://i.pinimg.com/originals/a3/2d/d6/a32dd64c50f06083b8bb8ac077fa5209.gif",
    },
  ],
  experience: [
    {
      year: "2017",
      company: "Tata Sustainability Group",
      highlight: "Sustainability Platforms, Training & Engagement Strategy",
      logos: [
        {
          alt: "Tata",
          src: "/images/logos/tata-marquee.png",
        },
        {
          alt: "Starbucks",
          src: "/images/logos/starbucks-marquee.png",
        },
      ],
      bullets: [
        "Modules for board oversight of sustainability",
        "Tata Sustainability Group website, volunteering portal, and skilling portal",
        "Volunteering and skilling visual identities",
        "Campaigns to enhance employee volunteering",
        "Development of e-training module on human rights",
        "Development of e-training modules for volunteers and SPOCs",
        "Extensive campaigns on biodiversity and ecosystem restoration",
        "Best practices booklet",
      ],
    },
    {
      year: "2016",
      company: "Colgate-Palmolive + Bridgestone",
      highlight: "Materiality & Sustainability Positioning Strategy",
      logos: [
        {
          alt: "Colgate-Palmolive",
          src: "/images/logos/colgate-palmolive-marquee.png",
        },
        {
          alt: "Bridgestone",
          src: "/images/logos/bridgestone-marquee.png",
        },
      ],
      bullets: [
        "Materiality assessment",
        "Sustainability roadmap",
        "Sustainability positioning",
        "External stakeholder communication",
        "Internal stakeholder sensitisation",
      ],
    },
    {
      year: "2018",
      company: "Spotify",
      highlight: "Brand & Consumer Tech Strategy",
      logos: [
        {
          alt: "Spotify",
          src: "/images/logos/spotify.png",
        },
      ],
      bullets: [
        "Helped shape an India launch narrative around mobile-first, multilingual listeners, with particular focus on Gen Z and millennial audiences discovering both local and global music in one place.",
        "Built audience thinking around city culture, fandom, and shareable listening moments so the launch felt locally fluent rather than imported.",
        "Translated market signals into clearer positioning for youth, campus, commuter, and creator-adjacent cohorts likely to drive early adoption.",
      ],
    },
    {
      year: "2019",
      company: "Coca-Cola",
      highlight: "Cherry Coke Market Lead",
      logos: [
        {
          alt: "Coca-Cola",
          src: "/images/logos/coca-cola.png",
        },
      ],
      bullets: [
        "Framed Cherry Coke for flavour-curious, trend-aware younger consumers looking for a playful twist on a familiar cola ritual.",
        "Used market and branding insight to localise launch thinking for MENA retail and social occasions, from casual hangouts to entertainment-led consumption moments.",
        "Turned taste, format, and brand signals into sharper rollout priorities across launch storytelling, audience resonance, and market-entry positioning.",
      ],
    },
    {
      year: "2020",
      company: "Zomato",
      highlight: "Market Intelligence Lead",
      logos: [
        {
          alt: "Zomato",
          src: "/images/logos/zomato.png",
        },
      ],
      bullets: [
        "Led market intelligence for launches across 16 cities, helping prioritise fast-growing, mobile-first audiences beyond the biggest metros.",
        "Used expansion signals across diners, restaurant partners, and local supply readiness to guide launch sequencing as the platform scaled across India and internationally.",
        "Supported communications strategy around startup acquisition and integration moments so growth felt coherent for customers, partners, and the wider ecosystem.",
      ],
    },
    {
      year: "2021",
      company: "Amazon Prime Video",
      highlight: "Content Psychology",
      logos: [
        {
          alt: "Prime Video",
          src: "/images/logos/prime-video.png",
        },
      ],
      bullets: [
        "Worked on audience-perception analysis to understand why certain shows became culturally sticky, binge-worthy, or conversation-led.",
        "Mapped likely viewer reactions across fandom, sentiment, and shareability to anticipate how audiences would respond to content before broader rollout.",
        "Translated those signals into brand-adjacency insight, helping identify where entertainment moments could create stronger relevance for advertisers and partners.",
      ],
    },
    {
      year: "2022",
      company: "UNSW",
      highlight: "Digital Transformation Lecturer",
      logos: [
        {
          alt: "UNSW",
          src: "/images/logos/unsw.png",
        },
      ],
      bullets: [
        "Started lecturing in digital transformation and taught 300+ students how technology, systems, and organisational change interact in practice.",
        "Turned complex business and systems thinking into applied classroom material for future operators, strategists, and analysts.",
        "Established a teaching approach that blended industry relevance with academic clarity, laying the groundwork for later AI fluency work.",
      ],
    },
    {
      year: "2023",
      company: "What's On!",
      highlight: "Founder, Federal-Gov AI",
      logoLayout: "grid-2x2",
      logos: [
        {
          alt: "rCITI Innovation of the Year",
          src: "/images/logos/rciti.png",
        },
        {
          alt: "Pearcey Top 3 Emerging Startups",
          src: "/images/logos/pearcey.png",
        },
        {
          alt: "iAwards Government and Public Sector Solution of the Year",
          src: "/images/logos/iawards.png",
        },
        {
          alt: "APICTA Awards",
          src: "/images/logos/apicta.png",
        },
      ],
      bullets: [
        "Founded What’s On! and positioned it at the intersection of AI, public service, and community technology.",
        "Built early AI solutions for federal-government use cases, proving the model in high-trust, human-centred service environments.",
        "Created a migrant support platform that impacted 139,000+ people by helping them navigate safety, skills, rights, and practical everyday resources.",
        "Designed the experience to make complex support information easier to access and act on for people building stability in a new environment.",
        "Reached award momentum with APAC Top 3 AI recognition, alongside Best Community Technology and GovTech recognition in Australia.",
      ],
    },
    {
      year: "2024",
      company: "UNSW",
      highlight: "AI Fluency, VC Endorsement & Dean's List",
      logos: [
        {
          alt: "UNSW",
          src: "/images/logos/unsw.png",
        },
        {
          alt: "City of Sydney",
          src: "/images/logos/city-of-sydney.png",
        },
      ],
      bullets: [
        "Revamped the AI Fluency course at UNSW and made it more practical for staff, students, and organisational adoption work.",
        "Finished postgraduate Business Information Systems study with Dean’s List / Excellence standing, strengthening the technical base behind the practice.",
        "Saw UNSW’s Vice-Chancellor endorse What’s On! while also starting AI upskilling sessions for the City of Sydney.",
      ],
    },
    {
      year: "2025",
      company: "UTS + ACU",
      highlight: "AI Capability Building Across Higher Ed",
      logos: [
        {
          alt: "UTS",
          src: "/images/logos/uts.png",
        },
        {
          alt: "Australian Catholic University",
          src: "/images/logos/acu.png",
        },
      ],
      bullets: [
        "Started helping UTS and ACU teams build capability, fluency, and confidence around AI adoption across academic and operational settings.",
        "Trained 400+ UNSW Finance staff through AI for Finance Professionals while What’s On! products contributed to $32M in commercial outcomes.",
        "Built a national profile as one of the youngest AI leads in Australian higher education, including a keynote visit to Darwin.",
      ],
    },
    {
      year: "2026",
      company: "USYD + City of Sydney",
      highlight: "AI Fluency for Government & Leadership",
      logos: [
        {
          alt: "The University of Sydney",
          src: "/images/logos/usyd.png",
        },
        {
          alt: "City of Sydney",
          src: "/images/logos/city-of-sydney.png",
        },
      ],
      bullets: [
        "Started training government staff in AI fluency, helping public-sector teams turn interest into confident, practical use.",
        "Partnered again with the City of Sydney to deliver AI for Small Businesses workshops.",
        "Delivered an AI for Leadership workshop for AGSM at UNSW while expanding capability-building work with the University of Sydney.",
      ],
    },
  ],
  featuredWork: [
    {
      title: "What's On!",
      category: "Founder-led AI engagement platform",
      summary:
        "Built the GTM motion, onboarding programs, partner enablement, demos, and operating rhythm for a government- and university-facing AI company turning founder-led traction into repeatable growth.",
      metrics: [
        "50+ paying partners in 90 days",
        "150,000+ migrant users supported",
        "APAC Top-3 AI Startup (APICTA 2025)",
      ],
      image: "/images/work/whats-on-overview.svg",
      link: "https://www.knowwhatson.com/work",
    },
    {
      title: "AI-me",
      category: "UNSW Sydney · AI conference assistant",
      summary:
        "AI-me became the default guide for UNSW's flagship AI symposium, handling discovery, matchmaking, sponsor surfacing, and real-time attendee questions without queues or paper.",
      metrics: [
        "92% engagement",
        "1,007 questions answered in 3–5s",
        "~30 hours help-desk time saved",
      ],
      image: "/images/work/ai-me.svg",
      link: "https://www.knowwhatson.com/work/ai-me",
    },
    {
      title: "ACU Admissions AI",
      category: "ACU · Lead conversion through gamification",
      summary:
        "An admissions and recruitment assistant using gamified QR-to-mobile and kiosk flows to turn curiosity into qualified student conversations with personalized degree advice.",
      metrics: [
        "160% lift in qualified leads",
        "85% increase in Q&A engagement",
        "Higher-quality degree conversations",
      ],
      image: "/images/work/acu-ai.svg",
      link: "https://www.knowwhatson.com/work/ai-career-coach",
    },
    {
      title: "Milli",
      category: "Government of Karnataka · Public event AI",
      summary:
        "Milli guided delegates, exhibitors, policymakers, and the public through a massive trade fair, blending multilingual event support, buyer intelligence, and commercial momentum.",
      metrics: [
        "$32M in expo sales enabled",
        "500,000+ attendees served",
        "163 exhibitors across the event",
      ],
      image: "/images/work/milli.svg",
      link: "https://www.knowwhatson.com/work/karnataka",
    },
  ],
  brandProof: [
    { name: "UNSW" },
    { name: "Humanitix" },
    { name: "City of Sydney" },
    { name: "Optus" },
    { name: "HCF" },
    { name: "ACU" },
    { name: "NSW TAFE" },
    { name: "Sozio" },
  ],
  toolStack: [
    { label: "OpenAI", image: "/images/toolstack/openai.svg" },
    { label: "GPT-4o", image: "/images/toolstack/gpt-4o.svg" },
    { label: "Assistants", image: "/images/toolstack/assistants.svg" },
    { label: "RAG", image: "/images/toolstack/rag.svg" },
    { label: "Voice", image: "/images/toolstack/voice.svg" },
    { label: "Playbooks", image: "/images/toolstack/playbooks.svg" },
    { label: "Enablement", image: "/images/toolstack/enablement.svg" },
    { label: "GTM Ops", image: "/images/toolstack/gtm-ops.svg" },
  ],
  testimonials: [
    {
      text: "Rushi turned AI from an abstract strategy topic into practical workflows our non-technical teams could start using with confidence almost immediately.",
      name: "Higher Education Partner",
      role: "Capability-building lead",
    },
    {
      text: "The strongest part of the work was how human it felt. The training was rigorous, but it never became intimidating or disconnected from everyday operations.",
      name: "Public Sector Team",
      role: "Innovation program stakeholder",
    },
    {
      text: "He brings structure to messy, high-stakes problems. We left with clearer priorities, stronger alignment, and a rollout path that leadership could back.",
      name: "Executive Sponsor",
      role: "Transformation office",
    },
    {
      text: "What stood out was the ability to connect strategy, systems thinking, and behaviour change in a way that made sense for educators and operators alike.",
      name: "Faculty Partner",
      role: "University program lead",
    },
    {
      text: "The workshops were practical, fast-moving, and grounded in the realities of frontline teams rather than generic AI hype.",
      name: "City Program Partner",
      role: "Small business capability program",
    },
    {
      text: "Rushi has a rare mix of market instinct and deep empathy. The result was work that felt commercially sharp without losing the human context.",
      name: "Brand Strategy Collaborator",
      role: "Launch and insights partner",
    },
    {
      text: "The finance-focused sessions made AI feel usable for professionals who are usually skeptical of technical change. That shift in confidence mattered.",
      name: "Finance Capability Cohort",
      role: "Enterprise learning participant",
    },
    {
      text: "He consistently translates complex innovation ideas into something teams can actually implement, measure, and improve over time.",
      name: "Startup Ecosystem Partner",
      role: "Founder and growth network",
    },
    {
      text: "The community technology work was especially powerful because it balanced scale with care, helping people access safety, skills, rights, and practical support.",
      name: "Community Technology Stakeholder",
      role: "Migration and inclusion partner",
    },
  ],
  contact: {
    email: "rushi@knowwhatson.com",
    linkedin: "https://www.linkedin.com/in/therushivyas/",
    website: "https://www.knowwhatson.com/",
    location: "Sydney, Australia",
    education: [
      "UNSW Sydney — Master of Business and Commerce, 2022–2024",
      "Double major in Business Information Systems & Analytics; Sustainability & Social Impact",
      "Graduated with Excellence; Dean's Award",
    ],
  },
  socialLinks: [
    {
      kind: "website",
      label: "Website",
      href: "https://www.knowwhatson.com/",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/therushivyas/",
    },
    {
      kind: "email",
      label: "Email",
      href: "mailto:rushi@knowwhatson.com",
    },
  ],
  heroAvatarStyle: {
    hoodieColor: "#22344d",
    pantsColor: "#171b24",
    eyeColor: "#6a4023",
    capColor: "#f4f5f7",
    computerColor: "#c5cad3",
    keyLightColor: "#eef7ff",
    glowColor: "#9ed4ff",
    rimColor: "#d7ecff",
    darkFeatureColor: "#16110d",
    stubbleStrength: 0,
    hideNodePatterns: ["helmet", "hat"],
    darkNodePatterns: ["hair", "brow", "lash", "beard"],
    darkMaterialPatterns: ["hair", "brow", "lash", "beard"],
  },
};
