import { actionTree, mutationTree } from "typed-vuex";
import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import { FestivalActivityRepository } from "~/repositories/festival-activity.repository";
import { FestivalTaskRepository } from "~/repositories/festival-task.repository";
import { safeCall } from "~/utils/api/calls";
import { StatsPayload } from "~/utils/models/stats.model";

export const state = () => ({
  statsFA: [] as StatsPayload<FestivalActivity>[],
  statsFT: [] as StatsPayload<FestivalTask>[],
});

export const mutations = mutationTree(state, {
  SET_STATS_FA(state, data: StatsPayload<FestivalActivity>[]) {
    state.statsFA = data;
  },
  SET_STATS_FT(state, data: StatsPayload<FestivalTask>[]) {
    state.statsFT = data;
  },
});

export const actions = actionTree(
  { state },
  {
    async getFaStats(context) {
      const res = await safeCall(
        this,
        FestivalActivityRepository.getStats(this),
      );
      if (!res) return;

      context.commit("SET_STATS_FA", res.data);
    },
    async getFtStats(context) {
      const res = await safeCall(this, FestivalTaskRepository.getStats(this));
      if (res) {
        context.commit("SET_STATS_FT", res.data);
      }
      return res;
    },
  },
);
