import { Statistics } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { FestivalActivities } from "../statistics.service";
import { PrismaService } from "../../prisma.service";

const INIT_STATUS_STATISTICS: Statistics["status"] = {
  DRAFT: 0,
  IN_REVIEW: 0,
  VALIDATED: 0,
  REFUSED: 0,
};

export class PrismaFestivalActivities implements FestivalActivities {
  constructor(private readonly prisma: PrismaService) {}

  async byTeams(): Promise<Statistics[]> {
    const statusStatistics = await this.prisma.festivalActivity.groupBy({
      by: ["teamCode", "status"],
      _count: { status: true },
      orderBy: { teamCode: "asc" },
    });

    return statusStatistics.reduce<Statistics[]>(
      (acc, { teamCode, _count, status }) => {
        const teamIndex = acc.findIndex((stat) => stat.teamCode === teamCode);
        const teamStatistics = acc.at(teamIndex);

        if (teamIndex === -1 || !teamStatistics) {
          return [...acc, this.initStatistics(teamCode, _count.status, status)];
        }

        const updatedTeamStatistics = this.updateTeamStatistics(
          teamStatistics,
          _count.status,
          status,
          teamCode,
        );

        return updateItemToList(acc, teamIndex, updatedTeamStatistics);
      },
      [],
    );
  }

  private initStatistics(
    teamCode: string,
    total: number,
    status: string,
  ): Statistics {
    const firstStatus = { ...INIT_STATUS_STATISTICS, [status]: total };

    return { teamCode, total, status: firstStatus };
  }

  private updateTeamStatistics(
    teamStatistics: Statistics,
    count: number,
    status: string,
    teamCode: string,
  ): Statistics {
    const total = teamStatistics.total + count;
    const mergedStatus: Statistics["status"] = {
      ...teamStatistics.status,
      [status]: count,
    };

    return { teamCode, total, status: mergedStatus };
  }
}
