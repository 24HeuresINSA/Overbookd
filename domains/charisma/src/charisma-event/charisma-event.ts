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
  InexistentParticipation,
} from "./charisma-event.error";
import { DateString, OverDate } from "@overbookd/date";

export type Participation = {
  slug: string;
  name: string;
  participant: User;
  charisma: number;
  eventDate: DateString;
};

export type ParticipantTakingPart = {
  id: number;
  hours: number;
};

export type CreateParticipation = Omit<Participation, "participant"> & {
  participantId: number;
};

export type EditParticipation = Omit<Participation, "name" | "participant"> & {
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
    eventDate: DateString,
    participants: ParticipantTakingPart[],
  ): Promise<User[]>;
  add(...participations: CreateParticipation[]): Promise<Participation[]>;
  exists(
    eventSlug: string,
    eventDate: DateString,
    participantId: number,
  ): Promise<boolean>;
  edit(participation: EditParticipation): Promise<Participation>;
};

export class CharismaEvent {
  constructor(private readonly charismaEvents: CharismaEventParticipations) {}

  async takePart(
    { name, charismaPerHour, eventDate }: CharismaEventDefinition,
    participants: ParticipantTakingPart[],
  ): Promise<Participation[]> {
    const slug = this.generateSlug(name);
    this.checkCharisma(charismaPerHour);

    const dateString = OverDate.from(eventDate).dateString;
    await this.checkParticipants(participants, slug, dateString);

    const newEvents = participants.map((participant) => ({
      slug,
      name,
      eventDate: dateString,
      participantId: participant.id,
      charisma: charismaPerHour * participant.hours,
    }));
    return this.charismaEvents.add(...newEvents);
  }

  async editParticipation(
    participation: EditParticipation,
  ): Promise<Participation> {
    this.checkCharisma(participation.charisma);

    const exists = await this.charismaEvents.exists(
      participation.slug,
      participation.eventDate,
      participation.participantId,
    );
    if (!exists) throw new InexistentParticipation();

    return this.charismaEvents.edit(participation);
  }

  private generateSlug(name: string): string {
    const slug = SlugifyService.apply(name);
    if (!slug) throw new InvalidName();
    return slug;
  }

  private checkCharisma(charismaPerHour: number): void {
    if (charismaPerHour <= 0) throw new InsufficientCharismaPerHour();
    if (!Number.isInteger(charismaPerHour)) throw new IntegerCharismaPerHour();
  }

  private async checkParticipants(
    participants: ParticipantTakingPart[],
    eventSlug: string,
    eventDate: DateString,
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
