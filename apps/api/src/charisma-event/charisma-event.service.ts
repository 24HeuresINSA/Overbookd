import {
  CharismaEvent,
  CharismaEventDefinition,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";

export class CharismaEventService {
  constructor(private readonly charismaEvent: CharismaEvent) {}

  async addParticipations(
    event: CharismaEventDefinition,
    participants: ParticipantTakingPartInCharismaEvent[],
  ): Promise<CharismaEventParticipation[]> {
    return this.charismaEvent.takePart(event, participants);
  }
}
