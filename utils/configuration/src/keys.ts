export const VOLUNTEER_REGISTER_FORM_KEY = "registerForm";
export const STAFF_REGISTER_FORM_KEY = "staffRegisterForm";
export const EVENT_DATE_KEY = "eventDate";
export const ORGA_WEEK_DATE_KEY = "orgaWeekDate";
export const INVITE_STAFF_LINK_KEY = "inviteStaffLink";
export const VOLUNTEER_BRIEFING_TIME_WINDOW_KEY = "volunteerBriefingTimeWindow";
export const USEFUL_LINKS_KEY = "usefulLinks";

export type ConfigurationKey =
  | typeof VOLUNTEER_REGISTER_FORM_KEY
  | typeof STAFF_REGISTER_FORM_KEY
  | typeof EVENT_DATE_KEY
  | typeof ORGA_WEEK_DATE_KEY
  | typeof INVITE_STAFF_LINK_KEY
  | typeof VOLUNTEER_BRIEFING_TIME_WINDOW_KEY
  | typeof USEFUL_LINKS_KEY;

export const configurationKeys = [
  VOLUNTEER_REGISTER_FORM_KEY,
  STAFF_REGISTER_FORM_KEY,
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  INVITE_STAFF_LINK_KEY,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  USEFUL_LINKS_KEY,
] as const;
