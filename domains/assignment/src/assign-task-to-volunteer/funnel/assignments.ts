import { Assignment, AssignmentIdentifier, TeamMember } from "../assignment";

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: TeamMember[];
};

export type Assignments = {
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
};
