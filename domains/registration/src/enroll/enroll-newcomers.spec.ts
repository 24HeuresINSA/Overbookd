import { beforeEach, describe, expect, it } from "vitest";
import { EnrollNewcomers, BENEVOLE_CODE } from "./enroll-newcomers";

describe("Enroll newcomers to a joinable team", () => {
  const newcomers = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const team = "hard";
  let enrollNewcomers: EnrollNewcomers;

  beforeEach(() => {
    enrollNewcomers = EnrollNewcomers.with(newcomers);
  });

  it("should enroll newcomers to the requested joinable team", () => {
    const enrolledNewcomers = enrollNewcomers.to(team);

    expect(
      enrolledNewcomers.every((newcomer) => newcomer.teams.includes(team)),
    ).toBe(true);
  });

  it("should also enroll newcomers to the benevole team", () => {
    const enrolledNewcomers = enrollNewcomers.to(team);

    expect(
      enrolledNewcomers.every((newcomer) =>
        newcomer.teams.includes(BENEVOLE_CODE),
      ),
    ).toBe(true);
  });
});
