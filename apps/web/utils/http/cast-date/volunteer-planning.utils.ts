import type { HttpStringified, PlanningTask } from "@overbookd/http";

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
