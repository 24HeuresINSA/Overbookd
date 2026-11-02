import {
  VolunteerForAssignment,
  VolunteersForAssignmentRepository,
  VolunteerNotFoundError,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { SELECT_BREAK_PERIOD } from "../../../common/query/break-period.query";
import { SELECT_TEAM_CODES } from "../../../common/query/user.query";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";

export class PrismaVolunteersForAssignment implements VolunteersForAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(volunteerId: number): Promise<VolunteerForAssignment> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: volunteerId, ...IS_NOT_DELETED },
      select: {
        id: true,
        ...SELECT_TEAM_CODES,
        availabilities: { select: SELECT_PERIOD },
        assigned: { select: { assignment: { select: SELECT_PERIOD } } },
        breaks: { select: SELECT_BREAK_PERIOD },
      },
    });
    if (!volunteer) throw new VolunteerNotFoundError(volunteerId);

    return {
      id: volunteer.id,
      teams: volunteer.teams.map(({ teamCode }) => teamCode),
      availabilities: volunteer.availabilities,
      assignments: volunteer.assigned.map(({ assignment }) => assignment),
      breakPeriods: volunteer.breaks,
    };
  }
}
