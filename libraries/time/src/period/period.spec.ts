import { describe, expect, it } from "vitest";
import {
  END_BEFORE_START_ERROR_MESSAGE,
  EndBeforeStart,
  NO_DURATION_ERROR_MESSAGE,
  Period,
} from "./period";
import {
  ONE_MINUTE_IN_MS,
  ONE_SECOND_IN_MS,
} from "../duration/duration.constant";
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
  friday08hto08h45,
  friday08hto10h,
  friday08h30to09h30,
  friday08hto09h30,
  friday08h30to09h,
  friday08h15to09h,
  thursday20hToFriday04h,
  saturday02hTo04h,
  monday10hto12h,
  monday10hto14h,
  monday12hto14h,
  tuesday15h30to15h31,
  tuesday15h30to15h33,
  tuesday15h31to15h32,
  tuesday15h32to15h33,
  thursday02hToSunday02h,
  thursday22hToFriday00h,
  saturday00hToSaturday02h,
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

  describe("when start is after end", () => {
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

  describe("when start is equal to end", () => {
    const date = new Date("2023-05-17T08:00+02:00");
    const period = { start: date, end: date };

    it("should be invalid", () => {
      expect(Period.isValid(period)).toBe(false);
    });

    it("should indicate that period should have a duration", () => {
      expect(Period.errors(period)).toEqual([NO_DURATION_ERROR_MESSAGE]);
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

describe("Split period into parts", () => {
  describe.each`
    readablePeriod              | period                 | parts | expectedPeriods
    ${"friday 08:00 to 09:00"}  | ${friday08hto09h}      | ${0}  | ${[friday08hto09h]}
    ${"friday 08:00 to 09:00"}  | ${friday08hto09h}      | ${4}  | ${[friday08hto08h15, friday08h15to08h30, friday08h30to08h45, friday08h45To09h]}
    ${"monday 10:00 to 14:00"}  | ${monday10hto14h}      | ${2}  | ${[monday10hto12h, monday12hto14h]}
    ${"tuesday 15:30 to 15:33"} | ${tuesday15h30to15h33} | ${3}  | ${[tuesday15h30to15h31, tuesday15h31to15h32, tuesday15h32to15h33]}
  `(
    "when spliting $readablePeriod into $parts parts",
    ({ period, parts, expectedPeriods }) => {
      it(`should split period into ${parts} parts`, () => {
        const periods = period.splitInto(parts);
        expect(periods).toEqual(expectedPeriods);
      });
    },
  );
});

describe("Sort periods", () => {
  describe.each`
    readablePeriods                                        | periods                                       | expectedPeriods
    ${"friday 09:30 to 10:00 and 08:15 to 08:30"}          | ${[friday09h30to10h, friday08h15to08h30]}     | ${[friday08h15to08h30, friday09h30to10h]}
    ${"friday 09:30 to 10:00 and 09:00 to saturday 01:00"} | ${[friday09h30to10h, friday09htoSaturday01h]} | ${[friday09htoSaturday01h, friday09h30to10h]}
    ${"friday 08:00 to 09:00 and 08:00 to 08:30"}          | ${[friday08hto09h, friday08hto08h30]}         | ${[friday08hto08h30, friday08hto09h]}
  `("when periods are $readablePeriods", ({ periods, expectedPeriods }) => {
    it("should sort periods", () => {
      const sortedPeriods = Period.sort(periods);
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
    ${"friday 08:00 to 08:30 and 08:45 to 09:30 and 09:30 to 10:00"} | ${[friday08hto08h30, friday08h45to09h30, friday09h30to10h]} | ${[friday08hto08h30, friday08h45to10h]}   | ${"friday 08:00 to 08:30 and 08:45 to 10:00"}
    ${"friday 08:00 to 08:45 and 08:30 to 09:30"}                    | ${[friday08hto08h45, friday08h30to09h30]}                   | ${[friday08hto09h30]}                     | ${"friday 08:00 to 09:30"}
    ${"friday 08:00 to 10:00 and 08:45 to 09:30"}                    | ${[friday08hto10h, friday08h45to09h30]}                     | ${[friday08hto10h]}                       | ${"friday 08:00 to 10:00"}
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

describe("Remove period from another", () => {
  describe.each`
    case                         | basePeriod          | periodToRemove           | expectedPeriods
    ${"not overlapping"}         | ${friday08hto09h}   | ${saturday00hTo00h00m02} | ${[friday08hto09h]}
    ${"partially overlapping"}   | ${friday08hto09h}   | ${friday07hto08h30}      | ${[friday08h30to09h]}
    ${"starting at same time"}   | ${friday08hto09h}   | ${friday08hto08h15}      | ${[friday08h15to09h]}
    ${"included"}                | ${friday08hto09h}   | ${friday08h15to08h30}    | ${[friday08hto08h15, friday08h30to09h]}
    ${"completelly overlapping"} | ${friday08hto08h15} | ${friday07hto08h30}      | ${[]}
  `(
    "when removing a $case period",
    ({ basePeriod, periodToRemove, expectedPeriods }) => {
      it(`should return ${expectedPeriods.length} period(s)`, () => {
        const periods = basePeriod.remove(periodToRemove);
        expect(periods).toStrictEqual(expectedPeriods);
      });
    },
  );
});

describe("Period is in day", () => {
  const friday = new Date("2024-05-17");
  describe.each`
    description                                                 | period                              | expectedResult
    ${"start and end are in the same day"}                      | ${friday08hto09h}                   | ${true}
    ${"start is in the day and the end is in the next day"}     | ${friday23h59m50toSaturday00h00m02} | ${true}
    ${"start is in the previous day and the end is in the day"} | ${thursday20hToFriday04h}           | ${true}
    ${"start and end are in different days"}                    | ${saturday02hTo04h}                 | ${false}
    ${"start and end overlap the day"}                          | ${thursday02hToSunday02h}           | ${true}
    ${"start is at midnight"}                                   | ${saturday00hToSaturday02h}         | ${false}
    ${"end is at midnight the day before"}                      | ${thursday22hToFriday00h}           | ${false}
  `("when $description", ({ period, expectedResult }) => {
    it(`should return ${expectedResult}`, () => {
      expect(period.isInDay(friday)).toBe(expectedResult);
    });
  });
});
