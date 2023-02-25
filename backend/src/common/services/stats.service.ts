import { Injectable } from '@nestjs/common';
import { FtStatus, Status } from '@prisma/client';
import { groupBy } from '../util/group-by';

export type StatsPayload = {
  teamCode: string;
  status: {
    status: Status | FtStatus;
    count: number;
  }[];
  total: number;
};

type StatsQueryResult = {
  status: Status | FtStatus;
  teamCode: string;
  _count: {
    status: number;
  };
};

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
  ): { status: Status | FtStatus; count: number }[] {
    return teamStats
      .map(({ status, _count }) => ({
        status,
        count: _count.status,
      }))
      .sort((a, b) => a.status.localeCompare(b.status));
  }

  private static sumStatusCount(teamStats: StatsQueryResult[]): number {
    return teamStats.reduce(
      (total, statusStats) => total + statusStats._count.status,
      0,
    );
  }
}
