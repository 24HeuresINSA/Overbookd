import {
  AFFECT_VOLUNTEER,
  ASK_FOR_HELP,
  ENROLL_NEWCOMER,
  FILL_AVAILABILITY,
  MANAGE_CONFIG,
  MANAGE_CONTRIBUTIONS,
  MANAGE_PERSONAL_ACCOUNTS,
  Permission,
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  READ_FT,
  READ_GEAR_CATALOG,
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_LOCATION,
  VIEW_FESTIVAL_EVENTS_STATS,
  VIEW_PLANNING,
  VIEW_TIMELINE,
  VIEW_TROMBINOSCOPE,
  VIEW_VOLUNTEER,
  WRITE_INVENTORY,
} from "@overbookd/permission";

export interface Page {
  icon: string;
  title: string;
  permission?: Permission;
  to: string;
  description: string;
  mobileSupport: boolean;
  keywords: string[];
}

export const pages: Page[] = [
  {
    icon: "mdi-apps",
    title: "Accueil",
    to: "/",
    description: "Page principale pour se rediriger vers toutes les autres",
    mobileSupport: true,
    keywords: [],
  },
  {
    icon: "mdi-account",
    title: "Profil",
    to: "/profile",
    description: "Page d'édition de ton profil",
    mobileSupport: true,
    keywords: ["profile", "photo", "commentaires"],
  },
  {
    icon: "mdi-image",
    title: "Trombinoscope",
    permission: VIEW_TROMBINOSCOPE,
    to: "/trombinoscope",
    description:
      "Liste de tous les bénévoles avec leur photo ce qui permet de mettre un visage sur un nom avant de se rencontrer",
    mobileSupport: false,
    keywords: ["trombinoscope", "photos"],
  },
  {
    icon: "mdi-chart-bubble",
    title: "Fiches Activités",
    permission: READ_FA,
    to: "/fa",
    description:
      "Liste des FAs, les FAs permettent de décrire tout ce qui va se passer sur le festival",
    mobileSupport: false,
    keywords: ["fas", "fiches-activites", "animations"],
  },
  {
    icon: "mdi-format-color-highlight",
    title: "Fiches Tâches",
    permission: READ_FT,
    to: "/ft",
    description:
      "Liste des FTs, les FTs permettent de décrire tout ce qui doit être fait pour le bon déroulement du festival",
    mobileSupport: false,
    keywords: ["fts", "fiche-taches"],
  },
  {
    icon: "mdi-account-group",
    title: "Liste des bénévoles",
    permission: VIEW_VOLUNTEER,
    to: "/volunteers",
    description: "Permet de voir tous les bénévoles",
    mobileSupport: true,
    keywords: ["benevoles", "orgas"],
  },
  {
    icon: "mdi-clock",
    title: "Mes dispos",
    permission: FILL_AVAILABILITY,
    to: "/availabilities",
    description:
      "Permet de renseigner quand tu es disponible pour aider sur le festival",
    mobileSupport: true,
    keywords: ["dispos", "disponibilites"],
  },
  {
    icon: "mdi-calendar-clock",
    title: "Planning",
    permission: VIEW_PLANNING,
    to: "/planning",
    description: "Permet d'avoir un apercu de son planning sur le festival",
    mobileSupport: false,
    keywords: ["planning", "calendrier", "taches", "affectation"],
  },
  {
    icon: "mdi-account-multiple-plus",
    title: "Inscriptions",
    permission: ENROLL_NEWCOMER,
    to: "/registrations",
    description:
      "Permet de visualiser tous les nouveaux arrivants sur Overbookd et de les enrôler",
    mobileSupport: true,
    keywords: ["arrivants", "inscriptions"],
  },
  {
    icon: "mdi-cash-multiple",
    title: "Cotisations",
    permission: MANAGE_CONTRIBUTIONS,
    to: "/contributions",
    description:
      "Permet d'enregistrer les cotisations des adhérents à l'association",
    mobileSupport: false,
    keywords: ["cotisations", "contributions"],
  },
  {
    icon: "mdi-clock-edit",
    title: "Charisme des dispos",
    permission: AFFECT_VOLUNTEER,
    to: "/charisma-periods",
    description:
      "Permet de définir les points de charisme des créneaux du festival",
    mobileSupport: false,
    keywords: ["charisme-dispos", "charisme-disponibilites"],
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Orga-Tâche",
    permission: AFFECT_VOLUNTEER,
    to: "/assignment/orga-task",
    description: "Permet d'affecter des bénévoles à des tâches",
    mobileSupport: false,
    keywords: ["affect", "orga-tache", "affectation"],
  },
  {
    icon: "mdi-human-greeting",
    title: "Affect Tâche-Orga",
    permission: AFFECT_VOLUNTEER,
    to: "/assignment/task-orga",
    description: "Permet d'affecter des tâches à des bénévoles",
    mobileSupport: false,
    keywords: ["affect", "tache-orga", "affectation"],
  },
  {
    icon: "mdi-clock",
    title: "Besoin orgas",
    permission: AFFECT_VOLUNTEER,
    to: "/orga-needs",
    description:
      "Permet de visualiser l'ensemble des bénévoles demandés pour réaliser les taches sur le festival",
    mobileSupport: false,
    keywords: ["benevoles", "demandes-benevoles", "besoin-benevoles", "orgas"],
  },
  {
    icon: "mdi-clock-fast",
    title: "Timeline",
    permission: VIEW_TIMELINE,
    to: "/timeline",
    description:
      "Permet de voir toutes les taches qui se déroulent pendant une plage horaire",
    mobileSupport: true,
    keywords: ["activite", "timeline"],
  },
  {
    icon: "mdi-handshake",
    title: "A l'aide",
    permission: ASK_FOR_HELP,
    to: "/need-help",
    description:
      "Permet de trouver un bénévole disponible pour venir aider sur une tâche",
    mobileSupport: true,
    keywords: ["aide-ponctuelle", "disponible"],
  },
  {
    icon: "mdi-cog",
    title: "Config Système",
    permission: MANAGE_CONFIG,
    to: "/config",
    description: "Permet de configurer Overbookd",
    mobileSupport: false,
    keywords: ["admin", "system", "configuration"],
  },
  {
    icon: "mdi-format-list-bulleted",
    title: "SG",
    permission: MANAGE_PERSONAL_ACCOUNTS,
    to: "/SG",
    description:
      "Permet de répartir les consommations des comptes perso aux adhérants",
    mobileSupport: false,
    keywords: [
      "comptes-perso",
      "consommations",
      "consomations",
      "placard",
      "biere",
    ],
  },
  {
    icon: "mdi-cash-multiple",
    title: "Transactions",
    permission: MANAGE_PERSONAL_ACCOUNTS,
    to: "/transactions",
    description:
      "Permet de visualiser les transactions effectuées sur Overbookd",
    mobileSupport: false,
    keywords: ["virements", "compte-perso", "transactions"],
  },
  {
    icon: "mdi-bookshelf",
    title: "Catalogue Matos",
    permission: READ_GEAR_CATALOG,
    to: "/matos/catalog",
    description:
      "Permet de définir l'ensemble du matériel disponible sur le festival",
    mobileSupport: false,
    keywords: ["catalogue-matos", "catalogue-materiel"],
  },
  {
    icon: "mdi-warehouse",
    title: "Inventaire",
    permission: WRITE_INVENTORY,
    to: "/matos/inventory",
    description:
      "Permet de compter l'ensemble du matériel appartenant à l'association",
    mobileSupport: false,
    keywords: ["inventaire", "matos", "materiel"],
  },
  {
    icon: "mdi-truck",
    title: "Logistique",
    permission: WRITE_INVENTORY,
    to: "/matos/logistic",
    description:
      "Permet de visualiser l'ensemble des demandes de matériel sur le festival",
    mobileSupport: false,
    keywords: ["demandes-matos", "demandes-materiel"],
  },
  {
    icon: "mdi-map-marker",
    title: "Lieux de la Signa",
    permission: WRITE_SIGNAGE_LOCATION,
    to: "/signa/location",
    description:
      "Permet de définir l'ensemble des lieux disponible sur le festival",
    mobileSupport: false,
    keywords: ["lieux-signaletique"],
  },
  {
    icon: "mdi-bookshelf",
    title: "Catalogue Signa",
    permission: READ_SIGNAGE_CATALOG,
    to: "/signa/catalog",
    description:
      "Permet de définir l'ensemble de la signalétique disponible sur le festival",
    mobileSupport: false,
    keywords: ["catalogue-signaletique"],
  },
  {
    icon: "mdi-web-sync",
    title: "Animations à publier",
    permission: READ_ANIMATION_TO_PUBLISH,
    to: "/public-animations",
    description:
      "Permet de lister les animations surlesquelles communiquer via les réseaux sociaux ou le site web",
    mobileSupport: false,
    keywords: ["animations", "communication", "publier", "publication"],
  },
  {
    icon: "mdi-chart-areaspline-variant",
    title: "Stats",
    permission: VIEW_FESTIVAL_EVENTS_STATS,
    to: "/stats",
    description:
      "Permet d'avoir un apercu de l'avancée des FAs et des FTs par rappport a l'édition précédente",
    mobileSupport: false,
    keywords: [
      "statistiques",
      "fas",
      "fiches-activites",
      "fts",
      "fiche-taches",
      "animations",
    ],
  },
];
