import { describe, expect, it } from "vitest";
import {
  taskFullyAssigned,
  taskMissingOneAssignee,
  taskMissingTwoVieux,
  taskMissingOneHardAndOneBenevole,
  taskMissingOneAssigneeThenOneHardAndOneBenevole,
  expectedTaskMissingOneAssignee,
  expectedTaskMissingTwoVieux,
  expectedTaskMissingOneHardAndOneBenevole,
  expectedTaskMissingOneAssigneeThenOneHardAndOneBenevole,
} from "./assign-task-to-volunteer.test-utils";
import { InMemoryTasks } from "./tasks.inmemory";
import { AssignTaskToVolunteer } from "./assign-task-to-volunteer";

describe("Assign task to volunteer", () => {
  const tasks = new InMemoryTasks([
    taskFullyAssigned,
    taskMissingOneAssignee,
    taskMissingTwoVieux,
    taskMissingOneHardAndOneBenevole,
    taskMissingOneAssigneeThenOneHardAndOneBenevole,
  ]);
  const assign = new AssignTaskToVolunteer(tasks);

  describe("when listing all assignable tasks", async () => {
    const assignableTasks = await assign.tasks();

    describe.each`
      taskName                                                | taskId                                                | expectedTeams
      ${taskMissingOneAssignee.name}                          | ${taskMissingOneAssignee.id}                          | ${expectedTaskMissingOneAssignee.teams}
      ${taskMissingTwoVieux.name}                             | ${taskMissingTwoVieux.id}                             | ${expectedTaskMissingTwoVieux.teams}
      ${taskMissingOneHardAndOneBenevole.name}                | ${taskMissingOneHardAndOneBenevole.id}                | ${expectedTaskMissingOneHardAndOneBenevole.teams}
      ${taskMissingOneAssigneeThenOneHardAndOneBenevole.name} | ${taskMissingOneAssigneeThenOneHardAndOneBenevole.id} | ${expectedTaskMissingOneAssigneeThenOneHardAndOneBenevole.teams}
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
          (t) => t.id === taskFullyAssigned.id,
        );
        expect(foundTask).toBeUndefined();
      });
    });
  });
});
