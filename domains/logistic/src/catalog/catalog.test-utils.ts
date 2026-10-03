import { CatalogCategory, CategoryOwner } from "./category";
import { SavedCatalogGear } from "./gear";

export const MATOS_OWNER: CategoryOwner = {
  name: "Orga Logistique Matos",
  code: "matos",
};
export const BARRIERES_OWNER: CategoryOwner = {
  name: "Orga Logistique et Securite",
  code: "barrieres",
};

export const BRICOLAGE_CATEGORY: CatalogCategory = {
  id: 1,
  name: "Bricollage",
  path: "bricollage",
  owner: MATOS_OWNER,
};

export const OUTILS_CATEGORY: CatalogCategory = {
  id: 2,
  name: "Outils",
  path: "bricollage->outils",
  owner: MATOS_OWNER,
  parent: 1,
};

export const MOBILIER_CATEGORY: CatalogCategory = {
  id: 3,
  name: "Mobilier",
  path: "mobilier",
  owner: MATOS_OWNER,
};

export const DIVERS_CATEGORY: CatalogCategory = {
  id: 4,
  name: "Divers",
  path: "divers",
};

export const BARRIERES_CATEGORY: CatalogCategory = {
  id: 5,
  name: "Barrieres",
  path: "barrieres",
  owner: BARRIERES_OWNER,
};

export const NETTOYAGE_CATEGORY: CatalogCategory = {
  id: 6,
  name: "Nettoyage",
  path: "nettoyage",
  owner: MATOS_OWNER,
};

export const CATEGORIES: CatalogCategory[] = [
  BRICOLAGE_CATEGORY,
  OUTILS_CATEGORY,
  MOBILIER_CATEGORY,
  DIVERS_CATEGORY,
  BARRIERES_CATEGORY,
  NETTOYAGE_CATEGORY,
];

export const PERCEUSE: SavedCatalogGear = {
  id: 1,
  name: "Perceuse",
  slug: "perceuse",
  category: {
    id: OUTILS_CATEGORY.id,
    path: OUTILS_CATEGORY.path,
    name: OUTILS_CATEGORY.name,
  },
  owner: MATOS_OWNER,
  isPonctualUsage: true,
  isConsumable: false,
};

export const CHAISE: SavedCatalogGear = {
  id: 2,
  name: "Chaise",
  slug: "chaise",
  category: {
    id: MOBILIER_CATEGORY.id,
    path: MOBILIER_CATEGORY.path,
    name: MOBILIER_CATEGORY.name,
  },
  owner: MATOS_OWNER,
  isPonctualUsage: false,
  isConsumable: false,
};

export const TIREUSE: SavedCatalogGear = {
  id: 3,
  name: "Tireuse",
  slug: "tireuse",
  isPonctualUsage: false,
  isConsumable: false,
};

export const TABLIER: SavedCatalogGear = {
  id: 4,
  name: "Tablier",
  slug: "tablier",
  isPonctualUsage: true,
  isConsumable: false,
};

export const PONCEUSE: SavedCatalogGear = {
  id: 5,
  name: "Ponçeuse",
  slug: "ponceuse",
  category: {
    id: OUTILS_CATEGORY.id,
    path: OUTILS_CATEGORY.path,
    name: OUTILS_CATEGORY.name,
  },
  owner: MATOS_OWNER,
  isPonctualUsage: true,
  isConsumable: false,
};

export const TABLE: SavedCatalogGear = {
  id: 6,
  name: "Table",
  slug: "table",
  category: {
    id: MOBILIER_CATEGORY.id,
    path: MOBILIER_CATEGORY.path,
    name: MOBILIER_CATEGORY.name,
  },
  owner: MATOS_OWNER,
  isPonctualUsage: false,
  isConsumable: false,
};
