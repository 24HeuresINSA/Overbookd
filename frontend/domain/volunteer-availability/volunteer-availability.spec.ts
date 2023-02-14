import { describe, expect, it } from "@jest/globals";
import { formatDateWithMinutes } from "../../utils/date/dateUtils";
import { Period } from "~/utils/models/period";
import { Availability } from "./volunteer-availability";
import { AVAILABILITY_ERROR_MESSAGES } from "./volunteer-availability.error";

describe("volunteer availability", () => {
  describe("start and end timeline", () => {
    describe("when start is before end", () => {
      describe("when period starts in party shift [18:00-06:00]", () => {
        it("should be able to create availability on pair hours", () => {
          const period: Period = {
            start: new Date("2023-05-12 22:00"),
            end: new Date("2023-05-13 02:00"),
          };
          const availability = Availability.fromPeriod(period);
          expect(availability.start).toBe(period.start);
          expect(availability.end).toBe(period.end);
        });
        it("should be able to create availability on odd hours", () => {
          const period: Period = {
            start: new Date("2023-05-13 01:00"),
            end: new Date("2023-05-13 03:00"),
          };
          const availability = Availability.fromPeriod(period);
          expect(availability.start).toBe(period.start);
          expect(availability.end).toBe(period.end);
        });
      });
      describe("when period starts in night shift [06:00-10:00]", () => {
        it("should be able to create availability on pair hours", () => {
          const period: Period = {
            start: new Date("2023-05-13 06:00"),
            end: new Date("2023-05-13 08:00"),
          };
          const availability = Availability.fromPeriod(period);
          expect(availability.start).toBe(period.start);
          expect(availability.end).toBe(period.end);
        });
        it("should inform that start should be a pair hour", () => {
          const period: Period = {
            start: new Date("2023-05-13 07:00"),
            end: new Date("2023-05-13 09:00"),
          };
          expect(() => Availability.fromPeriod(period)).toThrow(
            AVAILABILITY_ERROR_MESSAGES.START_HOUR
          );
        });
      });
      describe("when period starts in day shift [10:00-18:00]", () => {
        it("should be able to create availability on pair hours", () => {
          const period: Period = {
            start: new Date("2023-05-13 12:00"),
            end: new Date("2023-05-13 16:00"),
          };
          const availability = Availability.fromPeriod(period);
          expect(availability.start).toBe(period.start);
          expect(availability.end).toBe(period.end);
        });
        it("should inform that start should be a pair hour", () => {
          const period: Period = {
            start: new Date("2023-05-13 11:00"),
            end: new Date("2023-05-13 13:00"),
          };
          expect(() => Availability.fromPeriod(period)).toThrow(
            AVAILABILITY_ERROR_MESSAGES.START_HOUR
          );
        });
      });
    });
    describe("when start is same than end", () => {
      it("should inform that start should be before end", () => {
        const start = new Date("2023-05-12 22:00");
        const period = {
          start,
          end: start,
        };
        expect(() => Availability.fromPeriod(period)).toThrow(
          AVAILABILITY_ERROR_MESSAGES.PERIOD_TIMELINE
        );
      });
    });
    describe("when start is after end", () => {
      it("should inform that start should be before end", () => {
        const start = new Date("2023-05-12 22:00");
        const end = new Date("2023-05-12 20:00");
        const period = {
          start,
          end,
        };
        expect(() => Availability.fromPeriod(period)).toThrow(
          AVAILABILITY_ERROR_MESSAGES.PERIOD_TIMELINE
        );
      });
    });
  });
  describe("period duration", () => {
    describe("when duration is at least 2 hours", () => {
      it("should create availability", () => {
        const period: Period = {
          start: new Date("2023-05-13 01:00"),
          end: new Date("2023-05-13 10:00"),
        };
        const availability = Availability.fromPeriod(period);
        expect(availability.start).toBe(period.start);
        expect(availability.end).toBe(period.end);
      });
    });
    describe("when duration is less than 2 hours", () => {
      it("should inform that period should last at least 2 hours", () => {
        const period: Period = {
          start: new Date("2023-05-13 01:00"),
          end: new Date("2023-05-13 02:00"),
        };
        expect(() => Availability.fromPeriod(period)).toThrow(
          AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION
        );
      });
    });
  });
  describe("merge availabilities", () => {
    describe("when availabilities overlap or follow", () => {
      describe.each`
        firstPeriodStart                | firstPeriodEnd                  | secondPeriodStart               | secondPeriodEnd                 | expectedStart                   | expectedEnd
        ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-13 10:00")} | ${new Date("2023-05-13 10:00")} | ${new Date("2023-05-13 14:00")} | ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-13 14:00")}
        ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-13 10:00")} | ${new Date("2023-05-12 10:00")} | ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-12 10:00")} | ${new Date("2023-05-13 10:00")}
        ${new Date("2023-05-12 01:00")} | ${new Date("2023-05-13 10:00")} | ${new Date("2023-05-12 10:00")} | ${new Date("2023-05-12 14:00")} | ${new Date("2023-05-12 01:00")} | ${new Date("2023-05-13 10:00")}
        ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-13 10:00")} | ${new Date("2023-05-13 08:00")} | ${new Date("2023-05-13 14:00")} | ${new Date("2023-05-13 01:00")} | ${new Date("2023-05-13 14:00")}
      `(
        "when adding a period from $firstPeriodStart to $firstPeriodEnd and another from $secondPeriodStart to $secondPeriodEnd",
        ({
          firstPeriodStart,
          firstPeriodEnd,
          secondPeriodStart,
          secondPeriodEnd,
          expectedStart,
          expectedEnd,
        }) => {
          it(`should be merged to a period starting\
              from ${formatDateWithMinutes(expectedStart)}\
              to ${formatDateWithMinutes(expectedEnd)}\
             `, () => {
            const firstPeriod = {
              start: firstPeriodStart,
              end: firstPeriodEnd,
            };
            const secondPeriod = {
              start: secondPeriodStart,
              end: secondPeriodEnd,
            };
            const availability = Availability.fromPeriod(firstPeriod);
            const mergedAvailabilities = availability.addPeriod(secondPeriod);
            expect(mergedAvailabilities.start).toEqual(expectedStart);
            expect(mergedAvailabilities.end).toEqual(expectedEnd);
          });
        }
      );
    });
    describe("when availabilities are isolated", () => {
      it("should inform that periods should overlap or follow to be added", () => {
        const firstPeriod = {
          start: new Date("2023-05-12 01:00"),
          end: new Date("2023-05-12 05:00"),
        };
        const secondPeriod = {
          start: new Date("2023-05-12 10:00"),
          end: new Date("2023-05-12 16:00"),
        };
        const availability = Availability.fromPeriod(firstPeriod);
        expect(() => availability.addPeriod(secondPeriod)).toThrow(
          AVAILABILITY_ERROR_MESSAGES.PERIODS_JOINT
        );
      });
    });
  });
});
