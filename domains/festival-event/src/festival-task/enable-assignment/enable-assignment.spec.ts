import { beforeEach, describe, expect, it } from "vitest";
import { guardPS1, guardPS2 } from "../festival-task.fake";
import {
  Categorize,
  FestivalTask,
  ReadyToAssign,
  STATIQUE,
  Validated,
} from "../festival-task";
import { READY_TO_ASSIGN } from "../../common/status";
import { ASSIGNMENT_STARTED } from "../../common/action";
import { noel } from "../festival-task.test-util";
import { Adherent } from "../../common/adherent";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  ReadyToAssignWithoutConflicts,
  ValidatedWithoutConflicts,
} from "../volunteer-conflicts";
import {
  FestivalTaskNotFound,
  FestivalTaskNotValidated,
} from "../festival-task.error";
import { isValidated } from "../../festival-event";
import { updateItemToList } from "@overbookd/list";

type FestivalTasksForEnableAssignment = {
  findById(id: FestivalTask["id"]): Promise<ValidatedWithoutConflicts | null>;
  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts>;
};

class EnableAssignment {
  constructor(
    private readonly festivalTasks: FestivalTasksForEnableAssignment,
  ) {}

  async for(
    ftId: FestivalTask["id"],
    instigator: Adherent,
    categorize: Categorize,
  ) {
    const task = await this.festivalTasks.findById(ftId);
    if (!task) throw new FestivalTaskNotValidated(ftId);

    const readyToAssign = ReadyToAssignFestivalTask.fromValidated(
      task,
      instigator,
      categorize,
    );

    return this.festivalTasks.save(readyToAssign);
  }
}

class InMemoryFestivalTasksForEnableAssignment
  implements FestivalTasksForEnableAssignment
{
  constructor(private tasks: FestivalTask[]) {}
  findById(id: FestivalTask["id"]): Promise<ValidatedWithoutConflicts | null> {
    const task = this.tasks.find(
      (task): task is ValidatedWithoutConflicts =>
        task.id === id && isValidated<FestivalTask>(task),
    );
    return Promise.resolve(task ?? null);
  }

  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) throw new FestivalTaskNotFound(task.id);

    this.tasks = updateItemToList(this.tasks, index, task);
    return Promise.resolve(task);
  }

  get entries(): FestivalTask[] {
    return this.tasks;
  }
}

class ReadyToAssignFestivalTask {
  static fromValidated(
    task: Validated,
    instigator: Adherent,
    categorize: Categorize,
  ): ReadyToAssign {
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.assignmentStarted(instigator),
    ];
    return { ...task, ...categorize, status: READY_TO_ASSIGN, history };
  }
}

describe("Enable assignment", () => {
  let festivalTasks: InMemoryFestivalTasksForEnableAssignment;
  let enableAssignment: EnableAssignment;
  beforeEach(() => {
    festivalTasks = new InMemoryFestivalTasksForEnableAssignment([
      guardPS1,
      guardPS2,
    ]);
    enableAssignment = new EnableAssignment(festivalTasks);
  });
  describe.each`
    task        | instigator | categorize
    ${guardPS1} | ${noel}    | ${{ category: STATIQUE, topPriority: true }}
    ${guardPS2} | ${noel}    | ${{ category: STATIQUE, topPriority: true }}
  `(
    "when enabling assignment for validated festival task",
    ({ task, instigator, categorize }) => {
      it(`should switch status to ${READY_TO_ASSIGN}`, async () => {
        const { status } = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(status).toBe(READY_TO_ASSIGN);
      });
      it("should keep festival task sections", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.general).toEqual(task.general);
        expect(readyToAssign.festivalActivity).toEqual(task.festivalActivity);
        expect(readyToAssign.instructions).toEqual(task.instructions);
        expect(readyToAssign.mobilizations).toEqual(task.mobilizations);
        expect(readyToAssign.inquiries).toEqual(task.inquiries);
      });
      it(`should add ${ASSIGNMENT_STARTED} key event to history`, async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.history).toStrictEqual([
          ...task.history,
          {
            action: ASSIGNMENT_STARTED,
            by: instigator,
            at: expect.any(Date),
            description: "Affectation activée pour la FT",
          },
        ]);
      });
      it("should add task category and priority", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(readyToAssign.topPriority).toBe(categorize.topPriority);
        expect(readyToAssign.category).toBe(categorize.category);
      });
      it("should be stored in task repository", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(festivalTasks.entries).toContainEqual(readyToAssign);
      });
    },
  );
});
