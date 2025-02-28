import {
  Period,
  OverDate,
  MINUTES_IN_DAY,
  Duration,
  QUARTER_IN_MS,
} from "@overbookd/time";
import type { CalendarEvent } from "~/utils/calendar/event";
import type { DayPresenter } from "./day.presenter";

export const PIXELS_PER_MINUTE = 0.75;
export const VERTICAL_MARGIN_IN_PIXELS = 1;
export const HORIZONTAL_MARGIN_IN_PERCENTAGE = 1;

class Pixel {
  constructor(public readonly value: number) {}

  get css(): string {
    return `${this.value}px`;
  }
}

class Percentage {
  constructor(public readonly value: number) {}

  get css(): string {
    return `${this.value}%`;
  }
}

export class CalendarEventPresenter {
  constructor(
    private readonly event: CalendarEvent,
    private readonly day: DayPresenter,
    private readonly among: CalendarEvent[] = [],
  ) {}

  private get minutesBetweenDayStartAndEventStart(): number {
    const eventStart = this.displayedEventPeriod.start.getTime();
    const dayStart = this.day.startsAt.date.getTime();
    const emptyDurationBeforeEvent = Duration.ms(eventStart - dayStart);

    return emptyDurationBeforeEvent.inMinutes;
  }

  get displayedEventPeriod(): Period {
    const dayStart = this.day.startsAt.date;
    const dayEnd = this.day.endsAt.date;

    const start = this.event.start < dayStart ? dayStart : this.event.start;
    const end = this.event.end > dayEnd ? dayEnd : this.event.end;

    return Period.init({ start, end });
  }

  get top(): Pixel {
    const spaceBeforeEventStart =
      this.minutesBetweenDayStartAndEventStart * PIXELS_PER_MINUTE;

    return new Pixel(spaceBeforeEventStart + VERTICAL_MARGIN_IN_PIXELS);
  }

  get height(): Pixel {
    const eventDuration = this.displayedEventPeriod.duration.inMinutes;
    const remainingMinutesInDay =
      MINUTES_IN_DAY - this.minutesBetweenDayStartAndEventStart;
    const displayedDuration = Math.min(eventDuration, remainingMinutesInDay);
    const verticalMargin = VERTICAL_MARGIN_IN_PIXELS * 2;

    return new Pixel(displayedDuration * PIXELS_PER_MINUTE - verticalMargin);
  }

  get simultaneousEvents(): CalendarEvent[] {
    const event = Period.init({ start: this.event.start, end: this.event.end });
    const splitedEvent = event.splitInto(QUARTER_IN_MS);
    const overlappingEventsEachQuarter = splitedEvent.map((quarter) =>
      this.among.filter((other) => quarter.isOverlapping(Period.init(other))),
    );
    const maxOverlappingEvents: CalendarEvent[] =
      overlappingEventsEachQuarter.reduce(
        (maxOverlappingEvents, overlappingEvents) => {
          return overlappingEvents.length > maxOverlappingEvents.length
            ? overlappingEvents
            : maxOverlappingEvents;
        },
        [],
      );

    return [this.event, ...maxOverlappingEvents].sort((a, b) => {
      if (a.start.getTime() !== b.start.getTime()) {
        return a.start.getTime() - b.start.getTime();
      }
      if (a.end.getTime() !== b.end.getTime()) {
        return a.end.getTime() - b.end.getTime();
      }
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !== 0) return nameComparison;
      return a.id.localeCompare(b.id);
    });
  }

  get width(): Percentage {
    const horizontalMargin = HORIZONTAL_MARGIN_IN_PERCENTAGE * 2;
    const baseWidth = 100 / this.simultaneousEvents.length;
    return new Percentage(baseWidth - horizontalMargin);
  }

  get left(): Percentage {
    const index = this.simultaneousEvents.findIndex(
      (simultaneous) => this.event.id === simultaneous.id,
    );
    if (index === -1) throw new Error("Event not found in simultaneousEvents");

    const baseLeft = (100 / this.simultaneousEvents.length) * index;
    return new Percentage(baseLeft + HORIZONTAL_MARGIN_IN_PERCENTAGE);
  }

  get css(): Record<string, string> {
    return {
      top: this.top.css,
      height: this.height.css,
      width: this.width.css,
      left: this.left.css,
    };
  }

  get periodText(): string {
    const start = OverDate.from(this.event.start);
    const end = OverDate.from(this.event.end);
    return `${start.hour}${formatMinutes(start.minute)} - ${end.hour}${formatMinutes(
      end.minute,
    )}`;
  }
}

const formatMinutes = (minutes: number): string => {
  return minutes !== 0 ? `h${minutes.toString().padStart(2, "0")}` : "h";
};
