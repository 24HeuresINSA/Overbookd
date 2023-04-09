import { TaskCategory } from '@prisma/client';

export interface RequestedTeam {
  code: string;
  quantity: number;
  assignmentCount: number;
}
export interface DatabaseRequestedTeam {
  teamCode: string;
  quantity: number;
  _count: {
    assignments: number;
  };
}

type TimespanBase = {
  id: number;
  start: Date;
  end: Date;
};

export type AssignmentAsTeamMember = { teamRequest: { teamCode: string } };

export interface DatabaseTimespanWithAssignedTeamMembers extends TimespanBase {
  assignments: AssignmentAsTeamMember[];
}

export interface Timespan extends TimespanBase {
  requestedTeams: RequestedTeam[];
}

export interface DatabaseTimeWindow {
  teamRequests: DatabaseRequestedTeam[];
  timespans: DatabaseTimespanWithAssignedTeamMembers[];
}

export interface DatabaseTimespanWithFt {
  id: number;
  start: Date;
  end: Date;
  timeWindow: {
    ft: {
      id: number;
      name: string;
      hasPriority: boolean;
      category: TaskCategory;
    };
    _count: {
      timespans: number;
    };
    teamRequests: DatabaseRequestedTeam[];
  };
}

export interface DatabaseFtWithTimespans {
  id: number;
  name: string;
  hasPriority: boolean;
  category: TaskCategory;
  timeWindows: {
    timespans: {
      id: number;
      start: Date;
      end: Date;
    }[];
    _count: {
      timespans: number;
    };
    teamRequests: DatabaseRequestedTeam[];
  }[];
}

export interface SimplifiedFT {
  id: number;
  name: string;
  hasPriority: boolean;
  category: TaskCategory;
}

export type TimespanWithFt = Timespan & {
  ft: SimplifiedFT;
};

export type FtWithTimespan = SimplifiedFT & {
  timespans: Timespan[];
};

const COUNT_TIMESPANS = {
  _count: {
    select: {
      timespans: true,
    },
  },
};

const SELECT_TEAM_REQUEST = {
  select: {
    teamCode: true,
    quantity: true,
    _count: {
      select: {
        assignments: true,
      },
    },
  },
};

export const SELECT_TIMESPAN_WITH_FT = {
  id: true,
  start: true,
  end: true,
  timeWindow: {
    select: {
      ft: {
        select: {
          id: true,
          name: true,
          hasPriority: true,
          category: true,
        },
      },
      teamRequests: SELECT_TEAM_REQUEST,
      ...COUNT_TIMESPANS,
    },
  },
};

export const SELECT_FT_WITH_TIMESPANS = {
  id: true,
  name: true,
  hasPriority: true,
  category: true,
  timeWindows: {
    select: {
      timespans: {
        select: {
          id: true,
          start: true,
          end: true,
        },
      },
      ...COUNT_TIMESPANS,
      teamRequests: SELECT_TEAM_REQUEST,
    },
  },
};
