import { CatalogCategory, CategoryOwner } from "./category/category";
import { CatalogGear, SavedCatalogGear } from "./gear/gear";

export const MATOS_OWNER: CategoryOwner = {
  name: "Orga Logistique Matos",
  code: "matos",
};

export const BARRIERES_OWNER: CategoryOwner = {
  name: "Orga Logistique et Securite",
  code: "barrieres",
};

export const ELEC_OWNER: CategoryOwner = {
  name: "Orga Logistique Electricite & Eau",
  code: "elec",
};

export const SIGNA_OWNER: CategoryOwner = {
  name: "Orga Logistique Signalisation",
  code: "signa",
};

export const OWNERS: CategoryOwner[] = [
  MATOS_OWNER,
  ELEC_OWNER,
  BARRIERES_OWNER,
  SIGNA_OWNER,
];

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
  parent: BRICOLAGE_CATEGORY.id,
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

export const ELECTRIQUE_CATEGORY: CatalogCategory = {
  id: 8,
  name: "Electrique",
  path: "electrique",
  owner: ELEC_OWNER,
};

export const CABLE_CATEGORY: CatalogCategory = {
  id: 9,
  name: "Cable",
  path: "electrique->cable",
  owner: ELEC_OWNER,
  parent: ELECTRIQUE_CATEGORY.id,
};

export const GROSSE_TENSION_CATEGORY: CatalogCategory = {
  id: 10,
  name: "Grosse Tension",
  path: "electrique->cable->grosse-tension",
  owner: ELEC_OWNER,
  parent: CABLE_CATEGORY.id,
};

export const CATEGORIES: CatalogCategory[] = [
  BRICOLAGE_CATEGORY,
  OUTILS_CATEGORY,
  MOBILIER_CATEGORY,
  DIVERS_CATEGORY,
  BARRIERES_CATEGORY,
  NETTOYAGE_CATEGORY,
  ELECTRIQUE_CATEGORY,
  CABLE_CATEGORY,
  GROSSE_TENSION_CATEGORY,
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
export const PERCEUSE_WITH_CODE: CatalogGear = {
  ...PERCEUSE,
  code: "BR_OU_001",
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
export const CHAISE_WITH_CODE: CatalogGear = {
  ...CHAISE,
  code: "MO_002",
};

export const TIREUSE: SavedCatalogGear = {
  id: 3,
  name: "Tireuse",
  slug: "tireuse",
  isPonctualUsage: false,
  isConsumable: false,
};
export const TIREUSE_WITH_CODE: CatalogGear = TIREUSE;

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
