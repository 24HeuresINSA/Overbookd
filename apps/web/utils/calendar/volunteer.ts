import type { IProvidePeriod } from "@overbookd/time";
import type { CalendarEvent } from "./event";
import type { UserWithTeams } from "@overbookd/user";

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
