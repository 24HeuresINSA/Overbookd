import { Period } from "@overbookd/time";
import { FormatVolunteer } from "../volunteer.js";
import {
  StoredAssignableVolunteer,
  AssignableVolunteer,
} from "./assignable-volunteer.js";
import { Assignment, AssignmentIdentifier } from "./assignment.js";
import {
  Task,
  TaskIdentifier,
  TaskForAssignment,
  TaskWithAssignmentsSummary,
} from "./task.js";
import { countAssigneesInTeam } from "../count-assignees-in-team.js";

export type Tasks = {
  findAll(): Promise<Task[]>;
  findOne(id: TaskIdentifier["id"]): Promise<Task>;
};

export type AssignmentSpecification = {
  period: Period;
  oneOfTheTeams: string[];
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

  async assignableTasks(): Promise<TaskForAssignment[]> {
    const tasks = await this.allTasks.findAll();
    return tasks
      .map((task) => this.computeMissingAssignmentTeams(task))
      .filter((task) => task.teams.length > 0);
  }

  async allTasksForAssignment(): Promise<TaskForAssignment[]> {
    const tasks = await this.allTasks.findAll();
    return tasks.map((task) => this.computeAssignmentTeams(task));
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
    };
    const volunteers = await this.assignableVolunteers.on(
      assignmentIdentifier,
      assignmentSpecification,
    );

    return volunteers.map(({ assignments, requestedDuring, ...volunteer }) => {
      const totalAssignmentDuration = FormatVolunteer.computeAssignmentDuration(
        assignments.map((period) => Period.init(period)),
      );
      const assignmentDuration = FormatVolunteer.computeAssignmentDuration(
        assignments
          .filter(({ category }) => category === task.category)
          .map((period) => Period.init(period)),
      );
      const isRequestedOnSamePeriod = requestedDuring.some((period) =>
        period.isOverlapping(Period.init(assignment)),
      );
      return {
        ...volunteer,
        totalAssignmentDuration,
        assignmentDuration,
        isRequestedOnSamePeriod,
      };
    });
  }

  private computeMissingAssignmentTeams(task: Task): TaskForAssignment {
    const missingTeamMembers = new Set<string>();
    task.assignments.forEach((assignment) => {
      this.filterMissingTeamMembers(assignment).forEach((team) =>
        missingTeamMembers.add(team),
      );
    });

    return {
      id: task.id,
      name: task.name,
      topPriority: task.topPriority,
      category: task.category,
      inChargeTeam: task.inChargeTeam,
      teams: Array.from(missingTeamMembers),
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

  private computeAssignmentTeams(task: Task): TaskForAssignment {
    const teams = new Set<string>();
    task.assignments.forEach((assignment) => {
      assignment.demands.forEach(({ team }) => teams.add(team));
    });

    return {
      id: task.id,
      name: task.name,
      topPriority: task.topPriority,
      category: task.category,
      inChargeTeam: task.inChargeTeam,
      teams: Array.from(teams),
    };
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
