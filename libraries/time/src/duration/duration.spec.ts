import { describe, expect, it } from "vitest";
import { Duration } from "./duration";
import { ONE_DAY_IN_MS, ONE_SECOND_IN_MS } from "./duration.constant";

describe("Duration", () => {
  describe.each`
    milliseconds | expectedSeconds
    ${1000}      | ${1}
    ${3600000}   | ${3600}
    ${500}       | ${1}
    ${1}         | ${1}
    ${1001}      | ${2}
    ${1901}      | ${2}
  `(
    "When converting $milliseconds ms in seconds",
    ({ milliseconds, expectedSeconds }) => {
      it(`should convert to ${expectedSeconds} seconds`, () => {
        const seconds = Duration.ms(milliseconds).inSeconds;
        expect(seconds).toBe(expectedSeconds);
      });
    },
  );

  describe.each`
    milliseconds        | multiplier | expectedMilliseconds
    ${ONE_SECOND_IN_MS} | ${24}      | ${24 * ONE_SECOND_IN_MS}
    ${ONE_DAY_IN_MS}    | ${10}      | ${10 * ONE_DAY_IN_MS}
  `(
    "When multiplying $milliseconds ms by $multiplier",
    ({ milliseconds, multiplier, expectedMilliseconds }) => {
      it(`should return a duration of ${expectedMilliseconds} ms`, () => {
        const result = Duration.ms(milliseconds).times(multiplier);
        expect(result.inMilliseconds).toBe(expectedMilliseconds);
      });
    },
  );
});
