import { getMonday, ONE_DAY_IN_MS, Period } from "@overbookd/time";
import type { CalendarEvent } from "./event";

export const DAY_MODE = "day";
const _WEEK_MODE = "week";
export type CalendarMode = typeof DAY_MODE | typeof _WEEK_MODE;

export type CalendarDay = {
  name: string;
  number: number;
  date: Date;
};

export function getOverlappingEvents(
  event: CalendarEvent,
  allEvents: CalendarEvent[],
): CalendarEvent[] {
  const eventPeriod = Period.init(event);
  return allEvents.filter((e) => Period.init(e).isOverlapping(eventPeriod));
}

export function getWeekDays(date: Date): CalendarDay[] {
  const monday = getMonday(date);
  const weekDates = Array.from(
    { length: 7 },
    (_, i) => new Date(monday.getTime() + i * ONE_DAY_IN_MS),
  );
  return weekDates.map((date) => ({
    name: date.toLocaleDateString("fr-FR", { weekday: "long" }).toUpperCase(),
    number: date.getDate(),
    date,
  }));
}
