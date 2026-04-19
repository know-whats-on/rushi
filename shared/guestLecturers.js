const createWeek = (weekNumber, date, theme, isOff = false) => ({
  weekNumber,
  label: `Week ${weekNumber}`,
  date,
  theme,
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
  "We would love to welcome guest lecturers into AI Fluency at UNSW Sydney. Rushi and the students genuinely appreciate the time and effort it takes to share practical industry insight, case studies, and real-world lessons from your work.";
export const GUEST_LECTURER_CONFIRMATION_COPY =
  "Thanks for sharing your EOI. Rushi will review it and follow up if the timing and topic are a fit. This submission does not confirm a guest lecture slot.";
export const GUEST_LECTURER_COURSE_OUTLINE_URL =
  "https://www.unsw.edu.au/course-outlines/course-outline#year=2026&term=Term%201&deliveryMode=In%20Person&deliveryFormat=Standard&teachingPeriod=T1&deliveryLocation=Kensington&courseCode=INFS2604&activityGroupId=1";
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
  createWeek(1, "2026-06-05", "Introduction to the exciting world of AI"),
  createWeek(2, "2026-06-12", "Responsible AI & Usage Principles"),
  createWeek(3, "2026-06-19", "AI for Creativity"),
  createWeek(4, "2026-06-26", "AI for Prediction & Visualization"),
  createWeek(5, "2026-07-03", "AI for Research"),
  createWeek(6, "2026-07-10", "Flexibility Week", true),
  createWeek(7, "2026-07-17", "AI & Sustainability"),
  createWeek(8, "2026-07-24", "AI Agents"),
  createWeek(9, "2026-07-31", "Debates"),
  createWeek(10, "2026-08-07", "Presentations of Team Projects"),
];
export const GUEST_LECTURER_OFF_WEEK_NUMBER = 6;
export const GUEST_LECTURER_ACTIVE_WEEK_NUMBERS = GUEST_LECTURER_WEEKS.filter(
  (week) => !week.isOff
).map((week) => week.weekNumber);

export const getGuestLecturerWeek = (weekNumber) =>
  GUEST_LECTURER_WEEKS.find((week) => week.weekNumber === Number(weekNumber)) || null;
