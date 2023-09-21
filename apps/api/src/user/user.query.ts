import { ftStatuses } from "../ft/ft.model";

const SELECT_USER = {
  email: true,
  firstname: true,
  lastname: true,
  nickname: true,
  id: true,
  birthdate: true,
  phone: true,
  comment: true,
  profilePicture: true,
  charisma: true,
  balance: true,
};

export const SELECT_USER_TEAMS = {
  teams: {
    select: {
      team: {
        select: {
          code: true,
        },
      },
    },
  },
};

export const SELECT_USER_TEAMS_AND_PERMISSIONS = {
  teams: {
    select: {
      team: {
        select: {
          code: true,
          permissions: {
            select: {
              permissionName: true,
            },
          },
        },
      },
    },
  },
};

const SELECT_USER_TASKS_COUNT = {
  _count: {
    select: {
      assignments: true,
    },
  },
};

export const SELECT_MY_USER_INFORMATION = {
  ...SELECT_USER,
  ...SELECT_USER_TEAMS_AND_PERMISSIONS,
  ...SELECT_USER_TASKS_COUNT,
};

export const SELECT_USER_PERSONNAL_DATA = {
  ...SELECT_USER,
  ...SELECT_USER_TEAMS,
};

export const SELECT_USERNAME_WITH_ID = {
  id: true,
  firstname: true,
  lastname: true,
};

export const SELECT_FT_USER_REQUESTS_BY_USER_ID = {
  ftTimeWindows: {
    select: {
      start: true,
      end: true,
      ft: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  },
};

export const SELECT_VOLUNTEER_ASSIGNMENTS = {
  timeSpan: {
    select: {
      start: true,
      end: true,
      timeWindow: {
        select: {
          ft: { select: { name: true, id: true, status: true } },
        },
      },
    },
  },
  timeSpanId: true,
};

export const ACTIVE_NOT_ASSIGNED_FT_CONDITION = {
  ft: { isDeleted: false, NOT: { status: ftStatuses.READY } },
};

export const SELECT_TIMESPAN_PERIOD_WITH_CATEGORY = {
  timeSpan: {
    select: {
      start: true,
      end: true,
      timeWindow: {
        select: {
          ft: {
            select: {
              category: true,
            },
          },
        },
      },
    },
  },
};
