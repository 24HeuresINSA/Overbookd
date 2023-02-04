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

const MINIMAL_FA_SELECT = {
  select: {
    id: true,
    name: true,
    status: true,
  },
};

const DISPLAY_USER_WITH_ID_SELECT = {
  select: {
    firstname: true,
    lastname: true,
    id: true,
  },
};

const FEEDBACK_SELECT = {
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
};

const REVIEWS_SELECT = {
  select: {
    status: true,
    team: TEAM_SELECT,
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
  feedbacks: FEEDBACK_SELECT,
  timeWindows: {
    select: {
      id: true,
      start: true,
      end: true,
      sliceTime: true,
      userRequests: {
        select: {
          user: DISPLAY_USER_WITH_ID_SELECT,
        },
      },
      teamRequests: {
        select: {
          quantity: true,
          team: TEAM_SELECT,
        },
      },
    },
  },
  reviews: REVIEWS_SELECT,
  team: TEAM_SELECT,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  fa: MINIMAL_FA_SELECT,
};

export const LITE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  team: TEAM_SELECT,
  fa: MINIMAL_FA_SELECT,
  reviews: REVIEWS_SELECT,
};
