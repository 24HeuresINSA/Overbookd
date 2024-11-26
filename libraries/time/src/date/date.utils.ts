import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "../duration/duration.constant";

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
