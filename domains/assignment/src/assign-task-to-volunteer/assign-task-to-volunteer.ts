import { Category } from "@overbookd/festival-event-constants";
import { Period } from "@overbookd/period";
import { FormatVolunteer } from "../volunteer";
import {
  StoredAssignableVolunteer,
  AssignableVolunteer,
} from "./assignable-volunteer";
import { Assignment, AssignmentIdentifier } from "./assignment";
import {
  Task,
  TaskIdentifier,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "./task";
import { countAssigneesInTeam } from "../count-assignees-in-team";

export type Tasks = {
  findAll(): Promise<Task[]>;
  findOne(id: TaskIdentifier["id"]): Promise<Task>;
};

export type AssignmentSpecification = {
  period: Period;
  oneOfTheTeams: string[];
  category?: Category;
};

export type AssignableVolunteers = {
  on(
    assignmentIdentifier: AssignmentIdentifier,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]>;
};

export class AssignTaskToVolunteer {
  constructor(
    private readonly allTasks: Tasks,
    private readonly assignableVolunteers: AssignableVolunteers,
  ) {}

  async tasks(all: boolean = false): Promise<MissingAssignmentTask[]> {
    const tasks = await this.allTasks.findAll();

    const withMissingTeams = tasks.map((task) =>
      this.computeMissingAssignmentTeams(task),
    );
    return withMissingTeams
      .filter((task) => all || task.teams.length > 0)
      .map(({ teams, ...task }) => ({
        ...task,
        teams: removeDuplicates(teams),
      }));
  }

  async selectTask(
    taskId: TaskIdentifier["id"],
  ): Promise<TaskWithAssignmentsSummary> {
    const task = await this.allTasks.findOne(taskId);
    return this.computeAssignmentsSummary(task);
  }

  async selectAssignment(
    assignmentIdentifier: AssignmentIdentifier,
  ): Promise<AssignableVolunteer[]> {
    const task = await this.allTasks.findOne(assignmentIdentifier.taskId);

    const assignment = task.assignments.find(
      ({ assignmentId, mobilizationId }) =>
        assignmentId === assignmentIdentifier.assignmentId &&
        mobilizationId === assignmentIdentifier.mobilizationId,
    );

    if (!assignment) throw new Error("Assignment not found");

    const assignmentSpecification = {
      period: Period.init(assignment),
      oneOfTheTeams: this.filterMissingTeamMembers(assignment),
      category: task.category,
    };
    const volunteers = await this.assignableVolunteers.on(
      assignmentIdentifier,
      assignmentSpecification,
    );

    return volunteers.map(({ assignments, requestedDuring, ...volunteer }) => {
      const assignmentDuration = FormatVolunteer.computeAssignmentDuration(
        assignments.map((period) => Period.init(period)),
      );
      const isRequestedOnSamePeriod = requestedDuring.some((period) =>
        period.isOverlapping(Period.init(assignment)),
      );
      return { ...volunteer, assignmentDuration, isRequestedOnSamePeriod };
    });
  }

  private computeMissingAssignmentTeams(task: Task): MissingAssignmentTask {
    const missingTeamMembers = task.assignments.reduce(
      (teams: string[], assignment) => {
        const missingTeamMembers = this.filterMissingTeamMembers(assignment);
        return [...teams, ...missingTeamMembers];
      },
      [],
    );

    return {
      id: task.id,
      name: task.name,
      topPriority: task.topPriority,
      category: task.category,
      inChargeTeam: task.inChargeTeam,
      teams: Array.from(new Set(missingTeamMembers)),
    };
  }

  private filterMissingTeamMembers({
    demands,
    assignees,
  }: Pick<Assignment, "demands" | "assignees">): string[] {
    return demands
      .filter(({ team, demand: demands }) => {
        const countAssignees = countAssigneesInTeam(team, assignees);
        return countAssignees < demands;
      })
      .map(({ team }) => team);
  }

  private computeAssignmentsSummary(task: Task): TaskWithAssignmentsSummary {
    const assignments = task.assignments.map((assignment) => {
      const period = Period.init(assignment);
      const { taskId, mobilizationId, assignmentId } = assignment;
      return {
        start: period.start,
        end: period.end,
        taskId,
        mobilizationId,
        assignmentId,
        teams: assignment.demands.map(({ team, demand }) => ({
          team,
          demand,
          assigned: countAssigneesInTeam(team, assignment.assignees),
        })),
      };
    });

    return {
      id: task.id,
      name: task.name,
      category: task.category,
      assignments,
    };
  }
}

function removeDuplicates(teams: string[]): string[] {
  return Array.from(new Set(teams));
}
