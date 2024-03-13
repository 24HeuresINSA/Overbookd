import { IProvidePeriod } from "@overbookd/period";

export type SortablePeriodHeader = "start" | "end";

type PeriodSortFunction = (
  period: IProvidePeriod[],
  desc: boolean,
) => IProvidePeriod[];

export function sortPeriodsOnStart(
  periods: IProvidePeriod[],
  desc: boolean,
): IProvidePeriod[] {
  return periods.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortPeriodsOnEnd(
  periods: IProvidePeriod[],
  desc: boolean,
): IProvidePeriod[] {
  return periods.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const periodsSorts = new Map<SortablePeriodHeader, PeriodSortFunction>([
  ["start", sortPeriodsOnStart],
  ["end", sortPeriodsOnEnd],
]);
