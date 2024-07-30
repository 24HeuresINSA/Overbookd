import { CharismaEventPotentialParticipant } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { PotentialParticipants } from "../charisma-event.service";
import {
  IS_MEMBER_OF_VOLUNTEER_TEAM,
  SELECT_USER_IDENTIFIER,
} from "../../common/query/user.query";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";

export class PrismaCharismaEventPotentialParticipants
  implements PotentialParticipants
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CharismaEventPotentialParticipant[]> {
    return this.prisma.user.findMany({
      where: { ...IS_NOT_DELETED, ...IS_MEMBER_OF_VOLUNTEER_TEAM },
      select: { ...SELECT_USER_IDENTIFIER, charisma: true },
    });
  }
}
