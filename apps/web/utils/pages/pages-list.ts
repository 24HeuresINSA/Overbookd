import {
  AFFECT_VOLUNTEER,
  ASK_FOR_HELP,
  ENROLL_NEWCOMER,
  FILL_AVAILABILITY,
  MANAGE_CONFIG,
  MANAGE_PERSONNAL_ACCOUNTS,
  Permission,
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  READ_FT,
  READ_GEAR_CATALOG,
  READ_SIGNAGE_CATALOG,
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_PLANNING,
  VIEW_TIMELINE,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
  WRITE_INVENTORY,
} from "@overbookd/permission";

interface Page {
  icon: string;
  title: string;
  permission?: Permission;
  to: string;
}

export const pages: Page[] = [
  {
    icon: "mdi-apps",
    title: "Accueil",
    to: "/",
  },
  {
    icon: "mdi-image",
    title: "Trombinoscope",
    permission: VIEW_TROMBINOSCOPE,
    to: "/trombinoscope",
  },
  {
    icon: "mdi-chart-bubble",
    title: "Fiches Activités",
    permission: READ_FA,
    to: "/fa",
  },
  {
    icon: "mdi-format-color-highlight",
    title: "Fiches Tâches",
    permission: READ_FT,
    to: "/ft",
  },
  {
    icon: "mdi-account-group",
    title: "Liste des bénévoles",
    permission: VIEW_VOLUNTEER,
    to: "/volunteers",
  },
  {
    icon: "mdi-clock",
    title: "Mes dispos",
    permission: FILL_AVAILABILITY,
    to: "/availabilities",
  },
  {
    icon: "mdi-calendar-clock",
    title: "Planning",
    permission: VIEW_PLANNING,
    to: "/planning",
  },
  {
    icon: "mdi-account-multiple-plus",
    title: "Inscriptions",
    permission: ENROLL_NEWCOMER,
    to: "/registrations",
  },
  {
    icon: "mdi-clock-edit",
    title: "Charisme des dispos",
    permission: AFFECT_VOLUNTEER,
    to: "/charisma-period",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Orga-Tâche",
    permission: AFFECT_VOLUNTEER,
    to: "/assignment/orga-task",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Tâche-Orga",
    permission: AFFECT_VOLUNTEER,
    to: "/assignment/task-orga",
  },
  {
    icon: "mdi-clock",
    title: "Besoin orgas",
    permission: AFFECT_VOLUNTEER,
    to: "/orga-needs",
  },
  {
    icon: "mdi-clock-fast",
    title: "Timeline",
    permission: VIEW_TIMELINE,
    to: "/timeline",
  },
  {
    icon: "mdi-handshake",
    title: "A l'aide",
    permission: ASK_FOR_HELP,
    to: "/need-help",
  },
  {
    icon: "mdi-cog",
    title: "Config Système",
    permission: MANAGE_CONFIG,
    to: "/config",
  },
  {
    icon: "mdi-format-list-bulleted",
    title: "SG",
    permission: MANAGE_PERSONNAL_ACCOUNTS,
    to: "/SG",
  },
  {
    icon: "mdi-cash-multiple",
    title: "Transactions",
    permission: MANAGE_PERSONNAL_ACCOUNTS,
    to: "/transactions",
  },
  {
    icon: "mdi-bookshelf",
    title: "Catalogue Matos",
    permission: READ_GEAR_CATALOG,
    to: "/matos/catalog",
  },
  {
    icon: "mdi-warehouse",
    title: "Inventaire",
    permission: WRITE_INVENTORY,
    to: "/matos/inventory",
  },
  {
    icon: "mdi-truck",
    title: "Logistique",
    permission: WRITE_INVENTORY,
    to: "/matos/logistic",
  },
  {
    icon: "mdi-bookshelf",
    title: "Catalogue Signa",
    permission: READ_SIGNAGE_CATALOG,
    to: "/signa/catalog",
  },
  {
    icon: "mdi-web-sync",
    title: "Animations à publier",
    permission: READ_ANIMATION_TO_PUBLISH,
    to: "/public-animations",
  },
  {
    icon: "mdi-chart-areaspline-variant",
    title: "Stats",
    permission: VIEW_FESTIVAL_EVENTS_STATS,
    to: "/stats",
  },
];
