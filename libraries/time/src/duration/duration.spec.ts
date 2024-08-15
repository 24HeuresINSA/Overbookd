import { describe, expect, it } from "vitest";
import { Duration } from "./duration";

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
});
