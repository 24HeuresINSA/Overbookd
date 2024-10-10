export type CalendarEvent = {
  start: Date;
  end: Date;
  title: string;
  link?: string;
  category?: string;
  color?: string;
  allDay: false;
};

export type DailyEvent = {
  start: Date;
  title: string;
  color?: string;
  allDay: true;
};
