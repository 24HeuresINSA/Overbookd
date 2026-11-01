import { Assignment, AssignmentIdentifier, TeamMember } from "../assignment.js";

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: TeamMember[];
};

export type Assignments = {
  findOne(identifier: AssignmentIdentifier): Promise<Assignment>;
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
  unassign(assignment: AssignmentIdentifier, assigneeId: number): Promise<void>;
};
