import {
  HAVE_PERSONAL_ACCOUNT,
  SHOTGUN_SHARED_MEAL,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import {
  AVAILABILITIES_URL,
  MY_PERSONAL_ACCOUNT_URL,
  SHARED_MEALS_URL,
  VOLUNTEERS_URL,
} from "@overbookd/web-page";
import type { Page, PageInSummary } from "./desktop-summary";

export const MY_PERSONAL_ACCOUNT_PAGE: PageInSummary = {
  icon: "mdi-account-cash",
  title: "Mon Compte Perso",
  shortTitle: "CP",
  permission: HAVE_PERSONAL_ACCOUNT,
  to: MY_PERSONAL_ACCOUNT_URL,
  description:
    "Page avec ton compte persos et tes transactions permettant de faire des virements",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "mon",
    "virements",
    "cps",
    "comptes",
    "persos",
    "consos",
    "consomations",
  ],
};

export const SHARED_MEALS_PAGE: PageInSummary = {
  icon: "mdi-food-variant",
  title: "Repas Partagés",
  shortTitle: "Repas",
  permission: SHOTGUN_SHARED_MEAL,
  to: SHARED_MEALS_URL,
  description: "Page pour proposer et shotgun des repas partagés",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "repas-partages",
    "shotguns",
    "comptes",
    "persos",
    "menus",
    "repas-orgas",
  ],
};

export const VOLUNTEERS_PAGE: PageInSummary = {
  icon: "mdi-account-group",
  title: "Liste des Bénévoles",
  shortTitle: "Bénévoles",
  permission: VIEW_VOLUNTEER,
  to: VOLUNTEERS_URL,
  description: "Permet de voir tous les bénévoles",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["benevoles", "orgas", "liste"],
};

const AVAILABILITIES_PAGE: PageInSummary = {
  icon: "mdi-clock",
  title: "Mes dispos",
  to: AVAILABILITIES_URL,
  description:
    "Permet de renseigner quand tu es disponible pour aider sur le festival",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["dispos", "disponibilites"],
};

// const MY_PLANNING_PAGE: PageInSummary = {
//   icon: "mdi-calendar-clock",
//   title: "Mon Planning",
//   permission: VIEW_PLANNING,
//   to: PLANNING_URL,
//   description: "Permet d'avoir un apercu de son planning sur le festival",
//   mobileSupport: true,
//   canBeFavorite: true,
//   hasParam: false,
//   keywords: ["planning", "calendrier", "taches", "affectation"],
// };

// const PLANNING_PAGE: HiddenPageWithParams = {
//   title: "Planning",
//   permission: VIEW_PLANNING,
//   to: PLANNING_URL,
//   mobileSupport: true,
//   canBeFavorite: false,
//   hasParam: true,
// };

export const VOLUNTEER_SUMMARY_PAGES: PageInSummary[] = [
  MY_PERSONAL_ACCOUNT_PAGE,
  SHARED_MEALS_PAGE,
  VOLUNTEERS_PAGE,
  AVAILABILITIES_PAGE,
  // MY_PLANNING_PAGE,
];

export const VOLUNTEER_PAGES: Page[] = [
  ...VOLUNTEER_SUMMARY_PAGES,
  // PLANNING_PAGE,
];
