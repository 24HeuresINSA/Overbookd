import { beforeAll, describe, expect, it } from "vitest";
import { FestivalTaskNotFound } from "../festival-task.error";
import { ViewFestivalTask } from "./view";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PreviewDraft, PreviewFestivalTask } from "../festival-task";
import { installEscapeGame } from "../festival-task.test-util";
import { uninstallEscapeGame } from "../festival-task.test-util";

const installEscapeGamePreview: PreviewDraft = {
  id: installEscapeGame.id,
  status: installEscapeGame.status,
  name: installEscapeGame.general.name,
  administrator: installEscapeGame.general.administrator,
  team: installEscapeGame.general.team,
};

const uninstallEscapeGamePreview: PreviewDraft = {
  id: uninstallEscapeGame.id,
  status: uninstallEscapeGame.status,
  name: uninstallEscapeGame.general.name,
  administrator: uninstallEscapeGame.general.administrator,
  team: uninstallEscapeGame.general.team,
};

describe("View festival tasks", () => {
  let view: ViewFestivalTask;
  describe("View all tasks", () => {
    describe.each`
      nbTasks | tasks                                       | previews
      ${1}    | ${[installEscapeGame]}                      | ${[installEscapeGamePreview]}
      ${2}    | ${[installEscapeGame, uninstallEscapeGame]} | ${[installEscapeGamePreview, uninstallEscapeGamePreview]}
    `("when $nbTasks are known", ({ tasks, previews }) => {
      beforeAll(() => {
        const festivalTasks = new InMemoryFestivalTasks(tasks);
        view = new ViewFestivalTask(festivalTasks);
      });
      it("should expose all known tasks", async () => {
        const all = await view.all();
        expect(all).toHaveLength(tasks.length);
      });
      it("should generate preview for all tasks", async () => {
        const all = await view.all();
        previews.every((preview: PreviewFestivalTask) =>
          expect(all).toContainEqual(preview),
        );
      });
    });
  });
  describe("View one task", () => {
    describe.each`
      nbTasks | tasks                                       | existingTaskId            | expectedTask           | nonExistingId
      ${1}    | ${[installEscapeGame]}                      | ${installEscapeGame.id}   | ${installEscapeGame}   | ${uninstallEscapeGame.id}
      ${2}    | ${[installEscapeGame, uninstallEscapeGame]} | ${uninstallEscapeGame.id} | ${uninstallEscapeGame} | ${3}
    `(
      "with $nbTasks tasks known",
      ({ tasks, existingTaskId, expectedTask, nonExistingId }) => {
        beforeAll(() => {
          const festivalTasks = new InMemoryFestivalTasks(tasks);
          view = new ViewFestivalTask(festivalTasks);
        });
        describe("when looking for a known task", () => {
          it("should expose task detail", async () => {
            const task = await view.one(existingTaskId);
            expect(task).toStrictEqual(expectedTask);
          });
        });
        describe("when looking for an unknown task", () => {
          it("should indicate task not found", () => {
            expect(async () => await view.one(nonExistingId)).rejects.toThrow(
              FestivalTaskNotFound,
            );
          });
        });
      },
    );
  });
});