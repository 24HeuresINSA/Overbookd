export const HOME_URL = "/";

export const LOGIN_URL = "/login";
export const REGISTER_URL = "/register";

export const MY_PROFILE_URL = "/my-profile";
export const MY_PERSONAL_ACCOUNT_URL = "/my-personal-account";
export const SHARED_MEALS_URL = "/shared-meals";
export const VOLUNTEERS_URL = "/volunteers";
export const AVAILABILITIES_URL = "/availabilities";
export const PLANNING_URL = "/planning";

export const FA_URL = "/fa";
export const FT_URL = "/ft";
export const FA_TO_PUBLISH_URL = "/fa/to-publish";
export const SECURITY_DASHBOARD_URL = "/fa/dashboard/security";
export const STATS_URL = "/stats";

export const GEAR_CATALOG_URL = "/logistic/catalog";
export const INVENTORY_URL = "/logistic/inventory";
export const GEAR_DASHBOARD_URL = "/logistic/dashboard";
export const PURCHASE_GEARS_URL = "/logistic/purchase";
export const BORROW_GEARS_URL = "/logistic/borrow";
export const LOCATION_URL = "/signa/location";
export const SIGNAGE_CATALOG_URL = "/signa/catalog";

export const CONFIGURATION_URL = "/configuration";
export const REGISTRATIONS_STAFF_URL = "/registrations/staff";
export const REGISTRATIONS_VOLUNTEER_URL = "/registrations/volunteer";
export const CONTRIBUTIONS_URL = "/contributions";
export const SG_URL = "/sg";
export const TRANSACTIONS_URL = "/transactions";
export const CHARISMA_EVENTS_MANAGE_URL = "/charisma/events/manage";
export const CHARISMA_EVENTS_LIST_URL = "/charisma/events/list";
export const CHARISMA_PERIODS_URL = "/charisma/periods";
export const ASSIGNMENT_ORGA_TASK_URL = "/assignment/orga-task";
export const ASSIGNMENT_TASK_ORGA_URL = "/assignment/task-orga";
export const ORGA_NEED_URL = "/orga-need";

export const TIMELINE_URL = "/timeline";
export const NEED_HELP_URL = "/need-help";

export const pagesURL = [
  HOME_URL,
  MY_PROFILE_URL,
  MY_PERSONAL_ACCOUNT_URL,
  SHARED_MEALS_URL,
  VOLUNTEERS_URL,
  AVAILABILITIES_URL,
  PLANNING_URL,
  FA_URL,
  FT_URL,
  FA_TO_PUBLISH_URL,
  SECURITY_DASHBOARD_URL,
  STATS_URL,
  GEAR_CATALOG_URL,
  INVENTORY_URL,
  GEAR_DASHBOARD_URL,
  PURCHASE_GEARS_URL,
  BORROW_GEARS_URL,
  LOCATION_URL,
  SIGNAGE_CATALOG_URL,
  CONFIGURATION_URL,
  REGISTRATIONS_STAFF_URL,
  REGISTRATIONS_VOLUNTEER_URL,
  CONTRIBUTIONS_URL,
  SG_URL,
  TRANSACTIONS_URL,
  CHARISMA_EVENTS_MANAGE_URL,
  CHARISMA_EVENTS_LIST_URL,
  CHARISMA_PERIODS_URL,
  ASSIGNMENT_ORGA_TASK_URL,
  ASSIGNMENT_TASK_ORGA_URL,
  ORGA_NEED_URL,
  TIMELINE_URL,
  NEED_HELP_URL,
] as const;

export type PageURL = (typeof pagesURL)[number];

export function isPageURL(url: string): url is PageURL {
  return pagesURL.some((page) => page === url);
}
