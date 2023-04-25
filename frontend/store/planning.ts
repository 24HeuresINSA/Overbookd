import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";

const userRepo = RepoFactory.userRepo;

export const state = () => ({
  link: null as string | null,
  planningBase64Data: "",
});

export const mutations = mutationTree(state, {
  SET_LINK(state, link: string) {
    state.link = link;
  },
  SET_PLANNING_DATA(state, planningData: string) {
    state.planningBase64Data = planningData;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchSubscriptionLink({ commit }) {
      const res = await safeCall(
        this,
        userRepo.getPlanningSubscriptionLink(this)
      );
      if (!res) return;
      commit("SET_LINK", res.data.link);
    },
    async fetchMyPdfPlanning({ commit }) {
      const res = await safeCall(this, userRepo.getMyPdfPlanning(this));
      if (!res) return;
      commit("SET_PLANNING_DATA", res.data);
    },
  }
);
