import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

export const state = () => ({
  items: [] as any,
});

export const mutations = mutationTree(state, {
  SET_ALL_EQUIPMENT: function (state, items) {
    state.items = items;
  },
});

export const actions = actionTree(
  { state },
  {
    fetchAll: async function ({ commit, state }) {
      if (state.items.length > 0) {
        return;
      }
      const res = await safeCall(
        this,
        RepoFactory.equipmentRepo.getAllEquipments(this)
      );
      if (res) {
        commit("SET_ALL_EQUIPMENT", res.data);
      }
    },
  }
);
