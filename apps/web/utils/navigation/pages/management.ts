import {
  AFFECT_VOLUNTEER,
  ENROLL_HARD,
  ENROLL_SOFT,
  MANAGE_CHARISMA_EVENTS,
  MANAGE_CONFIG,
  MANAGE_CONTRIBUTIONS,
  MANAGE_PERSONAL_ACCOUNTS,
} from "@overbookd/permission";
import type { PageInSummary } from "./summary-pages";
import {
  ASSIGNMENT_ORGA_TASK_URL,
  ASSIGNMENT_TASK_ORGA_URL,
  CHARISMA_EVENTS_LIST_URL,
  CHARISMA_EVENTS_MANAGE_URL,
  CHARISMA_PERIODS_URL,
  CONFIGURATION_URL,
  CONTRIBUTIONS_URL,
  ORGA_NEED_URL,
  REGISTRATIONS_STAFF_URL,
  REGISTRATIONS_VOLUNTEER_URL,
  SG_URL,
  TRANSACTIONS_URL,
} from "@overbookd/web-page";

const CONFIGURATION_PAGE: PageInSummary = {
  icon: "mdi-cog",
  title: "Config Système",
  permission: MANAGE_CONFIG,
  to: CONFIGURATION_URL,
  description: "Permet de configurer Overbookd",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["config-systeme", "administration", "configuration"],
};

const REGISTRATIONS_HARD_PAGE: PageInSummary = {
  icon: "mdi-account-multiple-plus",
  title: "Admission Organisateurs",
  permission: ENROLL_HARD,
  to: REGISTRATIONS_STAFF_URL,
  description:
    "Permet d'enrôler les nouveaux arrivants en tant qu'organisateurs",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "admission-organisateurs",
    "nouveaux-arrivants",
    "inscriptions",
    "admissions",
    "orgas",
    "hards",
  ],
};

const REGISTRATIONS_SOFT_PAGE: PageInSummary = {
  icon: "mdi-account-multiple-check",
  title: "Admission Bénévoles",
  permission: ENROLL_SOFT,
  to: REGISTRATIONS_VOLUNTEER_URL,
  description: "Permet d'enrôler les nouveaux arrivants en tant que bénévoles",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "admission-benevoles",
    "nouveaux-arrivants",
    "inscriptions",
    "admissions",
    "softs",
  ],
};

const CONTRIBUTIONS_PAGE: PageInSummary = {
  icon: "mdi-cash-multiple",
  title: "Cotisations",
  permission: MANAGE_CONTRIBUTIONS,
  to: CONTRIBUTIONS_URL,
  description:
    "Permet d'enregistrer les cotisations des adhérents à l'association",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["cotisations", "contributions", "cotiz"],
};

const SG_PAGE: PageInSummary = {
  icon: "mdi-format-list-bulleted",
  title: "SG",
  permission: MANAGE_PERSONAL_ACCOUNTS,
  to: SG_URL,
  description:
    "Permet de répartir les consommations des comptes perso aux adhérants",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "sg",
    "secretaire-generale",
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
  to: TRANSACTIONS_URL,
  description: "Permet de visualiser les transactions effectuées sur Overbookd",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["transactions", "virements", "compte-perso"],
};

const CHARISMA_EVENTS_MANAGE_PAGE: PageInSummary = {
  icon: "mdi-emoticon-cool",
  title: "Gestion du Charisme",
  permission: MANAGE_CHARISMA_EVENTS,
  to: CHARISMA_EVENTS_MANAGE_URL,
  description:
    "Permet de gérer le charisme des bénévoles via la création d'événements",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["gestion-du-charisme", "evenements"],
};

const CHARISMA_EVENTS_LIST_PAGE: PageInSummary = {
  icon: "mdi-format-list-numbered",
  title: "Evénements Charismatiques",
  permission: MANAGE_CHARISMA_EVENTS,
  to: CHARISMA_EVENTS_LIST_URL,
  description:
    "Permet de voir la liste des participations aux événements charismatiques",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["evenements-chaismatiques", "charisme", "participations"],
};

const CHARISMA_PERIODS_PAGE: PageInSummary = {
  icon: "mdi-clock-edit",
  title: "Charisme des dispos",
  permission: AFFECT_VOLUNTEER,
  to: CHARISMA_PERIODS_URL,
  description:
    "Permet de définir les points de charisme des créneaux du festival",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: [
    "charisme-des-dispos",
    "charisme-dispos",
    "charisme-disponibilites",
  ],
};

const ASSIGNMENT_ORGA_TASK_PAGE: PageInSummary = {
  icon: "mdi-human-greeting",
  title: "Affect Orga-Tâche",
  permission: AFFECT_VOLUNTEER,
  to: ASSIGNMENT_ORGA_TASK_URL,
  description: "Permet d'affecter des bénévoles à des tâches",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["affect-orga-tache", "affectation"],
};

const ASSIGNMENT_TASK_ORGA_PAGE: PageInSummary = {
  icon: "mdi-human-greeting",
  title: "Affect Tâche-Orga",
  permission: AFFECT_VOLUNTEER,
  to: ASSIGNMENT_TASK_ORGA_URL,
  description: "Permet d'affecter des tâches à des bénévoles",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["affect-tache-orga", "affectation"],
};

const ORGA_NEED_PAGE: PageInSummary = {
  icon: "mdi-clock",
  title: "Besoin Orgas",
  permission: AFFECT_VOLUNTEER,
  to: ORGA_NEED_URL,
  description:
    "Permet de visualiser l'ensemble des bénévoles demandés pour réaliser les taches sur le festival",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["besoin-orgas", "demandes-benevoles", "besoin-benevoles"],
};

export const MANAGEMENT_SUMMARY_PAGES: PageInSummary[] = [
  CONFIGURATION_PAGE,
  REGISTRATIONS_HARD_PAGE,
  REGISTRATIONS_SOFT_PAGE,
  CONTRIBUTIONS_PAGE,
  SG_PAGE,
  TRANSACTIONS_PAGE,
  CHARISMA_EVENTS_MANAGE_PAGE,
  CHARISMA_EVENTS_LIST_PAGE,
  CHARISMA_PERIODS_PAGE,
  ASSIGNMENT_ORGA_TASK_PAGE,
  ASSIGNMENT_TASK_ORGA_PAGE,
  ORGA_NEED_PAGE,
];
