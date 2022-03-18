import { RepoFactory } from "../repositories/repoFactory";
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { Conflict } from "~/utils/models/conflicts";
const repo = RepoFactory.conflictsRepo;

interface State {
  conflicts: Conflict[];
}

export const state = (): State => ({
  conflicts: [],
});

export type ConflictState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_CONFLICTS: function (state, conflicts) {
    state.conflicts = conflicts;
  },
});

export const actions = actionTree(
  { state },
  {
    fetchConflictsByFTCount: async function ({ commit }, FTCount: number) {
      const res = await safeCall(this, repo.getFTConflicts(this, FTCount));
      if (res) {
        const filteredRes = res.data.filter(
          (conflict: Conflict) => conflict.user
        );
        commit("SET_CONFLICTS", filteredRes);
        //filter null user
        return filteredRes;
      }
    },
    fetchAll: async function ({ commit }) {
      const res = await safeCall(this, repo.getAllConflicts(this));
      if (res) {
        const filteredRes = res.data.filter(
          (conflict: Conflict) => conflict.user
        );
        commit("SET_CONFLICTS", filteredRes);
        //filter null user
        return filteredRes;
      }
    },
    computeAll: async function () {
      const res = await safeCall(this, repo.computeAll(this));
      return res;
    },
  }
);

export const getters = getterTree(state, {
  sortedByUser: (state: ConflictState) => () => {
    return [...state.conflicts].sort((a, b) => {
      if (a.user.firstname < b.user.firstname) {
        return -1;
      }
      if (a.user.firstname > b.user.firstname) {
        return 1;
      }
      if (a.user.lastname < b.user.lastname) {
        return -1;
      }
      if (a.user.lastname > b.user.lastname) {
        return 1;
      }
      return 0;
    });
  },
});
