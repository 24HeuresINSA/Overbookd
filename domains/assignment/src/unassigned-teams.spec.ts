import { describe, expect, it } from "vitest";
import { DeductUnassignedTeams } from "./unassigned-team";
import {
  taskFullyAssigned,
  taskMissingOneAssignee,
  taskMissingTwoVieux,
  taskMissingOneHardAndOneBenevole,
  taskMissingOneAssigneeThenOneHardAndOneBenevole,
} from "./unassigned-team.test-utils";

describe("Find unassigned teams", () => {
  describe.each`
    explaination                             | task                                               | expectation
    ${"without unassigned"}                  | ${taskFullyAssigned}                               | ${[]}
    ${"with one unassigned"}                 | ${taskMissingOneAssignee}                          | ${["plaizir"]}
    ${"with one unassigned among two teams"} | ${taskMissingTwoVieux}                             | ${["vieux"]}
    ${"with two different unassigned"}       | ${taskMissingOneHardAndOneBenevole}                | ${["hard", "benevole"]}
    ${"with two assignments"}                | ${taskMissingOneAssigneeThenOneHardAndOneBenevole} | ${["hard", "benevole", "plaizir"]}
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
