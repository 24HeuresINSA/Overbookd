import { describe, expect, it } from "vitest";
import { OverDate } from "@overbookd/time";
import { createCalendarEvent } from "./event";
import { CalendarEventPresenter } from "./calendar-event.presenter";

const monday = "2024-12-30";
const mondayOverDate = OverDate.init({ date: monday, hour: 0 });

describe("Calendar Event Presenter", () => {
  describe.each`
    eventStart                                               | eventEnd                                                 | expectedPeriodText
    ${OverDate.init({ date: monday, hour: 9 })}              | ${OverDate.init({ date: monday, hour: 10 })}             | ${"9h - 10h"}
    ${OverDate.init({ date: monday, hour: 14, minute: 15 })} | ${OverDate.init({ date: monday, hour: 16, minute: 30 })} | ${"14h15 - 16h30"}
    ${OverDate.init({ date: monday, hour: 0 })}              | ${OverDate.init({ date: monday, hour: 23, minute: 59 })} | ${"0h - 23h59"}
  `("period text", ({ eventStart, eventEnd, expectedPeriodText }) => {
    it(`should return "${expectedPeriodText}" for an event from ${eventStart} to ${eventEnd}`, () => {
      const event = createCalendarEvent({
        start: eventStart.date,
        end: eventEnd.date,
        name: "Event",
      });
      const presenter = new CalendarEventPresenter(event, mondayOverDate);

      expect(presenter.periodText).toBe(expectedPeriodText);
    });
  });
});
