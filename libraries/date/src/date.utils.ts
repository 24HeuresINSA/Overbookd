import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "@overbookd/period";
import { PARIS_TIMEZONE } from "./date";

// return format dd/mm/yyyy hh:mm
export function formatDateWithMinutes(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return format dd/mm/yyyy
export function formatDate(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return format month YYYY
export function formatMonthWithYear(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return format yyyy-mm-ddThh:mm
export function formatLocalDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = getTwoDigitsNumber(date.getMonth() + 1);
  const day = getTwoDigitsNumber(date.getDate());
  const hours = getTwoDigitsNumber(date.getHours());
  const minutes = getTwoDigitsNumber(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// return format yyyy-mm-dd
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = getTwoDigitsNumber(date.getMonth() + 1);
  const day = getTwoDigitsNumber(date.getDate());
  return `${year}-${month}-${day}`;
}

function getTwoDigitsNumber(number: number): string {
  return number < 10 ? "0" + number : number.toString();
}

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

// return month YYYY
export function formatDateWithExplicitMonth(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return dd month YYYY
export function formatDateWithExplicitMonthAndDay(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateDayName(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    ...PARIS_TIMEZONE,
    weekday: "short",
  });
}

export function formatDateDayNumber(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    ...PARIS_TIMEZONE,
    day: "numeric",
  });
}

export function computeTomorrowDate(date: Date): Date {
  return new Date(date.getTime() + ONE_DAY_IN_MS);
}

export function formatDateToHumanReadable(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    dateStyle: "long",
    timeStyle: "short",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateWithHoursAndMinutesOnly(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function displayForCalendar(date: Date): string {
  return `${date.getHours()}h${date.getMinutes() || ""}`;
}
