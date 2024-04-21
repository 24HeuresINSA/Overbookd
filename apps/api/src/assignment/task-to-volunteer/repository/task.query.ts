import { Categorize } from "@overbookd/festival-event";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";
import { IS_NOT_DELETED } from "../../common/repository/common.query";

export const IS_READY_AND_EXISTS = {
  ...IS_NOT_DELETED,
  status: READY_TO_ASSIGN,
} as const;

export const SELECT_TASK_WITH_ASSIGNMENTS = {
  id: true,
  name: true,
  topPriority: true,
  category: true,
  mobilizations: {
    select: {
      id: true,
      teams: { select: { teamCode: true, count: true } },
      assignees: { select: { teamCode: true, userId: true } },
      assignments: { select: { id: true, start: true, end: true } },
    },
  },
};

export type DatabaseTask = Categorize & {
  id: number;
  name: string;
  mobilizations: {
    id: string;
    teams: { teamCode: string; count: number }[];
    assignees: { teamCode: string; userId: number }[];
    assignments: (IProvidePeriod & { id: string })[];
  }[];
};
