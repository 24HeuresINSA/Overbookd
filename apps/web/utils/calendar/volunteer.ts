import type { IProvidePeriod } from "@overbookd/time";
import type { CalendarEvent } from "./event";
import type { User } from "@overbookd/user";

export type VolunteerForCalendar = User & {
  teams: string[];
  note?: string;
  comment?: string;
  phone?: string;
  availabilities: IProvidePeriod[];
  assignments: CalendarEvent[];
};
