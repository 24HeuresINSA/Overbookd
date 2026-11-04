import { IProvidePeriod, Period } from "@overbookd/time";

type AssigneeOnPeriod<T> = {
  volunteer: T;
  period: IProvidePeriod;
};

type VolunteersByPeriod<T> = {
  period: IProvidePeriod;
  volunteers: T[];
};

export function groupAssigneesByPeriod<T extends { id: number }>(
  period: IProvidePeriod,
  assignees: AssigneeOnPeriod<T>[],
): VolunteersByPeriod<T>[] {
  const containerPeriod = Period.init(period);
  const periodsToSplit = [
    ...assignees.map(({ period }) => period),
    containerPeriod,
  ];
  const splitPeriods = splitOverlappingPeriods(periodsToSplit).filter(
    (splitPeriod) => containerPeriod.includes(splitPeriod),
  );

  return splitPeriods.reduce<VolunteersByPeriod<T>[]>(
    (grouped, splitPeriod) => {
      const volunteers = findVolunteersOnPeriod(splitPeriod, assignees);
      if (volunteers.length === 0) return grouped;
      return [...grouped, { period: splitPeriod, volunteers }];
    },
    [],
  );
}

export function splitOverlappingPeriods(periods: IProvidePeriod[]): Period[] {
  const boundaries = [
    ...new Set(
      periods.flatMap(({ start, end }) => [start.getTime(), end.getTime()]),
    ),
  ].sort((a, b) => a - b);

  return boundaries.slice(0, -1).flatMap((start, index) => {
    const end = boundaries.at(index + 1);
    if (end === undefined) return [];
    const candidate = Period.init({
      start: new Date(start),
      end: new Date(end),
    });
    const overlapsAnyPeriod = periods.some((period) =>
      candidate.isOverlapping(period),
    );
    return overlapsAnyPeriod ? [candidate] : [];
  });
}

function findVolunteersOnPeriod<T extends { id: number }>(
  period: Period,
  assignees: AssigneeOnPeriod<T>[],
): T[] {
  const overlapping = assignees.filter(({ period: assigneePeriod }) =>
    period.isOverlapping(assigneePeriod),
  );
  const uniqueVolunteers = new Map<number, T>(
    overlapping.map(({ volunteer }) => [volunteer.id, volunteer]),
  );
  return [...uniqueVolunteers.values()];
}
