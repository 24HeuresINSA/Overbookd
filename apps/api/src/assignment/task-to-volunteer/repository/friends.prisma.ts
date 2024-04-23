import { Friends, VolunteerForFunnel } from "@overbookd/assignment";
import { Period } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";
import {
  HAS_POSITIVE_CHARISMA,
  IS_NOT_DELETED,
} from "../../common/repository/common.query";
import { overlapPeriodCondition } from "../../common/repository/period.query";

const SELECT_FRIEND = {
  id: true,
  firstname: true,
  lastname: true,
  teams: { select: { teamCode: true } },
};

export class PrismaFriends implements Friends {
  constructor(private readonly prisma: PrismaService) {}

  async availableDuringWith(
    period: Period,
    volunteer: number,
  ): Promise<VolunteerForFunnel[]> {
    const includePeriod = overlapPeriodCondition(period);
    const isFriendOfVolunteer = {
      OR: [
        { friends: { some: { requestorId: volunteer } } },
        { friendRequestors: { some: { friendId: volunteer } } },
      ],
    };
    const availableFriends = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...HAS_POSITIVE_CHARISMA,
        ...isFriendOfVolunteer,
        assigned: { none: { assignment: includePeriod } },
        availabilities: { some: includePeriod },
      },
      select: SELECT_FRIEND,
    });

    return availableFriends.map(({ id, firstname, lastname, teams }) => ({
      id,
      firstname,
      lastname,
      teams: teams.map(({ teamCode }) => teamCode),
    }));
  }
}
