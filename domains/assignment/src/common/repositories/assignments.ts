import { Period } from "@overbookd/period";
import { Assignment, AssignmentIdentifier, TeamMember } from "../assignment";

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: TeamMember[];
};

export type Assignments = {
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
  unassign(assignment: AssignmentIdentifier, assigneeId: number): Promise<void>;
  findAssignableFor(
    volunteerAssignments: Period[],
    oneOfTheTeams: string[],
  ): Promise<Assignment[]>;
};
