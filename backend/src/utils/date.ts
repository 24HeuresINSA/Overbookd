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
