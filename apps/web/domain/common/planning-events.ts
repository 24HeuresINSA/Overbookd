import { VolunteerTask } from "~/utils/models/user.model";
import { getColorByStatus } from "./status-color";
import { PlanningEvent } from "@overbookd/assignment";
import { CalendarEvent } from "~/utils/models/calendar.model";

export type CalendarPlanningEvent = {
  start: Date;
  end: Date;
  volunteerId?: number;
  name: string;
  color?: string;
};

export function convertTaskToPlanningEvent(
  { start, end, ft: { id, name, status } }: VolunteerTask,
  volunteerId: number,
): CalendarPlanningEvent {
  return {
    start,
    end,
    name: `[${id}] ${name}`,
    color: getColorByStatus(status),
    volunteerId,
  };
}

export function convertAssignmentPlanningEventForCalendar(
  { start, end, task }: PlanningEvent,
  volunteerId: number,
): CalendarPlanningEvent {
  return {
    start,
    end,
    name: `[${task.id}] ${task.name}`,
    color: getColorByStatus(task.status),
    volunteerId,
  };
}

export const PAUSE = "Pause";

export function convertToCalendarBreak({ start, end }): CalendarEvent {
  return { start, end, name: PAUSE, color: "black", timed: true };
}
