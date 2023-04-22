import { DateArray } from 'ics';

export const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export function formatDateWithMinutes(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  };
  return new Intl.DateTimeFormat('fr', displayOptions).format(new Date(date));
}

export function formatDateWithHoursAndMinutesOnly(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  };
  return new Intl.DateTimeFormat('fr', displayOptions).format(new Date(date));
}

export function toDateArray(date: string | Date): DateArray {
  const d = new Date(date);
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  ];
}

export function formatDateToHumanReadable(date: Date | string): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  };
  return new Intl.DateTimeFormat('fr', displayOptions).format(new Date(date));
}
