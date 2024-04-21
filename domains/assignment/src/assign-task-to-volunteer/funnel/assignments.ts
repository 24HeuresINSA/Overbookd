import { Assignee, Assignment, AssignmentIdentifier } from "../assignment";

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: Assignee[];
};

export type Assignments = {
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
};
