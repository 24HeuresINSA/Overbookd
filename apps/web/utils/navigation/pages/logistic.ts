import {
  BORROW_GEARS,
  PURCHASE_GEARS,
  READ_GEAR_CATALOG,
  READ_INVENTORY,
  READ_SIGNAGE_CATALOG,
  VIEW_GEAR_DASHBOARD,
  VIEW_LOCATION,
} from "@overbookd/permission";
import type { Page, HiddenPage, PageInSummary } from "./summary-pages";
import {
  BORROW_GEARS_URL,
  GEAR_CATALOG_URL,
  GEAR_DASHBOARD_URL,
  INVENTORY_URL,
  LOCATION_URL,
  PURCHASE_GEARS_URL,
  SIGNAGE_CATALOG_URL,
} from "@overbookd/web-page";

const GEAR_CATALOG_PAGE: PageInSummary = {
  icon: "mdi-bookshelf",
  title: "Catalogue Matos",
  permission: READ_GEAR_CATALOG,
  to: GEAR_CATALOG_URL,
  description:
    "Permet de définir l'ensemble du matériel disponible sur le festival",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
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
  to: INVENTORY_URL,
  description:
    "Permet de compter l'ensemble du matériel appartenant à l'association",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["inventaire", "matos", "materiel", "logistique"],
};

const GEAR_DASHBOARD_PAGE: PageInSummary = {
  icon: "mdi-chart-histogram",
  title: "Récap Matos",
  permission: VIEW_GEAR_DASHBOARD,
  to: GEAR_DASHBOARD_URL,
  description:
    "Permet de visualiser l'évolution du besoin / stock du matos sur l'année",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["recap-matos", "dashboard", "demandes-matos", "demandes-materiel"],
};

const PURCHASE_GEARS_LIST_PAGE: PageInSummary = {
  icon: "mdi-cash-register",
  title: "Fiches Achat",
  permission: PURCHASE_GEARS,
  to: PURCHASE_GEARS_URL,
  description: "Permet de gérer les achats de matériel",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["fiches-achats", "achats", "materiel", "matos", "fiches"],
};

const PURCHASE_GEARS_PAGE: HiddenPage = {
  title: "Fiche Achat",
  permission: PURCHASE_GEARS,
  to: PURCHASE_GEARS_URL,
  mobileSupport: false,
  canBeFavorite: false,
  hasParam: true,
};

const BORROW_GEARS_LIST_PAGE: PageInSummary = {
  icon: "mdi-store-clock",
  title: "Fiches Emprunt",
  permission: BORROW_GEARS,
  to: BORROW_GEARS_URL,
  description: "Permet de gérer les emprunts de matériel",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["fiches-emprunts", "emprunts", "materiel", "matos", "fiches"],
};

const BORROW_GEARS_PAGE: HiddenPage = {
  title: "Fiche Emprunt",
  permission: BORROW_GEARS,
  to: BORROW_GEARS_URL,
  mobileSupport: false,
  canBeFavorite: false,
  hasParam: true,
};

const LOCATION_PAGE: PageInSummary = {
  icon: "mdi-map-marker",
  title: "Lieux de la Signa",
  permission: VIEW_LOCATION,
  to: LOCATION_URL,
  description:
    "Permet de définir l'ensemble des lieux disponible sur le festival",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
  keywords: ["lieux-signaletique", "localisation", "carte", "plan"],
};

const SIGNAGE_CATALOG_PAGE: PageInSummary = {
  icon: "mdi-bookshelf",
  title: "Catalogue Signa",
  permission: READ_SIGNAGE_CATALOG,
  to: SIGNAGE_CATALOG_URL,
  description:
    "Permet de définir l'ensemble de la signalétique disponible sur le festival",
  mobileSupport: false,
  canBeFavorite: true,
  hasParam: false,
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
  GEAR_DASHBOARD_PAGE,
  PURCHASE_GEARS_LIST_PAGE,
  BORROW_GEARS_LIST_PAGE,
  LOCATION_PAGE,
  SIGNAGE_CATALOG_PAGE,
];

export const LOGISTIC_PAGES: Page[] = [
  ...LOGISTIC_SUMMARY_PAGES,
  PURCHASE_GEARS_PAGE,
  BORROW_GEARS_PAGE,
];
