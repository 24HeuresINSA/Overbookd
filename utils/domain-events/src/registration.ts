import type { Event } from "@overbookd/event";
import {
  AdherentRegistered,
  VolunteerRegistered,
} from "@overbookd/registration";

export const ADHERENT_REGISTERED = "adherent-registered";
export const VOLUNTEER_REGISTERED = "volunteer-registered";

export type AdherentRegisteredEvent = Event<
  typeof ADHERENT_REGISTERED,
  AdherentRegistered
>;
export type VolunteerRegisteredEvent = Event<
  typeof VOLUNTEER_REGISTERED,
  VolunteerRegistered
>;
