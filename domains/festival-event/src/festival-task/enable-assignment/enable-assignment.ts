import {
  ALL_TEAM_MEMBERS,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";
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
  Assignee,
  Assignment,
  ReviewableMobilization,
} from "../sections/mobilizations.js";
import { Item } from "@overbookd/list";
import { Period, Duration } from "@overbookd/time";
import { Volunteer } from "../sections/instructions.js";

export type FestivalTasksForEnableAssignment = {
  findById(id: FestivalTask["id"]): Promise<WithoutConflicts | null>;
  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts>;
};

export type VolunteersForEnableAssignment = {
  findByTeam(team: string): Promise<Volunteer[]>;
};

export class EnableAssignment {
  constructor(
    private readonly festivalTasks: FestivalTasksForEnableAssignment,
    private readonly festivalTaskTranslator: FestivalTaskTranslator,
    private readonly volunteers: VolunteersForEnableAssignment,
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

    const readyToAssignFestivalTask = new ReadyToAssignFestivalTask(
      this.volunteers,
    );
    const readyToAssign = await readyToAssignFestivalTask.fromValidated(
      await this.festivalTaskTranslator.translate(task),
      instigator,
      categorize,
    );

    const stored = await this.festivalTasks.save(readyToAssign);
    return this.festivalTaskTranslator.translate(stored);
  }
}

class ReadyToAssignFestivalTask {
  constructor(private readonly volunteers: VolunteersForEnableAssignment) {}

  async fromValidated(
    task: ValidatedWithConflicts,
    instigator: Adherent,
    categorize: Categorize,
  ): Promise<ReadyToAssign> {
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

    const teamAssignments = new TeamAssignments(this.volunteers);
    const mobilizationsWithTeamAssignments = await Promise.all(
      mobilizations.map((mobilization) =>
        teamAssignments.generate(mobilization),
      ),
    );

    return {
      ...task,
      ...categorize,
      status: READY_TO_ASSIGN,
      history,
      mobilizations: mobilizationsWithTeamAssignments,
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
      Assignments.extractAssignment(mobilization, period),
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

    return mobilizationPeriod.splitWithInterval(
      Duration.hours(mobilization.durationSplitInHour),
    );
  }

  private static extractAssignment(
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
}

export function extractVolunteerData(volunteer: Volunteer) {
  return {
    id: volunteer.id,
    lastName: volunteer.lastName,
    firstName: volunteer.firstName,
    nickname: volunteer.nickname,
  };
}

class TeamAssignments {
  constructor(private readonly volunteers: VolunteersForEnableAssignment) {}

  async generate(
    mobilization: Item<ReadyToAssignWithConflicts["mobilizations"]>,
  ): Promise<Item<ReadyToAssignWithConflicts["mobilizations"]>> {
    const teamAssignees = (
      await Promise.all(
        mobilization.teams
          .filter(({ count }) => count === ALL_TEAM_MEMBERS)
          .map(async ({ team }) => {
            const volunteers = await this.volunteers.findByTeam(team);
            return volunteers.map((volunteer): Assignee => ({
              ...volunteer,
              as: team,
            }));
          }),
      )
    ).flat();
    const assignments = mobilization.assignments.map((assignment) => ({
      ...assignment,
      assignees: this.mergeAssignees(assignment.assignees, teamAssignees),
    }));
    return { ...mobilization, assignments };
  }

  private mergeAssignees(
    baseAssignees: Assignee[],
    teamAssignees: Assignee[],
  ): Assignee[] {
    const allAssignees = [...baseAssignees, ...teamAssignees];
    const uniqueAssignees = allAssignees.reduce<Map<number, Assignee>>(
      (assignees, assignee) => {
        if (!assignees.has(assignee.id)) assignees.set(assignee.id, assignee);
        return assignees;
      },
      new Map(),
    );
    return [...uniqueAssignees.values()];
  }
}
