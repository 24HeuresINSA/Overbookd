import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "../volunteer";

type NamelyDemanded = { id: Volunteer["id"] };
export type TeamMember = { id: Volunteer["id"]; as: string };
export type Assignee = NamelyDemanded | TeamMember;

export function isTeamMember(assignee: Assignee): assignee is TeamMember {
  return Object.hasOwn(assignee, "as");
}

export function isMemberOf(team: string): (value: Assignee) => boolean {
  return (assignee) => {
    if (!isTeamMember(assignee)) return false;
    return assignee.as === team;
  };
}

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
