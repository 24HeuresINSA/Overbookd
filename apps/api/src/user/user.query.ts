import { Permission } from "@overbookd/permission";
import { SELECT_PERIOD } from "../common/query/period.query";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../common/query/transaction.query";
import { SELECT_USER_IDENTIFIER } from "../common/query/user.query";
import { SELECT_USER_DATA_FOR_CHARISMA } from "../common/query/charisma.query";
import { Edition } from "@overbookd/time";

const SELECT_USER = {
  ...SELECT_USER_IDENTIFIER,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  email: true,
  birthdate: true,
  phone: true,
  comment: true,
  profilePicture: true,
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

const SELECT_CURRENT_MEMBERSHIP_APPLICATION = {
  membershipApplications: {
    select: { membership: true },
    where: { edition: Edition.current },
  },
};

export const SELECT_MY_USER_INFORMATION = {
  ...SELECT_USER,
  ...SELECT_USER_TEAMS_AND_PERMISSIONS,
  ...SELECT_USER_TASKS_COUNT,
  ...SELECT_TRANSACTIONS_FOR_BALANCE,
  ...SELECT_CURRENT_MEMBERSHIP_APPLICATION,
  hasApprovedEULA: true,
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
  ...SELECT_PERIOD,
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
