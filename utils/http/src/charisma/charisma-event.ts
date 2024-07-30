import {
  CharismaEventDefinition,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import { User } from "@overbookd/user";

export type CreateCharismaEventParticipationsForm = {
  event: CharismaEventDefinition;
  participants: ParticipantTakingPartInCharismaEvent[];
};

export type CharismaEventPotentialParticipant = User & {
  charisma: number;
};
