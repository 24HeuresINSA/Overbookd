import type { AssignmentEvent, BreakPeriod } from "@overbookd/assignment";
import type { HttpStringified, PlanningTask } from "@overbookd/http";
import { castPeriodWithDate } from "./period.utils";

export function castAssignmentEventsWithDate(
  assignments: HttpStringified<AssignmentEvent[]>,
): AssignmentEvent[] {
  return assignments.map((assignment) => ({
    ...assignment,
    ...castPeriodWithDate(assignment),
  }));
}

export function castVolunteerPlanningTasksWithDate(
  tasks: HttpStringified<PlanningTask[]>,
): PlanningTask[] {
  return tasks.map(({ timeWindow, ...task }) => ({
    ...task,
    timeWindow: {
      ...timeWindow,
      start: new Date(timeWindow.start),
      end: new Date(timeWindow.end),
    },
  }));
}

export function castBreakPeriodWithDate(
  breakPeriod: HttpStringified<BreakPeriod>,
): BreakPeriod {
  return {
    name: breakPeriod.name,
    ...castPeriodWithDate(breakPeriod),
  };
}
