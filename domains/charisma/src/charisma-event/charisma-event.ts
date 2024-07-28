import { SlugifyService } from "@overbookd/slugify";
import { User } from "@overbookd/user";
import {
  InvalidName,
  InsufficientCharismaPerHour,
  IntegerCharismaPerHour,
  NoParticipant,
  InvalidParticipantHours,
  SameParticipantMultipleTimes,
  AlreadyExists,
} from "./charisma-event.error";

export type Participation = {
  slug: string;
  name: string;
  participant: User;
  charisma: number;
  eventDate: Date;
};

export type ParticipantTakingPart = {
  id: number;
  hours: number;
};

export type CreateParticipation = Omit<Participation, "participant"> & {
  participantId: number;
};

export type CharismaEventDefinition = {
  name: string;
  charismaPerHour: number;
  eventDate: Date;
};

export type CharismaEventParticipations = {
  areAlreadyParticipating(
    eventSlug: string,
    eventDate: Date,
    participants: ParticipantTakingPart[],
  ): Promise<User[]>;
  add(...participations: CreateParticipation[]): Promise<Participation[]>;
};

export class CharismaEvent {
  constructor(private readonly charismaEvents: CharismaEventParticipations) {}

  async takePart(
    { name, charismaPerHour, eventDate }: CharismaEventDefinition,
    participants: ParticipantTakingPart[],
  ): Promise<Participation[]> {
    const slug = this.generateSlug(name);
    this.checkCharismaPerHour(charismaPerHour);
    await this.checkParticipants(participants, slug, eventDate);

    const newEvents = participants.map((participant) => ({
      slug,
      name,
      eventDate,
      participantId: participant.id,
      charisma: charismaPerHour * participant.hours,
    }));
    return this.charismaEvents.add(...newEvents);
  }

  private generateSlug(name: string): string {
    const slug = SlugifyService.apply(name);
    if (!slug) throw new InvalidName();
    return slug;
  }

  private checkCharismaPerHour(charismaPerHour: number): void {
    if (charismaPerHour <= 0) throw new InsufficientCharismaPerHour();
    if (!Number.isInteger(charismaPerHour)) throw new IntegerCharismaPerHour();
  }

  private async checkParticipants(
    participants: ParticipantTakingPart[],
    eventSlug: string,
    eventDate: Date,
  ): Promise<void> {
    if (participants.length === 0) throw new NoParticipant();

    const hasInvalidHours = participants.some(({ hours }) => hours <= 0);
    if (hasInvalidHours) throw new InvalidParticipantHours();

    const uniqueParticipants = new Set(participants.map(({ id }) => id));
    const hasSameParticipant = uniqueParticipants.size !== participants.length;
    if (hasSameParticipant) throw new SameParticipantMultipleTimes();

    const existingParticipations =
      await this.charismaEvents.areAlreadyParticipating(
        eventSlug,
        eventDate,
        participants,
      );
    if (existingParticipations.length > 0) {
      throw new AlreadyExists(existingParticipations);
    }
  }
}
