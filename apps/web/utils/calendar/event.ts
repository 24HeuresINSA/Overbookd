export type CalendarEvent = {
  start: Date;
  end: Date;
  name: string;
  link?: string;
  color?: string;
};

export type DailyEvent = {
  start: Date;
  name: string;
  color?: string;
};
