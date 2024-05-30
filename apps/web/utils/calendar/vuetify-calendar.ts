export type VuetifyCalendar = {
  scrollToTime: (time: string) => void;
  prev: () => void;
  next: () => void;
};

const DAY = "day";
const WEEK = "week";

export type VuetifyCalendarType = typeof DAY | typeof WEEK;
