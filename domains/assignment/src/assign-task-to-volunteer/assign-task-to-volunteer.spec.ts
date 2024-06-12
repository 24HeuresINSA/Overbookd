import { beforeAll, describe, expect, it } from "vitest";
import {
  fullyAssignedTask,
  missingOnePlaizirTask,
  missingTwoVieuxTask,
  missingOneHardAndOneBenevoleTask,
  missingOneAssigneeThenOneHardAndOneBenevoleTask,
  missingOnePlaizirOrTwoVieuxOnStaggeredAssignmentsTask,
  missingTwoVieuxDuring19hto20h,
  fulfillAssignmentThenMissingOneHardTask,
} from "./test-resources/task.fake.js";
import { InMemoryTasks } from "./repositories/tasks.inmemory.js";
import { AssignTaskToVolunteer } from "./assign-task-to-volunteer.js";
import { AssignableVolunteer } from "./assignable-volunteer.js";
import { InMemoryAssignableVolunteers } from "./repositories/assignable-volunteers.inmemory.js";
import {
  fulfilledAssignment,
  leaAsAvailableVolunteer,
  missingOneHardAndOneBenevoleAssignment,
  missingOnePlaizirAssignment,
  missingTwoVieuxAssignment,
  noelAsAvailableVolunteer,
} from "./test-resources/assign-task-to-volunteer.test.utils.js";
import { HARD, VIEUX } from "../teams.js";
import { BENEVOLE_CODE } from "@overbookd/team";

describe("Assign task to volunteer", () => {
  const taskList = [
    fullyAssignedTask.value,
    missingOnePlaizirTask.value,
    missingTwoVieuxTask.value,
    missingOneHardAndOneBenevoleTask.value,
    missingOneAssigneeThenOneHardAndOneBenevoleTask.value,
    missingOnePlaizirOrTwoVieuxOnStaggeredAssignmentsTask.value,
    fulfillAssignmentThenMissingOneHardTask.value,
  ];
  const tasks = new InMemoryTasks(taskList);
  const volunteers = new InMemoryAssignableVolunteers([
    noelAsAvailableVolunteer.stored,
    leaAsAvailableVolunteer.stored,
  ]);
  const assign = new AssignTaskToVolunteer(tasks, volunteers);

  describe("when listing all assignable tasks", async () => {
    const assignableTasks = await assign.tasks();

    describe.each`
      taskName                                                      | taskId                                                      | expectedTeams
      ${missingOnePlaizirTask.value.name}                           | ${missingOnePlaizirTask.value.id}                           | ${["plaizir"]}
      ${missingTwoVieuxTask.value.name}                             | ${missingTwoVieuxTask.value.id}                             | ${[VIEUX]}
      ${missingOneHardAndOneBenevoleTask.value.name}                | ${missingOneHardAndOneBenevoleTask.value.id}                | ${[HARD, BENEVOLE_CODE]}
      ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.name} | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.id} | ${["plaizir", HARD, BENEVOLE_CODE]}
      ${fulfillAssignmentThenMissingOneHardTask.value.name}         | ${fulfillAssignmentThenMissingOneHardTask.value.id}         | ${[HARD]}
    `(
      "when listing missing assignment tasks with $taskName",
      ({ taskId, expectedTeams }) => {
        it("should contain task with missing teams", () => {
          const foundTask = assignableTasks.find((t) => t.id === taskId);
          expect(foundTask?.teams).toMatchObject(expectedTeams);
        });
      },
    );
    describe("when listing missing assignment tasks with fully assigned task", () => {
      it("should not contain task", () => {
        const foundTask = assignableTasks.find(
          (task) => task.id === fullyAssignedTask.value.id,
        );
        expect(foundTask).toBeUndefined();
      });
    });
  });

  describe("when listing all tasks", async () => {
    const allTasks = await assign.tasks(true);
    it("should return all tasks", () => {
      expect(allTasks).toHaveLength(taskList.length);
    });
  });

  describe("when selecting a task to assign", () => {
    describe.each`
      taskName                                                      | taskId                                                      | expectedAssignments
      ${fullyAssignedTask.value.name}                               | ${fullyAssignedTask.value.id}                               | ${fullyAssignedTask.assignments.map(({ summary }) => summary.assignment)}
      ${missingOnePlaizirTask.value.name}                           | ${missingOnePlaizirTask.value.id}                           | ${missingOnePlaizirTask.assignments.map(({ summary }) => summary.assignment)}
      ${missingTwoVieuxTask.value.name}                             | ${missingTwoVieuxTask.value.id}                             | ${missingTwoVieuxTask.assignments.map(({ summary }) => summary.assignment)}
      ${missingOneHardAndOneBenevoleTask.value.name}                | ${missingOneHardAndOneBenevoleTask.value.id}                | ${missingOneHardAndOneBenevoleTask.assignments.map(({ summary }) => summary.assignment)}
      ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.name} | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.id} | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.assignments.map(({ summary }) => summary.assignment)}
    `("when selecting task $taskName", ({ taskId, expectedAssignments }) => {
      it("should return the selected task with assignments summary", async () => {
        const selectedTask = await assign.selectTask(taskId);
        expect(selectedTask.assignments).toMatchObject(expectedAssignments);
      });
    });
  });

  describe("when selecting a task assignment", () => {
    describe.each`
      assignmentId                                                      | mobilizationId                                                      | taskId                                                           | teams                    | expectedVolunteers
      ${fulfilledAssignment.assignment.assignmentId}                    | ${fulfilledAssignment.assignment.mobilizationId}                    | ${fullyAssignedTask.task.id}                                     | ${[]}                    | ${[]}
      ${missingOnePlaizirAssignment.assignment.assignmentId}            | ${missingOnePlaizirAssignment.assignment.mobilizationId}            | ${missingOnePlaizirTask.task.id}                                 | ${["plaizir"]}           | ${[noelAsAvailableVolunteer.expected.BAR]}
      ${missingOneHardAndOneBenevoleAssignment.assignment.assignmentId} | ${missingOneHardAndOneBenevoleAssignment.assignment.mobilizationId} | ${missingOneHardAndOneBenevoleTask.task.id}                      | ${[HARD, BENEVOLE_CODE]} | ${[noelAsAvailableVolunteer.expected.STATIQUE, leaAsAvailableVolunteer.expected.STATIQUE]}
      ${missingTwoVieuxAssignment.assignment.assignmentId}              | ${missingTwoVieuxAssignment.assignment.mobilizationId}              | ${missingTwoVieuxTask.task.id}                                   | ${[VIEUX]}               | ${[leaAsAvailableVolunteer.expected.MANUTENTION]}
      ${missingOnePlaizirAssignment.assignment.assignmentId}            | ${missingOnePlaizirAssignment.assignment.mobilizationId}            | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.task.id}       | ${["plaizir"]}           | ${[noelAsAvailableVolunteer.expected.STATIQUE]}
      ${missingTwoVieuxDuring19hto20h.assignment.assignmentId}          | ${missingTwoVieuxDuring19hto20h.assignment.mobilizationId}          | ${missingOnePlaizirOrTwoVieuxOnStaggeredAssignmentsTask.task.id} | ${[VIEUX]}               | ${[leaAsAvailableVolunteer.expected.FUN]}
    `(
      "when looking for assignable $teams volunteers",
      ({ taskId, mobilizationId, assignmentId, expectedVolunteers }) => {
        let volunteers: AssignableVolunteer[];
        const assignmentIdentifier = { taskId, mobilizationId, assignmentId };
        beforeAll(async () => {
          volunteers = await assign.selectAssignment(assignmentIdentifier);
        });

        it("should return assignable volunteers only", () => {
          expect(volunteers).toHaveLength(expectedVolunteers.length);
        });
        it("should compute assignment duration", () => {
          const durations = extractDuration(volunteers);
          expect(durations).toEqual(extractDuration(expectedVolunteers));
        });
        it("should compute requested on same period", () => {
          const requestedOnSamePeriods = extractRequestOnSamePeriod(volunteers);
          expect(requestedOnSamePeriods).toEqual(
            extractRequestOnSamePeriod(expectedVolunteers),
          );
        });
        it("should provide all assignable volunteers", () => {
          expect(volunteers).toEqual(expectedVolunteers);
        });
      },
    );
  });
});

function extractDuration(volunteers: AssignableVolunteer[]): number[] {
  return volunteers.map(({ assignmentDuration }) => assignmentDuration);
}

function extractRequestOnSamePeriod(
  volunteers: AssignableVolunteer[],
): boolean[] {
  return volunteers.map(
    ({ isRequestedOnSamePeriod }) => isRequestedOnSamePeriod,
  );
}
