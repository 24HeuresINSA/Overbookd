export type VuetifyCalendar = {
  scrollToTime: (time: string) => void;
  prev: () => void;
  next: () => void;
};

const _DAY = "day";
const _WEEK = "week";

export type VuetifyCalendarType = typeof _DAY | typeof _WEEK;
