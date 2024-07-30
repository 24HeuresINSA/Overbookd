import {
  CharismaEventParticipations,
  CreateCharismaEventParticipation,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import { PrismaService } from "../../prisma.service";
import { SELECT_CHARISMA_EVENT_PARTICIPATION } from "./participation.query";
import { User } from "@overbookd/user";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

export class PrismaCharismaEventParticipations
  implements CharismaEventParticipations
{
  constructor(private readonly prisma: PrismaService) {}

  async areAlreadyParticipating(
    eventSlug: string,
    eventDate: Date,
    participants: ParticipantTakingPartInCharismaEvent[],
  ): Promise<User[]> {
    const participations =
      await this.prisma.charismaEventParticipation.findMany({
        where: {
          slug: eventSlug,
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
    return Promise.all(
      participations.map((participation) =>
        this.prisma.charismaEventParticipation.create({
          data: participation,
          select: SELECT_CHARISMA_EVENT_PARTICIPATION,
        }),
      ),
    );
  }
}
