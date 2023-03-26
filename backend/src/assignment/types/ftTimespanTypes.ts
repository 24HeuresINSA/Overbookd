import { TaskCategory } from '@prisma/client';

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
    teamRequests: {
      teamCode: string;
      quantity: number;
    }[];
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
    teamRequests: {
      teamCode: string;
      quantity: number;
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
          teamCode: true,
          quantity: true,
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
          teamCode: true,
          quantity: true,
        },
      },
    },
  },
};
