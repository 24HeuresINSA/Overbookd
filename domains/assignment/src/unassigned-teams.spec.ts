import { describe, expect, it } from "vitest";
import { DeductUnassignedTeams } from "./unassigned-team";
import {
  taskWithoutUnassigned,
  taskWithOneUnassigned,
  taskWithOneUnassignedAmongTwoTeams,
  taskWithTwoDifferentUnassigned,
  taskWithTwoAssignments,
} from "./unassigned-team.test-utils";

describe("Find unassigned teams", () => {
  describe.each`
    explaination                             | task                                  | expectation
    ${"without unassigned"}                  | ${taskWithoutUnassigned}              | ${[]}
    ${"with one unassigned"}                 | ${taskWithOneUnassigned}              | ${["plaizir"]}
    ${"with one unassigned among two teams"} | ${taskWithOneUnassignedAmongTwoTeams} | ${["vieux"]}
    ${"with two different unassigned"}       | ${taskWithTwoDifferentUnassigned}     | ${["hard", "benevole"]}
    ${"with two assignments"}                | ${taskWithTwoAssignments}             | ${["hard", "benevole", "plaizir"]}
  `(
    "when finding unassigned teams from task $explaination",
    ({ task, expectation }) => {
      it("should return unassigned teams", () => {
        const unassignedTeams = DeductUnassignedTeams.fromTask(task);
        expect(unassignedTeams.sort()).toEqual(expectation.sort());
      });
    },
  );
});
