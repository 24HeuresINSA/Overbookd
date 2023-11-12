import { BarrelPrices } from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";
import { PersonalAccountRepository } from "~/repositories/personal-account.repository";
import { safeCall } from "~/utils/api/calls";

interface State {
  barrels: BarrelPrices;
}

export const state = (): State => ({
  barrels: {
    prixFutBlonde: 0,
    prixFutBlanche: 0,
    prixFutTriple: 0,
    prixFutFlower: 0,
  },
});

export const mutations = mutationTree(state, {
  SET_BARRELS(state, barrels: BarrelPrices) {
    state.barrels = barrels;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchBarrels({ commit }): Promise<void> {
      const res = await safeCall(
        this,
        PersonalAccountRepository.getBarrelPrices(this),
        { errorMessage: "Impossible de récupérer les fûts et leur prix" },
      );
      if (!res) return;
      commit("SET_BARRELS", res.data);
    },

    async adjustBarrelPrices({ commit }, prices: BarrelPrices) {
      const res = await safeCall(
        this,
        PersonalAccountRepository.saveBarrelPrices(this, prices),
        { successMessage: "Prix des fûts mis a jour ✅" },
      );
      if (!res) return;
      commit("SET_BARRELS", res.data);
    },
  },
);
