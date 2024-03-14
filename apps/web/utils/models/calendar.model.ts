import { IProvidePeriod } from "@overbookd/period";
import { User } from "@overbookd/user";

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

export type CalendarUser = User & {
  teams: string[];
  availabilities: IProvidePeriod[];
};
