import { Period, OverDate, MINUTES_IN_DAY, Duration } from "@overbookd/time";
import { PIXELS_PER_MINUTE } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

export class CalendarEventManager {
  constructor(
    private readonly event: CalendarEvent,
    private readonly displayedDay: OverDate,
    private readonly overlappingEvents: CalendarEvent[] = [],
  ) {}

  private get currentDayStart(): OverDate {
    return OverDate.getStartOfDay(this.displayedDay.date);
  }

  private get eventStartTotalMinutes(): number {
    const emptyDurationBeforeEvent = Duration.ms(
      this.displayedEventPeriod.start.getTime() - this.currentDayStart.time,
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

  get topPositionInPixels(): number {
    return this.eventStartTotalMinutes * PIXELS_PER_MINUTE;
  }

  get heightInPixels(): number {
    const eventDuration = this.displayedEventPeriod.duration.inMinutes;
    const remainingMinutesInDay = MINUTES_IN_DAY - this.eventStartTotalMinutes;
    const displayedDuration = Math.min(eventDuration, remainingMinutesInDay);
    return displayedDuration * PIXELS_PER_MINUTE;
  }

  get widthInPercentage(): number {
    return 100 / this.overlappingEvents.length;
  }

  get leftInPercentage(): number {
    const index = this.overlappingEvents.findIndex((e) => e === this.event);
    return index * this.widthInPercentage;
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
