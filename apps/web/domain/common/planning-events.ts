import { VolunteerTask } from "~/utils/models/user.model";
import { getColorByStatus } from "./status-color";
import { PlanningEvent } from "@overbookd/assignment";

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
