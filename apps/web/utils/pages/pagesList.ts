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
    permission: "hard",
    to: "/fa",
  },
  {
    icon: "mdi-format-color-highlight",
    title: "Fiches Tâches",
    permission: "hard",
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
    to: "/availabilities",
  },
  {
    icon: "mdi-calendar-clock",
    title: "Planning",
    permission: "hard",
    to: `/calendar/me`,
  },
  {
    icon: "mdi-clock-edit",
    title: "Charisme des dispos",
    permission: "can-affect",
    to: "/charismaPeriod",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Orga-Tâche",
    permission: "can-affect",
    to: "/assignment/orga-task",
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Tâche-Orga",
    permission: "can-affect",
    to: "/assignment/task-orga",
  },
  {
    icon: "mdi-clock",
    title: "Besoin orgas",
    permission: "can-affect",
    to: "/orga-needs",
  },
  {
    icon: "mdi-clock-fast",
    title: "Timeline",
    permission: "can-view-timeline",
    to: "/timeline",
  },
  {
    icon: "mdi-handshake",
    title: "A l'aide",
    permission: "can-ask-for-help",
    to: "/need-help",
  },
  {
    icon: "mdi-cog",
    permission: "admin",
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
    permission: "catalog-read",
    title: "Catalogue",
    to: "/catalog",
  },
  {
    icon: "mdi-warehouse",
    permission: "inventory-write",
    title: "Inventaire",
    to: "/inventory",
  },
  {
    icon: "mdi-truck",
    permission: "inventory-write",
    title: "Logistique",
    to: "/logistic",
  },
  {
    icon: "mdi-web-sync",
    permission: "communication-read",
    title: "Animations à publier",
    to: "/comcom",
  },
  {
    icon: "mdi-chart-areaspline-variant",
    title: "Stats",
    permission: "hard",
    to: "/stats",
  },
];
