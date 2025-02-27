export const REGISTER_FORM_KEY = "registerForm";
export const EVENT_DATE_KEY = "eventDate";
export const INVITE_STAFF_LINK_KEY = "inviteStaffLink";
export const INVITE_NEW_ADHERENT_KEY = "inviteNewAdherentLink";
export const VOLUNTEER_BRIEFING_TIME_WINDOW_KEY = "volunteerBriefingTimeWindow";

export type ConfigurationKey =
  | typeof REGISTER_FORM_KEY
  | typeof EVENT_DATE_KEY
  | typeof INVITE_STAFF_LINK_KEY
  | typeof INVITE_NEW_ADHERENT_KEY
  | typeof VOLUNTEER_BRIEFING_TIME_WINDOW_KEY;

export const configurationKeys = [
  REGISTER_FORM_KEY,
  EVENT_DATE_KEY,
  INVITE_STAFF_LINK_KEY,
  INVITE_NEW_ADHERENT_KEY,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
] as const;

export type Configuration<
  T extends object | string | number | boolean =
    | object
    | string
    | number
    | boolean,
> = {
  key: string;
  value: T;
};
