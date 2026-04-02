import { VOLUNTEER_CHARTER_URL } from "@overbookd/web-page";
import type { Page, PageInSummary } from "./summary-pages";

export const VOLUNTEER_CHARTER_PAGE: PageInSummary = {
  icon: "mdi-note-edit",
  title: "Charte bénévole",
  to: VOLUNTEER_CHARTER_URL,
  description: "Permet de lire et signer la charte bénévole",
  mobileSupport: true,
  canBeFavorite: false,
  hasParam: false,
  keywords: ["charte-benevole", "charte", "benevole"],
};

export const CHARTER_SUMMARY_PAGES: PageInSummary[] = [VOLUNTEER_CHARTER_PAGE];

export const CHARTER_PAGES: Page[] = CHARTER_SUMMARY_PAGES;
