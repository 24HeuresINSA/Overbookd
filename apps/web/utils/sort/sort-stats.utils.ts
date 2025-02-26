import type { VolunteerWithAssignmentStats } from "@overbookd/http";
import { Duration } from "@overbookd/time";
import { AUCUNE, type DisplayableCategory } from "../assignment/task-category";
import type { UserName } from "@overbookd/user";
import type { DisplayableAssignmentStat } from "../user/user-information";

export function compareVolunteersOnNames(a: UserName, b: UserName) {
  return a.firstname.localeCompare(b.firstname);
}

export function compareVolunteersOnAssignment(
  a: HasAssignment,
  b: HasAssignment,
) {
  return a.assignment.inMilliseconds - b.assignment.inMilliseconds;
}

export function sumAssignmentDuration(stats: DisplayableAssignmentStat[]) {
  return Duration.ms(
    stats.reduce((total, { duration }) => total + duration, 0),
  );
}

export function compareVolunteersOnTaskCategoryAssignmentDuration(
  displayableCategory: DisplayableCategory,
) {
  return (a: VolunteerWithAssignmentStats, b: VolunteerWithAssignmentStats) => {
    const aAssignmentDuration =
      a.stats.find((stat) => (stat.category ?? AUCUNE) === displayableCategory)
        ?.duration ?? 0;
    const bAssignmentDuration =
      b.stats.find((stat) => (stat.category ?? AUCUNE) === displayableCategory)
        ?.duration ?? 0;
    console.log(aAssignmentDuration, bAssignmentDuration);
    return aAssignmentDuration - bAssignmentDuration;
  };
}

export function compareVolunteersOnTotalAssignmentDuration(
  a: VolunteerWithAssignmentStats,
  b: VolunteerWithAssignmentStats,
) {
  const aTotalAssignmentDuration = sumAssignmentDuration(
    a.stats,
  ).inMilliseconds;
  const bTotalAssignmentDuration = sumAssignmentDuration(
    b.stats,
  ).inMilliseconds;
  return aTotalAssignmentDuration - bTotalAssignmentDuration;
}
