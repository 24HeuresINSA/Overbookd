import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FA, Status } from "~/utils/models/FA";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

export const state = () => ({
  mFA: {
    status: Status.DRAFT,
    name: "",
  } as FA,
  FAs: [] as FA[],
  validated_by: [] as string[],
  refused_by: [] as string[],
});

export const getters = getterTree(state, {
  getFa: (state) => state.mFA,
  getFAs: (state) => state.FAs,
});

export const mutations = mutationTree(state, {
  SET_FA: function (state, fa: Partial<FA>) {
    state.mFA = { ...state.mFA, ...fa };
  },
  RESET_FA: function (state) {
    state.mFA = {
      status: Status.DRAFT,
      name: "",
    } as FA;
  },
  SET_ALL_FA: function (state, allFA: FA[]) {
    state.FAs = allFA.filter((fa) => fa.is_deleted === false);
  },
});

export const actions = actionTree(
  { state },
  {
    setFA: function ({ commit }, FA: FA) {
      commit("SET_FA", FA);
    },
    resetFA: function ({ commit }, payload) {
      commit("RESET_FA", payload);
    },
    fetchAll: async function ({ commit }) {
      const repo = RepoFactory;
      const res = await safeCall(this, repo.faRepo.getAllFAs(this));
      if (res && res.data) {
        commit("SET_ALL_FA", res.data);
        return res;
      }
      return null;
    },
  }
);
