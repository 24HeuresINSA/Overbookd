import {
  HAVE_PERSONAL_ACCOUNT,
  SHOTGUN_SHARED_MEAL,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import {
  MY_PERSONAL_ACCOUNT_URL,
  MY_PROFILE_URL,
  SHARED_MEALS_URL,
  TROMBINOSCOPE_URL,
  VOLUNTEERS_URL,
} from "@overbookd/web-page";
import type { HiddenPage, Page, PageInSummary } from "./navigation";

const MY_PROFILE_PAGE: HiddenPage = {
  title: "Mon Profil",
  to: MY_PROFILE_URL,
  mobileSupport: true,
  canBeFavorite: false,
};

const MY_PERSONAL_ACCOUNT_PAGE: PageInSummary = {
  icon: "mdi-account-cash",
  title: "Mon Compte Perso",
  permission: HAVE_PERSONAL_ACCOUNT,
  to: MY_PERSONAL_ACCOUNT_URL,
  description:
    "Page avec ton compte persos et tes transactions permettant de faire des virements",
  mobileSupport: true,
  canBeFavorite: true,
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

const SHARED_MEALS_PAGE: PageInSummary = {
  icon: "mdi-food-variant",
  title: "Repas Partagés",
  permission: SHOTGUN_SHARED_MEAL,
  to: SHARED_MEALS_URL,
  description: "Page pour proposer et shotgun des repas partagés",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: [
    "repas-partages",
    "shotguns",
    "comptes",
    "persos",
    "menus",
    "repas-orgas",
  ],
};

const TROMBINOSCOPE_PAGE: PageInSummary = {
  icon: "mdi-image",
  title: "Trombinoscope",
  permission: VIEW_TROMBINOSCOPE,
  to: TROMBINOSCOPE_URL,
  description:
    "Liste de tous les bénévoles avec leur photo ce qui permet de mettre un visage sur un nom avant de se rencontrer",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: ["trombinoscope", "photos"],
};

const VOLUNTEERS_PAGE: PageInSummary = {
  icon: "mdi-account-group",
  title: "Liste des Bénévoles",
  permission: VIEW_VOLUNTEER,
  to: VOLUNTEERS_URL,
  description: "Permet de voir tous les bénévoles",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: ["benevoles", "orgas", "liste"],
};

// const AVAILABILITIES_PAGE: PageInSummary = {
//   icon: "mdi-clock",
//   title: "Mes dispos",
//   to: AVAILABILITIES_URL,
//   description:
//     "Permet de renseigner quand tu es disponible pour aider sur le festival",
//   mobileSupport: true,
//   canBeFavorite: true,
//   keywords: ["dispos", "disponibilites"],
// };

// const MY_PLANNING_PAGE: PageInSummary = {
//   icon: "mdi-calendar-clock",
//   title: "Mon Planning",
//   permission: VIEW_PLANNING,
//   to: PLANNING_URL,
//   description: "Permet d'avoir un apercu de son planning sur le festival",
//   mobileSupport: true,
//   canBeFavorite: true,
//   keywords: ["planning", "calendrier", "taches", "affectation"],
// };

// const PLANNING_PAGE: HiddenPageWithParams = {
//   title: "Planning",
//   permission: VIEW_PLANNING,
//   to: `${PLANNING_URL}/:id`,
//   mobileSupport: true,
//   canBeFavorite: false,
// };

export const VOLUNTEER_SUMMARY_PAGES: PageInSummary[] = [
  MY_PERSONAL_ACCOUNT_PAGE,
  SHARED_MEALS_PAGE,
  TROMBINOSCOPE_PAGE,
  VOLUNTEERS_PAGE,
  // AVAILABILITIES_PAGE,
  // MY_PLANNING_PAGE,
];

export const VOLUNTEER_PAGES: Page[] = [
  ...VOLUNTEER_SUMMARY_PAGES,
  MY_PROFILE_PAGE,
  // PLANNING_PAGE,
];
