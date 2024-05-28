import { Preference } from "@overbookd/http";
import { actionTree, mutationTree } from "typed-vuex";
import { PreferenceRepository } from "~/repositories/preference.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  myPreferences: Preference | null;
};

export const state = (): State => ({
  myPreferences: null,
});

export const mutations = mutationTree(state, {
  SET_MY_PREFERENCES(state, preference: Preference) {
    state.myPreferences = preference;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchMyPreferences({ commit }) {
      const res = await safeCall(
        this,
        PreferenceRepository.getMyPreferences(this),
      );
      if (!res) return;
      commit("SET_MY_PREFERENCES", res.data);
    },
    async updateMyPreferences({ commit }, preference: Preference) {
      const res = await safeCall(
        this,
        PreferenceRepository.updateMyPreferences(this, preference),
        { successMessage: "✅ Ta préférence a bien été mis à jour" },
      );
      if (!res) return;
      commit("SET_MY_PREFERENCES", res.data);
    },
  },
);
