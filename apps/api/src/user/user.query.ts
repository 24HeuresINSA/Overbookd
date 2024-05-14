import { Permission } from "@overbookd/permission";

export const SELECT_BASE_USER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

const SELECT_USER = {
  ...SELECT_BASE_USER,
  email: true,
  birthdate: true,
  phone: true,
  comment: true,
  profilePicture: true,
  charisma: true,
  note: true,
};

export const SELECT_USER_TEAMS = {
  teams: { select: { team: { select: { code: true } } } },
};

export const SELECT_USER_TEAMS_AND_PERMISSIONS = {
  teams: {
    select: {
      team: {
        select: {
          code: true,
          permissions: { select: { permissionName: true } },
        },
      },
    },
  },
};

const SELECT_USER_TASKS_COUNT = {
  _count: { select: { assigned: true } },
};

export const SELECT_MY_USER_INFORMATION = {
  ...SELECT_USER,
  ...SELECT_USER_TEAMS_AND_PERMISSIONS,
  ...SELECT_USER_TASKS_COUNT,
  balance: true,
};

export const SELECT_USER_PERSONAL_DATA = {
  ...SELECT_USER,
  ...SELECT_USER_TEAMS,
};

export const SELECT_USER_PERSONAL_DATA_WITH_NOTE = {
  ...SELECT_USER_PERSONAL_DATA,
  note: true,
};

export const SELECT_PERIOD_AND_CATEGORY = {
  start: true,
  end: true,
  festivalTask: { select: { category: true } },
};

export function hasPermission(permission: Permission) {
  return {
    teams: {
      some: {
        team: {
          permissions: { some: { permission: { name: permission } } },
        },
      },
    },
  };
}
