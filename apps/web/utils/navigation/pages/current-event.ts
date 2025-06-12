import { ASK_FOR_HELP, VIEW_TIMELINE } from "@overbookd/permission";
import type { PageInSummary } from "./summary-pages";
import { NEED_HELP_URL, TIMELINE_URL } from "@overbookd/web-page";

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

export const CURRENT_EVENT_SUMMARY_PAGES: PageInSummary[] = [
  TIMELINE_PAGE,
  NEED_HELP_PAGE,
];
