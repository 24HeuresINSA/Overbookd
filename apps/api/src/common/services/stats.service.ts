import { Injectable } from "@nestjs/common";
import { groupBy } from "../util/group-by";
import { FaStatus, faStatuses } from "../../fa/fa.model";
import { FtStatus, ftStatuses } from "../../ft/ft.model";

export type StatsPayload = {
  teamCode: string;
  status: Record<FaStatus | FtStatus, number>;
  total: number;
};

type StatsQueryResult = {
  status: FaStatus | FtStatus;
  teamCode: string;
  _count: {
    status: number;
  };
};

const faStatusLifeCycle = [
  faStatuses.DRAFT,
  faStatuses.REFUSED,
  faStatuses.SUBMITTED,
  faStatuses.VALIDATED,
];

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
  ): Record<FaStatus | FtStatus, number> {
    const statuses = StatsService.sortStatus(teamStats);

    return statuses.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<FaStatus | FtStatus, number>);
  }

  private static sortStatus(teamStats: StatsQueryResult[]): StatsQueryResult[] {
    const statusOrder = teamStats.some(
      ({ status }) => status === ftStatuses.READY,
    )
      ? ftStatusLifeCycle
      : faStatusLifeCycle;
    return teamStats.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
  }

  private static sumStatusCount(teamStats: StatsQueryResult[]): number {
    return teamStats.reduce(
      (total, statusStats) => total + statusStats._count.status,
      0,
    );
  }
}
