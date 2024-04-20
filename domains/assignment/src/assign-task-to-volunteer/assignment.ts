import { IProvidePeriod } from "@overbookd/period";

export type Assignee = {
  as: string;
};

export type RequestedTeam = {
  code: string;
  demands: number;
};

export type AssignmentIdentifier = {
  assignmentId: string;
  mobilizationId: string;
};

export type Assignment = IProvidePeriod & {
  identifier: AssignmentIdentifier;
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

export type AssignmentTeam = RequestedTeam & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriod & {
  identifier: AssignmentIdentifier;
  teams: AssignmentTeam[];
};
