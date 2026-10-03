import {
  Volunteer,
  VolunteersForEnableAssignment,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";

export class PrismaEnableAssignmentVolunteers implements VolunteersForEnableAssignment {
  constructor(private readonly prisma: PrismaService) {}

  findByTeam(team: string): Promise<Volunteer[]> {
    return this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        teams: { some: { teamCode: team } },
      },
      select: SELECT_VOLUNTEER,
    });
  }
}
