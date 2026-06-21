import { describe, expect, it } from "vitest";
import { OverDate } from "@overbookd/time";
import {
  CalendarEventOrganizer,
  type DisplayableCalendarEvent,
} from "./calendar.organizer";
import { createCalendarEvent, type CalendarEvent } from "./event";

const sunday = "2024-12-29";
const monday = "2024-12-30";
const tuesday = "2024-12-31";

const monday09hto10hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 9 }).date,
  end: OverDate.init({ date: monday, hour: 10 }).date,
  name: "Event monday 09h to 10h",
});
const monday14h15to16h30Event = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 14, minute: 15 }).date,
  end: OverDate.init({ date: monday, hour: 16, minute: 30 }).date,
  name: "Event monday 14h45 to 16h30",
});
const monday00hto23h59Event = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 0 }).date,
  end: OverDate.init({ date: monday, hour: 23, minute: 59 }).date,
  name: "Event monday 00h to 23h59",
});
const monday22htoTuesday02hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 22 }).date,
  end: OverDate.init({ date: tuesday, hour: 2 }).date,
  name: "Event monday 22h to tuesday 02h",
});
const monday08hto10hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 8 }).date,
  end: OverDate.init({ date: monday, hour: 10 }).date,
  name: "Event monday 08h to 10h",
});
const sunday23htoMonday01hEvent = createCalendarEvent({
  start: OverDate.init({ date: sunday, hour: 23 }).date,
  end: OverDate.init({ date: monday, hour: 1 }).date,
  name: "Event sunday 23h to monday 01h",
});
const monday08hto11hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 8 }).date,
  end: OverDate.init({ date: monday, hour: 11 }).date,
  name: "Event monday 08h to 11h",
});
const monday14hto18hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 14 }).date,
  end: OverDate.init({ date: monday, hour: 18 }).date,
  name: "Event monday 14h to 18h",
});
const monday10hto12hEvent = createCalendarEvent({
  start: OverDate.init({ date: monday, hour: 10 }).date,
  end: OverDate.init({ date: monday, hour: 12 }).date,
  name: "Event monday 10h to 12h",
});

const toDisplayable = (
  event: CalendarEvent,
  startColumn: number,
  endColumn: number,
  columnCount: number,
): DisplayableCalendarEvent => ({
  ...event,
  startColumn,
  endColumn,
  columnCount,
});

describe("Calendar Event Organizer", () => {
  describe.each`
    events
    ${[monday08hto10hEvent, monday14h15to16h30Event]}
    ${[monday08hto10hEvent, monday14h15to16h30Event, monday09hto10hEvent]}
    ${[monday09hto10hEvent, sunday23htoMonday01hEvent, monday00hto23h59Event, monday08hto10hEvent]}
    ${[monday08hto10hEvent, monday08hto11hEvent]}
    ${[]}
  `("when generating displayable events", ({ events }) => {
    it(`should have as many displayed events as given events`, () => {
      const calendarEventOrganizer = new CalendarEventOrganizer(events);
      expect(calendarEventOrganizer.displayableEvents.length).toBe(
        events.length,
      );
    });
  });

  describe.each`
    events
    ${[monday08hto10hEvent, monday14h15to16h30Event]}
    ${[monday22htoTuesday02hEvent, sunday23htoMonday01hEvent, monday08hto11hEvent]}
    ${[monday09hto10hEvent]}
  `("when no events overlap", ({ events }) => {
    it(`should all display them in a single column`, () => {
      const calendarEventOrganizer = new CalendarEventOrganizer(events);
      expect(
        calendarEventOrganizer.displayableEvents.every(
          ({ startColumn, endColumn, columnCount }) =>
            startColumn === 0 && endColumn === 1 && columnCount === 1,
        ),
      ).toBe(true);
    });
  });

  describe.each`
    events                                                             | expectedDisplayedEvents
    ${[monday08hto10hEvent, monday09hto10hEvent]}                      | ${[toDisplayable(monday08hto10hEvent, 0, 1, 2), toDisplayable(monday09hto10hEvent, 1, 2, 2)]}
    ${[monday08hto10hEvent, monday09hto10hEvent, monday08hto11hEvent]} | ${[toDisplayable(monday08hto11hEvent, 0, 1, 3), toDisplayable(monday08hto10hEvent, 1, 2, 3), toDisplayable(monday09hto10hEvent, 2, 3, 3)]}
    ${[monday10hto12hEvent, monday09hto10hEvent, monday08hto11hEvent]} | ${[toDisplayable(monday08hto11hEvent, 0, 1, 2), toDisplayable(monday09hto10hEvent, 1, 2, 2), toDisplayable(monday10hto12hEvent, 1, 2, 2)]}
  `("when events do overlap", ({ events, expectedDisplayedEvents }) => {
    it(`should assign them different columns`, () => {
      const calendarEventOrganizer = new CalendarEventOrganizer(events);
      expect(calendarEventOrganizer.displayableEvents).toEqual(
        expectedDisplayedEvents,
      );
    });
  });

  describe("when some events overlap but not all together", () => {
    const events = [
      monday08hto10hEvent,
      monday09hto10hEvent,
      monday08hto11hEvent,
      monday14h15to16h30Event,
      monday14hto18hEvent,
      monday22htoTuesday02hEvent,
    ];
    it(`should assign different column systems by overlapping group`, () => {
      const calendarEventOrganizer = new CalendarEventOrganizer(events);
      expect(calendarEventOrganizer.displayableEvents).toEqual([
        toDisplayable(monday08hto11hEvent, 0, 1, 3),
        toDisplayable(monday08hto10hEvent, 1, 2, 3),
        toDisplayable(monday09hto10hEvent, 2, 3, 3),
        toDisplayable(monday14hto18hEvent, 0, 1, 2),
        toDisplayable(monday14h15to16h30Event, 1, 2, 2),
        toDisplayable(monday22htoTuesday02hEvent, 0, 1, 1),
      ]);
    });
  });

  describe("when an event overlaps with less events than there are columns available", () => {
    const events = [
      monday08hto10hEvent,
      monday09hto10hEvent,
      monday08hto11hEvent,
      monday10hto12hEvent,
    ];
    it(`should make it fill the available columns`, () => {
      const calendarEventOrganizer = new CalendarEventOrganizer(events);
      expect(calendarEventOrganizer.displayableEvents).toEqual([
        toDisplayable(monday08hto11hEvent, 0, 1, 3),
        toDisplayable(monday08hto10hEvent, 1, 2, 3),
        toDisplayable(monday10hto12hEvent, 1, 3, 3),
        toDisplayable(monday09hto10hEvent, 2, 3, 3),
      ]);
    });
  });
});
