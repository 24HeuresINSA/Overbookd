import { VolunteerForPlanning } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { Volunteers } from "../planning.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { Period } from "@overbookd/time";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../../../common/query/user.query";
import { VolunteerWithTeams } from "../domain/task.model";
import { buildUserNameWithNickname } from "@overbookd/user";

const SELECT_VOLUNTEER = { ...SELECT_USER_IDENTIFIER, ...SELECT_TEAMS_CODE };

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<VolunteerForPlanning[]> {
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

  async find(id: number): Promise<VolunteerWithTeams | null> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
    if (!volunteer) return null;
    return {
      id: volunteer.id,
      name: buildUserNameWithNickname(volunteer),
      teams: volunteer.teams.map(({ teamCode }) => teamCode),
    };
  }
}
