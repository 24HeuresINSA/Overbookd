import { Prisma } from '@prisma/client';

export type CompleteFtResponse = Prisma.FtGetPayload<{
  select: typeof COMPLETE_FT_SELECT;
}>;
export type LiteFtResponse = Prisma.FtGetPayload<{
  select: typeof LITE_FT_SELECT;
}>;

const TEAM_SELECT = {
  select: {
    id: true,
    name: true,
    code: true,
    color: true,
    icon: true,
  },
};

export const COMPLETE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  isStatic: true,
  description: true,
  location: {
    select: {
      id: true,
      name: true,
    },
  },
  isDeleted: true,
  feedbacks: {
    select: {
      id: true,
      comment: true,
      subject: true,
      authorId: true,
      createdAt: true,
      author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  },
  timeWindows: {
    select: {
      id: true,
      start: true,
      end: true,
      sliceTime: true,
      userRequests: {
        select: {
          userId: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      },
      teamRequests: {
        select: {
          number: true,
          team: TEAM_SELECT,
        },
      },
    },
  },
  reviews: {
    select: {
      status: true,
      team: TEAM_SELECT,
    },
  },
  team: TEAM_SELECT,
  userInCharge: {
    select: {
      firstname: true,
      lastname: true,
      id: true,
    },
  },
  fa: {
    select: {
      id: true,
      name: true,
      status: true,
    },
  },
};

export const LITE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  userInCharge: {
    select: {
      firstname: true,
      lastname: true,
    },
  },
  team: TEAM_SELECT,
  reviews: {
    select: {
      status: true,
      team: TEAM_SELECT,
    },
  },
};
