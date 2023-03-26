import {
  FTTimeWindow,
  FTTimeWindowSortFunction,
  SortableTimeWindowHeader,
} from "../models/ft";

export function sortOnStart(
  timeWindows: FTTimeWindow[],
  desc: boolean
): FTTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortOnEnd(
  timeWindows: FTTimeWindow[],
  desc: boolean
): FTTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const ftTimeWindowsSorts = new Map<
  SortableTimeWindowHeader,
  FTTimeWindowSortFunction
>([
  ["startDate", sortOnStart],
  ["endDate", sortOnEnd],
]);
