import { describe, expect, it } from "vitest";
import { DateString } from "@overbookd/period";
import { AvailabilityDateOddHourError } from "./volunteer-availability.error";
import { AvailabilityDate } from "./date";

const friday: DateString = "2024-05-17";

describe("AvailabilityDate [Paris based date]", () => {
  describe("when trying to select odd hour outside party shift", () => {
    it.each`
      date      | hour  | shift
      ${friday} | ${11} | ${"day"}
      ${friday} | ${7}  | ${"night"}
    `(
      "should indicate that we can't select odd hour during $shift shift",
      ({ date, hour }) => {
        expect(() => AvailabilityDate.init({ date, hour })).toThrow(
          AvailabilityDateOddHourError,
        );
      },
    );
  });
  describe("Generate associated period", () => {
    describe.each`
      date      | hour  | start                      | end
      ${friday} | ${10} | ${`${friday}T10:00+02:00`} | ${`${friday}T12:00+02:00`}
      ${friday} | ${6}  | ${`${friday}T06:00+02:00`} | ${`${friday}T08:00+02:00`}
      ${friday} | ${19} | ${`${friday}T19:00+02:00`} | ${`${friday}T20:00+02:00`}
    `(
      "when asking associated period for $date $hour h",
      ({ date, hour, start, end }) => {
        it(`should generate period to ${end}`, () => {
          const expectedStart = new Date(start);
          const expectedEnd = new Date(end);

          const availabilityDate = AvailabilityDate.init({ date, hour });
          const period = availabilityDate.period;

          expect(period.start).toStrictEqual(expectedStart);
          expect(period.end).toStrictEqual(expectedEnd);
        });
      },
    );
  });
});
