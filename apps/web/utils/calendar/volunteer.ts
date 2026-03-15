import type { IProvidePeriod } from "@overbookd/time";
import type { CalendarEvent } from "./event";
import type { User } from "@overbookd/user";
import type { CalendarEventForPlanning } from "../planning/event";

export type VolunteerForCalendar = User & {
  teams: string[];
  note?: string;
  comment?: string;
  phone?: string;
  availabilities: IProvidePeriod[];
  events: CalendarEvent[];
  charisma?: number;
  assignmentDuration?: number;
  totalAssignmentDuration?: number;
};

export type MultiCalendarVolunteer = {
  volunteerId: number;
  events: CalendarEventForPlanning[];
};
