import { Period } from "@overbookd/time";
import type { CalendarEvent } from "./event";

export const DAY_MODE = "day";
const _WEEK_MODE = "week";
export type CalendarMode = typeof DAY_MODE | typeof _WEEK_MODE;

export function getOverlappingEvents(
  event: CalendarEvent,
  allEvents: CalendarEvent[],
): CalendarEvent[] {
  const eventPeriod = Period.init(event);
  return allEvents.filter((e) => Period.init(e).isOverlapping(eventPeriod));
}
