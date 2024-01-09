import { FtTimeWindow, FtTimeWindowSortFunction } from "../models/ft.model";
import { TimeWindow as FaTimeWindow } from "@overbookd/festival-event";

export type SortableFtTimeWindowHeader = "startDate" | "endDate";

export function sortFtTimeWindowsOnStart(
  timeWindows: FtTimeWindow[],
  desc: boolean,
): FtTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.start.getTime() - b.start.getTime()) * order;
  });
}

export function sortFtTimeWindowsOnEnd(
  timeWindows: FtTimeWindow[],
  desc: boolean,
): FtTimeWindow[] {
  return timeWindows.sort((a, b) => {
    const order = desc ? -1 : 1;
    return (a.end.getTime() - b.end.getTime()) * order;
  });
}

export const ftTimeWindowsSorts = new Map<
  SortableFtTimeWindowHeader,
  FtTimeWindowSortFunction
>([
  ["startDate", sortFtTimeWindowsOnStart],
  ["endDate", sortFtTimeWindowsOnEnd],
]);

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
