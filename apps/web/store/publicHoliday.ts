import { actionTree, mutationTree } from "typed-vuex";
import { FrenchGouvPublicHolidayRepository } from "~/repositories/public-holyday.repository";

export type PublicHoliday = {
  date: Date;
  name: string;
};

type State = {
  all: PublicHoliday[];
};

export const state = (): State => ({
  all: [],
});

export const mutations = mutationTree(state, {
  SET_ALL_PUBLIC_HOLIDAYS(state, holidays: PublicHoliday[]) {
    state.all = holidays;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchAll({ commit }) {
      const holidays =
        await FrenchGouvPublicHolidayRepository.fetchPublicHolidays();
      commit("SET_ALL_PUBLIC_HOLIDAYS", holidays);
    },
  },
);
