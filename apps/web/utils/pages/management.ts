import {
  ENROLL_HARD,
  MANAGE_CHARISMA_EVENTS,
  MANAGE_CONFIG,
  MANAGE_CONTRIBUTIONS,
  MANAGE_PERSONAL_ACCOUNTS,
} from "@overbookd/permission";
import type { PageInSummary } from "./navigation";

const CONFIGURATION_PAGE: PageInSummary = {
  icon: "mdi-cog",
  title: "Config Système",
  permission: MANAGE_CONFIG,
  to: "/configuration",
  description: "Permet de configurer Overbookd",
  mobileSupport: true,
  keywords: ["administration", "system", "configuration"],
};

const REGISTRATIONS_HARD_PAGE: PageInSummary = {
  icon: "mdi-account-multiple-plus",
  title: "Admission Organisateurs",
  permission: ENROLL_HARD,
  to: "/registrations/staff",
  description: "Permet d'enrôler les nouveaux arrivants en tant que hard",
  mobileSupport: false,
  keywords: [
    "nouveaux-arrivants",
    "inscriptions",
    "admissions",
    "orgas",
    "hards",
  ],
};

// const REGISTRATIONS_SOFT_PAGE: Page = {
//   icon: "mdi-account-multiple-check",
//   title: "Admission Bénévoles",
//   permission: ENROLL_SOFT,
//   to: "/registrations/volunteer",
//   description: "Permet d'enrôler les nouveaux arrivants en tant que soft",
//   mobileSupport: false,
//   keywords: ["nouveaux-arrivants", "inscriptions", "admissions", "benevoles", "softs"],
// };

const CONTRIBUTIONS_PAGE: PageInSummary = {
  icon: "mdi-cash-multiple",
  title: "Cotisations",
  permission: MANAGE_CONTRIBUTIONS,
  to: "/contributions",
  description:
    "Permet d'enregistrer les cotisations des adhérents à l'association",
  mobileSupport: false,
  keywords: ["cotisations", "contributions", "cotiz"],
};

const SG_PAGE: PageInSummary = {
  icon: "mdi-format-list-bulleted",
  title: "SG",
  permission: MANAGE_PERSONAL_ACCOUNTS,
  to: "/sg",
  description:
    "Permet de répartir les consommations des comptes perso aux adhérants",
  mobileSupport: false,
  keywords: [
    "comptes-perso",
    "consommations",
    "consomations",
    "placard",
    "biere",
    "fut",
    "depot",
  ],
};

const TRANSACTIONS_PAGE: PageInSummary = {
  icon: "mdi-cash-multiple",
  title: "Transactions",
  permission: MANAGE_PERSONAL_ACCOUNTS,
  to: "/transactions",
  description: "Permet de visualiser les transactions effectuées sur Overbookd",
  mobileSupport: false,
  keywords: ["virements", "compte-perso", "transactions"],
};

const CHARISMA_EVENTS_MANAGE_PAGE: PageInSummary = {
  icon: "mdi-emoticon-cool",
  title: "Gestion du Charisme",
  permission: MANAGE_CHARISMA_EVENTS,
  to: "/charisma/events/manage",
  description:
    "Permet de gérer le charisme des bénévoles via la création d'événements",
  mobileSupport: false,
  keywords: ["charisme", "evenements"],
};

const CHARISMA_EVENTS_LIST_PAGE: PageInSummary = {
  icon: "mdi-format-list-numbered",
  title: "Evénements Charismatiques",
  permission: MANAGE_CHARISMA_EVENTS,
  to: "/charisma/events/list",
  description:
    "Permet de voir la liste des participations aux événements charismatiques",
  mobileSupport: false,
  keywords: ["charisme", "evenements", "participations"],
};

// const CHARISMA_PERIODS_PAGE: Page = {
//   icon: "mdi-clock-edit",
//   title: "Charisme des dispos",
//   permission: AFFECT_VOLUNTEER,
//   to: "/charisma-periods",
//   description:
//     "Permet de définir les points de charisme des créneaux du festival",
//   mobileSupport: false,
//   keywords: ["charisme-dispos", "charisme-disponibilites"],
// };

// const ASSIGNMENT_ORGA_TASK_PAGE: Page = {
//   icon: "mdi-human-greeting",
//   title: "Affect Orga-Tâche",
//   permission: AFFECT_VOLUNTEER,
//   to: "/assignment/orga-task",
//   description: "Permet d'affecter des bénévoles à des tâches",
//   mobileSupport: false,
//   keywords: ["orga-tache", "affectation"],
// };

// const ASSIGNMENT_TASK_ORGA_PAGE: Page = {
//   icon: "mdi-human-greeting",
//   title: "Affect Tâche-Orga",
//   permission: AFFECT_VOLUNTEER,
//   to: "/assignment/task-orga",
//   description: "Permet d'affecter des tâches à des bénévoles",
//   mobileSupport: false,
//   keywords: ["tache-orga", "affectation"],
// };

// const ORGA_NEEDS_PAGE: Page = {
//   icon: "mdi-clock",
//   title: "Besoin Orgas",
//   permission: AFFECT_VOLUNTEER,
//   to: "/orga-needs",
//   description:
//     "Permet de visualiser l'ensemble des bénévoles demandés pour réaliser les taches sur le festival",
//   mobileSupport: false,
//   keywords: ["benevoles", "demandes-benevoles", "besoin-benevoles", "orgas"],
// };

export const MANAGEMENT_SUMMARY_PAGES: PageInSummary[] = [
  CONFIGURATION_PAGE,
  REGISTRATIONS_HARD_PAGE,
  // REGISTRATIONS_SOFT_PAGE,
  CONTRIBUTIONS_PAGE,
  SG_PAGE,
  TRANSACTIONS_PAGE,
  CHARISMA_EVENTS_MANAGE_PAGE,
  CHARISMA_EVENTS_LIST_PAGE,
  // CHARISMA_PERIODS_PAGE,
  // ASSIGNMENT_ORGA_TASK_PAGE,
  // ASSIGNMENT_TASK_ORGA_PAGE,
  // ORGA_NEEDS_PAGE,
];
