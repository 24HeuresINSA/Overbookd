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

export class CreateCalendarEvent implements CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  name: string;
  link?: string;
  color?: string;

  private constructor(event: CalendarEvent) {
    this.id = event.id;
    this.start = event.start;
    this.end = event.end;
    this.name = event.name;
    this.link = event.link;
    this.color = event.color;
  }

  static init(event: BaseCalendarEvent): CreateCalendarEvent {
    const uniqueId = nanoid();
    return new CreateCalendarEvent({ id: uniqueId, ...event });
  }
}
