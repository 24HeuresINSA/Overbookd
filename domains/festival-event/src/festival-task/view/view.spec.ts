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
};

class InMemoryFestivalTasks implements FestivalTasksForView {
  constructor(private readonly tasks: FestivalTask[]) {}

  all(): Promise<PreviewFestivalTask[]> {
    return Promise.resolve(
      this.tasks.map(
        ({ id, status, general: { name, administrator, team } }) => ({
          id,
          status,
          name,
          administrator,
          team,
        }),
      ),
    );
  }
}

class ViewFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForView) {}

  all(): Promise<PreviewFestivalTask[]> {
    return this.festivalTasks.all();
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
});
