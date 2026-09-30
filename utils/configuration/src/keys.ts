export const REGISTRATION_FORM_KEY = "registrationForm";
export const EVENT_DATE_KEY = "eventDate";
export const ORGA_WEEK_DATE_KEY = "orgaWeekDate";
export const INVITE_STAFF_LINK_KEY = "inviteStaffLink";
export const VOLUNTEER_BRIEFING_TIME_WINDOW_KEY = "volunteerBriefingTimeWindow";
export const USEFUL_LINKS_KEY = "usefulLinks";
export const LAST_EDITION_FESTIVAL_EVENT_STATS_KEY =
  "lastEditionFestivalEventStats";

export type ConfigurationKey =
  | typeof REGISTRATION_FORM_KEY
  | typeof EVENT_DATE_KEY
  | typeof ORGA_WEEK_DATE_KEY
  | typeof INVITE_STAFF_LINK_KEY
  | typeof VOLUNTEER_BRIEFING_TIME_WINDOW_KEY
  | typeof USEFUL_LINKS_KEY
  | typeof LAST_EDITION_FESTIVAL_EVENT_STATS_KEY;

export const configurationKeys = [
  REGISTRATION_FORM_KEY,
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  INVITE_STAFF_LINK_KEY,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  USEFUL_LINKS_KEY,
  LAST_EDITION_FESTIVAL_EVENT_STATS_KEY,
] as const;
