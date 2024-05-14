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
