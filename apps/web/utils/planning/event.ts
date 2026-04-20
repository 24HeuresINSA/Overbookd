import type {
  AssignmentEvent,
  AssignmentIdentifier,
  PlanningEventTask,
} from "@overbookd/assignment";
import type { PlanningTask } from "@overbookd/http";
import { FT_URL } from "@overbookd/web-page";
import { getColorByStatus } from "~/domain/common/status-color";
import { createCalendarEvent, type CalendarEvent } from "../calendar/event";
import type { BreakEvent } from "~/domain/common/break-events";
import {
  AUCUNE,
  FRIENDS,
  type SelectableCategory,
} from "../assignment/task-category";

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

export function toCalendarTask(permissions: {
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

export function shouldBeHighlighted(
  selectedCategory: SelectableCategory | undefined,
  task: PlanningEventTask,
): boolean {
  const isSelectedCategory = selectedCategory === task.category;
  const isSelectedAucune =
    selectedCategory === AUCUNE && task.category === null;
  const isSelectedWithFriends =
    selectedCategory === FRIENDS && task.hasFriendsAssigned;
  return isSelectedCategory || isSelectedAucune || isSelectedWithFriends;
}
