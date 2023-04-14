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
  assignments: AssignmentAsTeamMember[];
}

type AssignedAsTeamMember = AssignmentAsTeamMember & {
  assignee: {
    id: number;
  };
};

export type DatabaseTimespanWithFtAndAssignees = Omit<
  DatabaseTimespanWithFt,
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

export type DatabaseAssignee = Assignee & DatabaseWithFriends<Assignee>;

export type DatabaseAssigneeWithTeams = DatabaseAssignee & {
  team: {
    team: {
      code: string;
    };
  }[];
};

export type DatabaseAssignmentsAsTeamMember = {
  teamRequest: {
    teamCode: string;
  };
  assignee: DatabaseAssigneeWithTeams;
};

export type DatabaseTimespanWithAssignees = TimespanBase & {
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

export type TimespanWithFt = Timespan & {
  ft: SimplifiedFT;
};

export type AvailableTimespan = TimespanWithFt & {
  hasFriendsAssigned: boolean;
};

export type TimespanWithFtAndAssignees = TimespanWithFt & {
  assignees: number[];
};

export type FtWithTimespan = SimplifiedFT & {
  timespans: Timespan[];
};

export type Assignee = {
  id: number;
  firstname: string;
  lastname: string;
};

export type AssigneeWithTeams = Assignee & {
  teams: string[];
};

export type TimespanAssignee = Assignee & {
  teams: string[];
  assignedTeam: string;
  friends: Assignee[];
};

export type FtWithLocation = {
  id: number;
  name: string;
  location: string;
};

export type TimespanWithAssignees = Timespan & {
  ft: FtWithLocation;
  requiredVolunteers: Assignee[];
  assignees: TimespanAssignee[];
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
      timespans: {
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
