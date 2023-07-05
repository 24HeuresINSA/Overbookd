import { Injectable } from '@nestjs/common';
import { groupBy } from '../util/group-by';
import { FaStatus } from 'src/fa/fa.model';
import { FtStatus } from 'src/ft/ft.model';

export type StatsPayload = {
  teamCode: string;
  status: {
    status: FaStatus | FtStatus;
    count: number;
  }[];
  total: number;
};

type StatsQueryResult = {
  status: FaStatus | FtStatus;
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
  ): { status: FaStatus | FtStatus; count: number }[] {
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
