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
import {
  benevolant,
  couperDesCarottes,
  rendreKangoo,
} from "../assign-task-to-volunteer/funnel/assign-volunteers-funnel.test-utils";
import { Task } from "../assign-task-to-volunteer/task";
import { STATIQUE } from "@overbookd/festival-event-constants";
import { BENEVOLE_CODE } from "@overbookd/team";
import { AssignmentSummaryWithTask } from "../common/assignment";

const taskForBenevolant: Task = {
  id: benevolant.taskId,
  name: "Task for Benevolant",
  assignments: [benevolant],
  topPriority: true,
  category: STATIQUE,
};

const taskForRendreKangoo: Task = {
  id: rendreKangoo.taskId,
  name: "Task for Rendre Kangoo",
  assignments: [rendreKangoo],
  topPriority: true,
  category: STATIQUE,
};

const taskForCouperDesCarottes: Task = {
  id: couperDesCarottes.taskId,
  name: "Task for Couper des Carottes",
  assignments: [couperDesCarottes],
  topPriority: true,
  category: STATIQUE,
};

const teamsForRendreKangoo = [
  { team: "conducteur", demand: 1, assigned: 0 },
  { team: BENEVOLE_CODE, demand: 2, assigned: 0 },
];

describe("Assign volunteer to task", () => {
  const volunteers = new InMemoryVolunteers([leaAssignee, noelAssignee]);
  const assignments = new InMemoryAssignments([
    benevolant,
    rendreKangoo,
    couperDesCarottes,
  ]);
  const tasks = new InMemoryTasks([
    taskForBenevolant,
    taskForRendreKangoo,
    taskForCouperDesCarottes,
  ]);
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
    describe("when selecting volunteer with conducteur team", async () => {
      const assignments = await assign.selectVolunteer(leaAssignee.id);
      it("should return assignable task assignments", () => {
        const { id, ...expectedTask } = taskForRendreKangoo;
        const expectedAssignment: AssignmentSummaryWithTask = {
          ...rendreKangoo,
          ...expectedTask,
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
        const { id, ...expectedTask } = taskForRendreKangoo;
        const expectedAssignment: AssignmentSummaryWithTask = {
          ...rendreKangoo,
          ...expectedTask,
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
