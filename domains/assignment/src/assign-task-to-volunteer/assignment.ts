import { IProvidePeriod } from "@overbookd/period";

export type Assignee = {
  as: string;
};

export type RequestedTeam = {
  code: string;
  demands: number;
};

export type AssignmentIdentifier = IProvidePeriod & {
  id: string;
  mobilizationId: string;
};

export type Assignment = AssignmentIdentifier & {
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

export type AssignmentTeam = RequestedTeam & {
  assigned: number;
};

export type AssignmentSummary = AssignmentIdentifier & {
  teams: AssignmentTeam[];
};
