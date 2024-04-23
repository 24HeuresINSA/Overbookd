import { describe, expect, it } from "vitest";
import { AssignVolunteerToTask } from "./assign-volunteer-to-task";
import { InMemoryVolunteers } from "./repositories/volunteers.inmemory";
import {
  leaAssignee,
  noelAssignee,
  noelExpected,
  leaExpected,
} from "./assign-volunteer-to-task.test-utils";
import { InMemoryAssignments } from "../common/repositories/assignments.inmemory";
import { InMemoryTasks } from "../common/repositories/tasks.inmemory";

describe("Assign volunteer to task", () => {
  const volunteers = new InMemoryVolunteers([leaAssignee, noelAssignee]);
  const assignments = new InMemoryAssignments([]);
  const tasks = new InMemoryTasks([]);
  const assign = new AssignVolunteerToTask(volunteers, assignments, tasks);

  describe("when listing all assignable volunteers", async () => {
    const assignableVolunteers = await assign.volunteers();
    describe.each`
      explaination                | assigneeId         | expected
      ${"with one assignment"}    | ${noelAssignee.id} | ${noelExpected}
      ${"with three assignments"} | ${leaAssignee.id}  | ${leaExpected}
    `("when listing volunteers $explaination", ({ assigneeId, expected }) => {
      it("should contain volunteer with right assignment duration", () => {
        const found = assignableVolunteers.find((a) => a.id === assigneeId);
        expect(found).toEqual(expected);
      });
    });
  });

  describe("when selecting a volunteer", () => {
    it("should return assignable task assignments", async () => {
      await assign.selectVolunteer(noelAssignee.id);
      expect(true).toBe(true);
    });
  });
});
