import { Category } from "@overbookd/festival-event-constants";

type Assignee = {
  as: string;
};
type RequestedTeam = {
  code: string;
  count: number;
};
export type Assignment = {
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

export type BaseAssignmentTask = {
  id: number;
  name: string;
  topPriority: boolean;
  category?: Category;
};

export type AssignmentTask = BaseAssignmentTask & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = BaseAssignmentTask & {
  teams: string[];
};

export type AssignedTasks = {
  findAll(): Promise<AssignmentTask[]>;
};

export class MissingAssignmentTasks {
  constructor(private readonly assignedTasks: AssignedTasks) {}

  async list(): Promise<MissingAssignmentTask[]> {
    const assignments = await this.assignedTasks.findAll();
    const withTeams = assignments.map((task) =>
      this.computeMissingAssignmentTeams(task),
    );
    return withTeams.filter((task) => task.teams.length > 0);
  }

  private computeMissingAssignmentTeams(
    task: AssignmentTask,
  ): MissingAssignmentTask {
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
