import { Permission } from "./permission.model";

export const HAVE_PERSONNAL_ACCOUNT = "have-personnal-account";
export const AFFECT_TEAM = "affect-team";
export const BE_AFFECTED = "be-affected";
export const WRITE_GEAR_CATALOG = "write-gear-catalog";
export const READ_GEAR_CATALOG = "read-gear-catalog";
export const READ_SIGNAGE_CATALOG = "read-signage-catalog";
export const WRITE_SIGNAGE_CATALOG = "write-signage-catalog";
export const WRITE_INVENTORY = "write-inventory";
export const MANAGE_PERSONNAL_ACCOUNTS = "manage-personnal-accounts";
export const MANAGE_USERS = "manage-users";
export const AFFECT_VOLUNTEER = "affect-volunteer";
export const MANAGE_CONFIG = "manage-config";
export const MANAGE_LOCATION = "manage-location";
export const VALIDATE_FA = "validate-fa";
export const VALIDATE_FT = "validate-ft";
export const READ_ANIMATION_TO_PUBLISH = "read-animation-to-publish";
export const READ_FA = "read-fa";
export const WRITE_FA = "write-fa";
export const READ_FT = "read-ft";
export const WRITE_FT = "write-ft";
export const VIEW_FESTIVAL_EVENTS_STATS = "view-festival-events-stats";
export const FILL_AVAILABILITY = "fill-availability";
export const VIEW_TIMELINE = "view-timeline";
export const ASK_FOR_HELP = "ask-for-help";
export const VIEW_PLANNING = "view-planning";
export const DOWNLOAD_PLANNING = "download-planning";
export const ENROLL_NEWCOMER = "enroll-newcomer";
export const VIEW_TROMBINOSCOPE = "view-trombinoscope";
export const VIEW_VOLUNTEER = "view-volunteer";
export const SEND_MAIL_TEST = "send-mail-test";
export const MANAGE_TEAMS = "manage-teams";
export const MANAGE_PERMISSIONS = "manage-permissions";
export const VIEW_DELETED_FA = "view-deleted-fa";
export const VIEW_DELETED_FT = "view-deleted-ft";

const permissions = [
  HAVE_PERSONNAL_ACCOUNT,
  AFFECT_TEAM,
  BE_AFFECTED,
  WRITE_GEAR_CATALOG,
  READ_GEAR_CATALOG,
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_CATALOG,
  WRITE_INVENTORY,
  MANAGE_PERSONNAL_ACCOUNTS,
  MANAGE_USERS,
  AFFECT_VOLUNTEER,
  MANAGE_CONFIG,
  MANAGE_LOCATION,
  VALIDATE_FA,
  VALIDATE_FT,
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  WRITE_FA,
  READ_FT,
  WRITE_FT,
  VIEW_FESTIVAL_EVENTS_STATS,
  FILL_AVAILABILITY,
  VIEW_TIMELINE,
  ASK_FOR_HELP,
  VIEW_PLANNING,
  DOWNLOAD_PLANNING,
  ENROLL_NEWCOMER,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
  SEND_MAIL_TEST,
  MANAGE_TEAMS,
  MANAGE_PERMISSIONS,
  VIEW_DELETED_FA,
  VIEW_DELETED_FT,
];

export function isPermission(permission: string): permission is Permission {
  return permissions.includes(permission);
}
