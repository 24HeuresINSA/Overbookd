import { describe, expect, it } from "vitest";
import { MINUTES_IN_HOUR, OverDate } from "@overbookd/time";
import { createCalendarEvent } from "./event";
import {
  CalendarEventPresenter,
  HORIZONTAL_MARGIN_IN_PERCENTAGE,
  PIXELS_PER_MINUTE,
  VERTICAL_MARGIN_IN_PIXELS,
} from "./calendar.presenter";
import { DayPresenter } from "./day.presenter";

const sunday = "2024-12-29";
const monday = "2024-12-30";
const tuesday = "2024-12-31";

const displayedDate = OverDate.init({ date: monday, hour: 0 });
const displayedDatePresenter = new DayPresenter(displayedDate);

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

const VERTICAL_MARGINS = VERTICAL_MARGIN_IN_PIXELS * 2;
const HORIZONTAL_MARGINS = HORIZONTAL_MARGIN_IN_PERCENTAGE * 2;

describe("Calendar Event Presenter", () => {
  describe.each`
    event                         | expectedStart                                     | expectedEnd
    ${monday09hto10hEvent}        | ${OverDate.init({ date: monday, hour: 9 }).date}  | ${OverDate.init({ date: monday, hour: 10 }).date}
    ${monday00hto23h59Event}      | ${OverDate.init({ date: monday, hour: 0 }).date}  | ${OverDate.init({ date: monday, hour: 23, minute: 59 }).date}
    ${monday22htoTuesday02hEvent} | ${OverDate.init({ date: monday, hour: 22 }).date} | ${OverDate.init({ date: monday, hour: 23, minute: 59 }).date}
    ${sunday23htoMonday01hEvent}  | ${OverDate.init({ date: monday, hour: 0 }).date}  | ${OverDate.init({ date: monday, hour: 1 }).date}
  `("displayed event period", ({ event, expectedStart, expectedEnd }) => {
    it(`should calculate displayed period as ${expectedStart} to ${expectedEnd} for ${event.name}`, () => {
      const presenter = new CalendarEventPresenter(
        event,
        displayedDatePresenter,
      );
      const displayedPeriod = presenter.displayedEventPeriod;
      expect(displayedPeriod.start).toStrictEqual(expectedStart);
      expect(displayedPeriod.end).toStrictEqual(expectedEnd);
    });
  });

  describe.each`
    event                      | expectedPeriodText
    ${monday09hto10hEvent}     | ${"9h - 10h"}
    ${monday14h15to16h30Event} | ${"14h15 - 16h30"}
    ${monday00hto23h59Event}   | ${"0h - 23h59"}
  `("calendar event period text", ({ event, expectedPeriodText }) => {
    it(`should return "${expectedPeriodText}" for ${event.name}`, () => {
      const presenter = new CalendarEventPresenter(
        event,
        displayedDatePresenter,
      );
      expect(presenter.periodText).toBe(expectedPeriodText);
    });
  });

  describe.each`
    event                         | expectedTop                                                                    | expectedHeight
    ${monday09hto10hEvent}        | ${PIXELS_PER_MINUTE * MINUTES_IN_HOUR * 9 + VERTICAL_MARGIN_IN_PIXELS}         | ${PIXELS_PER_MINUTE * MINUTES_IN_HOUR - VERTICAL_MARGINS}
    ${monday14h15to16h30Event}    | ${PIXELS_PER_MINUTE * (MINUTES_IN_HOUR * 14 + 15) + VERTICAL_MARGIN_IN_PIXELS} | ${PIXELS_PER_MINUTE * (2 * MINUTES_IN_HOUR + 15) - VERTICAL_MARGINS}
    ${monday22htoTuesday02hEvent} | ${PIXELS_PER_MINUTE * (MINUTES_IN_HOUR * 22) + VERTICAL_MARGIN_IN_PIXELS}      | ${PIXELS_PER_MINUTE * (MINUTES_IN_HOUR * 2 - 1) - VERTICAL_MARGINS}
  `("top and height", ({ event, expectedTop, expectedHeight }) => {
    it(`should calculate top as ${expectedTop}px and height as ${expectedHeight}px for ${event.name}`, () => {
      const presenter = new CalendarEventPresenter(
        event,
        displayedDatePresenter,
      );
      expect(presenter.top.value).toBe(expectedTop);
      expect(presenter.height.value).toBe(expectedHeight);
    });
  });

  describe.each`
    event                         | among                                                                    | expected
    ${monday09hto10hEvent}        | ${[]}                                                                    | ${1}
    ${monday09hto10hEvent}        | ${[monday22htoTuesday02hEvent]}                                          | ${1}
    ${monday08hto10hEvent}        | ${[monday00hto23h59Event, monday22htoTuesday02hEvent]}                   | ${2}
    ${monday08hto10hEvent}        | ${[monday00hto23h59Event, monday09hto10hEvent]}                          | ${3}
    ${monday00hto23h59Event}      | ${[monday09hto10hEvent, monday14h15to16h30Event]}                        | ${2}
    ${monday22htoTuesday02hEvent} | ${[monday09hto10hEvent, monday00hto23h59Event, monday14h15to16h30Event]} | ${2}
  `("simultaneous events", ({ event, among, expected }) => {
    it(`should deduct simultaneous events of ${event.name}`, () => {
      const presenter = new CalendarEventPresenter(
        event,
        displayedDatePresenter,
        among,
      );
      expect(presenter.simultaneousEventCount).toBe(expected);
    });
  });

  describe.each`
    event                         | among                                                                    | expectedWidth                   | expectedLeft
    ${monday09hto10hEvent}        | ${[]}                                                                    | ${100 - HORIZONTAL_MARGINS}     | ${HORIZONTAL_MARGIN_IN_PERCENTAGE}
    ${monday09hto10hEvent}        | ${[monday22htoTuesday02hEvent]}                                          | ${100 - HORIZONTAL_MARGINS}     | ${HORIZONTAL_MARGIN_IN_PERCENTAGE}
    ${monday08hto10hEvent}        | ${[monday00hto23h59Event, monday22htoTuesday02hEvent]}                   | ${50 - HORIZONTAL_MARGINS}      | ${50 + HORIZONTAL_MARGIN_IN_PERCENTAGE}
    ${monday08hto10hEvent}        | ${[monday00hto23h59Event, monday09hto10hEvent]}                          | ${100 / 3 - HORIZONTAL_MARGINS} | ${100 / 3 + HORIZONTAL_MARGIN_IN_PERCENTAGE}
    ${monday00hto23h59Event}      | ${[monday09hto10hEvent, monday14h15to16h30Event]}                        | ${50 - HORIZONTAL_MARGINS}      | ${HORIZONTAL_MARGIN_IN_PERCENTAGE}
    ${monday22htoTuesday02hEvent} | ${[monday09hto10hEvent, monday00hto23h59Event, monday14h15to16h30Event]} | ${50 - HORIZONTAL_MARGINS}      | ${50 + HORIZONTAL_MARGIN_IN_PERCENTAGE}
  `(
    "calendar event width and left",
    ({ event, among, expectedWidth, expectedLeft }) => {
      it(`should calculate width as ${expectedWidth}% and left as ${expectedLeft}px for ${event.name}`, () => {
        const presenter = new CalendarEventPresenter(
          event,
          displayedDatePresenter,
          among,
        );
        expect(presenter.width.value).toBe(expectedWidth);
        expect(presenter.left.value).toBe(expectedLeft);
      });
    },
  );
});
