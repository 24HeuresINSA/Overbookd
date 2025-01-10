import { OverDate, type DateString } from "@overbookd/time";
import { describe, expect, it } from "vitest";
import { DayPresenter } from "./day.presenter";

const friday: DateString = "2024-05-17";
const saturday: DateString = "2024-05-18";
const fridayWinterTime: DateString = "2024-12-06";

describe("Date presenter", () => {
  describe.each`
    date1                                | date2                        | expected
    ${`${friday}T11:11+02:00`}           | ${`${friday}T19:00+02:00`}   | ${true}
    ${`${friday}T11:00+02:00`}           | ${`${saturday}T00:00+02:00`} | ${false}
    ${`${fridayWinterTime}T11:15+07:00`} | ${`${friday}T19:00+02:00`}   | ${false}
  `(
    "when checking if $date1 and $date2 are the same day",
    ({ date1, date2, expected }) => {
      it(`should return ${expected}`, () => {
        const overDate1 = OverDate.from(date1);
        const overDate2 = OverDate.from(date2);
        const presenter = new DayPresenter(overDate1);
        expect(presenter.isSameDayThan(overDate2)).toBe(expected);
      });
    },
  );
  describe.each`
    date1                                | date2                        | expected
    ${`${friday}T11:11+02:00`}           | ${`${friday}T19:00+02:00`}   | ${true}
    ${`${friday}T11:00+02:00`}           | ${`${saturday}T00:00+02:00`} | ${true}
    ${`${fridayWinterTime}T11:15+07:00`} | ${`${friday}T19:00+02:00`}   | ${false}
  `(
    "when checking if $date1 and $date2 are the same week",
    ({ date1, date2, expected }) => {
      it(`should return ${expected}`, () => {
        const overDate1 = OverDate.from(date1);
        const overDate2 = OverDate.from(date2);
        const presenter = new DayPresenter(overDate1);
        expect(presenter.isSameWeekThan(overDate2)).toBe(expected);
      });
    },
  );

  describe("Get start of day", () => {
    describe.each`
      date                                 | expectedHour | expectedMinute | expectedDate
      ${`${friday}T11:11+02:00`}           | ${0}         | ${0}           | ${`${friday}T00:00+02:00`}
      ${`${saturday}T00:15+03:00`}         | ${0}         | ${0}           | ${`${friday}T00:00+02:00`}
      ${`${friday}T17:45-11:00`}           | ${0}         | ${0}           | ${`${saturday}T00:00+02:00`}
      ${`${fridayWinterTime}T12:30+01:00`} | ${0}         | ${0}           | ${`${fridayWinterTime}T00:00+01:00`}
    `(
      "when generating from $date",
      ({ date, expectedHour, expectedMinute, expectedDate }) => {
        it(`should generate date at ${expectedHour}h${expectedMinute}m`, () => {
          const dayStart = new DayPresenter(OverDate.from(date)).startsAt;
          expect(dayStart.hour).toBe(expectedHour);
          expect(dayStart.minute).toBe(expectedMinute);
          expect(dayStart.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });

  describe("Get end of day", () => {
    describe.each`
      date                                 | expectedHour | expectedMinute | expectedDate
      ${`${friday}T11:11+02:00`}           | ${23}        | ${59}          | ${`${friday}T23:59+02:00`}
      ${`${saturday}T00:15+03:00`}         | ${23}        | ${59}          | ${`${friday}T23:59+02:00`}
      ${`${friday}T17:45-11:00`}           | ${23}        | ${59}          | ${`${saturday}T23:59+02:00`}
      ${`${fridayWinterTime}T12:30+01:00`} | ${23}        | ${59}          | ${`${fridayWinterTime}T23:59+01:00`}
    `(
      "when generating from $date",
      ({ date, expectedHour, expectedMinute, expectedDate }) => {
        it(`should generate date at ${expectedHour}h${expectedMinute}m`, () => {
          const dayEnd = new DayPresenter(OverDate.from(date)).endsAt;
          expect(dayEnd.hour).toBe(expectedHour);
          expect(dayEnd.minute).toBe(expectedMinute);
          expect(dayEnd.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });

  describe("Get period indicator text", () => {
    describe.each`
      date                                 | expected
      ${`${friday}T11:11+02:00`}           | ${"Mai 2024"}
      ${`${saturday}T00:15+03:00`}         | ${"Mai 2024"}
      ${`${friday}T17:45-11:00`}           | ${"Mai 2024"}
      ${`${fridayWinterTime}T12:30+01:00`} | ${"Décembre 2024"}
    `("when generating from $date", ({ date, expected }) => {
      it(`should generate ${expected}`, () => {
        const periodIndicatorText = new DayPresenter(OverDate.from(date))
          .periodIndicatorText;
        expect(periodIndicatorText).toBe(expected);
      });
    });
  });
});
