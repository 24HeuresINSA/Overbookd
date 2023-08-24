import { describe, it, expect } from "vitest";
import { SlugifyService } from "./slugify";

describe("slugify service", () => {
  describe.each`
    sentence         | expected
    ${"Bonjour"}     | ${"bonjour"}
    ${"Léo Mouyna"}  | ${"leo-mouyna"}
    ${"Ça m'énerve"} | ${"ca-m-enerve"}
    ${"Cœur"}        | ${"coeur"}
    ${"Œil"}         | ${"oeil"}
    ${"vis Ø12mm"}   | ${"vis-o12mm"}
  `("when slugify $sentence", ({ sentence, expected }) => {
    it(`should return ${expected}`, () => {
      expect(SlugifyService.apply(sentence)).toBe(expected);
    });
  });
});
