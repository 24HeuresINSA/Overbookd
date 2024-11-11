import {
  DISPLAY_DATE,
  DISPLAY_DATE_TIME,
  DISPLAY_HOUR,
  PARIS_TIMEZONE,
} from "./date.js";

type DateSeed = Date | string | number;

// return format dd/mm/yyyy hh:mm
export function formatDateWithMinutes(date: DateSeed): string {
  return new Intl.DateTimeFormat("fr", DISPLAY_DATE_TIME).format(
    new Date(date),
  );
}

// return format dd/mm/yyyy
export function formatDate(date: DateSeed): string {
  return new Intl.DateTimeFormat("fr", DISPLAY_DATE).format(new Date(date));
}

// return format month YYYY
export function formatMonthWithYear(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

// return format yyyy-mm-ddThh:mm
export function formatLocalDateTime(date: DateSeed): string {
  const [day, month, year, hours, minutes] = new Intl.DateTimeFormat(
    "fr",
    DISPLAY_DATE_TIME,
  )
    .formatToParts(new Date(date))
    .filter((part) => part.type !== "literal")
    .map((part) => part.value);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// return format yyyy-mm-dd
export function formatLocalDate(date: DateSeed): string {
  const [day, month, year] = new Intl.DateTimeFormat("fr", DISPLAY_DATE)
    .format(new Date(date))
    .split("/");

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
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    weekday: "short",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateDayFullName(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    weekday: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateDayNumber(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    day: "numeric",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateHour(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    hour: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", displayOptions).format(
    new Date(date),
  );
}

export function formatDateMinute(date: DateSeed): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    ...PARIS_TIMEZONE,
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
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
  return new Intl.DateTimeFormat("fr", DISPLAY_HOUR).format(new Date(date));
}

export function formatDateNumberValue(value: number): string {
  return value.toString().padStart(2, "0");
}
