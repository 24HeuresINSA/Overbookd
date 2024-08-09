import type { Permission } from "@overbookd/permission";
import { VOLUNTEER_PAGES, VOLUNTEER_SUMMARY_PAGES } from "./volunteer";
import {
  FESTIVAL_EVENT_PAGES,
  FESTIVAL_EVENT_SUMMARY_PAGES,
} from "./festival-event";
import { MANAGEMENT_SUMMARY_PAGES } from "./management";
import { LOGISTIC_SUMMARY_PAGES } from "./logistic";
import { CURRENT_EVENT_SUMMARY_PAGES } from "./current-event";

export type PageInSummary = {
  icon: string;
  title: string;
  permission?: Permission;
  to: string;
  description: string;
  mobileSupport: boolean;
  keywords: string[];
};

export type HiddenPage = Pick<
  PageInSummary,
  "title" | "permission" | "to" | "mobileSupport"
>;

export type Page = PageInSummary | HiddenPage;

const INDEX_PAGE: PageInSummary = {
  icon: "mdi-home",
  title: "Accueil",
  to: "/",
  description: "Page principale pour se rediriger vers toutes les autres",
  mobileSupport: true,
  keywords: ["accueil", "home"],
};

export const summaryPages: PageInSummary[] = [
  INDEX_PAGE,
  ...VOLUNTEER_SUMMARY_PAGES,
  ...FESTIVAL_EVENT_SUMMARY_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_SUMMARY_PAGES,
];

const allPages: Page[] = [
  INDEX_PAGE,
  ...VOLUNTEER_PAGES,
  ...FESTIVAL_EVENT_PAGES,
  ...MANAGEMENT_SUMMARY_PAGES,
  ...CURRENT_EVENT_SUMMARY_PAGES,
  ...LOGISTIC_SUMMARY_PAGES,
];

function removePathLastPart(path: string): string {
  return path.replace(/\/[^/]*$/, "");
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
