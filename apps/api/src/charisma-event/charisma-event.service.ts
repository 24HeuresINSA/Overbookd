import {
  CharismaEvent,
  CharismaEventDefinition,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import { DateString } from "@overbookd/date";
import { CharismaEventPotentialParticipant } from "@overbookd/http";

export type PotentialParticipants = {
  findAll: () => Promise<CharismaEventPotentialParticipant[]>;
};

export type ViewParticipations = {
  findAll: () => Promise<CharismaEventParticipation[]>;
  remove: (
    slug: string,
    date: DateString,
    participantId: number,
  ) => Promise<void>;
};

type Repositories = {
  potentialParticipants: Readonly<PotentialParticipants>;
  viewParticipations: Readonly<ViewParticipations>;
};

export class CharismaEventService {
  constructor(
    private readonly charismaEvent: CharismaEvent,
    private readonly repositories: Repositories,
  ) {}

  async fetchAll(): Promise<CharismaEventParticipation[]> {
    return this.repositories.viewParticipations.findAll();
  }

  async fetchPotentialParticipants(): Promise<
    CharismaEventPotentialParticipant[]
  > {
    return this.repositories.potentialParticipants.findAll();
  }

  async addParticipations(
    { name, charismaPerHour, eventDate }: CharismaEventDefinition,
    participants: ParticipantTakingPartInCharismaEvent[],
  ): Promise<CharismaEventParticipation[]> {
    const event = { name, charismaPerHour, eventDate: new Date(eventDate) };
    return this.charismaEvent.takePart(event, participants);
  }

  async removeParticipation(
    slug: string,
    date: DateString,
    participantId: number,
  ): Promise<void> {
    return this.repositories.viewParticipations.remove(
      slug,
      date,
      participantId,
    );
  }
}
