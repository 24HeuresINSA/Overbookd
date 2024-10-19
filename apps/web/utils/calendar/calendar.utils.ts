import { Period } from "@overbookd/time";
import type { CalendarEvent } from "./event";

export const DAY_MODE = "day";
const WEEK_MODE = "week";
export type CalendarMode = typeof DAY_MODE | typeof WEEK_MODE;

export type CalendarDay = {
  name: string;
  number: number;
};

export function formatDateNumberValue(value: number): string {
  return value.toString().padStart(2, "0");
}

export function getOverlappingEvents(
  event: CalendarEvent,
  allEvents: CalendarEvent[],
): CalendarEvent[] {
  const eventPeriod = Period.init(event);
  return allEvents.filter((e) => Period.init(e).isOverlapping(eventPeriod));
}
