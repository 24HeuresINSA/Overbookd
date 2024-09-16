export const HAVE_PERSONAL_ACCOUNT = "have-personal-account";
export const AFFECT_TEAM = "affect-team";
export const BE_AFFECTED = "be-affected";
export const WRITE_GEAR_CATALOG = "write-gear-catalog";
export const READ_GEAR_CATALOG = "read-gear-catalog";
export const READ_SIGNAGE_CATALOG = "read-signage-catalog";
export const WRITE_SIGNAGE_CATALOG = "write-signage-catalog";
export const VIEW_GEAR_DASHBOARD = "view-gear-dashboard";
export const VIEW_LOCATION = "view-location";
export const MANAGE_LOCATION = "manage-location";
export const READ_INVENTORY = "read-inventory";
export const WRITE_INVENTORY = "write-inventory";
export const MANAGE_PERSONAL_ACCOUNTS = "manage-personal-accounts";
export const MANAGE_USERS = "manage-users";
export const AFFECT_VOLUNTEER = "affect-volunteer";
export const MANAGE_CONFIG = "manage-config";
export const VALIDATE_FA = "validate-fa";
export const VALIDATE_FT = "validate-ft";
export const READ_ANIMATION_TO_PUBLISH = "read-animation-to-publish";
export const READ_FA = "read-fa";
export const WRITE_FA = "write-fa";
export const READ_FT = "read-ft";
export const WRITE_FT = "write-ft";
export const FORCE_WRITE_FT = "force-write-ft";
export const VIEW_FESTIVAL_EVENTS_STATS = "view-festival-events-stats";
export const VIEW_TIMELINE = "view-timeline";
export const ASK_FOR_HELP = "ask-for-help";
export const VIEW_PLANNING = "view-planning";
export const DOWNLOAD_PLANNING = "download-planning";
export const SYNC_PLANNING = "sync-planning";
export const ENROLL_HARD = "enroll-hard";
export const ENROLL_SOFT = "enroll-soft";
export const VIEW_VOLUNTEER = "view-volunteer";
export const VIEW_VOLUNTEER_DETAILS = "view-volunteer-details";
export const SEND_MAIL_TEST = "send-mail-test";
export const MANAGE_TEAMS = "manage-teams";
export const MANAGE_PERMISSIONS = "manage-permissions";
export const VIEW_DELETED_FT = "view-deleted-ft";
export const MANAGE_ADMINS = "manage-admins";
export const MANAGE_CONTRIBUTIONS = "manage-contributions";
export const PAY_CONTRIBUTION = "pay-contribution";
export const OFFER_SHARED_MEAL = "offer-shared-meal";
export const SHOTGUN_SHARED_MEAL = "shotgun-shared-meal";
export const PURCHASE_GEARS = "purchase-gears";
export const BORROW_GEARS = "borrow-gears";
export const MANAGE_CHARISMA_EVENTS = "manage-charisma-events";
export const SET_FAVORITE_PAGES = "set-favorite-pages";
export const VIEW_SECURITY_DASHBOARD = "view-security-dashboard";

const permissions = [
  HAVE_PERSONAL_ACCOUNT,
  AFFECT_TEAM,
  BE_AFFECTED,
  WRITE_GEAR_CATALOG,
  READ_GEAR_CATALOG,
  VIEW_GEAR_DASHBOARD,
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_CATALOG,
  VIEW_LOCATION,
  READ_INVENTORY,
  WRITE_INVENTORY,
  MANAGE_PERSONAL_ACCOUNTS,
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
  FORCE_WRITE_FT,
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_TIMELINE,
  ASK_FOR_HELP,
  VIEW_PLANNING,
  DOWNLOAD_PLANNING,
  SYNC_PLANNING,
  ENROLL_HARD,
  ENROLL_SOFT,
  VIEW_VOLUNTEER,
  VIEW_VOLUNTEER_DETAILS,
  SEND_MAIL_TEST,
  MANAGE_TEAMS,
  MANAGE_PERMISSIONS,
  VIEW_DELETED_FT,
  MANAGE_ADMINS,
  MANAGE_CONTRIBUTIONS,
  PAY_CONTRIBUTION,
  OFFER_SHARED_MEAL,
  SHOTGUN_SHARED_MEAL,
  PURCHASE_GEARS,
  BORROW_GEARS,
  MANAGE_CHARISMA_EVENTS,
  SET_FAVORITE_PAGES,
  VIEW_SECURITY_DASHBOARD,
] as const;

export type Permission = (typeof permissions)[number];

export function isPermission(permission: string): permission is Permission {
  return permissions.some((p) => p === permission);
}
