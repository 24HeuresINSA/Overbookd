import { Categorize } from "@overbookd/festival-event";
import { READY_TO_ASSIGN } from "@overbookd/status";

export const IS_READY_AND_EXISTS = {
  isDeleted: false,
  status: READY_TO_ASSIGN,
} as const;

export const HAS_TEAM_REQUESTS = {
  mobilizations: {
    some: { teams: { some: {} } },
  },
};

const SELECT_MOBLIZATION_ASSIGNMENT = {
  id: true,
  start: true,
  end: true,
};

const SELECT_MOBILIZATION_TEAM = {
  teamCode: true,
  count: true,
};

const COUNT_MOBILIZATION_ASSIGNMENTS = {
  _count: {
    select: {
      assignments: true,
    },
  },
};

const SELECT_MOBILIZATION = {
  id: true,
  assignments: {
    select: SELECT_MOBLIZATION_ASSIGNMENT,
  },
  teams: {
    select: SELECT_MOBILIZATION_TEAM,
  },
  ...COUNT_MOBILIZATION_ASSIGNMENTS,
};

export const SELECT_TASK_WITH_PERIODS = {
  id: true,
  name: true,
  topPriority: true,
  category: true,
  mobilizations: {
    select: SELECT_MOBILIZATION,
  },
};

export type DatabaseTaskWithPeriods = Categorize & {
  id: number;
  name: string;
  mobilizations: {
    id: string;
    assignments: {
      id: string;
      start: Date;
      end: Date;
    }[];
    teams: {
      teamCode: string;
      count: number;
    }[];
    _count: { assignments: number };
  }[];
};
