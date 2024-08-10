import { User } from "@overbookd/user";
import {
  Participation,
  CharismaEventParticipations,
  CreateParticipation,
  ParticipantTakingPart,
  EditParticipation,
} from "./charisma-event";
import { DateString } from "@overbookd/date";

export class InMemoryCharismaEventParticipations
  implements CharismaEventParticipations
{
  constructor(
    private participants: User[],
    private participations: Participation[],
  ) {}

  async areAlreadyParticipating(
    eventSlug: string,
    eventDate: DateString,
    participants: ParticipantTakingPart[],
  ): Promise<User[]> {
    return this.participations
      .filter((participation) => {
        const sameSlug = participation.slug === eventSlug;
        const sameDate = participation.eventDate === eventDate;
        const sameParticipant = participants.some(
          ({ id }) => participation.participant.id === id,
        );
        return sameSlug && sameDate && sameParticipant;
      })
      .map(({ participant }) => participant);
  }

  async add(
    ...participations: CreateParticipation[]
  ): Promise<Participation[]> {
    const newEvents = participations.map(({ participantId, ...event }) => {
      const participant = this.participants.find(
        (participant) => participant.id === participantId,
      );
      if (!participant) {
        throw new Error(`Participant #${participantId} introuvable`);
      }
      return { ...event, participant };
    });
    this.participations = [...this.participations, ...newEvents];
    return newEvents;
  }

  async exists(
    eventSlug: string,
    eventDate: DateString,
    participantId: number,
  ): Promise<boolean> {
    return Promise.resolve(
      this.participations.some(
        (participation) =>
          participation.slug === eventSlug &&
          participation.eventDate === eventDate &&
          participation.participant.id === participantId,
      ),
    );
  }

  async edit(participation: EditParticipation): Promise<Participation> {
    const existing = this.participations.find(
      (existing) =>
        existing.slug === participation.slug &&
        existing.eventDate === participation.eventDate &&
        existing.participant.id === participation.participantId,
    );
    if (!existing) throw new Error("Participation inexistante");

    const updated = { ...existing, charisma: participation.charisma };
    this.participations = this.participations.map((participation) =>
      participation === existing ? updated : participation,
    );
    return updated;
  }

  get all(): Participation[] {
    return this.participations;
  }
}
