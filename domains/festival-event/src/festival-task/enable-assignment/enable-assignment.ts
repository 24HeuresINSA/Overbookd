import {
  Categorize,
  FestivalTask,
  ReadyToAssign,
  isReadyToAssign,
} from "../festival-task";
import { READY_TO_ASSIGN } from "../../common/status";
import { Adherent } from "../../common/adherent";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  FestivalTaskTranslator,
  ReadyToAssignWithoutConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
  FestivalTaskNotValidated,
  ReadyToAssignError,
} from "../festival-task.error";

import { isValidated } from "../../festival-event";
import { ValidatedWithConflicts } from "../festival-task.factory";

export type FestivalTasksForEnableAssignment = {
  findById(
    id: FestivalTask["id"],
  ): Promise<WithoutConflicts | ReadyToAssignWithoutConflicts | null>;
  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts>;
};

export class EnableAssignment {
  constructor(
    private readonly festivalTasks: FestivalTasksForEnableAssignment,
    private readonly festivalTaskTranslator: FestivalTaskTranslator,
  ) {}

  async for(
    ftId: FestivalTask["id"],
    instigator: Adherent,
    categorize: Categorize,
  ) {
    const task = await this.festivalTasks.findById(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    if (isReadyToAssign(task)) {
      throw new FestivalTaskError(
        "La tache est deja en affectation, ce n'est pas normal",
      );
    }
    if (!isValidated(task)) throw new FestivalTaskNotValidated(ftId);

    const readyToAssign = ReadyToAssignFestivalTask.fromValidated(
      await this.festivalTaskTranslator.translate(task),
      instigator,
      categorize,
    );

    return this.festivalTasks.save(readyToAssign);
  }
}

class ReadyToAssignFestivalTask {
  static fromValidated(
    task: ValidatedWithConflicts,
    instigator: Adherent,
    categorize: Categorize,
  ): ReadyToAssign {
    if (ReadyToAssignFestivalTask.hasUnavailableVolunteerRequired(task)) {
      throw new ReadyToAssignError();
    }

    const history = [
      ...task.history,
      FestivalTaskKeyEvents.assignmentStarted(instigator),
    ];
    return { ...task, ...categorize, status: READY_TO_ASSIGN, history };
  }

  private static hasUnavailableVolunteerRequired(task: ValidatedWithConflicts) {
    return task.mobilizations.some(({ volunteers }) =>
      volunteers.some(({ conflicts }) => conflicts.availability),
    );
  }
}
