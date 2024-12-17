import { ONE_DAY_IN_MS, OverDate, Period } from "@overbookd/time";
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

const cachedWeekDays = new Map<string, CalendarDay[]>();
export function getWeekDays(date: Date): CalendarDay[] {
  const weekKey = date.toISOString().substring(0, 10);
  if (!cachedWeekDays.has(weekKey)) cachedWeekDays.get(weekKey);

  const monday = OverDate.from(date).getMonday().date;
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    OverDate.from(new Date(monday.getTime() + i * ONE_DAY_IN_MS)),
  );
  const weekDays = weekDates.map((overdate) => ({
    name: overdate.date
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .toUpperCase(),
    number: Number(overdate.monthlyDate.day),
    date: overdate.date,
  }));
  cachedWeekDays.set(weekKey, weekDays);
  return weekDays;
}
