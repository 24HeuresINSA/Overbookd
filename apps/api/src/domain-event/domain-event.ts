import {
  ADHERENT,
  ADHERENT_REGISTERED,
  AdherentRegistered,
  VOLUNTEER,
  VolunteerRegistered,
} from "@overbookd/registration";

const REGISTRATION = "registration";

export type OverbookdEvent = AdherentRegistered | VolunteerRegistered;

export type OverbookdEventType = typeof ADHERENT_REGISTERED;

export function isAdherentRegistered(
  event: OverbookdEvent,
): event is AdherentRegistered {
  return event.membership === ADHERENT;
}

export function isVolunteerRegistered(
  event: OverbookdEvent,
): event is VolunteerRegistered {
  return event.membership === VOLUNTEER;
}

export type Domain = typeof REGISTRATION;

export type DomainEvent<T extends OverbookdEvent = OverbookdEvent> = {
  domain: Domain;
  event: T;
};
