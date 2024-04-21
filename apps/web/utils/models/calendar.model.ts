import { IProvidePeriod } from "@overbookd/period";

export type CalendarEvent = {
  start: Date;
  end: Date;
  name: string;
  link?: string;
  category?: string;
  color?: string;
  timed: true;
};

export type DailyEvent = {
  start: Date;
  name: string;
  color?: string;
  timed: false;
};

export type CalendarUser = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  teams: string[];
  availabilities: IProvidePeriod[];
};
