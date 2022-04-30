import { ITimeFrame } from "@entities/FT";
import { sortTFByUser } from "@src/services/conflict";
import * as fs from "fs";
// import { computeTFConflictsWithArray } from "../../../src/services/conflict";

let allTFs: ITimeFrame[];
let res: any = {};

describe("Testing conflicts service", () => {
  beforeAll(() => {
    // Load a really huge amount of timeFrames from json file
    const raw = fs.readFileSync(
      "__tests__/unit/services/timeFrames_sample.json",
      "utf-8"
    );
    allTFs = JSON.parse(raw);
    res = sortTFByUser(allTFs);
  });
  describe("Testing sortTFByUser", () => {
    it("should output a non null object", () => {
      expect(Object.keys(res).length).toBeGreaterThan(0);
    });
  });

  // describe("Testing computeTFConflictsWithArray", () => {
  //   it("should not fail", () => {
  //     res = computeTFConflictsWithArray(allTFs[0], allTFs);
  //     console.log(res);
  //     expect(true).toBeTruthy();
  //   });
  // });
});
