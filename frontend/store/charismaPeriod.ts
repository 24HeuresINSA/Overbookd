import { actionTree, mutationTree } from "typed-vuex";
import {
  castCharismaPeriodsWithDate,
  castCharismaPeriodWithDate,
  CharismaPeriod,
  SavedCharismaPeriod,
} from "~/utils/models/charismaPeriod";
import { updateItemToList } from "~/utils/functions/list";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";

const repo = RepoFactory.CharismaPeriodRepository;

export const state = () => ({
  charismaPeriods: [] as SavedCharismaPeriod[],
});

export const mutations = mutationTree(state, {
  SET_CHARISMA_PERIODS(state, charismaPeriods: SavedCharismaPeriod[]) {
    state.charismaPeriods = charismaPeriods;
  },

  ADD_CHARISMA_PERIOD(state, charismaPeriod: SavedCharismaPeriod) {
    state.charismaPeriods = [...state.charismaPeriods, charismaPeriod];
  },

  UPDATE_CHARISMA_PERIOD(state, charismaPeriod: SavedCharismaPeriod) {
    const index = state.charismaPeriods.findIndex(
      (cp) => cp.id === charismaPeriod.id
    );
    if (index === -1) return;
    state.charismaPeriods = updateItemToList(
      state.charismaPeriods,
      index,
      charismaPeriod
    );
  },

  DELETE_CHARISMA_PERIOD(state, charismaPeriod: SavedCharismaPeriod) {
    state.charismaPeriods = state.charismaPeriods.filter(
      (cp) => cp.id !== charismaPeriod.id
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchCharismaPeriods({ commit }) {
      const res = await safeCall(this, repo.getCharismaPeriods(this));
      if (!res) return;
      commit("SET_CHARISMA_PERIODS", castCharismaPeriodsWithDate(res.data));
    },

    async addCharismaPeriod({ commit }, charismaPeriod: CharismaPeriod) {
      const res = await safeCall(
        this,
        repo.createCharismaPeriod(this, charismaPeriod),
        {
          successMessage: "Période créée 🥳",
          errorMessage: "Période non créée 😢",
        }
      );
      if (!res) return;
      commit("ADD_CHARISMA_PERIOD", castCharismaPeriodWithDate(res.data));
    },

    async updateCharismaPeriod(
      { commit },
      charismaPeriod: SavedCharismaPeriod
    ) {
      const { id, ...CharismaPeriodWithoutId } = charismaPeriod;
      const res = await safeCall(
        this,
        repo.updateCharismaPeriod(this, id, CharismaPeriodWithoutId),
        {
          successMessage: "Période mise à jour 🥳",
          errorMessage: "Période non mise à jour 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_CHARISMA_PERIOD", castCharismaPeriodWithDate(res.data));
    },

    async deleteCharismaPeriod(
      { commit },
      charismaPeriod: SavedCharismaPeriod
    ) {
      const res = await safeCall(
        this,
        repo.deleteCharismaPeriod(this, charismaPeriod.id),
        {
          successMessage: "Période supprimée 🥳",
          errorMessage: "Période non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_CHARISMA_PERIOD", charismaPeriod);
    },
  }
);
