import type { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import type { Statistics } from "@overbookd/http";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import { FestivalTaskRepository } from "~/repositories/festival-event/festival-task.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  activityStats: Statistics<FestivalActivity>[];
  taskStats: Statistics<FestivalTask>[];
};

export const useFestivalEventStatsStore = defineStore("festival-event-stats", {
  state: (): State => ({
    activityStats: [],
    taskStats: [],
  }),
  actions: {
    async fetchActivityStats() {
      const res = await FestivalActivityRepository.getStats();
      if (isHttpError(res)) return;
      this.activityStats = res;
    },

    async fetchTaskStats() {
      const res = await FestivalTaskRepository.getStats();
      if (isHttpError(res)) return;
      this.taskStats = res;
    },
  },
});
