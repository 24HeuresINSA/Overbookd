import {
  Assignee,
  AssignmentIdentifier,
  BaseAssigneeForDetails,
  isTeamMember,
} from "@overbookd/assignment";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { IProvidePeriod } from "@overbookd/period";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../../../common/query/user.query";
import { User } from "@overbookd/user";

export type DatabaseAssignee = {
  teamCode: string;
  personalData: User & {
    comment?: string;
    note?: string;
    teams: { teamCode: string }[];
    friends: { requestor: BaseAssigneeForDetails }[];
    friendRequestors: { friend: BaseAssigneeForDetails }[];
    assigned: { assignment: IProvidePeriod }[];
  };
};

export type DatabaseAssignment = IProvidePeriod & {
  festivalTask: {
    name: string;
    appointment: { name: string };
  };
  assignees: DatabaseAssignee[];
  mobilization: {
    teams: { teamCode: string; count: number }[];
  };
};

const SELECT_ASSIGNEE_PERSONAL_DATA = {
  ...SELECT_USER_IDENTIFIER,
  ...SELECT_TEAMS_CODE,
  comment: true,
  note: true,
  friends: { select: { requestor: { select: SELECT_USER_IDENTIFIER } } },
  friendRequestors: {
    select: { friend: { select: SELECT_USER_IDENTIFIER } },
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
