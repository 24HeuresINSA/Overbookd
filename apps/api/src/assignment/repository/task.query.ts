import { Categorize } from "@overbookd/festival-event";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";

export const IS_READY_AND_EXISTS = {
  isDeleted: false,
  status: READY_TO_ASSIGN,
} as const;

export const HAS_TEAM_REQUESTS = {
  mobilizations: {
    some: { teams: {} },
  },
};

export const SELECT_TASK_WITH_TEAMS = {
  id: true,
  name: true,
  topPriority: true,
  category: true,
  mobilizations: {
    select: {
      teams: { select: { teamCode: true } },
    },
  },
};

export type DatabaseTaskWithRequestedTeams = Categorize & {
  id: number;
  name: string;
  mobilizations: {
    teams: { teamCode: string }[];
  }[];
};
