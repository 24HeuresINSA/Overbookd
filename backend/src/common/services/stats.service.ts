import { Injectable } from '@nestjs/common';
import { groupBy } from '../util/group-by';

export type StatsPayload = {
  teamCode: string;
  status: {
    status: string;
    count: number;
  }[];
  total: number;
};

export type StatsQueryResult = {
  fa_status: string;
  team_code: string;
  count: number;
}[];

@Injectable()
export class StatsService {
  stats(arr: StatsQueryResult): StatsPayload[] {
    const groupedByTeam = groupBy(arr, (i) => i.team_code);
    const stats = [] as StatsPayload[];
    Object.entries(groupedByTeam).forEach(([teamCode, f]) => {
      const total = f.reduce((acc, curr) => acc + curr.count, 0);
      stats.push({
        teamCode,
        status: f.map((i) => ({
          status: i.fa_status,
          count: i.count,
        })),
        total,
      });
    });
    return stats;
  }
}
