import type {
  AssignmentEvent,
  AssignmentIdentifier,
} from "@overbookd/assignment";
import type { PlanningTask } from "@overbookd/http";
import { FT_URL } from "@overbookd/web-page";
import { getColorByStatus } from "~/domain/common/status-color";
import { createCalendarEvent, type CalendarEvent } from "../calendar/event";
import type { BreakEvent } from "~/domain/common/break-events";

type RequestedDuringMobilization = CalendarEvent & {
  taskId: number;
  kind: "mobilization";
};

type AssignedToTask = CalendarEvent & {
  identifier: AssignmentIdentifier;
  kind: "assignment";
};

export type CalendarEventForPlanning =
  | RequestedDuringMobilization
  | AssignedToTask
  | BreakEvent;

export function toCalendarAssignment(
  assignment: AssignmentEvent,
): AssignedToTask {
  const { start, end, task, assignmentId, mobilizationId } = assignment;
  const identifier = { taskId: task.id, assignmentId, mobilizationId };

  return createCalendarEvent({
    start,
    end,
    name: `[${task.id}] ${task.name}`,
    color: getColorByStatus(task.status),
    identifier,
    kind: "assignment",
  });
}

export function buildToCalendarTask(permissions: {
  canReadFt: boolean;
}): (task: PlanningTask) => RequestedDuringMobilization {
  return (task: PlanningTask) => {
    const { name, id, status, timeWindow } = task;
    const { start, end } = timeWindow;

    return createCalendarEvent({
      start,
      end,
      taskId: id,
      name: `[${id}] ${name}`,
      color: getColorByStatus(status),
      link: permissions.canReadFt ? `${FT_URL}/${id}` : undefined,
      kind: "mobilization",
    });
  };
}
