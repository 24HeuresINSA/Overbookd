import { Categorize } from "@overbookd/festival-event";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";

export const IS_READY_AND_EXISTS = {
  isDeleted: false,
  status: READY_TO_ASSIGN,
} as const;

export const SELECT_TASK_WITH_ASSIGNMENTS = {
  id: true,
  name: true,
  topPriority: true,
  category: true,
  mobilizations: {
    select: {
      start: true,
      end: true,
      teams: { select: { teamCode: true, count: true } },
      assignees: { select: { teamCode: true } },
    },
  },
};

export type DatabaseFullTask = Categorize & {
  id: number;
  name: string;
  mobilizations: {
    start: Date;
    end: Date;
    teams: { teamCode: string; count: number }[];
    assignees: { teamCode: string }[];
  }[];
};
