const createWeek = (weekNumber, date, theme, description, isOff = false) => ({
  weekNumber,
  label: `Week ${weekNumber}`,
  date,
  theme,
  description,
  isOff,
});

export const GUEST_LECTURER_CAMPAIGN_KEY = "unsw-ai-fluency-2026";
export const GUEST_LECTURER_CARD_ID = "unsw-ai-fluency-guest-lecturers";
export const GUEST_LECTURER_PUBLIC_ROUTE = "/studio/guest-lecturers";
export const GUEST_LECTURER_APP_ROUTE = "/guest-lecturers";
export const GUEST_LECTURER_CARD_MARK = "UNSW";
export const GUEST_LECTURER_CARD_LOGO_URL = "/images/studio/unsw-sydney-card-logo.png";
export const GUEST_LECTURER_CARD_TITLE = "AI Fluency Guest Lecturers";
export const GUEST_LECTURER_CARD_SUMMARY =
  "Use the guest access code to open the EOI page, or the admin passcode to review submissions.";
export const GUEST_LECTURER_PAGE_TITLE = "UNSW AI Fluency guest lecturers";
export const GUEST_LECTURER_PAGE_SUMMARY =
  "We would love to welcome guest lecturers into INFS2604 Artificial Intelligence Fluency at UNSW Sydney. The course is taught in person in Kensington in Term 1 2026 and moves through the exciting world of AI, responsible AI and usage principles, creativity, prediction and visualization, research, sustainability, AI agents, debates, and team project presentations. Lecture recordings are not available, so Rushi and the students especially value live industry insight and the time it takes to share it well.";
export const GUEST_LECTURER_CONFIRMATION_COPY =
  "Thanks for sharing your EOI. Rushi will review it and follow up if the timing and topic are a fit. This submission does not confirm a guest lecture slot.";
export const GUEST_LECTURER_TOPIC_FIELD_LABEL =
  "Preferred lecture topic based on your expertise";
export const GUEST_LECTURER_TOPIC_FIELD_PLACEHOLDER =
  "If there is a topic, case study, or angle you would especially enjoy covering, add it here.";
export const GUEST_LECTURER_ORGANISATION = "UNSW Sydney";
export const GUEST_LECTURER_CAMPUS = "UNSW Sydney Kensington Campus";
export const GUEST_LECTURER_BUILDING = "Quadrangle Building (E15) Room 1043";
export const GUEST_LECTURER_LOCATION_LABEL =
  "UNSW Sydney Kensington Campus, Quadrangle Building (E15) Room 1043";
export const GUEST_LECTURER_MAP_LINK = "https://link.mazemap.com/tXrrnCO4";
export const GUEST_LECTURER_MAP_EMBED_SRC =
  "https://use.mazemap.com/embed.html#v=1&config=unsw&campusid=111&zlevel=2&center=151.230528,-33.916965&zoom=18&search=quad%201043&sharepoitype=identifier&sharepoi=K-E15-1043&utm_medium=iframe";
export const GUEST_LECTURER_TIMEZONE = "Australia/Sydney";
export const GUEST_LECTURER_CLASS_START_HOUR = 14;
export const GUEST_LECTURER_CLASS_START_MINUTE = 0;
export const GUEST_LECTURER_CLASS_END_HOUR = 17;
export const GUEST_LECTURER_CLASS_END_MINUTE = 0;
export const GUEST_LECTURER_TIME_LABEL = "2 PM to 5 PM";
export const GUEST_LECTURER_SEGMENT_LABEL = "30 to 60 minutes within the class";
export const GUEST_LECTURER_WEEKS = [
  createWeek(
    1,
    "2026-06-05",
    "Introduction to the exciting world of AI",
    "This week may introduce how modern AI systems work, where they already appear in daily life, and what makes them useful in practice. It can help students build a grounded mental model before moving into more applied and industry-facing topics."
  ),
  createWeek(
    2,
    "2026-06-12",
    "Responsible AI & Usage Principles",
    "This week may explore safe, ethical, and trustworthy ways to use AI in study and work. Students may discuss bias, privacy, transparency, and the habits that help people use AI responsibly."
  ),
  createWeek(
    3,
    "2026-06-19",
    "AI for Creativity",
    "This week may focus on AI as a creative collaborator for brainstorming, writing, design, and storytelling. Students may test how prompts, iteration, and critique can turn rough ideas into stronger outputs."
  ),
  createWeek(
    4,
    "2026-06-26",
    "AI for Prediction & Visualization",
    "This week may look at how AI supports forecasting, pattern finding, dashboards, and clearer communication of insights. The emphasis may be on turning messy information into useful predictions and visual stories."
  ),
  createWeek(
    5,
    "2026-07-03",
    "AI for Research",
    "This week may show how AI can accelerate literature scanning, synthesis, note-making, and question framing. Students may learn where AI is helpful in research and where human judgement still matters most."
  ),
  createWeek(
    6,
    "2026-07-10",
    "Flexibility Week",
    "This flexibility week may create space to catch up, consolidate learning, or adjust the flow of the course. It also gives room for reflection before the subject moves into later-stage applied topics.",
    true
  ),
  createWeek(
    7,
    "2026-07-17",
    "AI & Sustainability",
    "This week may examine how AI intersects with sustainability, environmental impact, and long-term systems thinking. Students may consider both the opportunities AI creates and the trade-offs it introduces."
  ),
  createWeek(
    8,
    "2026-07-24",
    "AI Agents",
    "This week may unpack autonomous workflows, tool use, memory, and goal-directed AI systems. Students may explore what makes an AI agent different from a single prompt and where agents are genuinely useful."
  ),
  createWeek(
    9,
    "2026-07-31",
    "Debates",
    "This week may involve structured debate around the promises, risks, and practical boundaries of AI. Students may practice forming arguments, challenging assumptions, and defending decisions with evidence."
  ),
  createWeek(
    10,
    "2026-08-07",
    "Presentations of Team Projects",
    "This week may centre on final project presentations and the communication of applied AI ideas. Students may bring together course concepts, reflect on what they built, and learn from each other's approaches."
  ),
];
export const GUEST_LECTURER_OFF_WEEK_NUMBER = 6;
export const GUEST_LECTURER_ACTIVE_WEEK_NUMBERS = GUEST_LECTURER_WEEKS.filter(
  (week) => !week.isOff
).map((week) => week.weekNumber);

export const getGuestLecturerWeek = (weekNumber) =>
  GUEST_LECTURER_WEEKS.find((week) => week.weekNumber === Number(weekNumber)) || null;
