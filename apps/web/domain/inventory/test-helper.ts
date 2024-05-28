import { CatalogCategory, CatalogGear } from "@overbookd/http";

const teamMatos = { name: "Orga Logistique Matos", code: "matos" };

const outils: CatalogCategory = {
  id: 2,
  name: "Outils",
  path: "bricollage->outils",
  owner: teamMatos,
  parent: 1,
};
export const marteau: CatalogGear = {
  id: 1,
  name: "Marteau",
  slug: "marteau",
  category: {
    id: outils.id,
    path: outils.path,
    name: outils.name,
  },
  owner: teamMatos,
  code: "BR_OU_001",
  isPonctualUsage: true,
  isConsumable: false,
};
export const perceuse: CatalogGear = {
  id: 2,
  name: "Perceuse",
  slug: "perceuse",
  category: {
    id: outils.id,
    path: outils.path,
    name: outils.name,
  },
  owner: teamMatos,
  code: "BR_OU_002",
  isPonctualUsage: true,
  isConsumable: false,
};
export const scieCirculaire: CatalogGear = {
  id: 2,
  name: "Scie Circulaire",
  slug: "scie-circulaire",
  category: {
    id: outils.id,
    path: outils.path,
    name: outils.name,
  },
  owner: teamMatos,
  code: "BR_OU_003",
  isPonctualUsage: false,
  isConsumable: false,
};
