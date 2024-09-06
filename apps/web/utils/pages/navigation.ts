import type { Permission } from "@overbookd/permission";
import { HOME_URL } from "@overbookd/web-page";
import { VOLUNTEER_PAGES, VOLUNTEER_SUMMARY_PAGES } from "./volunteer";
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
};

export type HiddenPage = Pick<
  PageInSummary,
  "title" | "permission" | "to" | "mobileSupport"
> & { canBeFavorite: false };

export type Page = PageInSummary | HiddenPage;

export const HOME_PAGE: PageInSummary = {
  icon: "mdi-home",
  title: "Accueil",
  to: HOME_URL,
  description: "Page principale pour se rediriger vers toutes les autres",
  mobileSupport: true,
  canBeFavorite: false,
  keywords: ["accueil", "home"],
};

export const summaryPages: PageInSummary[] = [
  HOME_PAGE,
  ...VOLUNTEER_SUMMARY_PAGES,
  ...FESTIVAL_EVENT_SUMMARY_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_SUMMARY_PAGES,
];

const allPages: Page[] = [
  HOME_PAGE,
  ...VOLUNTEER_PAGES,
  ...FESTIVAL_EVENT_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_PAGES,
];

function removePathLastPart(path: string): string {
  return path.replace(/\/[^/]*$/, "/");
}

export function findPage(path: string): Page | undefined {
  const pageWithExactPath = allPages.find((page) => page.to === path);
  if (pageWithExactPath) return pageWithExactPath;

  const remainingPages = allPages.filter((page) => page.to !== path);
  const reducedPath = removePathLastPart(path);

  return remainingPages.find(
    (page) => removePathLastPart(page.to) === reducedPath,
  );
}
