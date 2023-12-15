import { Statistics } from "@overbookd/http";

export type FestivalActivities = {
  byTeams(): Promise<Statistics[]>;
};

export class StatisticsService {
  constructor(private readonly festivalActivities: FestivalActivities) {}

  get festivalActivity() {
    return this.festivalActivities.byTeams();
  }
}
