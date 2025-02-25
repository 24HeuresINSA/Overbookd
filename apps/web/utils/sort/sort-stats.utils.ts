import {
  BAR,
  type Category,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import type {
  VolunteerWithAssignmentStats,
  AssignmentStat,
} from "@overbookd/http";
import { Duration } from "@overbookd/time";
import { AUCUNE } from "../assignment/task-category";
import type { UserName } from "@overbookd/user";

export function compareVolunteersOnNames(a: UserName, b: UserName) {
  return a.firstname.localeCompare(b.firstname);
}

export function compareVolunteersOnAssignment(
  a: HasAssignment,
  b: HasAssignment,
) {
  return a.assignment.inMilliseconds - b.assignment.inMilliseconds;
}

/* ------------------------- */

export function sumAssignmentDuration(stats: AssignmentStat[]) {
  return Duration.ms(
    stats.reduce((total, { duration }) => total + duration, 0),
  );
}

export type SortFunction<T> = (a: T, b: T) => number;

export function sortVolunteerOnNames(desc: boolean): SortFunction<UserName> {
  return (a, b) => {
    const order = desc ? -1 : 1;
    return a.firstname.localeCompare(b.firstname) * order;
  };
}

type HasCharisma = {
  charisma: number;
};

export function sortVolunteerOnCharisma(
  desc: boolean,
): SortFunction<HasCharisma> {
  return (a, b) => {
    const order = desc ? -1 : 1;
    return (a.charisma - b.charisma) * order;
  };
}

export function sortVolunteerOnTaskCategoryAssignmentDuration(
  desc: boolean,
  category?: Category,
): SortFunction<VolunteerWithAssignmentStats> {
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

export function sortVolunteerOnTotalAssignmentDuration(
  desc: boolean,
): SortFunction<VolunteerWithAssignmentStats> {
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
): SortFunction<VolunteerWithAssignmentStats> {
  switch (sortBy) {
    case "volunteer":
      return sortVolunteerOnNames(sortDesc);
    case "charisma":
      return sortVolunteerOnCharisma(sortDesc);
    case STATIQUE:
    case MANUTENTION:
    case BAR:
    case RELOU:
    case FUN:
      return sortVolunteerOnTaskCategoryAssignmentDuration(sortDesc, sortBy);
    case AUCUNE:
      return sortVolunteerOnTaskCategoryAssignmentDuration(sortDesc);
    case "total":
      return sortVolunteerOnTotalAssignmentDuration(sortDesc);
    default:
      return () => 0;
  }
}
