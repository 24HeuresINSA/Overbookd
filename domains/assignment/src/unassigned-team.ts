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
export type Task = {
  assignments: Assignment[];
};

export class DeductUnassignedTeams {
  static fromTask(task: Task): string[] {
    return DeductUnassignedTeams.fromAssignments(task.assignments);
  }

  private static fromAssignments(assignments: Assignment[]): string[] {
    const requestedTeams = assignments.flatMap((assignment) =>
      assignment.requestedTeams.map((team) => team),
    );
    const assignees = assignments.flatMap((assignment) =>
      assignment.assignees.map((assignee) => assignee),
    );
    return requestedTeams
      .filter((team) => {
        const countAssignees = DeductUnassignedTeams.countAssigneesInTeam(
          team.code,
          assignees,
        );
        return countAssignees < team.count;
      })
      .map((team) => team.code);
  }

  private static countAssigneesInTeam(
    team: string,
    assignees: Assignee[],
  ): number {
    return assignees.filter((assignee) => assignee.as === team).length;
  }
}
