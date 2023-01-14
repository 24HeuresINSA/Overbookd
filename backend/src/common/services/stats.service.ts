import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { groupBy } from '../util/group-by';

export type StatsPayload = {
  teamId: number;
  status: {
    status: Status;
    count: number;
  }[];
  total: number;
};

export type StatsQueryResult = {
  status: Status;
  team_id: number;
  _count: {
    status: number;
  };
};

@Injectable()
export class StatsService {
  stats(statsFromQuery: StatsQueryResult[]): StatsPayload[] {
    const groupedByTeam = groupBy(statsFromQuery, (i) => i.team_id);
    return groupedByTeam.map(StatsService.convertTeamStatsToStatsPayload);
  }

  private static convertTeamStatsToStatsPayload(
    teamStats: StatsQueryResult[],
  ): StatsPayload {
    const teamId = teamStats[0].team_id;
    const total = StatsService.sumStatusCount(teamStats);
    const status = StatsService.extractStatusStats(teamStats);
    return {
      teamId,
      total,
      status,
    };
  }

  private static extractStatusStats(
    teamStats: StatsQueryResult[],
  ): { status: Status; count: number }[] {
    return teamStats.map(({ status, _count }) => ({
      status,
      count: _count.status,
    }));
  }

  private static sumStatusCount(teamStats: StatsQueryResult[]): number {
    return teamStats.reduce(
      (total, statusStats) => total + statusStats._count.status,
      0,
    );
  }
}
