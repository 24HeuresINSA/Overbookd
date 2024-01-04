import { describe, expect, it } from "vitest";
import {
  END_BEFORE_START_ERROR_MESSAGE,
  EndBeforeStart,
  Period,
} from "./period";
import { ONE_MINUTE_IN_MS, ONE_SECOND_IN_MS } from "./duration.constant";
import {
  friday08hto09h,
  friday08hto08h15,
  friday08h15to08h30,
  friday08h30to08h45,
  friday08h45To09h,
  friday23h59m50toSaturday00h00m02,
  friday23h59m50to23h59m55,
  friday23h59m55toSaturday00h,
  saturday00hTo00h00m02,
  friday09h30to10h,
  friday09htoSaturday01h,
  friday08hto08h30,
  friday07hto08h30,
  friday08h45to09h30,
  friday08h45to10h,
} from "./period.test-utils";

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
    readablePeriod                            | period                              | intervalInMs             | readableInterval | expectedPeriods
    ${"friday 08:00 to 09:00"}                | ${friday08hto09h}                   | ${15 * ONE_MINUTE_IN_MS} | ${"15min"}       | ${[friday08hto08h15, friday08h15to08h30, friday08h30to08h45, friday08h45To09h]}
    ${"friday 23:59:50 to saturday 00:00:02"} | ${friday23h59m50toSaturday00h00m02} | ${5 * ONE_SECOND_IN_MS}  | ${"5sec"}        | ${[friday23h59m50to23h59m55, friday23h59m55toSaturday00h, saturday00hTo00h00m02]}
  `(
    "when period start is $readablePeriod",
    ({ period, intervalInMs, readableInterval, expectedPeriods }) => {
      it(`should split period with a ${readableInterval} interval`, () => {
        const periods = period.splitWithIntervalInMs(intervalInMs);
        expect(periods).toEqual(expectedPeriods);
      });
    },
  );
});

describe("Sort periods", () => {
  describe.each`
    readablePeriods                                        | periods                                       | expectedPeriods
    ${"friday 09:30 to 10:00 and 08:15 to 08:30"}          | ${[friday09h30to10h, friday08h15to08h30]}     | ${[friday08h15to08h30, friday09h30to10h]}
    ${"friday 09:00 to 10:00 and 09:00 to saturday 01:00"} | ${[friday09h30to10h, friday09htoSaturday01h]} | ${[friday09htoSaturday01h, friday09h30to10h]}
  `("when periods are $readablePeriods", ({ periods, expectedPeriods }) => {
    it("should sort periods", () => {
      const sortedPeriods = Period.sort(periods);
      console.log(sortedPeriods, expectedPeriods);
      expect(sortedPeriods).toEqual(expectedPeriods);
    });
  });
});

describe("Merge contiguous periods", () => {
  describe.each`
    readablePeriods                                                  | periods                                                     | expectedPeriods                           | readableExpectedPeriods
    ${"friday 08:00 to 08:15"}                                       | ${[friday08hto08h15]}                                       | ${[friday08hto08h15]}                     | ${"friday 08:00 to 08:15"}
    ${"friday 08:00 to 08:15 and 08:15 to 08:30"}                    | ${[friday08hto08h15, friday08h15to08h30]}                   | ${[friday08hto08h30]}                     | ${"friday 08:00 to 08:30"}
    ${"friday 08:00 to 08:15 and 08:00 to 08:30"}                    | ${[friday08hto08h15, friday08hto08h30]}                     | ${[friday08hto08h30]}                     | ${"friday 08:00 to 08:30"}
    ${"friday 08:00 to 08:15 and 08:30 to 08:45"}                    | ${[friday08hto08h15, friday08h30to08h45]}                   | ${[friday08hto08h15, friday08h30to08h45]} | ${"friday 08:00 to 08:15 and 08:30 to 08:45"}
    ${"friday 08:00 to 08:15 and 07:00 to 08:30"}                    | ${[friday08hto08h15, friday07hto08h30]}                     | ${[friday07hto08h30]}                     | ${"friday 07:00 to 08:30"}
    ${"friday 08:00 to 08:30 and 08:45 to 09:30 and 09:30 to 10:00"} | ${[friday08hto08h30, friday08h45to09h30, friday09h30to10h]} | ${[friday08hto08h30, friday08h45to10h]}   | ${"friday 08:00 to 08:30 and 08:45 to 10:00"}
  `(
    "when periods are $readablePeriods",
    ({ periods, expectedPeriods, readableExpectedPeriods }) => {
      it(`should merge contiguous periods to ${readableExpectedPeriods}`, () => {
        const mergedPeriods = Period.mergeContiguous(periods);
        expect(mergedPeriods).toEqual(expectedPeriods);
      });
    },
  );
});
