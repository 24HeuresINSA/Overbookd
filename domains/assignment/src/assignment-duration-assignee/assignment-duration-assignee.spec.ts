import { describe, expect, it } from "vitest";
import { AssignmentDurationAssignee } from "./assignment-duration-assignee";
import { InMemoryAssignees } from "./assignees.inmemory";
import {
  leaAssignee,
  noelAssignee,
  noelExpected,
  leaExpected,
} from "./assignee.test-utils";

describe("Listing assignees", async () => {
  const assignees = new InMemoryAssignees([leaAssignee, noelAssignee]);
  const assignmentDurationAssignee = new AssignmentDurationAssignee(assignees);
  const assigneesWithDuration = await assignmentDurationAssignee.list();
  describe.each`
    explaination                | assigneeId         | expected
    ${"with one assignment"}    | ${noelAssignee.id} | ${noelExpected}
    ${"with three assignments"} | ${leaAssignee.id}  | ${leaExpected}
  `("when listing assignees $explaination", ({ assigneeId, expected }) => {
    it("should contain assignee with right assignment duration", () => {
      const found = assigneesWithDuration.find((a) => a.id === assigneeId);
      expect(found).toEqual(expected);
    });
  });
});
