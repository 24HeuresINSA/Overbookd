import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { StatsPayload } from "~/utils/models/stats";

export const state = () => ({
  statsFA: [] as StatsPayload[],
  statsFT: [] as StatsPayload[],
});

export const mutations = mutationTree(state, {
  SET_STATS_FA(state, data: StatsPayload[]) {
    state.statsFA = data;
  },
  SET_STATS_FT(state, data: StatsPayload[]) {
    state.statsFT = data;
  },
});

export const actions = actionTree(
  { state },
  {
    async getFaStats(context) {
      const res = await safeCall<StatsPayload>(
        this,
        RepoFactory.faRepo.getFaStats(this)
      );
      if (res) {
        context.commit("SET_STATS_FA", res.data);
      }
      return res;
    },
    async getFtStats(context) {
      const res = await safeCall<StatsPayload>(
        this,
        RepoFactory.ftRepo.getFtStats(this)
      );
      if (res) {
        context.commit("SET_STATS_FT", res.data);
      }
      return res;
    },
  }
);
