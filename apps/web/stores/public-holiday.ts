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
    calendarEvents(state): DailyEvent[] {
      return state.all.map((holiday) => ({
        start: holiday.date,
        name: holiday.name,
        color: "grey",
      }));
    },
  },
  actions: {
    async fetchAll() {
      this.all = await publicHolidays.all();
    },
  },
});
