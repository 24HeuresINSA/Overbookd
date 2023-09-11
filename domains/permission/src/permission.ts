const HAVE_PERSONNAL_ACCOUNT = "have-personnal-account";
const AFFECT_TEAM = "affect-team";
const BE_AFFECTED = "be-affected";
const WRITE_GEAR_CATALOG = "write-gear-catalog";
const READ_GEAR_CATALOG = "read-gear-catalog";
const READ_SIGNAGE_CATALOG = "read-signage-catalog";
const WRITE_SIGNAGE_CATALOG = "write-signage-catalog";
const WRITE_INVENTORY = "write-inventory";
const MANAGE_PERSONNAL_ACCOUNTS = "manage-personnal-accounts";
const MANAGE_USERS = "manage-users";
const AFFECT_VOLUNTEER = "affect-volunteer";
const MANAGE_CONFIG = "manage-config";
const MANAGE_LOCATION = "manage-location";
const VALIDATE_FA = "validate-fa";
const VALIDATE_FT = "validate-ft";
const READ_ANIMATION_TO_PUBLISH = "read-animation-to-publish";
const READ_FA = "read-fa";
const WRITE_FA = "write-fa";
const READ_FT = "read-ft";
const WRITE_FT = "write-ft";
const VIEW_FESTIVAL_EVENTS_STATS = "view-festival-events-stats";
const FILL_AVAILABILITY = "fill-availability";
const VIEW_TIMELINE = "view-timeline";
const ASK_FOR_HELP = "ask-for-help";
const VIEW_PLANNING = "view-planning";
const DOWNLOAD_PLANNING = "download-planning";
const ENROLL_NEWCOMER = "enroll-newcomer";
const VIEW_TROMBINOSCOPE = "view-trombinoscope";
const VIEW_VOLUNTEER = "view-volunteer";

export type Permission =
  | typeof HAVE_PERSONNAL_ACCOUNT
  | typeof AFFECT_TEAM
  | typeof BE_AFFECTED
  | typeof WRITE_GEAR_CATALOG
  | typeof READ_GEAR_CATALOG
  | typeof READ_SIGNAGE_CATALOG
  | typeof WRITE_SIGNAGE_CATALOG
  | typeof WRITE_INVENTORY
  | typeof MANAGE_PERSONNAL_ACCOUNTS
  | typeof MANAGE_USERS
  | typeof AFFECT_VOLUNTEER
  | typeof MANAGE_CONFIG
  | typeof MANAGE_LOCATION
  | typeof VALIDATE_FA
  | typeof VALIDATE_FT
  | typeof READ_ANIMATION_TO_PUBLISH
  | typeof READ_FA
  | typeof WRITE_FA
  | typeof READ_FT
  | typeof WRITE_FT
  | typeof VIEW_FESTIVAL_EVENTS_STATS
  | typeof FILL_AVAILABILITY
  | typeof VIEW_TIMELINE
  | typeof ASK_FOR_HELP
  | typeof VIEW_PLANNING
  | typeof DOWNLOAD_PLANNING
  | typeof ENROLL_NEWCOMER
  | typeof VIEW_TROMBINOSCOPE
  | typeof VIEW_VOLUNTEER;

export const permissions: Record<string, Permission> = {
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
};
