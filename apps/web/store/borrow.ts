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
  selected: Borrow;
};

export const state = (): State => ({
  all: [],
  selected: defaultBorrow,
});

export const mutations = mutationTree(state, {
  SET_ALL(state, borrow: Borrow[]) {
    state.all = borrow;
  },
  SET_SELECTED(state, borrow: Borrow) {
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

    async plan({ state, commit }, form: PlanBorrowForm) {
      const id = state.selected.id;
      const res = await safeCall(this, BorrowRepository.plan(this, id, form));
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async remove({ commit, dispatch }, id: Borrow["id"]) {
      const res = await safeCall(this, BorrowRepository.remove(this, id));
      if (!res) return;
      commit("SET_SELECTED", null);
      await dispatch("fetchAll");
    },

    async addGearRequest({ state, commit }, form: AddBorrowGearRequestForm) {
      const id = state.selected.id;
      if (!id) return;
      const res = await safeCall(
        this,
        BorrowRepository.addGearRequest(this, id, form),
      );
      if (!res) return;
      commit("SET_SELECTED", castWithDate(res.data));
    },

    async removeGearRequest({ state, commit }, slug: GearRequest["slug"]) {
      const id = state.selected.id;
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

const defaultBorrow: Borrow = {
  id: 0,
  lender: "",
  availableOn: new Date(),
  unavailableOn: new Date(),
  gears: [],
};
