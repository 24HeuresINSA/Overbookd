import { Prisma } from '@prisma/client';

export type CompleteFtResponse = Prisma.FtGetPayload<{
  select: typeof COMPLETE_FT_SELECT;
}>;
export type LiteFtResponse = Prisma.FtGetPayload<{
  select: typeof LITE_FT_SELECT;
}>;

export const COMPLETE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  parentFaId: true,
  isStatic: true,
  description: true,
  userInChargeId: true,
  locationId: true,
  isDeleted: true,
  comments: {
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
          teamCode: true,
          number: true,
          team: {
            select: {
              name: true,
              color: true,
              icon: true,
            },
          },
        },
      },
    },
  },
  reviews: {
    select: {
      teamCode: true,
      status: true,
      team: {
        select: {
          name: true,
        },
      },
    },
  },
};

export const LITE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  parentFaId: true,
  userInCharge: {
    select: {
      firstname: true,
      lastname: true,
    },
  },
  reviews: {
    select: {
      teamCode: true,
      status: true,
      team: {
        select: {
          name: true,
        },
      },
    },
  },
};
