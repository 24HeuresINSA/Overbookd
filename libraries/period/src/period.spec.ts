import { describe, expect, it } from "vitest";
import {
  END_BEFORE_START_ERROR_MESSAGE,
  EndBeforeStart,
  Period,
} from "./period";

describe("Create a period", () => {
  describe("when start is before end", () => {
    it("should create a period", () => {
      const period = Period.init({
        start: new Date("2023-05-17T08:00+02:00"),
        end: new Date("2023-05-17T09:00+02:00"),
      });
      expect(period.start.getTime()).toBe(
        new Date("2023-05-17T08:00+02:00").getTime(),
      );
      expect(period.end.getTime()).toBe(
        new Date("2023-05-17T09:00+02:00").getTime(),
      );
    });
  });

  describe("when start is after to end", () => {
    it("should indicate that end should be after start", () => {
      expect(() =>
        Period.init({
          start: new Date("2023-05-17T09:00+02:00"),
          end: new Date("2023-05-17T08:00+02:00"),
        }),
      ).toThrow(EndBeforeStart);
    });
  });
});

describe("Check period validity", () => {
  describe("when start is before end", () => {
    const period = {
      start: new Date("2023-05-17T08:00+02:00"),
      end: new Date("2023-05-17T09:00+02:00"),
    };

    it("should be valid", () => {
      expect(Period.isValid(period)).toBe(true);
    });

    it("should not have errors", () => {
      expect(Period.errors(period)).toEqual([]);
    });
  });

  describe("when start is after to end", () => {
    const period = {
      start: new Date("2023-05-17T09:00+02:00"),
      end: new Date("2023-05-17T08:00+02:00"),
    };

    it("should be invalid", () => {
      expect(Period.isValid(period)).toBe(false);
    });

    it("should indicate that end should be after start", () => {
      expect(Period.errors(period)).toEqual([END_BEFORE_START_ERROR_MESSAGE]);
    });
  });
});
