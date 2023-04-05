import { FtTimespan, TaskCategory } from '@prisma/client';

export interface TeamRequestForStats {
  teamCode: string;
  quantity: number;
}
export interface DatabaseRequestedTeam extends TeamRequestForStats {
  _count: {
    assignments: number;
  };
}

export type FtTimespanForStats = Pick<FtTimespan, 'id' | 'start' | 'end'>;

export interface FtTimespanWithStats extends FtTimespanForStats {
  assignments: { teamRequest: { teamCode: string } }[];
}

export interface FtTimespanWithAggregatedStats extends FtTimespanForStats {
  teamRequest: { assignmentCount: number; code: string; quantity: number };
}

export interface TimeWindowWithStats {
  teamRequests: TeamRequestForStats[];
  timespans: FtTimespanWithStats[];
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
    teamRequests: DatabaseRequestedTeam[];
  }[];
}

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
      teamRequests: SELECT_TEAM_REQUEST,
    },
  },
};
