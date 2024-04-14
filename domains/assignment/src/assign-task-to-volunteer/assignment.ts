import { IProvidePeriod } from "@overbookd/period";

export type Assignee = {
  as: string;
};

export type RequestedTeam = {
  code: string;
  demands: number;
};

type IProvidePeriodWithId = IProvidePeriod & {
  id: string;
};

export type Assignment = IProvidePeriodWithId & {
  requestedTeams: RequestedTeam[];
  assignees: Assignee[];
};

export type AssignmentTeam = RequestedTeam & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriodWithId & {
  teams: AssignmentTeam[];
};
