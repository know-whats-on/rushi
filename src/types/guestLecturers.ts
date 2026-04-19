export interface GuestLecturerWeek {
  weekNumber: number;
  label: string;
  date: string;
  theme: string;
  isOff: boolean;
}

export interface GuestLecturerAccessSession {
  accessible: boolean;
  campaignKey: string;
  expiresAt?: string | null;
}

export interface GuestLecturerAdminSession {
  accessible: boolean;
  campaignKey: string;
  expiresAt?: string | null;
}

export interface GuestLecturerSubmissionInput {
  name: string;
  email: string;
  linkedinUrl: string;
  topicPreference?: string;
  selectedWeeks: number[];
}

export interface GuestLecturerSubmission {
  id: string;
  campaignKey: string;
  name: string;
  email: string;
  linkedinUrl: string;
  topicPreference: string;
  selectedWeeks: number[];
  createdAt: string;
}
