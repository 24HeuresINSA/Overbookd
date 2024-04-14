import { describe, expect, it } from "vitest";
import {
  fullyAssignedTask,
  missingOnePlaizirTask,
  missingTwoVieuxTask,
  missingOneHardAndOneBenevoleTask,
  missingOneAssigneeThenOneHardAndOneBenevoleTask,
} from "./task.fake";
import { InMemoryTasks } from "./tasks.inmemory";
import { AssignTaskToVolunteer } from "./assign-task-to-volunteer";

describe("Assign task to volunteer", () => {
  const tasks = new InMemoryTasks([
    fullyAssignedTask.value,
    missingOnePlaizirTask.value,
    missingTwoVieuxTask.value,
    missingOneHardAndOneBenevoleTask.value,
    missingOneAssigneeThenOneHardAndOneBenevoleTask.value,
  ]);
  const assign = new AssignTaskToVolunteer(tasks);

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
        expect(selectedTask.assignments.sort()).toEqual(
          expectedAssignments.sort(),
        );
      });
    });
  });

  describe("when selecting a task assignment", () => {
    it("should return assignable volunteers", async () => {
      const assignment = missingOnePlaizirTask.assignments.at(0);
      const volunteers = await assign.selectAssignment(
        missingOnePlaizirTask.value.id,
        assignment?.summary.assignment.id ?? "",
      );
      expect(volunteers).toEqual(assignment?.summary.assignableVolunteers);
    });
  });
});
