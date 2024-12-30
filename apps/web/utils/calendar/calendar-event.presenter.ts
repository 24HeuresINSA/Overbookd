import { Period, OverDate, MINUTES_IN_DAY, Duration } from "@overbookd/time";
import type { CalendarEvent } from "~/utils/calendar/event";

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
    private readonly displayedDay: OverDate,
    private readonly overlappingEvents: CalendarEvent[] = [this.event],
  ) {}

  private get currentDayStart(): OverDate {
    return OverDate.getStartOfDay(this.displayedDay.date);
  }

  private get eventStartTotalMinutes(): number {
    const emptyDurationBeforeEvent = Duration.ms(
      this.displayedEventPeriod.start.getTime() -
        this.currentDayStart.timestamp,
    );
    return emptyDurationBeforeEvent.inMinutes;
  }

  get displayedEventPeriod(): Period {
    const dayStart = OverDate.getStartOfDay(this.displayedDay.date).date;
    const dayEnd = OverDate.getEndOfDay(this.displayedDay.date).date;

    const validStart =
      this.event.start < dayStart ? dayStart : this.event.start;
    const validEnd = this.event.end > dayEnd ? dayEnd : this.event.end;

    const start = validStart < validEnd ? validStart : validEnd;
    const end = validStart < validEnd ? validEnd : validStart;

    return Period.init({ start, end });
  }

  get top(): Pixel {
    console.log(this.eventStartTotalMinutes);
    return new Pixel(
      this.eventStartTotalMinutes * PIXELS_PER_MINUTE +
        VERTICAL_MARGIN_IN_PIXELS,
    );
  }

  get height(): Pixel {
    const eventDuration = this.displayedEventPeriod.duration.inMinutes;
    const remainingMinutesInDay = MINUTES_IN_DAY - this.eventStartTotalMinutes;
    const displayedDuration = Math.min(eventDuration, remainingMinutesInDay);
    const verticalMargin = VERTICAL_MARGIN_IN_PIXELS * 2;
    return new Pixel(displayedDuration * PIXELS_PER_MINUTE - verticalMargin);
  }

  get width(): Percentage {
    const horizontalMargin = HORIZONTAL_MARGIN_IN_PERCENTAGE * 2;
    const hasOverlappingEvents = this.overlappingEvents.length > 0;
    const baseWidth = hasOverlappingEvents
      ? 100 / this.overlappingEvents.length
      : 100;
    return new Percentage(baseWidth - horizontalMargin);
  }

  get left(): Percentage {
    const index = this.overlappingEvents.findIndex((e) => e === this.event);
    return new Percentage(
      index * this.width.value + HORIZONTAL_MARGIN_IN_PERCENTAGE,
    );
  }

  get periodText(): string {
    const start = OverDate.from(this.event.start);
    const end = OverDate.from(this.event.end);

    const formatMinutes = (minutes: number): string =>
      minutes !== 0 ? `h${minutes.toString().padStart(2, "0")}` : "h";
    return `${start.hour}${formatMinutes(start.minute)} - ${end.hour}${formatMinutes(
      end.minute,
    )}`;
  }
}
