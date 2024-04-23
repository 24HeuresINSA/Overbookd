import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "./volunteer";
import { TaskCategorized } from "./task";

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

export function countAssigneesInTeam(
  team: string,
  assignees: Assignee[],
): number {
  return assignees.filter(isMemberOf(team)).length;
}

export type BaseAssigneeForDetails = {
  id: Volunteer["id"];
  firstname: Volunteer["firstname"];
  lastname: Volunteer["lastname"];
};

export type TeamMemberForDetails = BaseAssigneeForDetails & {
  teams: string[];
  as: string;
  friends: BaseAssigneeForDetails[];
};

export type NamelyDemandedForDetails = BaseAssigneeForDetails;

export type AssigneeForDetails =
  | TeamMemberForDetails
  | NamelyDemandedForDetails;

export type TeamDemanded = { team: string; demand: number };

export type AssignmentIdentifier = {
  taskId: number;
  mobilizationId: string;
  assignmentId: string;
};

type BaseAssignment = IProvidePeriod &
  AssignmentIdentifier & {
    name: string;
    demands: TeamDemanded[];
  };

type AssignmentWithoutDetails = BaseAssignment & {
  assignees: Assignee[];
};

export type AssignmentWithDetails = BaseAssignment & {
  appointment: string;
  assignees: AssigneeForDetails[];
};

const defaultAssignmentOption = { withDetails: false };

type AssignmentOption = {
  withDetails: boolean;
};

export type Assignment<
  Option extends AssignmentOption = typeof defaultAssignmentOption,
> = Option["withDetails"] extends true
  ? AssignmentWithDetails
  : AssignmentWithoutDetails;

export type AssignmentTeam = TeamDemanded & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriod &
  AssignmentIdentifier & {
    teams: AssignmentTeam[];
  };

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorized, "id"> & {
    hasFriendsAssigned: boolean;
  };
