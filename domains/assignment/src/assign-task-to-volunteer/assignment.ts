import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "../volunteer";

export type Assignee = {
  id: Volunteer["id"];
  as: string;
};

export type TeamDemanded = { team: string; demand: number };

export type AssignmentIdentifier = {
  taskId: number;
  mobilizationId: string;
  assignmentId: string;
};

export type Assignment = IProvidePeriod &
  AssignmentIdentifier & {
    name: string;
    demands: TeamDemanded[];
    assignees: Assignee[];
  };

export type AssignmentTeam = TeamDemanded & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriod &
  AssignmentIdentifier & {
    teams: AssignmentTeam[];
  };
