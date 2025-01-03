import { OverDate, type DateString } from "@overbookd/time";
import { describe, expect, it } from "vitest";
import { DayPresenter } from "./day.presenter";

const monday: DateString = "2024-05-13";
const friday: DateString = "2024-05-17";
const saturday: DateString = "2024-05-18";
const mondayWinterTime: DateString = "2024-12-02";
const fridayWinterTime: DateString = "2024-12-06";

describe("Date presenter", () => {
  it.each([
    { date: `${friday}T11:11+02:00`, expectedMonday: `${monday}T00:00+02:00` },
    {
      date: `${saturday}T00:15+03:00`,
      expectedMonday: `${monday}T00:00+02:00`,
    },
    {
      date: `${fridayWinterTime}T12:30+01:00`,
      expectedMonday: `${mondayWinterTime}T00:00+01:00`,
    },
  ])(
    "should find monday $expectedMonday for $date",
    ({ date, expectedMonday }) => {
      const overDate = OverDate.from(date);
      const overMonday = OverDate.from(expectedMonday);
      const presenter = new DayPresenter(overDate);

      expect(presenter.monday).toStrictEqual(overMonday);
    },
  );

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

  describe("Get week days", () => {
    it("should return 7 days starting from the correct Monday", () => {
      const date = OverDate.from(`${friday}T11:11+02:00`);
      const presenter = new DayPresenter(date);
      const weekDays = presenter.weekDays;

      expect(weekDays).toHaveLength(7);
      expect(weekDays[0].name).toBe("LUNDI");
      expect(weekDays[6].name).toBe("DIMANCHE");
      expect(weekDays[0].number).toBe(13); // Lundi 13 mai
      expect(weekDays[6].number).toBe(19); // Dimanche 19 mai
    });

    it("should handle weeks spanning multiple months", () => {
      const date = OverDate.from(`${mondayWinterTime}T12:30+01:00`);
      const presenter = new DayPresenter(date);
      const weekDays = presenter.weekDays;

      expect(weekDays).toHaveLength(7);
      expect(weekDays[0].name).toBe("LUNDI");
      expect(weekDays[0].number).toBe(2); // Lundi 2 décembre
      expect(weekDays[6].name).toBe("DIMANCHE");
      expect(weekDays[6].number).toBe(8); // Dimanche 8 décembre
    });
  });
});
