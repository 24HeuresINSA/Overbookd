import { Injectable } from "@nestjs/common";
import { groupBy } from "../common/util/group-by";
import { FtStatus, ftStatuses } from "./ft.model";

export type StatsPayload = {
  teamCode: string;
  status: Record<FtStatus, number>;
  total: number;
};

type StatsQueryResult = {
  status: FtStatus;
  teamCode: string;
  _count: {
    status: number;
  };
};

const ftStatusLifeCycle = [
  ftStatuses.DRAFT,
  ftStatuses.REFUSED,
  ftStatuses.SUBMITTED,
  ftStatuses.VALIDATED,
  ftStatuses.READY,
];

@Injectable()
export class StatsService {
  stats(statsFromQuery: StatsQueryResult[]): StatsPayload[] {
    const groupedByTeam = groupBy(statsFromQuery, (i) => i.teamCode);
    return groupedByTeam.map(StatsService.convertTeamStatsToStatsPayload);
  }

  private static convertTeamStatsToStatsPayload(
    teamStats: StatsQueryResult[],
  ): StatsPayload {
    const teamCode = teamStats[0].teamCode;
    const total = StatsService.sumStatusCount(teamStats);
    const status = StatsService.extractStatusStats(teamStats);
    return {
      teamCode,
      total,
      status,
    };
  }

  private static extractStatusStats(
    teamStats: StatsQueryResult[],
  ): Record<FtStatus, number> {
    const statuses = StatsService.sortStatus(teamStats);

    return statuses.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<FtStatus, number>,
    );
  }

  private static sortStatus(teamStats: StatsQueryResult[]): StatsQueryResult[] {
    return teamStats.sort(
      (a, b) =>
        ftStatusLifeCycle.indexOf(a.status) -
        ftStatusLifeCycle.indexOf(b.status),
    );
  }

  private static sumStatusCount(teamStats: StatsQueryResult[]): number {
    return teamStats.reduce(
      (total, statusStats) => total + statusStats._count.status,
      0,
    );
  }
}
