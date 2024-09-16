import { describe, expect, it } from "vitest";
import { HttpParams } from "./http-param";

// In Http URL, some special characters are not allowed. They must be encoded.
// : -> %3A
// [ -> %5B
// ] -> %5D

describe("Generate Http Params", () => {
  describe.each`
    param                              | expected                              | readableExpected
    ${{ key: 1 }}                      | ${"key=1"}                            | ${"key=1"}
    ${{ key: "value" }}                | ${"key=value"}                        | ${"key=value"}
    ${{ key1: true, key2: 1 }}         | ${"key1=true&key2=1"}                 | ${"key1=true&key2=1"}
    ${{ key: new Date("2021-01-01") }} | ${"key=2021-01-01T00%3A00%3A00.000Z"} | ${"key=2021-01-01T00:00:00.000Z"}
  `(
    `
    When given $param primitive value`,
    ({ param, expected, readableExpected }) => {
      it(`should return ${readableExpected}`, () => {
        const result = HttpParams.generate(param);
        expect(result.toString()).toBe(expected);
      });
    },
  );

  describe.each`
    array                                          | expected                                                       | readableExpected
    ${{ array: [1] }}                              | ${"array%5B%5D=1"}                                             | ${"array[]=1"}
    ${{ array: ["oui", "non"] }}                   | ${"array%5B%5D=oui&array%5B%5D=non"}                           | ${"array[]=oui&array[]=non"}
    ${{ array: [true, "oui", 1] }}                 | ${"array%5B%5D=true&array%5B%5D=oui&array%5B%5D=1"}            | ${"array[]=true&array[]=oui&array[]=1"}
    ${{ array: [new Date("2021-01-01"), "test"] }} | ${"array%5B%5D=2021-01-01T00%3A00%3A00.000Z&array%5B%5D=test"} | ${"array[]=2021-01-01T00:00:00.000Z&array[]=test"}
  `(
    `
    When given $array array value`,
    ({ array, expected, readableExpected }) => {
      it(`should return ${readableExpected}`, () => {
        const result = HttpParams.generate(array);
        expect(result.toString()).toBe(expected);
      });
    },
  );

  describe("When given mixed value", () => {
    it("should return the expected result", () => {
      const result = HttpParams.generate({
        key: "value",
        array: [1, "test"],
      });
      expect(result.toString()).toBe(
        "key=value&array%5B%5D=1&array%5B%5D=test", // key=value&array[]=1&array[]=test
      );
    });
  });
});
