import { Statistics } from "@overbookd/http";

export type FestivalActivityStatistics = {
  byTeams(): Promise<Statistics[]>;
};

export class StatisticsService {
  constructor(private readonly statistics: FestivalActivityStatistics) {}

  get festivalActivity() {
    return this.statistics.byTeams();
  }
}
