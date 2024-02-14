import {
  FestivalActivity,
  FestivalEvent,
  FestivalTask,
} from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";

export type FestivalEventStatistics<T extends FestivalEvent> = {
  byTeams(): Promise<Statistics<T>[]>;
};

export class StatisticsService {
  constructor(
    private readonly festivalActivities: FestivalEventStatistics<FestivalActivity>,
    private readonly festivalTasks: FestivalEventStatistics<FestivalTask>,
  ) {}

  get festivalActivity() {
    return this.festivalActivities.byTeams();
  }

  get festivalTask() {
    return this.festivalTasks.byTeams();
  }
}
