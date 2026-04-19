import { VolunteerForPlanningLeaflet } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { PlanningVolunteers } from "../planning.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { IProvidePeriod, Period } from "@overbookd/time";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../../../common/query/user.query";
import { AssignmentEvent } from "@overbookd/assignment";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { SELECT_PLANNING_EVENT } from "../../../assignment/common/repository/planning.query";
import { toPlanningEventFromAssignment } from "../../../assignment/common/repository/planning.prisma";
import { UserWithTeams } from "@overbookd/user";
import { friendAssigneesCount } from "../../../assignment/common/repository/assignment.query";

const SELECT_VOLUNTEER = { ...SELECT_USER_IDENTIFIER, ...SELECT_TEAMS_CODE };

export class PrismaPlanningVolunteers implements PlanningVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async allForLeaflets(): Promise<VolunteerForPlanningLeaflet[]> {
    const volunteers = await this.prisma.user.findMany({
      where: { assigned: { some: {} }, preference: { paperPlanning: true } },
      select: {
        ...SELECT_VOLUNTEER,
        assigned: { select: { assignment: { select: SELECT_PERIOD } } },
      },
    });

    return volunteers.map(({ assigned, teams: teamCodes, ...volunteer }) => {
      const assignment = assigned.reduce((sum, { assignment }) => {
        const duration = Period.init(assignment).duration.inMilliseconds;
        return sum + duration;
      }, 0);
      const teams = teamCodes.map(({ teamCode }) => teamCode);
      return { ...volunteer, assignment, teams };
    });
  }

  async findOne(id: number): Promise<UserWithTeams | null> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
    if (!volunteer) return null;
    return {
      ...volunteer,
      teams: volunteer.teams.map(({ teamCode }) => teamCode),
    };
  }

  async assignmentsFor(volunteerId: number): Promise<AssignmentEvent[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: IS_NOT_DELETED,
      },
      select: {
        ...SELECT_PLANNING_EVENT,
        ...friendAssigneesCount(volunteerId),
      },
    });

    return assignments.map(toPlanningEventFromAssignment);
  }

  availabilitiesFor(volunteerId: number): Promise<IProvidePeriod[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: { userId: volunteerId },
      select: SELECT_PERIOD,
    });
  }
}
