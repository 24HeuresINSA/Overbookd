import { Category } from "@overbookd/festival-event-constants";
import { Period } from "@overbookd/period";
import { IProvidePeriod } from "@overbookd/period";
import { missingOnePlaizirTask } from "./task.fake";

export type Assignee = {
  as: string;
};

export type RequestedTeam = {
  code: string;
  demands: number;
};

export type Assignment = IProvidePeriod & {
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

export type AssignmentTeam = RequestedTeam & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriod & {
  id: string;
  teams: AssignmentTeam[];
};

export type TaskIdentifier = {
  id: number;
  name: string;
};

type TaskCategorized = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
};

export type TaskWithAssignmentsSummary = TaskIdentifier & {
  assignments: AssignmentSummary[];
};

export type Task = TaskCategorized & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = TaskCategorized & {
  teams: string[];
};

export type AssignableVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  charisma: number;
  comment?: string;
  note?: string;
  teams: string[];
  assignmentDuration: number;
  isRequestedOnSamePeriod: boolean;
  hasFriendAvailable: boolean;
  hasFriendAssigned: boolean;
};

export type Tasks = {
  findAll(): Promise<Task[]>;
  findOne(id: TaskIdentifier["id"]): Promise<Task>;
};

export class AssignTaskToVolunteer {
  constructor(private readonly allTasks: Tasks) {}

  async tasks(): Promise<MissingAssignmentTask[]> {
    const tasks = await this.allTasks.findAll();
    const withMissingTeams = tasks.map((task) =>
      this.computeMissingAssignmentTeams(task),
    );
    return withMissingTeams.filter((task) => task.teams.length > 0);
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
    return (
      missingOnePlaizirTask.assignments.at(0)?.summary.assignableVolunteers ??
      []
    );
  }

  private computeMissingAssignmentTeams(task: Task): MissingAssignmentTask {
    const requestedTeams = task.assignments.flatMap((assignment) =>
      assignment.requestedTeams.map((team) => team),
    );
    const assignees = task.assignments.flatMap((assignment) =>
      assignment.assignees.map((assignee) => assignee),
    );
    const teams = requestedTeams
      .filter((team) => {
        const countAssignees = this.countAssigneesInTeam(team.code, assignees);
        return countAssignees < team.demands;
      })
      .map((team) => team.code);

    return {
      id: task.id,
      name: task.name,
      topPriority: task.topPriority,
      category: task.category,
      teams,
    };
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
