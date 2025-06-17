import {
  ASK_FOR_HELP,
  VIEW_TIMELINE,
  MANAGE_SLEEP_ROOMS,
} from "@overbookd/permission";
import type { PageInSummary } from "./summary-pages";
import { NEED_HELP_URL, TIMELINE_URL, SLEEP_URL } from "@overbookd/web-page";

const TIMELINE_PAGE: PageInSummary = {
  icon: "mdi-clock",
  title: "Timeline",
  permission: VIEW_TIMELINE,
  to: TIMELINE_URL,
  description:
    "Permet de voir toutes les taches qui se déroulent pendant une plage horaire",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["timeline", "activite", "actuel", "en-cours"],
};

const NEED_HELP_PAGE: PageInSummary = {
  icon: "mdi-handshake",
  title: "Besoin d'aide",
  permission: ASK_FOR_HELP,
  to: NEED_HELP_URL,
  description:
    "Permet de trouver un bénévole disponible pour venir aider sur une tâche",
  mobileSupport: true,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["besoin-d-aide", "aide-ponctuelle", "disponible", "a-l-aide"],
};

const SLEEP_PAGE: PageInSummary = {
  icon: "mdi-bed-clock",
  title: "DodoMaker",
  permission: MANAGE_SLEEP_ROOMS,
  to: SLEEP_URL,
  description: "Permet de gérer les salles dodo pendant le festival.",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["salle-dodo", "qg-orga", "sommeil", "lit"],
};

export const CURRENT_EVENT_SUMMARY_PAGES: PageInSummary[] = [
  TIMELINE_PAGE,
  NEED_HELP_PAGE,
  SLEEP_PAGE,
];
