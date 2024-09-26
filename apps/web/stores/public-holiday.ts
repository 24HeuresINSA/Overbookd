import { FrenchGovPublicHolidayRepository } from "~/repositories/french-gov-public-holiday.repository";

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
  actions: {
    async fetchAll() {
      this.all = await publicHolidays.all();
    },
  },
});
