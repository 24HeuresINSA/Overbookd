import { Injectable } from "@nestjs/common";
import { groupBy } from "../util/group-by";
import { FaStatus, faStatuses } from "../../fa/fa.model";
import { FtStatus, ftStatuses } from "../../ft/ft.model";

export type StatusCount = {
  status: FaStatus | FtStatus;
  count: number;
};

export type StatsPayload = {
  teamCode: string;
  status: StatusCount[];
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
  ): { status: FaStatus | FtStatus; count: number }[] {
    const statuses = teamStats.map(({ status, _count }) => ({
      status,
      count: _count.status,
    }));
    return StatsService.sortStatus(statuses);
  }

  private static sortStatus(
    statuses: { status: FaStatus | FtStatus; count: number }[],
  ): { status: FaStatus | FtStatus; count: number }[] {
    const statusOrder = statuses.some(
      ({ status }) => status === ftStatuses.READY,
    )
      ? ftStatusLifeCycle
      : faStatusLifeCycle;

    return statuses.sort(
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
