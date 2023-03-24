import { TaskCategory } from '@prisma/client';

export interface TimespanWithFtAfterRequest {
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
    teamRequests: {
      team: {
        code: string;
      };
    }[];
  };
}

export interface FtWithTimespansAfterRequest {
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
    teamRequests: {
      team: {
        code: string;
      };
    }[];
  }[];
}

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
      teamRequests: {
        select: {
          team: {
            select: {
              code: true,
            },
          },
        },
      },
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
      teamRequests: {
        select: {
          team: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  },
};
