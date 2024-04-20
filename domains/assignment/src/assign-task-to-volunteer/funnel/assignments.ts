import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "./volunteer";

export type TeamDemanded = { team: string; count: number };

export type Assignee = { volunteer: Volunteer["id"]; as: string };
type AssignmentIdentifier = {
  taskId: number;
  mobilizationId: string;
  assignmentId: string;
};

export type Assignment = AssignmentIdentifier &
  IProvidePeriod & {
    name: string;
    demands: TeamDemanded[];
    assignees: Assignee[];
  };

export type VolunteersForAssignment = {
  assignment: AssignmentIdentifier;
  volunteers: Assignee[];
};

export type Assignments = {
  assign(volunteersForAssignment: VolunteersForAssignment): Promise<Assignment>;
};
