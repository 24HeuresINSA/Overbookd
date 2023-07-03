import {
    FtTimeWindow,
    FtTimeWindowSortFunction,
    SortableTimeWindowHeader,
} from "../models/ft";

export function sortOnStart(
  timeWindows: FtTimeWindow[],
  desc: boolean
): FtTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortOnEnd(
  timeWindows: FtTimeWindow[],
  desc: boolean
): FtTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const ftTimeWindowsSorts = new Map<
  SortableTimeWindowHeader,
  FtTimeWindowSortFunction
>([
  ["startDate", sortOnStart],
  ["endDate", sortOnEnd],
]);
