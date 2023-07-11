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

export type TimeSpanBase = {
  id: number;
  start: Date;
  end: Date;
};

export type AssignmentAsTeamMember = { teamRequest: { teamCode: string } };

export interface DatabaseTimeSpanWithAssignedTeamMembers extends TimeSpanBase {
  assignments: AssignmentAsTeamMember[];
}

export interface TimeSpan extends TimeSpanBase {
  requestedTeams: RequestedTeam[];
}

export interface DatabaseTimeWindow {
  teamRequests: DatabaseRequestedTeam[];
  timeSpans: DatabaseTimeSpanWithAssignedTeamMembers[];
}

export interface DatabaseTimeSpanWithFt {
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
      timeSpans: number;
    };
    teamRequests: DatabaseRequestedTeam[];
  };
  assignments: AssignmentAsTeamMember[];
}

type AssignedAsTeamMember = AssignmentAsTeamMember & {
  assignee: {
    id: number;
  };
};

export type DatabaseTimeSpanWithFtAndAssignees = Omit<
  DatabaseTimeSpanWithFt,
  'assignments'
> & {
  assignments: AssignedAsTeamMember[];
};

type DatabaseWithFriends<T extends { id: number }> = {
  friends: {
    requestor: T;
  }[];
  friendRequestors: {
    friend: T;
  }[];
};

export type DataBaseAssignee = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
};

export type WithTeams = {
  team: {
    team: {
      code: string;
    };
  }[];
};

export type DatabaseAssigneeWithFriends = DataBaseAssignee &
  DatabaseWithFriends<DataBaseAssignee & WithTeams>;

type DatabaseAssigneeWithTeams = DatabaseAssigneeWithFriends & WithTeams;

export type DatabaseAssignmentsAsTeamMember = {
  teamRequest: {
    teamCode: string;
  };
  assignee: DatabaseAssigneeWithTeams;
};

export type DatabaseTimeSpanWithAssignees = TimeSpanBase & {
  assignments: DatabaseAssignmentsAsTeamMember[];
  timeWindow: {
    teamRequests: DatabaseRequestedTeam[];
    ft: {
      id: number;
      name: string;
      location: {
        name: string;
      };
    };
  };
};

export interface DatabaseFtWithTimeSpans {
  id: number;
  name: string;
  hasPriority: boolean;
  category: TaskCategory;
  timeWindows: {
    timeSpans: {
      id: number;
      start: Date;
      end: Date;
      assignments: AssignmentAsTeamMember[];
    }[];
    teamRequests: DatabaseRequestedTeam[];
  }[];
}

export interface SimplifiedFT {
  id: number;
  name: string;
  hasPriority: boolean;
  category: TaskCategory;
}

export type TimeSpanWithFt = TimeSpan & {
  ft: SimplifiedFT;
};

export type AvailableTimeSpan = TimeSpanWithFt & {
  hasFriendsAssigned: boolean;
};

export type TimeSpanWithFtAndAssignees = TimeSpanWithFt & {
  assignees: number[];
};

export type FtWithTimeSpan = SimplifiedFT & {
  timeSpans: TimeSpan[];
};

export type Assignee = DataBaseAssignee & {
  teams: string[];
};

export type TimeSpanAssignee = Assignee & {
  assignedTeam: string;
  friends: Assignee[];
};

export type FtWithLocation = {
  id: number;
  name: string;
  location: string;
};

export type TimeSpanWithAssignees = TimeSpan & {
  ft: FtWithLocation;
  requiredVolunteers: Assignee[];
  assignees: TimeSpanAssignee[];
};

const COUNT_TIMESPANS = {
  _count: {
    select: {
      timeSpans: true,
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

const SELECT_TEAM_REQUEST_CODE = {
  teamRequest: {
    select: {
      teamCode: true,
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
  assignments: {
    select: SELECT_TEAM_REQUEST_CODE,
    where: { NOT: { teamRequestId: null } },
  },
};

export const SELECT_TIMESPAN_WITH_FT_AND_ASSIGNMENTS = {
  ...SELECT_TIMESPAN_WITH_FT,
  assignments: {
    select: {
      assignee: {
        select: {
          id: true,
        },
      },
      ...SELECT_TEAM_REQUEST_CODE,
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
      timeSpans: {
        select: {
          id: true,
          start: true,
          end: true,
          assignments: {
            select: SELECT_TEAM_REQUEST_CODE,
            where: { NOT: { teamRequestId: null } },
          },
        },
      },
      ...COUNT_TIMESPANS,
      teamRequests: SELECT_TEAM_REQUEST,
    },
  },
};
