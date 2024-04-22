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

export type SimpleAssigneeForDetails = {
  id: Volunteer["id"];
  firstname: Volunteer["firstname"];
  lastname: Volunteer["lastname"];
};

export type AssigneeForDetailsAs = SimpleAssigneeForDetails & {
  teams: string[];
  as: string;
  friends: SimpleAssigneeForDetails[];
};

type AssigneeForDetails = AssigneeForDetailsAs | SimpleAssigneeForDetails;

export type TeamDemanded = { team: string; demand: number };

export type AssignmentIdentifier = {
  taskId: number;
  mobilizationId: string;
  assignmentId: string;
};

type AssignmentWithoutDetails = IProvidePeriod &
  AssignmentIdentifier & {
    name: string;
    demands: TeamDemanded[];
    assignees: Assignee[];
  };

type AssignmentWithDetails = AssignmentWithoutDetails & {
  appointment: string;
  assignees: AssigneeForDetails[];
};

const defaultAssignmentOption = { withDetails: false };

export type Assignment<
  Option extends { withDetails: boolean } = typeof defaultAssignmentOption,
> = Option extends {
  withDetails: true;
}
  ? AssignmentWithDetails
  : AssignmentWithoutDetails;

export type AssignmentTeam = TeamDemanded & {
  assigned: number;
};

export type AssignmentSummary = IProvidePeriod &
  AssignmentIdentifier & {
    teams: AssignmentTeam[];
  };
