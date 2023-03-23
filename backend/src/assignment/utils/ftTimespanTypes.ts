import { TaskCategory } from '@prisma/client';

export interface FtTimespanAfterRequest {
  id: number;
  start: Date;
  end: Date;
  hasPriority: boolean;
  category: TaskCategory;
  timeWindows: {
    ft: {
      id: number;
      name: string;
    };
    teamRequests: {
      team: {
        code: string;
      };
    }[];
  };
}

export const SELECT_FT_TIMESPAN = {
  id: true,
  start: true,
  end: true,
  hasPriority: true,
  category: true,
  timeWindows: {
    select: {
      ft: {
        select: {
          id: true,
          name: true,
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
