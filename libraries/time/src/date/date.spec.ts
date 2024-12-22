import { describe, expect, it } from "vitest";
import { DateString, Hour, Minute, OverDate } from "./date.js";

const friday: DateString = "2024-05-17";
const saturday: DateString = "2024-05-18";
const monday: DateString = "2024-05-13";
const fridayWinterTime: DateString = "2024-12-06";
const mondayWinterTime: DateString = "2024-12-02";
const friday10h = new Date(`${friday}T10:00+02:00`);
const friday12h = new Date(`${friday}T12:00+02:00`);
const saturdayDate = new Date(saturday);

type TestHelper = {
  date: string;
  expectedHour: Hour;
  expectedMinute: Minute;
  expectedDate: string;
};

describe("Over Date [Paris based date]", () => {
  describe.each`
    date                | hour  | minute | expectedUTCHour | expectedUTCMinute
    ${friday}           | ${10} | ${0}   | ${8}            | ${0}
    ${friday}           | ${0}  | ${15}  | ${22}           | ${15}
    ${friday}           | ${3}  | ${30}  | ${1}            | ${30}
    ${friday}           | ${19} | ${45}  | ${17}           | ${45}
    ${fridayWinterTime} | ${20} | ${25}  | ${19}           | ${25}
  `(
    "when select hour $hour and minute $minute for $date",
    ({ date, hour, expectedUTCHour, minute, expectedUTCMinute }) => {
      it("should generate a date according to Paris timezone", () => {
        const availabilityDate = OverDate.init({ date, hour, minute });
        expect(availabilityDate.date.getUTCHours()).toBe(expectedUTCHour);
        expect(availabilityDate.date.getUTCMinutes()).toBe(expectedUTCMinute);
      });
    },
  );
  describe("Generate from date", () => {
    describe.each`
      date                                 | expectedHour | expectedMinute | expectedDate
      ${`${friday}T11:11+01:00`}           | ${12}        | ${11}          | ${`${friday}T12:11+02:00`}
      ${`${friday}T11:00-11:00`}           | ${0}         | ${0}           | ${`${saturday}T00:00+02:00`}
      ${`${friday}T11:15+07:00`}           | ${6}         | ${15}          | ${`${friday}T06:15+02:00`}
      ${`${fridayWinterTime}T11:15+07:00`} | ${5}         | ${15}          | ${`${fridayWinterTime}T05:15+01:00`}
    `(
      "when generating from $date",
      ({ date, expectedHour, expectedMinute, expectedDate }) => {
        it(`should generate date at ${expectedHour}h${expectedMinute}m`, () => {
          const availabilityDate = OverDate.from(new Date(date));
          expect(availabilityDate.hour).toBe(expectedHour);
          expect(availabilityDate.minute).toBe(expectedMinute);
          expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });
  describe("Generate from date string", () => {
    describe.each<TestHelper>([
      {
        date: `${friday}T10:11:00.000Z`,
        expectedHour: 12,
        expectedMinute: 11,
        expectedDate: `${friday}T12:11+02:00`,
      },
    ])(
      "when generating from $date",
      ({ date, expectedHour, expectedMinute, expectedDate }) => {
        it(`should generate date at ${expectedHour}h${expectedMinute}m`, () => {
          const availabilityDate = OverDate.from(date);
          expect(availabilityDate.hour).toBe(expectedHour);
          expect(availabilityDate.minute).toBe(expectedMinute);
          expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });
  describe("Turn local date to same datetime with Paris timezone", () => {
    describe.each`
      date                           | expectedHour | expectedMinute | expectedDate
      ${`${friday}T11:00`}           | ${11}        | ${0}           | ${`${friday}T11:00+02:00`}
      ${`${friday}T00:15`}           | ${0}         | ${15}          | ${`${friday}T00:15+02:00`}
      ${`${friday}T22:30`}           | ${22}        | ${30}          | ${`${friday}T22:30+02:00`}
      ${`${fridayWinterTime}T22:30`} | ${22}        | ${30}          | ${`${fridayWinterTime}T22:30+01:00`}
    `(
      "when generating from $date",
      ({ date, expectedHour, expectedMinute, expectedDate }) => {
        it(`should generate date at ${expectedHour}h${expectedMinute}m`, () => {
          const availabilityDate = OverDate.fromLocal(new Date(date));
          expect(availabilityDate.hour).toBe(expectedHour);
          expect(availabilityDate.minute).toBe(expectedMinute);
          expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });
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
          const availabilityDate = OverDate.getStartOfDay(new Date(date));
          expect(availabilityDate.hour).toBe(expectedHour);
          expect(availabilityDate.minute).toBe(expectedMinute);
          expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
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
          const availabilityDate = OverDate.getEndOfDay(new Date(date));
          expect(availabilityDate.hour).toBe(expectedHour);
          expect(availabilityDate.minute).toBe(expectedMinute);
          expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
        });
      },
    );
  });
  describe("Detect period inclusion", () => {
    describe.each`
      date      | hour  | periods                                   | isIncluded
      ${friday} | ${10} | ${[]}                                     | ${false}
      ${friday} | ${10} | ${[{ start: friday10h, end: friday12h }]} | ${true}
      ${friday} | ${12} | ${[{ start: friday10h, end: friday12h }]} | ${false}
    `(
      "when looking for $date $hour h inside $periods",
      ({ date, hour, periods, isIncluded }) => {
        it(`should indicate date is ${isIncluded ? "" : "not "}included by periods list`, () => {
          const availabilityDate = OverDate.init({ date, hour });
          expect(availabilityDate.isIncludedBy(periods)).toBe(isIncluded);
        });
      },
    );
  });
  describe("Generate associated period", () => {
    describe.each`
      date      | hour  | minute | start                      | end
      ${friday} | ${10} | ${0}   | ${`${friday}T10:00+02:00`} | ${`${friday}T11:00+02:00`}
      ${friday} | ${6}  | ${0}   | ${`${friday}T06:00+02:00`} | ${`${friday}T07:00+02:00`}
      ${friday} | ${19} | ${30}  | ${`${friday}T19:30+02:00`} | ${`${friday}T20:30+02:00`}
    `(
      "when asking associated period for $date $hour h $minute m",
      ({ date, hour, minute, start, end }) => {
        it(`should generate period to ${end}`, () => {
          const expectedStart = new Date(start);
          const expectedEnd = new Date(end);

          const availabilityDate = OverDate.init({ date, hour, minute });
          const period = availabilityDate.period;

          expect(period.start).toStrictEqual(expectedStart);
          expect(period.end).toStrictEqual(expectedEnd);
        });
      },
    );
  });
  describe("Generate date string", () => {
    describe.each`
      date            | expected
      ${friday10h}    | ${friday}
      ${friday12h}    | ${friday}
      ${saturdayDate} | ${saturday}
    `("when asking date string for $date", ({ date, expected }) => {
      it(`should return ${expected}`, () => {
        const availabilityDate = OverDate.from(date);
        expect(availabilityDate.dateString).toBe(expected);
      });
    });
  });
  describe("Get monday", () => {
    describe.each`
      date                                 | expected
      ${`${friday}T11:11+02:00`}           | ${`${monday}T00:00+02:00`}
      ${`${saturday}T00:15+03:00`}         | ${`${monday}T00:00+02:00`}
      ${`${fridayWinterTime}T12:30+01:00`} | ${`${mondayWinterTime}T00:00+01:00`}
    `("when asking monday for $date", ({ date, expected }) => {
      it(`should return ${expected}`, () => {
        const availabilityDate = OverDate.from(date);
        expect(availabilityDate.getMonday().date).toStrictEqual(
          new Date(expected),
        );
      });
    });
  });
  describe("Compare dates", () => {
    describe.each`
      date1                                | date2                        | expected
      ${`${friday}T11:11+02:00`}           | ${`${friday}T19:00+02:00`}   | ${true}
      ${`${friday}T11:00+02:00`}           | ${`${saturday}T00:00+02:00`} | ${false}
      ${`${fridayWinterTime}T11:15+07:00`} | ${`${friday}T19:00+02:00`}   | ${false}
    `(
      "when checking if $date1 and $date2 are the same day",
      ({ date1, date2, expected }) => {
        it(`should return ${expected}`, () => {
          const overdate1 = OverDate.from(date1);
          const overdate2 = OverDate.from(date2);
          expect(OverDate.isSameDay(overdate1, overdate2)).toBe(expected);
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
          const overdate1 = OverDate.from(date1);
          const overdate2 = OverDate.from(date2);
          expect(OverDate.isSameWeek(overdate1, overdate2)).toBe(expected);
        });
      },
    );
  });
});
