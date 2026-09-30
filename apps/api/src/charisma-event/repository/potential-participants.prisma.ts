import { CharismaEventPotentialParticipant } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { PotentialParticipants } from "../charisma-event.service";
import {
  IS_MEMBER_OF_VOLUNTEER_TEAM,
  SELECT_USER_IDENTIFIER,
} from "../../common/query/user.query";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";
import {
  SELECT_CHARISMA_PERIOD,
  SELECT_USER_DATA_FOR_CHARISMA,
} from "../../common/query/charisma.query";
import { Charisma } from "@overbookd/charisma";

export class PrismaCharismaEventPotentialParticipants implements PotentialParticipants {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CharismaEventPotentialParticipant[]> {
    const [participants, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: { ...IS_NOT_DELETED, ...IS_MEMBER_OF_VOLUNTEER_TEAM },
        select: { ...SELECT_USER_IDENTIFIER, ...SELECT_USER_DATA_FOR_CHARISMA },
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
    ]);
    return participants.map(
      ({ charismaEventParticipations, availabilities, ...participant }) => {
        const charisma = Charisma.init()
          .addEvents(charismaEventParticipations)
          .addAvailabilities(availabilities, charismaPeriods)
          .calculate();
        return { ...participant, charisma };
      },
    );
  }
}
