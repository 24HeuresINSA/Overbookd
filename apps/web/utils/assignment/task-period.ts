import { TaskWithPeriods } from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";

export function castTaskWithPeriodsWithDate(
  task: HttpStringified<TaskWithPeriods>,
): TaskWithPeriods {
  return {
    ...task,
    periods: task.periods.map((period) => ({
      ...period,
      start: new Date(period.start),
      end: new Date(period.end),
    })),
  };
}

export function getRequiredTeamsInTask(task: TaskWithPeriods): string[] {
  const teams = task.periods.flatMap((timeSpan) =>
    timeSpan.teams.map((team) => team.code),
  );
  return [...new Set(teams)];
}
