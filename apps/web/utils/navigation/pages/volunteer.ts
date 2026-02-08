import {
  HAVE_PERSONAL_ACCOUNT,
  SHOTGUN_SHARED_MEAL,
  VIEW_MULTI_PLANNING,
  VIEW_PLANNING,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import {
  AVAILABILITIES_URL,
  MY_PERSONAL_ACCOUNT_URL,
  PLANNING_URL,
  MULTI_PLANNING_URL,
  SHARED_MEALS_URL,
  VOLUNTEERS_URL,
  VOLUNTEER_CHARTER_URL,
} from "@overbookd/web-page";
import type { HiddenPage, Page, PageInSummary } from "./summary-pages";

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
    "mon-compte-perso",
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
  keywords: ["liste-des-benevoles", "benevoles", "orgas"],
};

export const AVAILABILITIES_PAGE: PageInSummary = {
  icon: "mdi-clock",
  title: "Mes Dispos",
  shortTitle: "Dispos",
  to: AVAILABILITIES_URL,
  description:
    "Permet de renseigner quand tu es disponible pour aider sur le festival",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["mes-dispos", "disponibilites"],
};

export const MY_PLANNING_PAGE: PageInSummary = {
  icon: "mdi-calendar",
  title: "Mon Planning",
  shortTitle: "Planning",
  permission: VIEW_PLANNING,
  to: PLANNING_URL,
  description: "Permet d'avoir un apercu de son planning sur le festival",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["mon-planning", "calendrier", "taches", "affectation"],
};

const PLANNING_PAGE: HiddenPage = {
  title: "Planning",
  permission: VIEW_PLANNING,
  to: PLANNING_URL,
  mobileSupport: true,
  canBeFavorite: false,
  hasParam: true,
};

const MULTI_PLANNING_PAGE: PageInSummary = {
  icon: "mdi-calendar-multiple",
  title: "Multi Planning",
  shortTitle: "Multi Planning",
  permission: VIEW_MULTI_PLANNING,
  to: MULTI_PLANNING_URL,
  description:
    "Permet d'avoir un apercu de plusieurs plannings sur le festival",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["multi-planning", "calendrier", "taches", "affectation"],
};

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

export const VOLUNTEER_SUMMARY_PAGES: PageInSummary[] = [
  MY_PERSONAL_ACCOUNT_PAGE,
  SHARED_MEALS_PAGE,
  VOLUNTEERS_PAGE,
  AVAILABILITIES_PAGE,
  MY_PLANNING_PAGE,
  MULTI_PLANNING_PAGE,
  VOLUNTEER_CHARTER_PAGE,
];

export const VOLUNTEER_PAGES: Page[] = [
  ...VOLUNTEER_SUMMARY_PAGES,
  PLANNING_PAGE,
];
