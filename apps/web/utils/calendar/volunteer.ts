import type { IProvidePeriod } from "@overbookd/time";
import type { UserWithTeams } from "@overbookd/user";
import type { CalendarEvent } from "./event";

export type VolunteerForCalendar = UserWithTeams & {
  note?: string;
  comment?: string;
  phone?: string;
  availabilities: IProvidePeriod[];
  events: CalendarEvent[];
  charisma?: number;
  assignmentDuration?: number;
  totalAssignmentDuration?: number;
};
