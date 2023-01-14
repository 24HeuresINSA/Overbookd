import { Category, Gear } from "~/utils/models/catalog.model";

const teamMatos = { name: "Orga Logistique Matos", code: "matos" };

const outils: Category = {
  id: 2,
  name: "Outils",
  path: "bricollage->outils",
  owner: teamMatos,
  parent: 1,
};
export const marteau: Gear = {
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
};
export const perceuse: Gear = {
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
};
export const scieCirculaire: Gear = {
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
};
