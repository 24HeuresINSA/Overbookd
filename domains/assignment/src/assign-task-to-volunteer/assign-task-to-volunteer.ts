import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";

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
  teams: AssignmentTeam[];
};

export type TaskIdentifier = {
  id: number;
  name: string;
};

type BaseTask = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
};

export type TaskWithAssignmentsSummary = TaskIdentifier & {
  assignments: AssignmentSummary[];
};

export type FullTask = BaseTask & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = BaseTask & {
  teams: string[];
};

export type Tasks = {
  findAll(): Promise<FullTask[]>;
  findOne(id: TaskIdentifier["id"]): Promise<FullTask>;
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

  private computeMissingAssignmentTeams(task: FullTask): MissingAssignmentTask {
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

  private computeAssignmentsSummary(
    task: FullTask,
  ): TaskWithAssignmentsSummary {
    const assignments = task.assignments.map((assignment) => ({
      start: assignment.start,
      end: assignment.end,
      teams: assignment.requestedTeams.map((team) => ({
        code: team.code,
        demands: team.demands,
        assigned: this.countAssigneesInTeam(team.code, assignment.assignees),
      })),
    }));

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
