import { beforeEach, describe, expect, it } from "vitest";
import { RemoveFestivalTask } from "./remove";
import { InMemoryFestivalTasksForRemoval } from "./festival-tasks-for-removal.inmemory";
import {
  DRAFT,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import {
  barCashier,
  guardJustDance,
  installEscapeGame,
  parcoursCollageTrajetA,
  serveWaterOnJustDance,
  uninstallBarbecue,
} from "../festival-task.fake";
import { RemoveReadyToAssignError } from "../festival-task.error";

const initTasks = [
  installEscapeGame,
  guardJustDance,
  serveWaterOnJustDance,
  uninstallBarbecue,
  barCashier,
  parcoursCollageTrajetA,
];

describe("Remove Festival Task", () => {
  let remove: RemoveFestivalTask;
  let festivalTasks: InMemoryFestivalTasksForRemoval;
  beforeEach(() => {
    festivalTasks = new InMemoryFestivalTasksForRemoval(initTasks);
    remove = new RemoveFestivalTask(festivalTasks);
  });

  describe.each`
    status       | task
    ${DRAFT}     | ${installEscapeGame}
    ${IN_REVIEW} | ${guardJustDance}
    ${REFUSED}   | ${uninstallBarbecue}
    ${VALIDATED} | ${barCashier}
  `("when removing existing task with status $status", ({ task }) => {
    it("should remove the task", async () => {
      await remove.apply(task.id);
      const tasks = await festivalTasks.all;
      expect(tasks).not.toContainEqual(task);
    });
  });

  describe(`when removing existing task with status ${READY_TO_ASSIGN}`, () => {
    it("should indicate that the task is not removable", async () => {
      await expect(remove.apply(parcoursCollageTrajetA.id)).rejects.toThrow(
        RemoveReadyToAssignError,
      );
    });
  });

  describe("when removing unexisting task", () => {
    it("should do nothing", async () => {
      await remove.apply(1000);
      const tasks = await festivalTasks.all;
      expect(tasks).toBe(initTasks);
    });
  });
});
