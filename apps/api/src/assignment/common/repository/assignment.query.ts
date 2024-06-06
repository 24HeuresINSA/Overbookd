import {
  Assignee,
  AssignmentIdentifier,
  BaseAssigneeForDetails,
  isTeamMember,
} from "@overbookd/assignment";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { IProvidePeriod } from "@overbookd/period";

export type DatabaseAssignee = {
  teamCode: string;
  personalData: {
    id: number;
    firstname: string;
    lastname: string;
    comment?: string;
    note?: string;
    teams: { teamCode: string }[];
    friends: { requestor: BaseAssigneeForDetails }[];
    friendRequestors: { friend: BaseAssigneeForDetails }[];
    assigned: { assignment: IProvidePeriod }[];
  };
};

export type DatabaseAssignment = {
  start: Date;
  end: Date;
  festivalTask: {
    name: string;
    appointment: { name: string };
  };
  assignees: DatabaseAssignee[];
  mobilization: {
    teams: { teamCode: string; count: number }[];
  };
};

const SELECT_FRIEND_PERSONAL_DATA = {
  id: true,
  lastname: true,
  firstname: true,
};

const SELECT_ASSIGNEE_PERSONAL_DATA = {
  id: true,
  firstname: true,
  lastname: true,
  comment: true,
  note: true,
  teams: { select: { teamCode: true } },
  friends: { select: { requestor: { select: SELECT_FRIEND_PERSONAL_DATA } } },
  friendRequestors: {
    select: { friend: { select: SELECT_FRIEND_PERSONAL_DATA } },
  },
  assigned: { select: { assignment: { select: SELECT_PERIOD } } },
};

const SELECT_ASSIGNEE = {
  teamCode: true,
  personalData: { select: SELECT_ASSIGNEE_PERSONAL_DATA },
};

const SELECT_TEAM_DEMANDS = { teamCode: true, count: true };

const SELECT_TASK = {
  id: true,
  name: true,
  appointment: { select: { name: true } },
};

const SELECT_MOBILIZATION = {
  id: true,
  teams: { select: SELECT_TEAM_DEMANDS },
};

export const SELECT_ASSIGNMENT = {
  ...SELECT_PERIOD,
  id: true,
  festivalTask: { select: SELECT_TASK },
  assignees: { select: SELECT_ASSIGNEE },
  mobilization: { select: SELECT_MOBILIZATION },
};

export function uniqueAssignment(identifier: AssignmentIdentifier) {
  const { taskId, mobilizationId, assignmentId } = identifier;
  return {
    id_mobilizationId_festivalTaskId: {
      festivalTaskId: taskId,
      mobilizationId,
      id: assignmentId,
    },
  };
}

export function updateAssigneesOnAssignment(
  volunteers: Assignee[],
  { assignmentId, mobilizationId, taskId }: AssignmentIdentifier,
) {
  return volunteers.filter(isTeamMember).map(({ id, as }) => ({
    where: {
      userId_assignmentId_mobilizationId_festivalTaskId: {
        assignmentId,
        mobilizationId,
        festivalTaskId: taskId,
        userId: id,
      },
    },
    update: { teamCode: as },
    create: { userId: id, teamCode: as },
  }));
}
