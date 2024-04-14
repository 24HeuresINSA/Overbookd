import { beforeAll, describe, expect, it } from "vitest";
import {
  fullyAssignedTask,
  missingOnePlaizirTask,
  missingTwoVieuxTask,
  missingOneHardAndOneBenevoleTask,
  missingOneAssigneeThenOneHardAndOneBenevoleTask,
} from "./test-ressources/task.fake";
import { InMemoryTasks } from "./repositories/tasks.inmemory";
import { AssignTaskToVolunteer } from "./assign-task-to-volunteer";
import { AssignableVolunteer } from "./assignable-volunteer";
import { InMemoryAssignableVolunteers } from "./repositories/assignable-volunteers.inmemory";
import {
  leaAsAvailableVolunteer,
  noelAsAvailableVolunteer,
} from "./test-ressources/assign-task-to-volunteer.test.utils";

describe("Assign task to volunteer", () => {
  const tasks = new InMemoryTasks([
    fullyAssignedTask.value,
    missingOnePlaizirTask.value,
    missingTwoVieuxTask.value,
    missingOneHardAndOneBenevoleTask.value,
    missingOneAssigneeThenOneHardAndOneBenevoleTask.value,
  ]);
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
      ${missingTwoVieuxTask.value.name}                             | ${missingTwoVieuxTask.value.id}                             | ${["vieux"]}
      ${missingOneHardAndOneBenevoleTask.value.name}                | ${missingOneHardAndOneBenevoleTask.value.id}                | ${["hard", "benevole"]}
      ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.name} | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.value.id} | ${["plaizir", "hard", "benevole"]}
    `(
      "when listing missing assignment tasks with $taskName",
      ({ taskId, expectedTeams }) => {
        it("should contain task with missing teams", () => {
          const foundTask = assignableTasks.find((t) => t.id === taskId);
          expect(foundTask?.teams.sort()).toEqual(expectedTeams.sort());
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
      task                                | teams                   | expectedVolunteers
      ${fullyAssignedTask}                | ${[]}                   | ${[]}
      ${missingOnePlaizirTask}            | ${["plaizir"]}          | ${[noelAsAvailableVolunteer.expected.BAR]}
      ${missingOneHardAndOneBenevoleTask} | ${["hard", "benevole"]} | ${[noelAsAvailableVolunteer.expected.STATIQUE, leaAsAvailableVolunteer.expected.STATIQUE]}
      ${missingTwoVieuxTask}              | ${["vieux"]}            | ${[leaAsAvailableVolunteer.expected.MANUTENTION]}
    `(
      "when looking for assignable $teams volunteers",
      ({ task, expectedVolunteers }) => {
        let volunteers: AssignableVolunteer[];
        beforeAll(async () => {
          const assignment = task.assignments.at(0);
          volunteers = await assign.selectAssignment(
            task.value.id,
            assignment?.summary.assignment.id ?? "",
          );
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

function extractDuration(volunteers: AssignableVolunteer[]) {
  return volunteers.map(({ assignmentDuration }) => assignmentDuration);
}

function extractRequestOnSamePeriod(volunteers: AssignableVolunteer[]) {
  return volunteers.map(
    ({ isRequestedOnSamePeriod }) => isRequestedOnSamePeriod,
  );
}
