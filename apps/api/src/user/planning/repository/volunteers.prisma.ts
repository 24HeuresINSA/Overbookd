import { VolunteerForPlanning } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { UserNameWithTeams, Volunteers } from "../planning.service";
import { SELECT_PERIOD } from "../../../assignment/common/repository/period.query";
import { Period } from "@overbookd/period";

const SELECT_VOLUNTEER = {
  firstname: true,
  lastname: true,
  nickname: true,
  teams: { select: { teamCode: true } },
};

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<VolunteerForPlanning[]> {
    const volunteers = await this.prisma.user.findMany({
      where: { assigned: { some: {} }, preference: { paperPlanning: true } },
      select: {
        id: true,
        ...SELECT_VOLUNTEER,
        teams: { select: { teamCode: true } },
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

  async find(id: number): Promise<UserNameWithTeams> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
    return {
      ...volunteer,
      teams: volunteer.teams.map(({ teamCode }) => teamCode),
    };
  }
}
