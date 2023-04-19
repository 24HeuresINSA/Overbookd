import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";

const userRepo = RepoFactory.userRepo;

export const state = () => ({
  link: null as string | null,
});

export const mutations = mutationTree(state, {
  SET_LINK(state, link: string) {
    state.link = link;
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
  }
);
