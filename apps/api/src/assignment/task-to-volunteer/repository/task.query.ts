import { Categorize } from "@overbookd/festival-event";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";
import { IS_NOT_DELETED } from "../../common/repository/common.query";

const NOT_READY_TO_ASSIGN = {
  status: { not: READY_TO_ASSIGN },
} as const;

export const EXISTS_AND_NOT_READY_TO_ASSIGN = {
  ...IS_NOT_DELETED,
  ...NOT_READY_TO_ASSIGN,
} as const;

export const IS_READY_AND_EXISTS = {
  ...IS_NOT_DELETED,
  status: READY_TO_ASSIGN,
} as const;

const SELECT_ASSIGNEE = { teamCode: true, userId: true };
const SELECT_ASSIGNMENT = {
  id: true,
  start: true,
  end: true,
  assignees: { select: SELECT_ASSIGNEE },
};
const SELECT_MOBILIZATION = {
  id: true,
  teams: { select: { teamCode: true, count: true } },
  assignments: { select: SELECT_ASSIGNMENT },
};

export const SELECT_TASK_WITH_ASSIGNMENTS = {
  id: true,
  name: true,
  topPriority: true,
  category: true,
  mobilizations: { select: SELECT_MOBILIZATION },
};

export type DatabaseTask = Categorize & {
  id: number;
  name: string;
  mobilizations: {
    id: string;
    teams: { teamCode: string; count: number }[];
    assignments: (IProvidePeriod & {
      id: string;
      assignees: { teamCode: string; userId: number }[];
    })[];
  }[];
};
