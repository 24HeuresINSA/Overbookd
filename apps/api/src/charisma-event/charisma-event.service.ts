import {
  CharismaEvent,
  CharismaEventDefinition,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import { CharismaEventPotentialParticipant } from "@overbookd/http";

export type PotentialParticipants = {
  findAll: () => Promise<CharismaEventPotentialParticipant[]>;
};

export class CharismaEventService {
  constructor(
    private readonly charismaEvent: CharismaEvent,
    private readonly potentialParticipants: PotentialParticipants,
  ) {}

  async fetchPotentialParticipants(): Promise<
    CharismaEventPotentialParticipant[]
  > {
    return this.potentialParticipants.findAll();
  }

  async addParticipations(
    event: CharismaEventDefinition,
    participants: ParticipantTakingPartInCharismaEvent[],
  ): Promise<CharismaEventParticipation[]> {
    return this.charismaEvent.takePart(event, participants);
  }
}
