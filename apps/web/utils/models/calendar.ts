import { IProvidePeriod } from "@overbookd/period";
import { User } from "./user";

export interface CalendarEvent {
  start: Date;
  end: Date;
  name: string;
  category?: string;
  color?: string;
  timed: true;
}

export type CalendarUser = User & {
  teams: string[];
  availabilities: IProvidePeriod[];
};
