import {
  EndBeforeStart,
  OverDate,
  type DateString,
  type Hour,
  type Minute,
} from "@overbookd/time";
import { describe, expect, it } from "vitest";
import { createCalendarEvent } from "./event";
import {
  boundEvents,
  CalendarPresenter,
  type Bounds,
} from "./calendar.presenter2";

const sunday: DateString = "2025-06-15";
const monday: DateString = "2025-06-16";
const tuesday: DateString = "2025-06-17";
const wednesday: DateString = "2025-06-18";

const mondayToTuesdayBounds: Bounds = { start: monday, end: tuesday };
const mondayToWednesdayBounds: Bounds = { start: monday, end: wednesday };
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
        const bounded = boundEvents(presenter.bounds, initialEvents);
        expect(bounded).toEqual(expectedEvents);
      });
    },
  );

  describe("CalendarPresenter.place", () => {
    it("should place non-overlapping events in the same column", () => {
      const events = [
        createEvt(8, 9, "A"),
        createEvt(9, 10, "B"),
        createEvt(11, 13, "C"),
      ];
      const presenter = CalendarPresenter.init(mondayBounds, events);
      const placed = presenter.place();

      expect(placed.totalColumns).toBe(1);
      for (const evt of placed.events) {
        expect(evt.column).toBe(0);
      }
    });

    it("should place fully overlapping events in different columns", () => {
      const events = [
        createEvt(8, 10, "A"),
        createEvt(8, 10, "B"),
        createEvt(8, 10, "C"),
      ];
      const presenter = CalendarPresenter.init(mondayBounds, events);
      const placed = presenter.place();

      const columns = placed.events.map((e) => e.column);
      expect(new Set(columns).size).toBe(3);

      expect(placed.totalColumns).toBe(3);
    });

    it("should allow partial reuse of columns when possible", () => {
      // A x
      // A B
      // C B
      // C x
      const events = [
        createEvt(8, 10, "A"),
        createEvt(9, 11, "B"),
        createEvt(10, 12, "C"),
      ];
      const presenter = CalendarPresenter.init(mondayBounds, events);
      const placed = presenter.place();

      const A = placed.events.find((e) => e.id === "A");
      const B = placed.events.find((e) => e.id === "B");
      const C = placed.events.find((e) => e.id === "C");

      expect(A?.column).toBe(C?.column);
      expect(B?.column).not.toBe(A?.column);

      expect(placed.totalColumns).toBe(2);
    });

    it("should correctly calculate vertical position", () => {
      const event = createEvt(9, 10, "D");
      const presenter = CalendarPresenter.init(mondayBounds, [event]);
      const placed = presenter.place().events[0];

      expect(placed.topMinutes).toBe(9 * 60);
      expect(placed.durationMinutes).toBe(60);
    });
  });

  describe("splitEventsByDay", () => {
    it("should not split events that fit entirely in a day", () => {
      const event = createCalendarEvent({
        name: "monday morning",
        start: createDate(monday, 9),
        end: createDate(monday, 11),
      });

      const presenter = CalendarPresenter.init(mondayToTuesdayBounds, [event]);
      const slices = presenter.splitIntoDailySlices;

      expect(slices).toHaveLength(1);
      expect(slices[0].start).toEqual(event.start);
      expect(slices[0].end).toEqual(event.end);
      expect(slices[0].originalId).toBe(event.id);
      expect(slices[0].sliceIndex).toBe(0);
    });

    it("should split an event that spans across two days", () => {
      const event = createCalendarEvent({
        name: "overnight event",
        start: createDate(monday, 23),
        end: createDate(tuesday, 2),
      });

      const presenter = CalendarPresenter.init(mondayToWednesdayBounds, [
        event,
      ]);
      const slices = presenter.splitIntoDailySlices;

      expect(slices).toHaveLength(2);

      const [slice0, slice1] = slices;

      expect(slice0.originalId).toBe(event.id);
      expect(slice0.sliceIndex).toBe(0);
      expect(slice0.start).toEqual(createDate(monday, 23));
      expect(slice0.end).toEqual(createDate(tuesday, 0));

      expect(slice1.originalId).toBe(event.id);
      expect(slice1.sliceIndex).toBe(1);
      expect(slice1.start).toEqual(createDate(tuesday, 0));
      expect(slice1.end).toEqual(createDate(tuesday, 2));
    });

    it("should split an event across three days", () => {
      const event = createCalendarEvent({
        name: "long event",
        start: createDate(monday, 20),
        end: createDate(wednesday, 4),
      });

      const presenter = CalendarPresenter.init(mondayToWednesdayBounds, [
        event,
      ]);
      const slices = presenter.splitIntoDailySlices;

      expect(slices).toHaveLength(3);

      expect(slices[0]).toMatchObject({
        originalId: event.id,
        sliceIndex: 0,
        start: createDate(monday, 20),
        end: createDate(tuesday, 0),
      });

      expect(slices[1]).toMatchObject({
        originalId: event.id,
        sliceIndex: 1,
        start: createDate(tuesday, 0),
        end: createDate(wednesday, 0),
      });

      expect(slices[2]).toMatchObject({
        originalId: event.id,
        sliceIndex: 2,
        start: createDate(wednesday, 0),
        end: createDate(wednesday, 4),
      });
    });

    it("should skip events outside the bounds", () => {
      const event = createCalendarEvent({
        name: "wednesday event",
        start: createDate(wednesday, 10),
        end: createDate(wednesday, 12),
      });

      const presenter = CalendarPresenter.init(mondayToTuesdayBounds, [event]);
      const slices = presenter.splitIntoDailySlices;

      expect(slices).toHaveLength(0);
    });
  });
});

const createDate = (date: DateString, hour: Hour, minute: Minute = 0) =>
  OverDate.init({ date, hour: hour, minute }).date;

const createEvt = (startHour: Hour, endHour: Hour, id: string) =>
  createCalendarEvent({
    id,
    name: `event-${id}`,
    start: createDate(monday, startHour),
    end: createDate(monday, endHour),
  });
