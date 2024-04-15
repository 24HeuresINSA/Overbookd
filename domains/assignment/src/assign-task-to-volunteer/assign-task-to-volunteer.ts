import { Period } from "@overbookd/period";
import { IProvidePeriod } from "@overbookd/period";
import { FormatVolunteer } from "../volunteer";
import {
  StoredAssignableVolunteer,
  AssignableVolunteer,
} from "./assignable-volunteer";
import { AssignmentSummary, Assignment, Assignee } from "./assignment";
import {
  Task,
  TaskIdentifier,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "./task";
import { Category } from "@overbookd/festival-event-constants";

export type Tasks = {
  findAll(): Promise<Task[]>;
  findOne(id: TaskIdentifier["id"]): Promise<Task>;
};

export type AssignableVolunteers = {
  on(
    period: IProvidePeriod,
    oneOfTheTeams: string[],
    category?: Category,
  ): Promise<StoredAssignableVolunteer[]>;
};

export class AssignTaskToVolunteer {
  constructor(
    private readonly allTasks: Tasks,
    private readonly assignableVolunteers: AssignableVolunteers,
  ) {}

  async tasks(): Promise<MissingAssignmentTask[]> {
    const tasks = await this.allTasks.findAll();
    const withMissingTeams = tasks.map((task) =>
      this.computeMissingAssignmentTeams(task),
    );
    return withMissingTeams
      .filter((task) => task.teams.length > 0)
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
    taskId: TaskIdentifier["id"],
    assignmentId: AssignmentSummary["id"],
  ): Promise<AssignableVolunteer[]> {
    const task = await this.allTasks.findOne(taskId);

    const assignment = task.assignments.find(
      (assignment) => assignment.id === assignmentId,
    );
    if (!assignment) throw new Error("Assignment not found");

    const volunteers = await this.assignableVolunteers.on(
      assignment,
      this.filterMissingTeamMembers(assignment),
      task.category,
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
    const requestedTeams = task.assignments.flatMap((assignment) =>
      assignment.requestedTeams.map((team) => team),
    );
    const assignees = task.assignments.flatMap((assignment) =>
      assignment.assignees.map((assignee) => assignee),
    );
    const teams = this.filterMissingTeamMembers({ requestedTeams, assignees });

    return {
      id: task.id,
      name: task.name,
      topPriority: task.topPriority,
      category: task.category,
      teams,
    };
  }

  private filterMissingTeamMembers({
    requestedTeams,
    assignees,
  }: Pick<Assignment, "requestedTeams" | "assignees">): string[] {
    return requestedTeams
      .filter((team) => {
        const countAssignees = this.countAssigneesInTeam(team.code, assignees);
        return countAssignees < team.demands;
      })
      .map((team) => team.code);
  }

  private computeAssignmentsSummary(task: Task): TaskWithAssignmentsSummary {
    const assignments = task.assignments.map((assignment) => {
      const period = Period.init(assignment);
      return {
        start: period.start,
        end: period.end,
        id: period.id,
        teams: assignment.requestedTeams.map((team) => ({
          code: team.code,
          demands: team.demands,
          assigned: this.countAssigneesInTeam(team.code, assignment.assignees),
        })),
      };
    });

    return {
      id: task.id,
      name: task.name,
      assignments,
    };
  }

  private countAssigneesInTeam(team: string, assignees: Assignee[]): number {
    return assignees.filter((assignee) => assignee.as === team).length;
  }
}

function removeDuplicates(teams: string[]): string[] {
  return Array.from(new Set(teams));
}
