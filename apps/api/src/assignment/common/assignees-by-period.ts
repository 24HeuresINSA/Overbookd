import { removeItemAtIndex } from "@overbookd/list";
import { IProvidePeriod, Period } from "@overbookd/time";

export type AssigneeOnPeriod<T> = {
  volunteer: T;
  period: IProvidePeriod;
};

export type VolunteersByPeriod<T> = {
  period: IProvidePeriod;
  volunteers: T[];
};

export function groupAssigneesByPeriod<T extends { id: number }>(
  period: IProvidePeriod,
  assignees: AssigneeOnPeriod<T>[],
): VolunteersByPeriod<T>[] {
  const containerPeriod = Period.init(period);
  const uniquePeriods = extractUniquePeriods(containerPeriod, assignees);
  const splitPeriods = splitOverlappingPeriods(uniquePeriods).filter(
    (splitPeriod) => containerPeriod.includes(splitPeriod),
  );
  return splitPeriods.reduce((grouped, splitPeriod) => {
    const volunteers = findVolunteersOnPeriod(splitPeriod, assignees);
    if (volunteers.length === 0) return grouped;
    return [...grouped, { period: splitPeriod, volunteers }];
  }, [] as VolunteersByPeriod<T>[]);
}

function extractUniquePeriods<T>(
  containerPeriod: Period,
  assignees: AssigneeOnPeriod<T>[],
): Period[] {
  const allPeriods = [
    ...assignees.map(({ period }) => Period.init(period)),
    containerPeriod,
  ];
  return allPeriods.reduce(uniquePeriodReducer, [] as Period[]);
}

function uniquePeriodReducer(periods: Period[], period: Period): Period[] {
  const existingPeriodIndex = periods.findIndex((p) => period.equals(p));
  if (existingPeriodIndex !== -1) return periods;
  return [...periods, period];
}

function splitOverlappingPeriods(periods: Period[]): Period[] {
  return periods.reduce(
    (splitPeriods, period) =>
      splitOverlappingPeriodsReducer(splitPeriods, period),
    [] as Period[],
  );
}

function splitOverlappingPeriodsReducer(
  periods: Period[],
  period: Period,
): Period[] {
  const overlapedPeriodIndex = periods.findIndex((previousPeriod) =>
    period.isOverlapping(previousPeriod),
  );
  const overlapedPeriod = periods.at(overlapedPeriodIndex);
  if (overlapedPeriodIndex === -1 || !overlapedPeriod) {
    return [...periods, period];
  }

  const splitPeriods = overlapedPeriod.splitOverlapping(period);

  const nonOverlappingPeriods = removeItemAtIndex(
    periods,
    overlapedPeriodIndex,
  );

  const updatedPeriods = [...nonOverlappingPeriods, ...splitPeriods];

  return splitOverlappingPeriods(updatedPeriods);
}

function findVolunteersOnPeriod<T extends { id: number }>(
  period: Period,
  assignees: AssigneeOnPeriod<T>[],
): T[] {
  return assignees
    .filter(({ period: assigneePeriod }) =>
      period.isOverlapping(Period.init(assigneePeriod)),
    )
    .reduce(uniqueVolunteerReducer, [] as T[]);
}

function uniqueVolunteerReducer<T extends { id: number }>(
  volunteers: T[],
  { volunteer }: AssigneeOnPeriod<T>,
): T[] {
  const alreadyInVolunteersIndex = volunteers.findIndex(
    ({ id }) => id === volunteer.id,
  );
  if (alreadyInVolunteersIndex !== -1) return volunteers;

  return [...volunteers, volunteer];
}
