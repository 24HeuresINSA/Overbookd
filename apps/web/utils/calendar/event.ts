import { nanoid } from "nanoid";

export type DailyEvent = {
  start: Date;
  name: string;
  color?: string;
};

type BaseCalendarEvent = {
  start: Date;
  end: Date;
  name: string;
  link?: string; // Plutôt unsure de si c'est encore nécessaire
  color?: string;
  ft_id?: number;
};

export type CalendarEvent = BaseCalendarEvent & {
  id: string;
};

export function createCalendarEvent<T extends BaseCalendarEvent>(
  event: T,
): T & { id: string } {
  const uniqueId = nanoid();
  return { id: uniqueId, ...event };
}
