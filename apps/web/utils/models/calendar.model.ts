import { IProvidePeriod } from "@overbookd/period";
import { User } from "@overbookd/user";

export interface CalendarEvent {
  start: Date;
  end: Date;
  name: string;
  link?: string;
  category?: string;
  color?: string;
  timed: true;
}

export type CalendarUser = User & {
  teams: string[];
  availabilities: IProvidePeriod[];
};
