import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { StatsPayload } from "~/utils/models/stats";

export const state = () => ({
  statsFA: [] as StatsPayload[],
});

export const mutations = mutationTree(state, {
  SET_STATS_FA(state, data: StatsPayload[]) {
    state.statsFA = data;
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
  }
);
