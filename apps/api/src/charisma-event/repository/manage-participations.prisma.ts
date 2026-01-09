import {
  CharismaEventParticipations,
  CreateCharismaEventParticipation,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
  EditCharismaEventParticipation,
} from "@overbookd/charisma";
import { PrismaService } from "../../prisma.service";
import { SELECT_CHARISMA_EVENT_PARTICIPATION } from "./participation.query";
import { User } from "@overbookd/user";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";
import { DateString } from "@overbookd/time";

export class PrismaManageCharismaEventParticipations implements CharismaEventParticipations {
  constructor(private readonly prisma: PrismaService) {}

  async areAlreadyParticipating(
    slug: string,
    eventDate: DateString,
    participants: ParticipantTakingPartInCharismaEvent[],
  ): Promise<User[]> {
    const participations =
      await this.prisma.charismaEventParticipation.findMany({
        where: {
          slug,
          eventDate,
          participantId: { in: participants.map(({ id }) => id) },
        },
        select: { participant: { select: SELECT_USER_IDENTIFIER } },
      });
    return participations.map(({ participant }) => participant);
  }

  async add(
    ...participations: CreateCharismaEventParticipation[]
  ): Promise<CharismaEventParticipation[]> {
    const newParticipations = await Promise.all(
      participations.map((participation) =>
        this.prisma.charismaEventParticipation.create({
          data: participation,
          select: SELECT_CHARISMA_EVENT_PARTICIPATION,
        }),
      ),
    );
    return newParticipations.map((participation) => ({
      ...participation,
      eventDate: participation.eventDate as DateString,
    }));
  }

  async exists(
    slug: string,
    eventDate: DateString,
    participantId: number,
  ): Promise<boolean> {
    const participation =
      await this.prisma.charismaEventParticipation.findFirst({
        where: { slug, eventDate, participantId },
      });
    return participation !== null;
  }

  async edit(
    participation: EditCharismaEventParticipation,
  ): Promise<CharismaEventParticipation> {
    const updatedParticipation =
      await this.prisma.charismaEventParticipation.update({
        where: {
          participantId_slug_eventDate: {
            slug: participation.slug,
            eventDate: participation.eventDate,
            participantId: participation.participantId,
          },
        },
        data: participation,
        select: SELECT_CHARISMA_EVENT_PARTICIPATION,
      });
    return {
      ...updatedParticipation,
      eventDate: updatedParticipation.eventDate as DateString,
    };
  }
}
