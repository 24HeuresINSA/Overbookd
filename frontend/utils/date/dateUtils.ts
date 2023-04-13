export const ONE_MINUTE_IN_MS = 1000 * 60;
export const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;

// return format dd/mm/yyyy hh:mm
export function formatDateWithMinutes(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
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
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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

export function formatDateWithExplicitMonth(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateDayName(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
  });
}

export function formatDateDayNumber(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
  });
}

export function setDateHour(date: Date, hour: number): Date {
  return new Date(new Date(date.setHours(hour)).setMinutes(0));
}

export function computeTomorrowDate(date: Date): Date {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return tomorrow;
}

export function computeNextHourDate(date: Date): Date {
  const nextHour = new Date(date);
  nextHour.setHours(date.getHours() + 1);
  return nextHour;
}

export function formatDateToHumanReadable(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "long",
    timeStyle: "short",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}
