import {
  HAVE_PERSONAL_ACCOUNT,
  SHOTGUN_SHARED_MEAL,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import type { HiddenPage, Page, PageInSummary } from "./navigation";

const PROFILE_PAGE: HiddenPage = {
  title: "Mon Profil",
  to: "/profile",
  mobileSupport: true,
};

const MY_PERSONAL_ACCOUNT_PAGE: PageInSummary = {
  icon: "mdi-account-cash",
  title: "Mon Compte Perso",
  permission: HAVE_PERSONAL_ACCOUNT,
  to: "/my-personal-account",
  description:
    "Page avec ton compte persos et tes transactions permettant de faire des virements",
  mobileSupport: true,
  keywords: ["virements", "cps", "comptes", "persos", "consos", "consomations"],
};

const SHARED_MEALS_PAGE: PageInSummary = {
  icon: "mdi-food-variant",
  title: "Repas Partagés",
  permission: SHOTGUN_SHARED_MEAL,
  to: "/shared-meals",
  description: "Page pour proposer et shotgun des repas partagés",
  mobileSupport: true,
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
  to: "/trombinoscope",
  description:
    "Liste de tous les bénévoles avec leur photo ce qui permet de mettre un visage sur un nom avant de se rencontrer",
  mobileSupport: true,
  keywords: ["trombinoscope", "photos"],
};

const VOLUNTEERS_PAGE: PageInSummary = {
  icon: "mdi-account-group",
  title: "Liste des Bénévoles",
  permission: VIEW_VOLUNTEER,
  to: "/volunteers",
  description: "Permet de voir tous les bénévoles",
  mobileSupport: true,
  keywords: ["benevoles", "orgas", "liste"],
};

// const AVAILABILITIES_PAGE: PageInSummary = {
//   icon: "mdi-clock",
//   title: "Mes dispos",
//   to: "/availabilities",
//   description:
//     "Permet de renseigner quand tu es disponible pour aider sur le festival",
//   mobileSupport: true,
//   keywords: ["dispos", "disponibilites"],
// };

// const MY_PLANNING_PAGE: PageInSummary = {
//   icon: "mdi-calendar-clock",
//   title: "Mon Planning",
//   permission: VIEW_PLANNING,
//   to: "/planning",
//   description: "Permet d'avoir un apercu de son planning sur le festival",
//   mobileSupport: true,
//   keywords: ["planning", "calendrier", "taches", "affectation"],
// };

// const PLANNING_PAGE: HiddenPageWithParams = {
//   title: "Planning",
//   permission: VIEW_PLANNING,
//   to: "/planning/:id",
//   mobileSupport: true,
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
  PROFILE_PAGE,
  // PLANNING_PAGE,
];
