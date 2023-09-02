import {
  ADHERENT,
  AdherentRegistered,
  VOLUNTEER,
  VolunteerRegistered,
} from "@overbookd/registration";

const REGISTRATION = "registration";

export type OverbookEvent = AdherentRegistered | VolunteerRegistered;

export function isAdherentRegistered(
  event: OverbookEvent,
): event is AdherentRegistered {
  return event.membership === ADHERENT;
}

export function isVolunteerRegistered(
  event: OverbookEvent,
): event is VolunteerRegistered {
  return event.membership === VOLUNTEER;
}

export type Domain = typeof REGISTRATION;

export type DomainEvent<T extends OverbookEvent = OverbookEvent> = {
  domain: Domain;
  event: T;
};
