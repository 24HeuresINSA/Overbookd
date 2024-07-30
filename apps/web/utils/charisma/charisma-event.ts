import type { CharismaEventPotentialParticipant } from "@overbookd/http";

export type CharismaEventParticipant = CharismaEventPotentialParticipant & {
  hours: number;
};
