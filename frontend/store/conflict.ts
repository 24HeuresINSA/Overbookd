import { RepoFactory } from "../repositories/repoFactory";
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import { readyException } from "cypress/types/jquery";
import { safeCall } from "~/utils/api/calls";

const repo = RepoFactory.conflictsRepo;

interface State {
  conflicts: unknown[];
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
        commit("SET_CONFLICTS", res.data);
        return res.data;
      }
    },
  }
);
