import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import {
  Categorize,
  FestivalTask,
  ReadyToAssign,
  isReadyToAssign,
} from "../festival-task.js";
import { Adherent } from "../../common/adherent.js";
import { FestivalTaskKeyEvents } from "../festival-task.event.js";
import {
  FestivalTaskTranslator,
  ReadyToAssignWithConflicts,
  ReadyToAssignWithoutConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts.js";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
  FestivalTaskNotValidated,
  ReadyToAssignError,
} from "../festival-task.error.js";

import { isValidated } from "../../festival-event.js";
import { ValidatedWithConflicts } from "../festival-task.factory.js";
import {
  Assignment,
  ReviewableMobilization,
  VolunteerWithConflicts,
} from "../sections/mobilizations.js";
import { Item } from "@overbookd/list";
import { Period, Duration } from "@overbookd/period";

export type FestivalTasksForEnableAssignment = {
  findById(id: FestivalTask["id"]): Promise<WithoutConflicts | null>;
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
  ): Promise<ReadyToAssignWithConflicts> {
    const task = await this.festivalTasks.findById(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    if (isReadyToAssign(task)) {
      throw new FestivalTaskError(
        "La tâche est déjà en affectation, ce n'est pas normal",
      );
    }
    if (!isValidated(task)) throw new FestivalTaskNotValidated(ftId);

    const readyToAssign = ReadyToAssignFestivalTask.fromValidated(
      await this.festivalTaskTranslator.translate(task),
      instigator,
      categorize,
    );

    const stored = await this.festivalTasks.save(readyToAssign);
    return this.festivalTaskTranslator.translate(stored);
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

    const mobilizations = task.mobilizations.map((mobilization) =>
      Assignments.generate(mobilization),
    );

    return {
      ...task,
      ...categorize,
      status: READY_TO_ASSIGN,
      history,
      mobilizations,
    };
  }

  private static hasUnavailableVolunteerRequired(task: ValidatedWithConflicts) {
    return task.mobilizations.some(({ volunteers }) =>
      volunteers.some(({ conflicts }) => {
        const missingAvailability = conflicts.availability === true;
        const alreadyAssigned = conflicts.assignments.length > 0;
        return missingAvailability || alreadyAssigned;
      }),
    );
  }
}

export class Assignments {
  static generate(
    mobilization: Item<ValidatedWithConflicts["mobilizations"]>,
  ): Item<ReadyToAssignWithConflicts["mobilizations"]> {
    const assignmentPeriods = Assignments.generatePeriods(mobilization);

    const assignments: Assignment[] = assignmentPeriods.map((period) =>
      extractAssignment(mobilization, period),
    );
    return { ...mobilization, assignments };
  }

  private static generatePeriods(
    mobilization: ReviewableMobilization<
      { readonly withAssignments: false } & { withConflicts: true }
    >,
  ) {
    const mobilizationPeriod = Period.init(mobilization);
    if (mobilization.durationSplitInHour === null) return [mobilizationPeriod];

    return mobilizationPeriod.splitWithIntervalInMs(
      Duration.hours(mobilization.durationSplitInHour).inMilliseconds,
    );
  }
}

function extractAssignment(
  mobilization: Item<ValidatedWithConflicts["mobilizations"]>,
  period: Period,
): Assignment {
  return {
    start: period.start,
    end: period.end,
    id: period.id,
    assignees: mobilization.volunteers.map(extractVolunteerData),
  };
}

function extractVolunteerData(volunteer: VolunteerWithConflicts) {
  return {
    id: volunteer.id,
    lastname: volunteer.lastname,
    firstname: volunteer.firstname,
    nickname: volunteer.nickname,
  };
}
