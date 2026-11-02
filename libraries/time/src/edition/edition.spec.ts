import { describe, expect, it } from "vitest";
import { Edition } from "./edition";

describe("Edition", () => {
  it.each([
    { date: "2024-08-31T23:59:59.999Z", edition: 49 },
    { date: "2024-09-01T00:00:00.000Z", edition: 50 },
    { date: "2025-08-31T23:59:59.999Z", edition: 50 },
    { date: "2025-09-01T00:00:00.000Z", edition: 51 },
  ])("returns edition $edition for $date", ({ date, edition }) => {
    expect(Edition.on(new Date(date))).toBe(edition);
  });
});
