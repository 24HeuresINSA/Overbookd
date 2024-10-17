export type CalendarEvent = {
  start: Date;
  end: Date;
  name: string;
  link?: string;
  color?: string;
  timed: true;
};

export type DailyEvent = {
  start: Date;
  name: string;
  color?: string;
  timed: false;
};
