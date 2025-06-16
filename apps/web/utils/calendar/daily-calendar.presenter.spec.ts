import { OverDate, Period } from "@overbookd/time";
import { describe, expect, it } from "vitest";
import { createCalendarEvent, type CalendarEvent } from "./event";
import { DayPresenter } from "./day.presenter";

class CalendarPresenter {
  private constructor(
    public readonly day: DayPresenter,
    private readonly events: CalendarEvent[],
  ) {}

  static init(
    day: DayPresenter,
    events: CalendarEvent[] = [],
  ): CalendarPresenter {
    return new CalendarPresenter(day, events);
  }

  get boundedEvents(): CalendarEvent[] {
    return this.events
      .map((event) => {
        const eventPeriod = Period.init(event);
        const includes = eventPeriod.isInDay(this.day.date.date);
        if (includes) return event;

        const isOverlapping = this.day.date.isIncludedBy(event);
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

const monday00h00 = OverDate.init({ date: monday, hour: 0, minute: 0 });
const tuesday00h00 = OverDate.init({ date: tuesday, hour: 0, minute: 0 });

const monday09hto10hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 9 }).date,
  end: OverDate.init({ date: monday, hour: 10 }).date,
  name: "Event monday 09h to 10h",
});
const monday14hto23h59Event = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 14 }).date,
  end: tuesday00h00.date,
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
  describe("when initialized presenter with day", () => {
    const day = new DayPresenter(monday00h00);
    const presenter = CalendarPresenter.init(day);
    it("initializes presenter correctly", () => {
      expect(presenter).toBeInstanceOf(CalendarPresenter);
    });
  });

  describe.each`
    day             | initialEvents                                                             | expectedEvents
    ${monday00h00}  | ${[monday09hto10hEvent, monday14hto23h59Event]}                           | ${[monday09hto10hEvent, monday14hto23h59Event]}
    ${monday00h00}  | ${[tuesday02To10hEvent]}                                                  | ${[]}
    ${monday00h00}  | ${[monday09hto10hEvent, monday14htoTuesday08hEvent]}                      | ${[monday09hto10hEvent, { ...monday14htoTuesday08hEvent, end: tuesday00h00 }]}
    ${tuesday00h00} | ${[sunday20hToTuesday02hEvent, tuesday02To10hEvent, monday09hto10hEvent]} | ${[{ ...sunday20hToTuesday02hEvent, start: monday00h00 }, tuesday02To10hEvent, monday09hto10hEvent]}
    ${monday00h00}  | ${[sunday20hToTuesday02hEvent]}                                           | ${[{ ...sunday20hToTuesday02hEvent, start: monday00h00, end: tuesday00h00 }]}
  `("when day is $day", ({ day, initialEvents, expectedEvents }) => {
    const presenter = CalendarPresenter.init(day, initialEvents);
    it("should return the expected events", () => {
      expect(presenter.boundedEvents).toEqual(expectedEvents);
    });
  });
});
