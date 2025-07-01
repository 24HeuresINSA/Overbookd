import {
  Duration,
  EndBeforeStart,
  OverDate,
  Period,
  type DateString,
} from "@overbookd/time";
import type { CalendarEvent } from "./event";

export type Bounds = {
  start: DateString;
  end: DateString;
};

type PlacedEvent = CalendarEvent & {
  topMinutes: number;
  durationMinutes: number;
  column: number;
};

type PlacedEventLayout = {
  events: PlacedEvent[];
  totalColumns: number;
};

type CalendarEventSlice = CalendarEvent & {
  originalId: string;
  sliceIndex: number;
};

export class CalendarPresenter {
  private constructor(
    public readonly bounds: Period,
    private readonly events: CalendarEvent[],
  ) {}

  static init(bounds: Bounds, events: CalendarEvent[] = []): CalendarPresenter {
    if (bounds.start > bounds.end) throw new EndBeforeStart();
    const start = OverDate.init({ date: bounds.start, hour: 0 });
    const end = OverDate.init({ date: bounds.end, hour: 0 }).plus(
      Duration.ONE_DAY,
    );
    const boundsPeriod = Period.init({ start: start.date, end: end.date });
    return new CalendarPresenter(boundsPeriod, events);
  }

  private get boundedEvents(): CalendarEvent[] {
    return boundEvents(this.bounds, this.events);
  }

  private get splitedIntoDailySlices(): CalendarEventSlice[] {
    return splitIntoDailySlices(this.bounds, this.boundedEvents);
  }

  place(): PlacedEventLayout {
    const sorted = Period.sort(this.splitedIntoDailySlices);
    const placed: PlacedEvent[] = [];
    const columns: CalendarEvent[][] = [];

    for (const event of sorted) {
      const eventPeriod = Period.init({ start: event.start, end: event.end });
      let columnIndex = columns.findIndex((col) => {
        const last = col[col.length - 1];
        const lastPeriod = Period.init({ start: last.start, end: last.end });
        return !eventPeriod.isOverlapping(lastPeriod);
      });

      if (columnIndex === -1) {
        columnIndex = columns.length;
        columns.push([]);
      }

      columns[columnIndex].push(event);

      const startMinutes = Period.init({
        start: this.bounds.start,
        end: event.start,
      }).duration.inMinutes;
      const endMinutes = Period.init({
        start: this.bounds.start,
        end: event.end,
      }).duration.inMinutes;
      const durationMinutes = endMinutes - startMinutes;

      placed.push({
        ...event,
        topMinutes: startMinutes,
        durationMinutes,
        column: columnIndex,
      });
    }

    return { events: placed, totalColumns: columns.length };
  }
}

export function boundEvents(
  bounds: Period,
  events: CalendarEvent[],
): CalendarEvent[] {
  return events
    .map((event) => {
      const eventPeriod = Period.init(event);
      const includes = bounds.includes(eventPeriod);
      if (includes) return event;

      const isOverlapping = bounds.isOverlapping(eventPeriod);
      if (!isOverlapping) return null;

      const start =
        bounds.start < eventPeriod.start ? eventPeriod.start : bounds.start;
      const end = bounds.end > eventPeriod.end ? eventPeriod.end : bounds.end;
      return { ...event, start, end };
    })
    .filter((e): e is CalendarEvent => e !== null);
}

export function splitIntoDailySlices(
  bounds: Period,
  events: CalendarEvent[],
): CalendarEventSlice[] {
  const days = bounds.splitWithInterval(Duration.ONE_DAY);

  const slices: CalendarEventSlice[] = [];
  const sliceCount = new Map<string, number>();

  for (const dayPeriod of days) {
    for (const evt of events) {
      const evtPeriod = Period.init({ start: evt.start, end: evt.end });

      if (!evtPeriod.isOverlapping(dayPeriod)) continue;

      const start = evt.start < dayPeriod.start ? dayPeriod.start : evt.start;
      const end = evt.end > dayPeriod.end ? dayPeriod.end : evt.end;

      const index = sliceCount.get(evt.id) ?? 0;
      sliceCount.set(evt.id, index + 1);

      slices.push({
        ...evt,
        start,
        end,
        originalId: evt.id,
        sliceIndex: index,
      });
    }
  }
  return slices;
}
