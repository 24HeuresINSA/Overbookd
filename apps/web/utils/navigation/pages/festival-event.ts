import {
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  READ_FT,
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_SECURITY_DASHBOARD,
} from "@overbookd/permission";
import type { HiddenPage, Page, PageInSummary } from "./page-list";
import {
  FA_URL,
  FT_URL,
  FA_TO_PUBLISH_URL,
  STATS_URL,
  SECURITY_DASHBOARD_URL,
} from "@overbookd/web-page";

export const FA_LIST_PAGE: PageInSummary = {
  icon: "mdi-chart-bubble",
  title: "Fiches Activités",
  shortTitle: "FA",
  permission: READ_FA,
  to: FA_URL,
  description:
    "Liste des FAs, les FAs permettent de décrire tout ce qui va se passer sur le festival",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: ["fas", "fiches-activites", "animations"],
};

const FA_PAGE: HiddenPage = {
  title: "Fiche Activité",
  permission: READ_FA,
  to: `${FA_URL}/:id`,
  mobileSupport: true,
  canBeFavorite: false,
};

const FT_LIST_PAGE: PageInSummary = {
  icon: "mdi-format-color-highlight",
  title: "Fiches Tâches",
  permission: READ_FT,
  to: FT_URL,
  description:
    "Liste des FTs, les FTs permettent de décrire tout ce qui doit être fait pour le bon déroulement du festival",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: ["fts", "fiche-taches"],
};

const FT_PAGE: HiddenPage = {
  title: "Fiche Tâche",
  permission: READ_FT,
  to: `${FT_URL}/:id`,
  mobileSupport: true,
  canBeFavorite: false,
};

const FA_TO_PUBLISH_PAGE: PageInSummary = {
  icon: "mdi-web-sync",
  title: "Animations à Publier",
  permission: READ_ANIMATION_TO_PUBLISH,
  to: FA_TO_PUBLISH_URL,
  description:
    "Permet de lister les animations surlesquelles communiquer via les réseaux sociaux ou le site web",
  mobileSupport: false,
  canBeFavorite: true,
  keywords: [
    "animations",
    "communication",
    "publier",
    "publication",
    "comcom",
    "fa",
  ],
};

const SECURITY_DASHBOARD_PAGE: HiddenPage = {
  title: "Récapitulatif Sécurité",
  permission: VIEW_SECURITY_DASHBOARD,
  to: SECURITY_DASHBOARD_URL,
  mobileSupport: false,
  canBeFavorite: false,
};

const FESTIVAL_EVENTS_STATS_PAGE: PageInSummary = {
  icon: "mdi-chart-areaspline-variant",
  title: "Statistiques",
  permission: VIEW_FESTIVAL_EVENTS_STATS,
  to: STATS_URL,
  description:
    "Permet d'avoir un apercu de l'avancée des FAs et des FTs par rappport à l'édition précédente",
  mobileSupport: false,
  canBeFavorite: true,
  keywords: [
    "statistiques",
    "stats",
    "fas",
    "fiches-activites",
    "fts",
    "fiche-taches",
    "animations",
  ],
};

export const FESTIVAL_EVENT_SUMMARY_PAGES: PageInSummary[] = [
  FA_LIST_PAGE,
  FT_LIST_PAGE,
  FA_TO_PUBLISH_PAGE,
  FESTIVAL_EVENTS_STATS_PAGE,
];

export const FESTIVAL_EVENT_PAGES: Page[] = [
  ...FESTIVAL_EVENT_SUMMARY_PAGES,
  FA_PAGE,
  FT_PAGE,
  SECURITY_DASHBOARD_PAGE,
];
