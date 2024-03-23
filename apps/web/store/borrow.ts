import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import {
  Borrow,
  GearRequest,
  InitBorrowForm,
  PlanBorrowForm,
} from "@overbookd/logistic";
import { BorrowRepository } from "~/repositories/borrow.repository";
import { AddBorrowGearRequestForm, HttpStringified } from "@overbookd/http";

type State = {
  all: Borrow[];
  selected: Borrow | null;
};

export const state = (): State => ({
  all: [],
  selected: null,
});

export const mutations = mutationTree(state, {
  SET_ALL(state, borrow: Borrow[]) {
    state.all = borrow;
  },
  SET_SELECTED(state, borrow: Borrow | null) {
    state.selected = borrow;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAll({ commit }) {
      const res = await safeCall(this, BorrowRepository.getAll(this));
      if (!res) return;
      const borrows = res.data.map(castWithDate);
      commit("SET_ALL", borrows);
    },

    async fetchOne({ commit }, id: Borrow["id"]) {
      const res = await safeCall(this, BorrowRepository.getOne(this, id));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async init({ commit }, form: InitBorrowForm) {
      const res = await safeCall(this, BorrowRepository.init(this, form));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async plan(
      { commit },
      { id, form }: { id: Borrow["id"]; form: PlanBorrowForm },
    ) {
      const res = await safeCall(this, BorrowRepository.plan(this, id, form));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async remove({ commit }, id: Borrow["id"]) {
      const res = await safeCall(this, BorrowRepository.remove(this, id));
      if (!res) return;
      commit("SET_SELECTED", null);
    },

    async addGearRequest(
      { commit },
      { id, form }: { id: Borrow["id"]; form: AddBorrowGearRequestForm },
    ) {
      const res = await safeCall(
        this,
        BorrowRepository.addGearRequest(this, id, form),
      );
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async removeGearRequest(
      { commit },
      { id, slug }: { id: Borrow["id"]; slug: GearRequest["slug"] },
    ) {
      const res = await safeCall(
        this,
        BorrowRepository.removeGearRequest(this, id, slug),
      );
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },
  },
);

function castWithDate(borrow: HttpStringified<Borrow>) {
  return {
    ...borrow,
    availableOn: new Date(borrow.availableOn),
    unavailableOn: new Date(borrow.unavailableOn),
  };
}
