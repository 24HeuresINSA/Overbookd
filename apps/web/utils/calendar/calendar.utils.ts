export type CalendarDay = {
  name: string;
  number: number;
};

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
}

export function formatDateNumberValue(value: number): string {
  return value.toString().padStart(2, "0");
}
