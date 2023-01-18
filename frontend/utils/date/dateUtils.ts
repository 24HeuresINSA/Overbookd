export const ONE_HOUR = 1000 * 60 * 60;

export function formatStringDateAndHourToDisplay(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatStringDateToDisplay(date: string | Date): string {
  const displayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
}

export function formatDateForComponent(date: Date): string {
  const year = date.getFullYear();
  const month = getTwoDigitsNumber(date.getMonth() + 1);
  const day = getTwoDigitsNumber(date.getDate());
  const hours = getTwoDigitsNumber(date.getHours());
  const minutes = getTwoDigitsNumber(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getTwoDigitsNumber(number: number): string {
  return number < 10 ? "0" + number : number.toString();
}

export function getHourDiff(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return diff / ONE_HOUR;
}
