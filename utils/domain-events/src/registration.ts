import type { Event } from "@overbookd/event";
import { EnrolledNewcomer } from "@overbookd/registration";
import { StaffRegistered, VolunteerRegistered } from "@overbookd/registration";

export const STAFF_REGISTERED = "staff-registered";
export const VOLUNTEER_REGISTERED = "volunteer-registered";
export const VOLUNTEER_ENROLLED = "volunteer-enrolled";

export type StaffRegisteredEvent = Event<
  typeof STAFF_REGISTERED,
  StaffRegistered
>;
export type VolunteerRegisteredEvent = Event<
  typeof VOLUNTEER_REGISTERED,
  VolunteerRegistered
>;
export type VolunteerEnrolledEvent = Event<
  typeof VOLUNTEER_ENROLLED,
  EnrolledNewcomer
>;
