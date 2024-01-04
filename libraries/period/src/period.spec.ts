import { describe, expect, it } from "vitest";
import {
  END_BEFORE_START_ERROR_MESSAGE,
  EndBeforeStart,
  IProvidePeriod,
  Period,
} from "./period";
import { ONE_MINUTE_IN_MS, ONE_SECOND_IN_MS } from "./duration.constant";

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

describe("Split period with interval", () => {
  describe.each`
    readablePeriod                                  | period                                                                                          | intervalInMs             | readableInterval | expectedPeriods
    ${"2023-05-17 08:00 to 09:00"}                  | ${{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T09:00+02:00") }}       | ${15 * ONE_MINUTE_IN_MS} | ${"15min"}       | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T08:15+02:00"), end: new Date("2023-05-17T08:30+02:00") }, { start: new Date("2023-05-17T08:30+02:00"), end: new Date("2023-05-17T08:45+02:00") }, { start: new Date("2023-05-17T08:45+02:00"), end: new Date("2023-05-17T09:00+02:00") }]}
    ${"2024-01-01 23:59:50 to 2024-01-02 00:00:02"} | ${{ start: new Date("2024-01-01T23:59:50+02:00"), end: new Date("2024-01-02T00:00:02+02:00") }} | ${5 * ONE_SECOND_IN_MS}  | ${"5sec"}        | ${[{ start: new Date("2024-01-01T23:59:50+02:00"), end: new Date("2024-01-01T23:59:55+02:00") }, { start: new Date("2024-01-01T23:59:55+02:00"), end: new Date("2024-01-02T00:00:00+02:00") }, { start: new Date("2024-01-02T00:00:00+02:00"), end: new Date("2024-01-02T00:00:02+02:00") }]}
  `(
    "when period start is $readablePeriod",
    ({ period, intervalInMs, readableInterval, expectedPeriods }) => {
      it(`should split period with a ${readableInterval} interval`, () => {
        const periods = Period.init(period).splitWithIntervalInMs(intervalInMs);
        expect(periods).toEqual(expectedPeriods);
      });
    },
  );
});

describe("Sort periods", () => {
  describe.each`
    readablePeriods                                                         | periods                                                                                                                                                                             | expectedPeriods
    ${"2023-05-17 09:00 to 09:15 and 2023-05-17 08:15 to 08:30"}            | ${[{ start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-17T09:15+02:00") }, { start: new Date("2023-05-17T08:15+02:00"), end: new Date("2023-05-17T08:30+02:00") }]} | ${[{ start: new Date("2023-05-17T08:15+02:00"), end: new Date("2023-05-17T08:30+02:00") }, { start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-17T09:15+02:00") }]}
    ${"2023-05-17 09:00 to 12:00 and 2023-05-17 09:00 to 2023-05-18 01:00"} | ${[{ start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-17T12:00+02:00") }, { start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-18T01:00+02:00") }]} | ${[{ start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-18T01:00+02:00") }, { start: new Date("2023-05-17T09:00+02:00"), end: new Date("2023-05-17T12:00+02:00") }]}
  `("when periods are $readablePeriods", ({ periods, expectedPeriods }) => {
    it("should sort periods", () => {
      const initPeriods = periods.map((period: IProvidePeriod) =>
        Period.init(period),
      );
      const sortedPeriods = Period.sort(initPeriods);
      console.log(sortedPeriods, expectedPeriods);
      expect(sortedPeriods).toEqual(expectedPeriods);
    });
  });
});

describe("Merge contiguous periods", () => {
  describe.each`
    readablePeriods                                                                            | periods                                                                                                                                                                                                                                                                     | expectedPeriods                                                                                                                                                                     | readableExpectedPeriods
    ${"2023-05-17 08:00 to 08:15"}                                                             | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }]}                                                                                                                                                                                 | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }]}                                                                                         | ${"2023-05-17 08:00 to 08:15"}
    ${"2023-05-17 08:00 to 08:15 and 2023-05-17 08:15 to 08:30"}                               | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T08:15+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${"2023-05-17 08:00 to 08:30"}
    ${"2023-05-17 08:00 to 08:15 and 2023-05-17 08:00 to 08:30"}                               | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${"2023-05-17 08:00 to 08:30"}
    ${"2023-05-17 08:00 to 08:15 and 2023-05-17 08:30 to 08:45"}                               | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T08:30+02:00"), end: new Date("2023-05-17T08:45+02:00") }]}                                                                                         | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T08:30+02:00"), end: new Date("2023-05-17T08:45+02:00") }]} | ${"2023-05-17 08:00 to 08:15 and 2023-05-17 08:30 to 08:45"}
    ${"2023-05-17 08:00 to 08:15 and 2023-05-17 07:00 to 08:30"}                               | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:15+02:00") }, { start: new Date("2023-05-17T07:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${[{ start: new Date("2023-05-17T07:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }]}                                                                                         | ${"2023-05-17 07:00 to 08:30"}
    ${"2023-05-17 08:00 to 08:30 and 2023-05-17 08:45 to 09:30 and 2023-05-17 09:30 to 10:00"} | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }, { start: new Date("2023-05-17T08:45+02:00"), end: new Date("2023-05-17T09:30+02:00") }, { start: new Date("2023-05-17T09:30+02:00"), end: new Date("2023-05-17T10:00+02:00") }]} | ${[{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T08:30+02:00") }, { start: new Date("2023-05-17T08:45+02:00"), end: new Date("2023-05-17T10:00+02:00") }]} | ${"2023-05-17 08:00 to 08:30 and 2023-05-17 08:45 to 10:00"}
  `(
    "when periods are $readablePeriods",
    ({ periods, expectedPeriods, readableExpectedPeriods }) => {
      it(`should merge contiguous periods to ${readableExpectedPeriods}`, () => {
        const initPeriods = periods.map((period: IProvidePeriod) =>
          Period.init(period),
        );
        const mergedPeriods = Period.mergeContiguous(initPeriods);
        expect(mergedPeriods).toEqual(expectedPeriods);
      });
    },
  );
});
