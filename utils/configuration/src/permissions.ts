import {
  type ConfigurationKey,
  REGISTER_FORM_KEY,
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  INVITE_STAFF_LINK_KEY,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  USEFUL_LINKS_KEY
} from "./keys";
import {
  type Permission,
  ENTER_EXTENDED_AVAILABILITITES,
  ENROLL_SOFT,
  MANAGE_CONFIG,
  VIEW_USEFUL_LINKS,
} from "@overbookd/permission";

const ALL = "ALL";
const NONE = "NONE";

type ExtendedPermission = Permission | typeof ALL | typeof NONE

type ConfigurationWithPermissions = {
  key: ConfigurationKey;
  permissions: {
    read: ExtendedPermission,
    write: ExtendedPermission,
  };
}

const configurationsWithPermissions: ConfigurationWithPermissions[] = [
  {
    key: REGISTER_FORM_KEY,
    permissions: {
      read: ALL,
      write: MANAGE_CONFIG,
    },
  },
  {
    key: EVENT_DATE_KEY,
    permissions: {
      read: ALL,
      write: MANAGE_CONFIG,
    },
  },
  {
    key: ORGA_WEEK_DATE_KEY,
    permissions: {
      read: ENTER_EXTENDED_AVAILABILITITES,
      write: MANAGE_CONFIG,
    },
  },
  {
    key: INVITE_STAFF_LINK_KEY,
    permissions: {
      read: NONE,
      write: NONE,
    },
  },
  {
    key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
    permissions: {
      read: ENROLL_SOFT,
      write: ENROLL_SOFT,
    },
  },
  {
    key: USEFUL_LINKS_KEY,
    permissions: {
      read: VIEW_USEFUL_LINKS,
      write: MANAGE_CONFIG,
    },
  },
];

export function canReadConfiguration(
  key: ConfigurationKey,
  permissions: Permission[],
): boolean {
  const config = configurationsWithPermissions.find((c) => c.key === k);
  if (!config) return false;
  
  const read = config.permissions.read;
  if (read === ALL) return true;
  if (read === NONE) return false;
  return permissions.some((p) => p === read);
}


export function canWriteConfiguration(
  key: ConfigurationKey,
  permissions: Permission[],
): boolean {
  const config = configurationsWithPermissions.find((c) => c.key === k);
  if (!config) return false;
  
  const write = config.permissions.write;
  if (write === ALL) return true;
  if (write === NONE) return false;
  return permissions.some((p) => p === write);
}
