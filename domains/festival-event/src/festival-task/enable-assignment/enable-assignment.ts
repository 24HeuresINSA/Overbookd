import {
  Categorize,
  FestivalTask,
  ReadyToAssign,
  Validated,
} from "../festival-task";
import { READY_TO_ASSIGN } from "../../common/status";
import { Adherent } from "../../common/adherent";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  ReadyToAssignWithoutConflicts,
  ValidatedWithoutConflicts,
} from "../volunteer-conflicts";
import { FestivalTaskNotValidated } from "../festival-task.error";

export type FestivalTasksForEnableAssignment = {
  findById(id: FestivalTask["id"]): Promise<ValidatedWithoutConflicts | null>;
  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts>;
};

export class EnableAssignment {
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
