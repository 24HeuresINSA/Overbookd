import { FrenchGovPublicHolidayRepository } from "~/repositories/french-gov-public-holiday.repository";
import type { DailyEvent } from "~/utils/calendar/event";

export type PublicHoliday = {
  date: Date;
  name: string;
};

type PublicHolidays = { all: () => Promise<PublicHoliday[]> };
const publicHolidays: PublicHolidays = FrenchGovPublicHolidayRepository;

type State = {
  all: PublicHoliday[];
};

export const usePublicHolidayStore = defineStore("public-holiday", {
  state: (): State => ({
    all: [],
  }),
  getters: {
    calendarEventsForYear(state) {
      return (year: number): DailyEvent[] => {
        return state.all
          .filter(({ date }) => date.getFullYear() === year)
          .map(({ date, name }) => ({ start: date, name, color: "grey" }));
      };
    },
  },
  actions: {
    async fetchAll() {
      this.all = await publicHolidays.all();
    },
  },
});
