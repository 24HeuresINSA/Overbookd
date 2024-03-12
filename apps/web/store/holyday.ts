import { actionTree, mutationTree } from "typed-vuex";
import { HolydayRepository } from "~/repositories/holyday.repository";

export type HolyDay = {
  date: Date;
  name: string;
};

type State = {
  days: HolyDay[];
};

export const state = (): State => ({
  days: [],
});

export const mutations = mutationTree(state, {
  SET_HOLY_DAYS(state, holyDays: HolyDay[]) {
    state.days = holyDays;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchHolyDays({ commit }) {
      const holyDays = await HolydayRepository.fetchGouvHollyDays();
      commit("SET_HOLY_DAYS", holyDays);
    },
  },
);
