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

export type BaseTask = {
  id: number;
  name: string;
  topPriority: boolean;
  category?: Category;
};

export type TaskWithAssignments = BaseTask & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = BaseTask & {
  teams: string[];
};

export type Tasks = {
  findAll(): Promise<TaskWithAssignments[]>;
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

  private computeMissingAssignmentTeams(
    task: TaskWithAssignments,
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
