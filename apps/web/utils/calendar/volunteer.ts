import type { IProvidePeriod } from "@overbookd/time";
import type { CalendarEvent } from "./event";
import type { UserWithTeams } from "@overbookd/user";

export type VolunteerForCalendar = UserWithTeams & {
  availabilities: IProvidePeriod[];
  events: CalendarEvent[];
};
