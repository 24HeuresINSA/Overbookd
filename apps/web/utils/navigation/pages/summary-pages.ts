import type { Permission } from "@overbookd/permission";
import { HOME_URL } from "@overbookd/web-page";
import {
  AVAILABILITIES_PAGE,
  MY_PERSONAL_ACCOUNT_PAGE,
  MY_PLANNING_PAGE,
  SHARED_MEALS_PAGE,
  VOLUNTEER_CHARTER_PAGE,
  VOLUNTEER_PAGES,
  VOLUNTEER_SUMMARY_PAGES,
  VOLUNTEERS_PAGE,
} from "./volunteer";
import {
  FESTIVAL_EVENT_PAGES,
  FESTIVAL_EVENT_SUMMARY_PAGES,
} from "./festival-event";
import { MANAGEMENT_SUMMARY_PAGES } from "./management";
import { LOGISTIC_PAGES, LOGISTIC_SUMMARY_PAGES } from "./logistic";
import { CURRENT_EVENT_SUMMARY_PAGES } from "./current-event";

export type PageInSummary = {
  icon: string;
  title: string;
  shortTitle?: string;
  permission?: Permission;
  to: string;
  description: string;
  mobileSupport: boolean;
  canBeFavorite: boolean;
  keywords: string[];
  badgeValue?: number;
  hasParam: boolean;
};

export type HiddenPage = Pick<
  PageInSummary,
  "title" | "permission" | "to" | "mobileSupport" | "hasParam"
> & { canBeFavorite: false };

export type Page = PageInSummary | HiddenPage;

export const HOME_PAGE: PageInSummary = {
  icon: "mdi-home",
  title: "Accueil",
  to: HOME_URL,
  description: "Page d'accueil",
  mobileSupport: true,
  canBeFavorite: false,
  hasParam: false,
  keywords: ["accueil", "home"],
};

export const ALL_PAGES: Page[] = [
  HOME_PAGE,
  ...VOLUNTEER_PAGES,
  ...FESTIVAL_EVENT_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_PAGES,
];

export const SUMMARY_PAGES: PageInSummary[] = [
  HOME_PAGE,
  ...VOLUNTEER_SUMMARY_PAGES,
  ...FESTIVAL_EVENT_SUMMARY_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_SUMMARY_PAGES,
];

export const VOLUNTEER_MOBILE_SUMMARY = [
  HOME_PAGE,
  MY_PLANNING_PAGE,
  AVAILABILITIES_PAGE,
  VOLUNTEERS_PAGE,
  VOLUNTEER_CHARTER_PAGE,
];

export const ORGA_MOBILE_SUMMARY_WITHOUT_PLANNING = [
  HOME_PAGE,
  MY_PERSONAL_ACCOUNT_PAGE,
  SHARED_MEALS_PAGE,
  VOLUNTEERS_PAGE,
];
export const ORGA_MOBILE_SUMMARY_WITH_PLANNING = [
  HOME_PAGE,
  MY_PLANNING_PAGE,
  MY_PERSONAL_ACCOUNT_PAGE,
  SHARED_MEALS_PAGE,
  VOLUNTEERS_PAGE,
];
