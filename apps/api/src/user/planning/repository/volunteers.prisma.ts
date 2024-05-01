import { VolunteerForPlanning } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { Volunteers } from "../planning.service";
import { SELECT_PERIOD } from "../../../assignment/common/repository/period.query";
import { Period } from "@overbookd/period";
import { UserName } from "@overbookd/user";

const SELECT_VOLUNTEER_NAME = {
  firstname: true,
  lastname: true,
  nickname: true,
};

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<VolunteerForPlanning[]> {
    const volunteers = await this.prisma.user.findMany({
      where: { assigned: { some: {} }, preference: { paperPlanning: true } },
      select: {
        id: true,
        ...SELECT_VOLUNTEER_NAME,
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

  find(id: number): Promise<UserName> {
    return this.prisma.user.findUnique({
      where: { id },
      select: SELECT_VOLUNTEER_NAME,
    });
  }
}
