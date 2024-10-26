import { getColorByStatus } from "./status-color";
import type { PlanningEvent } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/time";
import {
  CreateCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

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

export function convertToCalendarBreak({
  start,
  end,
}: IProvidePeriod): CalendarEvent {
  return CreateCalendarEvent.init({ start, end, name: PAUSE, color: "black" });
}
