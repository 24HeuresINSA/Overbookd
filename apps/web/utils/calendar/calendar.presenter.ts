import { Period, OverDate, MINUTES_IN_DAY, Duration } from "@overbookd/time";
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

export type AmongCalendarEvent = { count: number; index: number };
const DEFAULT_AMONG: AmongCalendarEvent = { count: 1, index: 0 };

export class CalendarEventPresenter {
  constructor(
    private readonly event: CalendarEvent,
    private readonly day: DayPresenter,
    private readonly among: AmongCalendarEvent = DEFAULT_AMONG,
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

  get width(): Percentage {
    const horizontalMargin = HORIZONTAL_MARGIN_IN_PERCENTAGE * 2;
    const baseWidth = 100 / this.among.count;
    return new Percentage(baseWidth - horizontalMargin);
  }

  get left(): Percentage {
    const previousEventsMargin =
      this.among.index * HORIZONTAL_MARGIN_IN_PERCENTAGE * 2;
    const baseLeft = this.among.index * this.width.value + previousEventsMargin;
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
