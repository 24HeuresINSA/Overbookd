import { describe, expect, it } from "vitest";
import { DateString, OverDate } from "./date";

const friday: DateString = "2024-05-17";
const saturday: DateString = "2024-05-18";
const friday10h = new Date(`${friday}T10:00+02:00`);
const friday12h = new Date(`${friday}T12:00+02:00`);

describe("Over Date [Paris based date]", () => {
  describe.each`
    date      | hour  | expectedUTCHour
    ${friday} | ${10} | ${8}
    ${friday} | ${0}  | ${22}
    ${friday} | ${3}  | ${1}
    ${friday} | ${19} | ${17}
  `("when select hour $hour for $date", ({ date, hour, expectedUTCHour }) => {
    it("should generate a date according to Paris timezone", () => {
      const availabilityDate = OverDate.init({ date, hour });
      expect(availabilityDate.date.getUTCHours()).toBe(expectedUTCHour);
    });
  });
  describe("Generate from date", () => {
    describe.each`
      date                       | expectedHour | expectedDate
      ${`${friday}T11:00+01:00`} | ${12}        | ${`${friday}T12:00+02:00`}
      ${`${friday}T11:00-11:00`} | ${0}         | ${`${saturday}T00:00+02:00`}
      ${`${friday}T11:00+07:00`} | ${6}         | ${`${friday}T06:00+02:00`}
    `("when generating from $date", ({ date, expectedHour, expectedDate }) => {
      it(`should generate date at ${expectedHour}h`, () => {
        const availabilityDate = OverDate.from(new Date(date));
        expect(availabilityDate.hour).toBe(expectedHour);
        expect(availabilityDate.date).toStrictEqual(new Date(expectedDate));
      });
    });
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
      date      | hour  | start                      | end
      ${friday} | ${10} | ${`${friday}T10:00+02:00`} | ${`${friday}T11:00+02:00`}
      ${friday} | ${6}  | ${`${friday}T06:00+02:00`} | ${`${friday}T07:00+02:00`}
      ${friday} | ${19} | ${`${friday}T19:00+02:00`} | ${`${friday}T20:00+02:00`}
    `(
      "when asking associated period for $date $hour h",
      ({ date, hour, start, end }) => {
        it(`should generate period to ${end}`, () => {
          const expectedStart = new Date(start);
          const expectedEnd = new Date(end);

          const availabilityDate = OverDate.init({ date, hour });
          const period = availabilityDate.period;

          expect(period.start).toStrictEqual(expectedStart);
          expect(period.end).toStrictEqual(expectedEnd);
        });
      },
    );
  });
});
