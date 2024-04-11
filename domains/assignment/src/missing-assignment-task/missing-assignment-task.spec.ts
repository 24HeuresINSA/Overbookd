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
} from "./missing-assignment-task.test-utils";
import { InMemoryAssignedTasks } from "./assigned-tasks.inmemory";
import { MissingAssignmentTasks } from "./missing-assignment-task";

describe("List missing assignment tasks", async () => {
  const tasks = [
    taskFullyAssigned,
    taskMissingOneAssignee,
    taskMissingTwoVieux,
    taskMissingOneHardAndOneBenevole,
    taskMissingOneAssigneeThenOneHardAndOneBenevole,
  ];
  const assignedTasks = new InMemoryAssignedTasks(tasks);
  const missing = new MissingAssignmentTasks(assignedTasks);
  const missingTasks = await missing.list();

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
        const foundTask = missingTasks.find((t) => t.id === taskId);
        expect(foundTask?.teams.sort()).toEqual(expectedTeams.sort());
      });
    },
  );
  describe("when listing missing assignment tasks with fully assigned task", () => {
    it("should not contain task", () => {
      const foundTask = missingTasks.find((t) => t.id === taskFullyAssigned.id);
      expect(foundTask).toBeUndefined();
    });
  });
});
