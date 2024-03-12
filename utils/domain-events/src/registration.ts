import type { Event } from "@overbookd/event";
import { StaffRegistered, VolunteerRegistered } from "@overbookd/registration";

export const STAFF_REGISTERED = "staff-registered";
export const VOLUNTEER_REGISTERED = "volunteer-registered";

export type StaffRegisteredEvent = Event<
  typeof STAFF_REGISTERED,
  StaffRegistered
>;
export type VolunteerRegisteredEvent = Event<
  typeof VOLUNTEER_REGISTERED,
  VolunteerRegistered
>;
