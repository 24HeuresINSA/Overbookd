import { FaTimeWindow, FaTimeWindowSortFunction } from "../models/fa";
import { FtTimeWindow, FtTimeWindowSortFunction } from "../models/ft";

export type SortableTimeWindowHeader = "startDate" | "endDate";

export function sortFtTimeWindowsOnStart(
  timeWindows: FtTimeWindow[],
  desc: boolean
): FtTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortFtTimeWindowsOnEnd(
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
  ["startDate", sortFtTimeWindowsOnStart],
  ["endDate", sortFtTimeWindowsOnEnd],
]);

export function sortFaTimeWindowsOnStart(
  timeWindows: FaTimeWindow[],
  desc: boolean
): FaTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortFaTimeWindowsOnEnd(
  timeWindows: FaTimeWindow[],
  desc: boolean
): FaTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const faTimeWindowsSorts = new Map<
  SortableTimeWindowHeader,
  FaTimeWindowSortFunction
>([
  ["startDate", sortFaTimeWindowsOnStart],
  ["endDate", sortFaTimeWindowsOnEnd],
]);
