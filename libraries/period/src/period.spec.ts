import { describe, expect, it } from "vitest";
import { INVALID_PERIOD_ERROR_MESSAGE, Period } from "./period";

describe("create a period", () => {
  describe("when start is before end", () => {
    it("should create a period", () => {
      const period = Period.init({
        start: new Date("2023-05-17 09:00"),
        end: new Date("2023-05-17 14:00"),
      });

      expect(period.start.getTime()).toBeLessThan(period.end.getTime());
      expect(period.hasDuration).toBe(true);
    });
  });

  describe("when start is after end", () => {
    it("should indicate that start must be before end", () => {
      expect(() =>
        Period.init({
          start: new Date("2023-05-17 14:00"),
          end: new Date("2023-05-17 09:00"),
        }),
      ).toThrow(INVALID_PERIOD_ERROR_MESSAGE);
    });
  });
});
