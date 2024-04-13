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
    fullyAssignedTask,
    missingOnePlaizirTask,
    missingTwoVieuxTask,
    missingOneHardAndOneBenevoleTask,
    missingOneAssigneeThenOneHardAndOneBenevoleTask,
  ]);
  const assign = new AssignTaskToVolunteer(tasks);

  describe("when listing all assignable tasks", async () => {
    const assignableTasks = await assign.tasks();

    describe.each`
      taskName                                                | taskId                                                | expectedTeams
      ${missingOnePlaizirTask.name}                           | ${missingOnePlaizirTask.id}                           | ${["plaizir"]}
      ${missingTwoVieuxTask.name}                             | ${missingTwoVieuxTask.id}                             | ${["vieux"]}
      ${missingOneHardAndOneBenevoleTask.name}                | ${missingOneHardAndOneBenevoleTask.id}                | ${["hard", "benevole"]}
      ${missingOneAssigneeThenOneHardAndOneBenevoleTask.name} | ${missingOneAssigneeThenOneHardAndOneBenevoleTask.id} | ${["plaizir", "hard", "benevole"]}
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
          (task) => task.id === fullyAssignedTask.id,
        );
        expect(foundTask).toBeUndefined();
      });
    });
  });
});
