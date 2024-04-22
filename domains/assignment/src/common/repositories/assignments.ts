import { Assignment, AssignmentIdentifier, TeamMember } from "../../assign-task-to-volunteer/assignment";

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: TeamMember[];
};

export type Assignments = {
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
  unassign(assignment: AssignmentIdentifier, assigneeId: number): Promise<void>;
};
