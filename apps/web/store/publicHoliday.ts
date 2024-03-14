import { actionTree, mutationTree } from "typed-vuex";
import { FrenchGovPublicHolidayRepository } from "~/repositories/french-gov-public-holiday.repository";

export type PublicHoliday = {
  date: Date;
  name: string;
};

export type PublicHolidays = { all: () => Promise<PublicHoliday[]> };

const publicHolidays: PublicHolidays = FrenchGovPublicHolidayRepository;

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
      const holidays = await publicHolidays.all();
      commit("SET_ALL_PUBLIC_HOLIDAYS", holidays);
    },
  },
);
