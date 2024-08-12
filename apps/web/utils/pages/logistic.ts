import {
  READ_GEAR_CATALOG,
  READ_INVENTORY,
  READ_SIGNAGE_CATALOG,
  VIEW_LOCATION,
} from "@overbookd/permission";
import type { PageInSummary } from "./navigation";

const GEAR_CATALOG_PAGE: PageInSummary = {
  icon: "mdi-bookshelf",
  title: "Catalogue Matos",
  permission: READ_GEAR_CATALOG,
  to: "/logistic/catalog",
  description:
    "Permet de définir l'ensemble du matériel disponible sur le festival",
  mobileSupport: false,
  keywords: [
    "catalogue-matos",
    "catalogue-materiel",
    "equipement",
    "logistique",
  ],
};

const INVENTORY_PAGE: PageInSummary = {
  icon: "mdi-warehouse",
  title: "Inventaire Matos",
  permission: READ_INVENTORY,
  to: "/logistic/inventory",
  description:
    "Permet de compter l'ensemble du matériel appartenant à l'association",
  mobileSupport: false,
  keywords: ["inventaire", "matos", "materiel", "logistique"],
};

// const GEAR_DASHBOARD_PAGE: PageInSummary = {
//   icon: "mdi-chart-histogram",
//   title: "Récap Matos",
//   permission: VIEW_GEAR_DASHBOARD,
//   to: "/logistic/dashboard",
//   description:
//     "Permet de visualiser l'évolution du besoin / stock du matos sur l'année",
//   mobileSupport: false,
//   keywords: ["recap-matos", "dashboard", "demandes-matos", "demandes-materiel"],
// };

// const PURCHASE_GEARS_PAGE: PageInSummary = {
//   icon: "mdi-cash-register",
//   title: "Fiches Achats",
//   permission: PURCHASE_GEARS,
//   to: "/logistic/purchase",
//   description: "Permet de gérer les achats de matériel",
//   mobileSupport: false,
//   keywords: ["fiches-achats", "achats", "materiel", "matos", "fiches"],
// };

// const BORROW_GEARS_PAGE: PageInSummary = {
//   icon: "mdi-store-clock",
//   title: "Fiches Emprunts",
//   permission: BORROW_GEARS,
//   to: "/logistic/borrow",
//   description: "Permet de gérer les emprunts de matériel",
//   mobileSupport: false,
//   keywords: ["fiches-emprunts", "emprunts", "materiel", "matos", "fiches"],
// };

const LOCATION_PAGE: PageInSummary = {
  icon: "mdi-map-marker",
  title: "Lieux de la Signa",
  permission: VIEW_LOCATION,
  to: "/signa/location",
  description:
    "Permet de définir l'ensemble des lieux disponible sur le festival",
  mobileSupport: false,
  keywords: ["lieux-signaletique", "localisation"],
};

const SIGNAGE_CATALOG_PAGE: PageInSummary = {
  icon: "mdi-bookshelf",
  title: "Catalogue Signa",
  permission: READ_SIGNAGE_CATALOG,
  to: "/signa/catalog",
  description:
    "Permet de définir l'ensemble de la signalétique disponible sur le festival",
  mobileSupport: false,
  keywords: [
    "catalogue-signaletique",
    "panneau",
    "affiche",
    "bache",
    "pancarte",
  ],
};

export const LOGISTIC_SUMMARY_PAGES: PageInSummary[] = [
  GEAR_CATALOG_PAGE,
  INVENTORY_PAGE,
  // GEAR_DASHBOARD_PAGE,
  // PURCHASE_GEARS_PAGE,
  // BORROW_GEARS_PAGE,
  LOCATION_PAGE,
  SIGNAGE_CATALOG_PAGE,
];
