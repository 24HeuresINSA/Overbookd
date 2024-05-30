import { describe, it, expect } from "@jest/globals";
import { ALL_HOURS } from "./availabilities";

describe("Availability Starting hours", () => {
  it("should match the list", () => {
    const expectedList = [
      0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 21, 22, 23,
    ];
    expect(ALL_HOURS).toStrictEqual(expectedList);
  });
});
