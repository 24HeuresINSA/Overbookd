import {
  FestivalActivity,
  FestivalEvent,
  FestivalTask,
} from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";

export type FestivalEventStatistics<T extends FestivalEvent> = {
  byTeams(): Promise<Statistics<T>[]>;
  countRefusalsByUser(userId: number): Promise<number>;
};

export class StatisticsService {
  constructor(
    private readonly festivalActivities: FestivalEventStatistics<FestivalActivity>,
    private readonly festivalTasks: FestivalEventStatistics<FestivalTask>,
  ) {}

  get festivalActivity() {
    return this.festivalActivities.byTeams();
  }

  async countRefusedActivitiesByUser(userId: number): Promise<number> {
    return this.festivalActivities.countRefusalsByUser(userId);
  }

  get festivalTask() {
    return this.festivalTasks.byTeams();
  }
}
