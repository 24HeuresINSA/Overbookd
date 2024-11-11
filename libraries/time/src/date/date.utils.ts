import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "../duration/duration.constant";
import { OverDate } from "./date";

export function getHourDiff(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return diff / ONE_HOUR_IN_MS;
}

export function roundMinutes(date: Date, round: number): Date | null {
  if (!date) return null;

  const minutes = date.getMinutes();
  if (minutes % round === 0) return date;

  const minutesRounded = Math.round(minutes / round) * round;
  date.setMinutes(minutesRounded);
  return date;
}

export function computeTomorrowDate(date: Date): Date {
  return new Date(date.getTime() + ONE_DAY_IN_MS);
}

export function getMonday(date: Date): Date {
  const newDate = new Date(`${OverDate.from(date).dateString}T00:00`);
  const currentDay = newDate.getDay();

  const isSunday = currentDay === 0;
  const baseOffset = isSunday ? -6 : 1;
  const daysToMonday = baseOffset - currentDay;

  newDate.setDate(newDate.getDate() + daysToMonday);

  const fixedDate = OverDate.fromLocal(newDate).date;
  fixedDate.setHours(date.getHours());
  fixedDate.setMinutes(date.getMinutes());

  return fixedDate;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isSameWeek(date1: Date, date2: Date): boolean {
  const weekStart1 = getMonday(date1);
  const weekStart2 = getMonday(date2);
  return isSameDay(weekStart1, weekStart2);
}

export function displayForCalendar(date: Date): string {
  return `${date.getHours()}h${date.getMinutes() || ""}`;
}
