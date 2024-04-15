import { AddGearRequestForm, HttpStringified } from "@overbookd/http";
import {
  GearRequest,
  InitPurchaseForm,
  PlanPurchaseForm,
  Purchase,
} from "@overbookd/logistic";
import { actionTree, mutationTree } from "typed-vuex";
import { PurchaseRepository } from "~/repositories/purchase.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  all: Purchase[];
  selected: Purchase;
};

export const state = (): State => ({
  all: [],
  selected: defaultPurchase,
});

export const mutations = mutationTree(state, {
  SET_ALL(state, purchase: Purchase[]) {
    state.all = purchase;
  },
  SET_SELECTED(state, purchase: Purchase) {
    state.selected = purchase;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAll({ commit }) {
      const res = await safeCall(this, PurchaseRepository.getAll(this));
      if (!res) return;
      const purchases = res.data.map(castWithDate);
      commit("SET_ALL", purchases);
    },

    async fetchOne({ commit }, id: Purchase["id"]) {
      const res = await safeCall(this, PurchaseRepository.getOne(this, id));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async init({ commit }, form: InitPurchaseForm) {
      const res = await safeCall(this, PurchaseRepository.init(this, form));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async plan({ state, commit }, form: PlanPurchaseForm) {
      const id = state.selected.id;
      const res = await safeCall(this, PurchaseRepository.plan(this, id, form));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async remove({ commit, dispatch }, id: Purchase["id"]) {
      const res = await safeCall(this, PurchaseRepository.remove(this, id));
      if (!res) return;
      commit("SET_SELECTED", null);
      dispatch("fetchAll");
    },

    async addGearRequest({ state, commit }, form: AddGearRequestForm) {
      const id = state.selected.id;
      const res = await safeCall(
        this,
        PurchaseRepository.addGearRequest(this, id, form),
      );
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async removeGearRequest({ state, commit }, slug: GearRequest["slug"]) {
      const id = state.selected.id;
      const res = await safeCall(
        this,
        PurchaseRepository.removeGearRequest(this, id, slug),
      );
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },
  },
);

function castWithDate(purchase: HttpStringified<Purchase>) {
  return {
    ...purchase,
    availaibleOn: new Date(purchase.availableOn),
  };
}

const defaultPurchase: Purchase = {
  id: 0,
  seller: "",
  availableOn: new Date(),
  gears: [],
};
