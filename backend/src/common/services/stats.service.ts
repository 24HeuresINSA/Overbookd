import { Injectable } from '@nestjs/common';
import { GroupByService } from './group-by.service';

export type StatsPayload = Array<{
  teamName: string;
  teamCode: string;
  status: object;
  total: number;
}>;

@Injectable()
export class StatsService {
  constructor(private readonly groupByService: GroupByService) {}

  stats(
    arr: Array<{ status: string; teamName: string; teamCode: string }>,
  ): StatsPayload {
    const groupedByTeam = this.groupByService.groupBy(arr, (i) => i.teamCode);
    const stats = Object.entries(groupedByTeam).map(([teamCode, f]) => {
      const groupedByStatus = this.groupByService.groupBy(f, (i) => i.status);
      const countByStatus = {};
      Object.entries(groupedByStatus).forEach(([s, element]) => {
        countByStatus[s] = element.length;
      });
      // sort countByStatus by key
      const sortedStatus = Object.keys(countByStatus)
        .sort()
        .reduce((acc, key) => {
          acc[key] = countByStatus[key];
          return acc;
        }, {});
      return {
        teamName: f[0].teamName,
        teamCode,
        status: sortedStatus,
        total: f.length,
      };
    });
    return stats;
  }
}
