interface Page {
  icon: string;
  title: string;
  permission?: string;
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
    permission: "hard",
    to: "/trombinoscope",
  },
  {
    icon: "mdi-chart-bubble",
    title: "Fiches Activités",
    permission: "read-fa",
    to: "/fa",
  },
  {
    icon: "mdi-format-color-highlight",
    title: "Fiches Tâches",
    permission: "read-ft",
    to: "/ft",
  },
  {
    icon: "mdi-account-group",
    title: "Liste des bénévoles",
    permission: "hard",
    to: "/humans",
  },
  {
    icon: "mdi-clock",
    title: "Mes dispos",
    permission: "fill-availability",
    to: "/availabilities",
  },
  {
    icon: "mdi-calendar-clock",
    title: "Planning",
    permission: "hard",
    to: `/planning`,
  },
  {
    icon: "mdi-clock-edit",
    title: "Charisme des dispos",
    permission: "affect-volunteer",
    to: "/charismaPeriod",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Orga-Tâche",
    permission: "affect-volunteer",
    to: "/assignment/orga-task",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Tâche-Orga",
    permission: "affect-volunteer",
    to: "/assignment/task-orga",
  },
  {
    icon: "mdi-clock",
    title: "Besoin orgas",
    permission: "affect-volunteer",
    to: "/orga-needs",
  },
  {
    icon: "mdi-clock-fast",
    title: "Timeline",
    permission: "view-timeline",
    to: "/timeline",
  },
  {
    icon: "mdi-handshake",
    title: "A l'aide",
    permission: "ask-for-help",
    to: "/need-help",
  },
  {
    icon: "mdi-cog",
    permission: "manage-config",
    title: "Config Système",
    to: "/config",
  },
  {
    icon: "mdi-format-list-bulleted",
    permission: "manage-cp",
    title: "SG",
    to: "/SG",
  },
  {
    icon: "mdi-cash-multiple",
    permission: "manage-cp",
    title: "Transactions",
    to: "/transactions",
  },
  {
    icon: "mdi-bookshelf",
    permission: "read-catalog",
    title: "Catalogue",
    to: "/catalog",
  },
  {
    icon: "mdi-warehouse",
    permission: "write-inventory",
    title: "Inventaire",
    to: "/inventory",
  },
  {
    icon: "mdi-truck",
    permission: "write-inventory",
    title: "Logistique",
    to: "/logistic",
  },
  {
    icon: "mdi-web-sync",
    permission: "read-animation-to-publish",
    title: "Animations à publier",
    to: "/comcom",
  },
  {
    icon: "mdi-chart-areaspline-variant",
    title: "Stats",
    permission: "view-stats",
    to: "/stats",
  },
];
