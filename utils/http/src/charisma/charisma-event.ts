import {
  CharismaEventDefinition,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";

export type CreateCharismaEventParticipationsForm = {
  event: CharismaEventDefinition;
  participants: ParticipantTakingPartInCharismaEvent[];
};
