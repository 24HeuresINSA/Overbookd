import { Period } from "@overbookd/period";

export type Assignee = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  comment?: string;
  teams: string[];
};

type WithAssignments = {
  assignments: Period[];
};

type WithAssignmentDuration = {
  assignmentDuration: number;
};

export type AssigneeWithAssignments = Assignee & WithAssignments;

export type AssigneeWithAssignmentDuration = Assignee & WithAssignmentDuration;

export type Assignees = {
  findAll(): Promise<AssigneeWithAssignments[]>;
};

export class AssignmentDurationAssignee {
  constructor(private assignees: Assignees) {}

  async list(): Promise<AssigneeWithAssignmentDuration[]> {
    const assignees = await this.assignees.findAll();
    return assignees.map((assignee) =>
      this.computeAssignmentDuration(assignee),
    );
  }

  private computeAssignmentDuration(
    assignee: AssigneeWithAssignments,
  ): AssigneeWithAssignmentDuration {
    const assignmentDuration = assignee.assignments.reduce(
      (acc, assignment) => acc + assignment.duration.inMilliseconds,
      0,
    );
    return {
      id: assignee.id,
      firstname: assignee.firstname,
      lastname: assignee.lastname,
      charisma: assignee.charisma,
      comment: assignee.comment,
      teams: assignee.teams,
      assignmentDuration,
    };
  }
}
