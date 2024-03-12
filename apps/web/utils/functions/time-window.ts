import { TimeWindow as FaTimeWindow } from "@overbookd/festival-event";

export type SortableFaTimeWindowHeader = "start" | "end";

type FaTimeWindowSortFunction = (
  timeWindows: FaTimeWindow[],
  desc: boolean,
) => FaTimeWindow[];

export function sortFaTimeWindowsOnStart(
  timeWindows: FaTimeWindow[],
  desc: boolean,
): FaTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortFaTimeWindowsOnEnd(
  timeWindows: FaTimeWindow[],
  desc: boolean,
): FaTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const faTimeWindowsSorts = new Map<
  SortableFaTimeWindowHeader,
  FaTimeWindowSortFunction
>([
  ["start", sortFaTimeWindowsOnStart],
  ["end", sortFaTimeWindowsOnEnd],
]);
