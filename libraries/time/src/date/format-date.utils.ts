import { PARIS_TIMEZONE } from "./date.js";

type DateSeed = Date | string | number;

// return format dd/mm/yyyy hh:mm
export function formatDateWithMinutes(date: DateSeed): string {
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
export function formatDate(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return format month YYYY
export function formatMonthWithYear(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

function getTwoDigitsNumber(number: number): string {
  return number < 10 ? "0" + number : number.toString();
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

// return month YYYY
export function formatDateWithExplicitMonth(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return dd month YYYY
export function formatDateWithExplicitMonthAndDay(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateDayName(date: DateSeed): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    ...PARIS_TIMEZONE,
    weekday: "short",
  });
}

export function formatDateDayNumber(date: DateSeed): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    ...PARIS_TIMEZONE,
    day: "numeric",
  });
}

export function formatDateToHumanReadable(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    dateStyle: "long",
    timeStyle: "short",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateWithHoursAndMinutesOnly(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}
