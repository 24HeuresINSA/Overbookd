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
  link?: string;
  color?: string;
};

export type CalendarEvent = BaseCalendarEvent & {
  id: string;
};

export class CalendarEventBuilder {
  static build(event: BaseCalendarEvent): CalendarEvent {
    const uniqueId = nanoid();
    return { id: uniqueId, ...event };
  }
}
