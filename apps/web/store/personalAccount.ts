import { updateItemToList } from "@overbookd/list";
import {
  AdjustPrice,
  ConfiguredBarrel,
  NewBarrel,
} from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";
import { PersonalAccountRepository } from "~/repositories/personal-account.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  barrels: ConfiguredBarrel[];
};

export const state = (): State => ({
  barrels: [],
});

export const mutations = mutationTree(state, {
  SET_BARRELS(state, barrels: ConfiguredBarrel[]) {
    state.barrels = barrels;
  },
  REMOVE_BARREL(state, slug: string) {
    state.barrels = state.barrels.filter((barrel) => barrel.slug !== slug);
  },
  UPDATE_BARREL(state, barrel: ConfiguredBarrel) {
    const index = state.barrels.findIndex(({ slug }) => slug === barrel.slug);
    if (index === -1) return;

    state.barrels = updateItemToList(state.barrels, index, barrel);
  },
  ADD_BARREL(state, barrel: ConfiguredBarrel) {
    state.barrels = [...state.barrels, barrel];
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchBarrels({ commit }) {
      const res = await safeCall(
        this,
        PersonalAccountRepository.getBarrels(this),
        { errorMessage: "Impossible de récupérer les fûts et leur prix" },
      );
      if (!res) return;
      commit("SET_BARRELS", res.data);
    },

    async removeBarrel({ commit }, slug: string) {
      const res = await safeCall(
        this,
        PersonalAccountRepository.removeBarrelPrice(this, slug),
        { successMessage: "Fût retiré" },
      );
      if (!res) return;
      commit("REMOVE_BARREL", slug);
    },

    async createBarrel({ commit }, barrel: NewBarrel) {
      const res = await safeCall(
        this,
        PersonalAccountRepository.createBarrel(this, barrel),
        { successMessage: "Fût ajouté" },
      );
      if (!res) return;
      commit("ADD_BARREL", res.data);
    },

    async adjustBarrelPrice({ commit }, { slug, price }: AdjustPrice) {
      const res = await safeCall(
        this,
        PersonalAccountRepository.adjustBarrelPrice(this, slug, price),
        { successMessage: "Prix du fût ajusté" },
      );
      if (!res) return;
      commit("UPDATE_BARREL", res.data);
    },
  },
);
