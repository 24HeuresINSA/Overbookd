import {
  BAR,
  Category,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { AssignmentStats, VolunteerAssignmentStat } from "@overbookd/http";
import { Duration } from "@overbookd/period";
import { AUCUNE } from "../assignment/task-category";

export function sumAssignmentDuration(stats: VolunteerAssignmentStat[]) {
  return Duration.ms(
    stats.reduce((total, { duration }) => total + duration, 0),
  );
}

export type AssignmentStatsSortFunction = (
  a: AssignmentStats,
  b: AssignmentStats,
) => number;

export function sortVolunteerOnNamesFunction(
  desc: boolean,
): AssignmentStatsSortFunction {
  return (a, b) => {
    const order = desc ? -1 : 1;
    return a.firstname.localeCompare(b.firstname) * order;
  };
}

export function sortVolunteerOnTaskCategoryAssignmentDurationFunction(
  desc: boolean,
  category?: Category,
): AssignmentStatsSortFunction {
  const order = desc ? -1 : 1;
  if (!category) {
    return (a, b) => {
      const aAssignmentDuration =
        a.stats.find((stat) => stat.category === null)?.duration ?? 0;
      const bAssignmentDuration =
        b.stats.find((stat) => stat.category === null)?.duration ?? 0;
      return (aAssignmentDuration - bAssignmentDuration) * order;
    };
  }
  return (a, b) => {
    const aAssignmentDuration =
      a.stats.find((stat) => stat.category === category)?.duration ?? 0;
    const bAssignmentDuration =
      b.stats.find((stat) => stat.category === category)?.duration ?? 0;
    return (aAssignmentDuration - bAssignmentDuration) * order;
  };
}

export function sortVolunteerOnTotalAssignmentDurationFunction(
  desc: boolean,
): AssignmentStatsSortFunction {
  const order = desc ? -1 : 1;
  return (a, b) => {
    const aTotalAssignmentDuration = sumAssignmentDuration(
      a.stats,
    ).inMilliseconds;
    const bTotalAssignmentDuration = sumAssignmentDuration(
      b.stats,
    ).inMilliseconds;
    return (aTotalAssignmentDuration - bTotalAssignmentDuration) * order;
  };
}

export function getAssignmentStatsSortFunctionFromSortType(
  sortBy: string,
  sortDesc: boolean,
): AssignmentStatsSortFunction {
  switch (sortBy) {
    case "volunteer":
      return sortVolunteerOnNamesFunction(sortDesc);
    case STATIQUE:
    case MANUTENTION:
    case BAR:
    case RELOU:
    case FUN:
      return sortVolunteerOnTaskCategoryAssignmentDurationFunction(
        sortDesc,
        sortBy,
      );
    case AUCUNE:
      return sortVolunteerOnTaskCategoryAssignmentDurationFunction(sortDesc);
    case "total":
      return sortVolunteerOnTotalAssignmentDurationFunction(sortDesc);
    default:
      return () => 0;
  }
}
