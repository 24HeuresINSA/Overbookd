import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";

export type Assignee = {
  as: string;
};
export type RequestedTeam = {
  code: string;
  count: number;
};
export type Assignment = IProvidePeriod & {
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

type TaskIdentifier = {
  id: number;
  name: string;
};
export type BaseTask = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
};

export type FullTask = BaseTask & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = BaseTask & {
  teams: string[];
};

export type Tasks = {
  findAll(): Promise<FullTask[]>;
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
        return countAssignees < team.count;
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

  private countAssigneesInTeam(team: string, assignees: Assignee[]): number {
    return assignees.filter((assignee) => assignee.as === team).length;
  }
}
