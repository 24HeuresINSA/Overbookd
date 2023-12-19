import { describe, it, expect } from "vitest";
import { SlugifyService } from "./slugify";

describe("slugify service", () => {
  describe.each`
    sentence                        | expected
    ${"Bonjour"}                    | ${"bonjour"}
    ${"Léo Mouyna"}                 | ${"leo-mouyna"}
    ${"Ça m'énerve"}                | ${"ca-m-enerve"}
    ${"Cœur"}                       | ${"coeur"}
    ${"Œil"}                        | ${"oeil"}
    ${"vis Ø12mm"}                  | ${"vis-o12mm"}
    ${"VIP/PRESSE/ORGANISATEUR"}    | ${"vip-presse-organisateur"}
    ${"PASS 1 SOIR / PASS 2 SOIRS"} | ${"pass-1-soir-pass-2-soirs"}
    ${"comment ça va ?"}            | ${"comment-ca-va"}
    ${"  salut"}                    | ${"salut"}
  `("when slugify $sentence", ({ sentence, expected }) => {
    it(`should return ${expected}`, () => {
      expect(SlugifyService.apply(sentence)).toBe(expected);
    });
  });
});
