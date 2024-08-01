import {
  HAVE_PERSONAL_ACCOUNT,
  AFFECT_TEAM,
  BE_AFFECTED,
  WRITE_GEAR_CATALOG,
  READ_GEAR_CATALOG,
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_CATALOG,
  VIEW_LOCATION,
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
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_TIMELINE,
  ASK_FOR_HELP,
  VIEW_PLANNING,
  DOWNLOAD_PLANNING,
  ENROLL_HARD,
  ENROLL_SOFT,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
  SEND_MAIL_TEST,
  MANAGE_PERMISSIONS,
  MANAGE_TEAMS,
  VIEW_DELETED_FT,
  MANAGE_ADMINS,
  MANAGE_CONTRIBUTIONS,
  PAY_CONTRIBUTION,
  OFFER_SHARED_MEAL,
  SHOTGUN_SHARED_MEAL,
  VIEW_GEAR_DASHBOARD,
  PURCHASE_GEARS,
  BORROW_GEARS,
  FORCE_WRITE_FT,
  SYNC_PLANNING,
  MANAGE_CHARISMA_EVENTS,
  READ_INVENTORY,
} from "./permissions.js";

export type Permission =
  | typeof HAVE_PERSONAL_ACCOUNT
  | typeof AFFECT_TEAM
  | typeof BE_AFFECTED
  | typeof WRITE_GEAR_CATALOG
  | typeof READ_GEAR_CATALOG
  | typeof VIEW_GEAR_DASHBOARD
  | typeof READ_SIGNAGE_CATALOG
  | typeof WRITE_SIGNAGE_CATALOG
  | typeof VIEW_LOCATION
  | typeof READ_INVENTORY
  | typeof WRITE_INVENTORY
  | typeof MANAGE_PERSONAL_ACCOUNTS
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
  | typeof FORCE_WRITE_FT
  | typeof VIEW_FESTIVAL_EVENTS_STATS
  | typeof VIEW_TIMELINE
  | typeof ASK_FOR_HELP
  | typeof VIEW_PLANNING
  | typeof DOWNLOAD_PLANNING
  | typeof SYNC_PLANNING
  | typeof ENROLL_HARD
  | typeof ENROLL_SOFT
  | typeof VIEW_TROMBINOSCOPE
  | typeof VIEW_VOLUNTEER
  | typeof SEND_MAIL_TEST
  | typeof MANAGE_TEAMS
  | typeof MANAGE_PERMISSIONS
  | typeof VIEW_DELETED_FT
  | typeof MANAGE_ADMINS
  | typeof MANAGE_CONTRIBUTIONS
  | typeof PAY_CONTRIBUTION
  | typeof OFFER_SHARED_MEAL
  | typeof SHOTGUN_SHARED_MEAL
  | typeof PURCHASE_GEARS
  | typeof BORROW_GEARS
  | typeof MANAGE_CHARISMA_EVENTS;
