import { VIEW_TIMELINE } from "@overbookd/permission";
import type { PageInSummary } from "./navigation";
import { TIMELINE_URL } from "@overbookd/web-page";

const TIMELINE_PAGE: PageInSummary = {
  icon: "mdi-clock",
  title: "Timeline",
  permission: VIEW_TIMELINE,
  to: TIMELINE_URL,
  description:
    "Permet de voir toutes les taches qui se déroulent pendant une plage horaire",
  mobileSupport: true,
  canBeFavorite: true,
  keywords: ["activite", "timeline", "actuel", "en-cours"],
};

// const NEED_HELP_PAGE: PageInSummary = {
//   icon: "mdi-handshake",
//   title: "A l'aide",
//   permission: ASK_FOR_HELP,
//   to: NEED_HELP_URL,
//   description:
//     "Permet de trouver un bénévole disponible pour venir aider sur une tâche",
//   mobileSupport: true,
//   canBeFavorite: true,
//   keywords: ["aide-ponctuelle", "disponible", "besoin"],
// };

export const CURRENT_EVENT_SUMMARY_PAGES: PageInSummary[] = [
  TIMELINE_PAGE,
  // NEED_HELP_PAGE,
];
