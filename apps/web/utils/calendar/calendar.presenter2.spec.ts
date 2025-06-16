import {
  Duration,
  EndBeforeStart,
  OverDate,
  Period,
  type DateString,
} from "@overbookd/time";
import { describe, expect, it } from "vitest";
import { createCalendarEvent, type CalendarEvent } from "./event";

type Bounds = {
  start: DateString;
  end: DateString;
};

class CalendarPresenter {
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

  get boundedEvents(): CalendarEvent[] {
    return this.events
      .map((event) => {
        const eventPeriod = Period.init(event);
        const includes = this.bounds.includes(eventPeriod);
        if (includes) return event;

        const isOverlapping = this.bounds.isOverlapping(eventPeriod);
        if (!isOverlapping) return null;

        const start =
          this.bounds.start < eventPeriod.start
            ? eventPeriod.start
            : this.bounds.start;
        const end =
          this.bounds.end > eventPeriod.end ? eventPeriod.end : this.bounds.end;
        return { ...event, start, end };
      })
      .filter((e): e is CalendarEvent => e !== null);
  }
}

const sunday = "2025-06-15";
const monday = "2025-06-16";
const tuesday = "2025-06-17";

const mondayToTuesdayBounds: Bounds = { start: monday, end: tuesday };
const mondayBounds: Bounds = { start: monday, end: monday };

const monday00h00 = OverDate.init({ date: monday, hour: 0, minute: 0 }).date;
const tuesday00h00 = OverDate.init({ date: tuesday, hour: 0, minute: 0 }).date;

const monday09hto10hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 9 }).date,
  end: OverDate.init({ date: monday, hour: 10 }).date,
  name: "Event monday 09h to 10h",
});
const monday14hto23h59Event = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 14 }).date,
  end: tuesday00h00,
  name: "Event monday 14h to 23h59",
});
const monday14htoTuesday08hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 14 }).date,
  end: OverDate.init({ date: tuesday, hour: 8 }).date,
  name: "Event monday 14h to tuesday 08h",
});
const tuesday02To10hEvent = createCalendarEvent({
  start: OverDate.init({ date: tuesday, hour: 2 }).date,
  end: OverDate.init({ date: tuesday, hour: 10 }).date,
  name: "Event tuesday 02h to 10h",
});
const sunday20hToTuesday02hEvent = createCalendarEvent({
  start: OverDate.init({ date: sunday, hour: 20 }).date,
  end: OverDate.init({ date: tuesday, hour: 2 }).date,
  name: "Event sunday 20h to tuesday 02h",
});

describe("Calendar Event Presenter", () => {
  describe("when initialized presenter", () => {
    describe("with bounds with start before end", () => {
      const presenter = CalendarPresenter.init(mondayToTuesdayBounds);
      it("initializes presenter correctly", () => {
        expect(presenter).toBeInstanceOf(CalendarPresenter);
      });
    });
    describe("with bounds with start equal to end", () => {
      const presenter = CalendarPresenter.init(mondayBounds);
      it("initializes presenter correctly", () => {
        expect(presenter).toBeInstanceOf(CalendarPresenter);
      });
    });
    describe("with bounds with start after end", () => {
      const bounds: Bounds = { start: "2025-06-18", end: "2025-06-17" };
      it("should indicate that start date must be before end date", () => {
        expect(() => CalendarPresenter.init(bounds)).toThrow(EndBeforeStart);
      });
    });
  });

  describe.each`
    bounds                   | initialEvents                                                             | expectedEvents
    ${mondayBounds}          | ${[monday09hto10hEvent, monday14hto23h59Event]}                           | ${[monday09hto10hEvent, monday14hto23h59Event]}
    ${mondayBounds}          | ${[tuesday02To10hEvent]}                                                  | ${[]}
    ${mondayBounds}          | ${[monday09hto10hEvent, monday14htoTuesday08hEvent]}                      | ${[monday09hto10hEvent, { ...monday14htoTuesday08hEvent, end: tuesday00h00 }]}
    ${mondayToTuesdayBounds} | ${[sunday20hToTuesday02hEvent, tuesday02To10hEvent, monday09hto10hEvent]} | ${[{ ...sunday20hToTuesday02hEvent, start: monday00h00 }, tuesday02To10hEvent, monday09hto10hEvent]}
    ${mondayBounds}          | ${[sunday20hToTuesday02hEvent]}                                           | ${[{ ...sunday20hToTuesday02hEvent, start: monday00h00, end: tuesday00h00 }]}
  `(
    "when bounded with $bounds",
    ({ bounds, initialEvents, expectedEvents }) => {
      const presenter = CalendarPresenter.init(bounds, initialEvents);
      it("should return the expected events", () => {
        expect(presenter.boundedEvents).toEqual(expectedEvents);
      });
    },
  );
});
