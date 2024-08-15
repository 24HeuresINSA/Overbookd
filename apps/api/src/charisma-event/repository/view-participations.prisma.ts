import { CharismaEventParticipation } from "@overbookd/charisma";
import { PrismaService } from "../../prisma.service";
import { SELECT_CHARISMA_EVENT_PARTICIPATION } from "./participation.query";
import { ViewParticipations } from "../charisma-event.service";
import { DateString } from "@overbookd/time";

export class PrismaViewCharismaEventParticipations
  implements ViewParticipations
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CharismaEventParticipation[]> {
    const participations =
      await this.prisma.charismaEventParticipation.findMany({
        select: SELECT_CHARISMA_EVENT_PARTICIPATION,
        orderBy: { eventDate: "desc" },
      });
    return participations.map((participation) => ({
      ...participation,
      eventDate: participation.eventDate as DateString,
    }));
  }

  async remove(
    slug: string,
    eventDate: DateString,
    participantId: number,
  ): Promise<void> {
    await this.prisma.charismaEventParticipation.delete({
      where: {
        participantId_slug_eventDate: {
          participantId,
          slug,
          eventDate,
        },
      },
    });
  }
}
