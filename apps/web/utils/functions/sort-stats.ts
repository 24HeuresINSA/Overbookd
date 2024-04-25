import { Category } from "@overbookd/festival-event-constants";
import { AssignmentStats, VolunteerAssignmentStat } from "@overbookd/http";
import { Duration } from "@overbookd/period";

export function sumAssignmentDuration(stats: VolunteerAssignmentStat[]) {
  return Duration.ms(
    stats.reduce((total, { duration }) => total + duration, 0),
  );
}

export function sortVolunteerOnNames(
  volunteers: AssignmentStats[],
  desc: boolean,
): AssignmentStats[] {
  return volunteers.sort((a, b) => {
    const order = desc ? -1 : 1;
    return a.firstname.localeCompare(b.firstname) * order;
  });
}

export function sortVolunteerOnTaskCategoryAssignmentDuration(
  volunteers: AssignmentStats[],
  desc: boolean,
  category?: Category,
): AssignmentStats[] {
  const order = desc ? -1 : 1;
  if (!category) {
    return volunteers.sort((a, b) => {
      const aAssignmentDuration =
        a.stats.find((stat) => stat.category === null)?.duration ?? 0;
      const bAssignmentDuration =
        b.stats.find((stat) => stat.category === null)?.duration ?? 0;
      return (aAssignmentDuration - bAssignmentDuration) * order;
    });
  }
  return volunteers.sort((a, b) => {
    const aAssignmentDuration =
      a.stats.find((stat) => stat.category === category)?.duration ?? 0;
    const bAssignmentDuration =
      b.stats.find((stat) => stat.category === category)?.duration ?? 0;
    return (aAssignmentDuration - bAssignmentDuration) * order;
  });
}

export function sortVolunteerOnTotalAssignmentDuration(
  volunteers: AssignmentStats[],
  desc: boolean,
): AssignmentStats[] {
  const order = desc ? -1 : 1;
  return volunteers.sort((a, b) => {
    const aTotalAssignmentDuration = sumAssignmentDuration(
      a.stats,
    ).inMilliseconds;
    const bTotalAssignmentDuration = sumAssignmentDuration(
      b.stats,
    ).inMilliseconds;
    return (aTotalAssignmentDuration - bTotalAssignmentDuration) * order;
  });
}
