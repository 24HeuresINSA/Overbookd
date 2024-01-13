import { beforeAll, describe, expect, it } from "vitest";
import { Draft, FestivalTask } from "../festival-task";
import { escapeGame, noel } from "../festival-task.test-util";
import { FestivalTaskKeyEvents } from "../festival-task.event";

const installEscapeGame: FestivalTask = {
  id: 1,
  status: "DRAFT",
  general: {
    name: "Install Escape Game",
    administrator: noel,
    team: null,
  },
  festivalActivity: escapeGame,
  instructions: {
    appointment: null,
    contacts: [],
    global: null,
    inCharge: {
      adherents: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  volunteerInquiries: [],
  gearInquiries: [],
};

type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

type PreviewFestivalTask = PreviewDraft;

const installEscapeGamePreview: PreviewDraft = {
  id: installEscapeGame.id,
  status: installEscapeGame.status,
  name: installEscapeGame.general.name,
  administrator: installEscapeGame.general.administrator,
  team: installEscapeGame.general.team,
};

const uninstallEscapeGame: FestivalTask = {
  id: 2,
  status: "DRAFT",
  general: {
    name: "Uninstall Escape Game",
    administrator: noel,
    team: null,
  },
  festivalActivity: escapeGame,
  instructions: {
    appointment: null,
    contacts: [],
    global: null,
    inCharge: {
      adherents: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  volunteerInquiries: [],
  gearInquiries: [],
};

const uninstallEscapeGamePreview: PreviewDraft = {
  id: uninstallEscapeGame.id,
  status: uninstallEscapeGame.status,
  name: uninstallEscapeGame.general.name,
  administrator: uninstallEscapeGame.general.administrator,
  team: uninstallEscapeGame.general.team,
};

type FestivalTasksForView = {
  all(): Promise<PreviewFestivalTask[]>;
  one(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
};

class FestivalTaskBuilder {
  private constructor(private readonly task: FestivalTask) {}
  static build(task: FestivalTask) {
    return new FestivalTaskBuilder(task);
  }

  get overview(): FestivalTask {
    return this.task;
  }

  get preview(): PreviewFestivalTask {
    const { id, status, general } = this.task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}

class InMemoryFestivalTasks implements FestivalTasksForView {
  constructor(private readonly tasks: FestivalTask[]) {}

  one(ftId: number): Promise<FestivalTask | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  all(): Promise<PreviewFestivalTask[]> {
    return Promise.resolve(
      this.tasks.map((task) => FestivalTaskBuilder.build(task).preview),
    );
  }
}

class FestivalTaskNotFound extends Error {
  constructor(ftId: FestivalTask["id"]) {
    const message = `La fiche tache #${ftId} n'a pas été trouvé`;
    super(message);
  }
}

class ViewFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForView) {}

  all(): Promise<PreviewFestivalTask[]> {
    return this.festivalTasks.all();
  }

  async one(ftId: FestivalTask["id"]): Promise<FestivalTask> {
    const task = await this.festivalTasks.one(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    return task;
  }
}

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
