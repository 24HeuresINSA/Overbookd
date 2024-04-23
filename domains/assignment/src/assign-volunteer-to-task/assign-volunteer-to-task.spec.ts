import { describe, expect, it } from "vitest";
import { AssignVolunteerToTask } from "./assign-volunteer-to-task";
import { InMemoryVolunteers } from "./repositories/volunteers.inmemory";
import {
  leaAssignee,
  noelAssignee,
  noelExpected,
  leaExpected,
  taskForBenevolant,
  taskForCouperDesCarottes,
  taskForRendreKangoo,
  teamsForRendreKangoo,
} from "./assign-volunteer-to-task.test-utils";
import { AssignmentSummaryWithTask } from "../common/assignment";
import { InMemoryTaskAssignments } from "./repositories/task-assignments.inmemory";

describe("Assign volunteer to task", () => {
  const volunteers = new InMemoryVolunteers([leaAssignee, noelAssignee]);
  const assignments = new InMemoryTaskAssignments([
    taskForBenevolant,
    taskForRendreKangoo,
    taskForCouperDesCarottes,
  ]);
  const assign = new AssignVolunteerToTask(volunteers, assignments);

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
    describe("when selecting volunteer with conducteur team", async () => {
      const assignments = await assign.selectVolunteer(leaAssignee.id);
      it("should return assignable task assignments", () => {
        const expectedAssignment: AssignmentSummaryWithTask = {
          ...taskForRendreKangoo,
          teams: teamsForRendreKangoo,
          hasFriendsAssigned: false,
        };
        expect(assignments).toStrictEqual([expectedAssignment]);
      });

      it("should return teams with missing assignees", () => {
        expect(assignments[0].teams).toEqual(teamsForRendreKangoo);
      });
    });
    describe("when selecting volunteer already assigned at same time and with benevole team", async () => {
      const assignments = await assign.selectVolunteer(noelAssignee.id);
      it("should return assignable task assignments", () => {
        const expectedAssignment: AssignmentSummaryWithTask = {
          ...taskForRendreKangoo,
          teams: teamsForRendreKangoo,
          hasFriendsAssigned: false,
        };
        expect(assignments).toStrictEqual([expectedAssignment]);
      });

      it("should return teams with missing assignees", () => {
        expect(assignments[0].teams).toEqual(teamsForRendreKangoo);
      });
    });
  });
});
