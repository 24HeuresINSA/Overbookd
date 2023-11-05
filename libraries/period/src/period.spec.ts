import { describe, expect, it } from "vitest";
import { EndBeforeStart, Period } from "./period";

describe("Create a period", () => {
  describe("when start is before end", () => {
    it("should create a period", () => {
      const period = Period.init({
        start: new Date("2023-05-17 08:00"),
        end: new Date("2023-05-17 09:00"),
      });
      expect(period.start.getTime()).toBe(
        new Date("2023-05-17 08:00").getTime(),
      );
      expect(period.end.getTime()).toBe(new Date("2023-05-17 09:00").getTime());
    });
  });

  describe("when start is after to end", () => {
    it("should indicate that end should be after start", () => {
      expect(() =>
        Period.init({
          start: new Date("2023-05-17 09:00"),
          end: new Date("2023-05-17 08:00"),
        }),
      ).toThrow(EndBeforeStart);
    });
  });
});
