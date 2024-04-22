import {
  Assignee,
  AssignmentIdentifier,
  isTeamMember,
} from "@overbookd/assignment";
import { SELECT_PERIOD } from "./period.query";

export type DatabaseAssignment = {
  start: Date;
  end: Date;
  festivalTask: {
    name: string;
    appointment: { name: string };
  };
  assignees: {
    teamCode: string;
    personalData: {
      id: number;
      firstname: string;
      lastname: string;
    };
  }[];
  mobilization: {
    teams: { teamCode: string; count: number }[];
  };
};

export const SELECT_ASSIGNMENT = {
  ...SELECT_PERIOD,
  festivalTask: {
    select: {
      name: true,
      appointment: { select: { name: true } },
    },
  },
  assignees: {
    select: {
      teamCode: true,
      personalData: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  },
  mobilization: {
    select: {
      teams: {
        select: { teamCode: true, count: true },
      },
    },
  },
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
