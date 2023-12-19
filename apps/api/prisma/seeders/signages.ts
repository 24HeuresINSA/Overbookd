import { AFFICHE, PANNEAU, BACHE, Signage } from "@overbookd/signa";

type CreateSignage = Omit<Signage, "id">;

export const signages: CreateSignage[] = [
  {
    name: "Affiche 24 A2",
    slug: "affiche-24-a2",
    type: AFFICHE,
  },
  {
    name: "Bonjour vert 2x4",
    slug: "bonjour-vert-2x4",
    type: PANNEAU,
  },
  {
    name: "Bienvenue vert 10x2",
    slug: "bienvenue-vert-10x2",
    type: BACHE,
  },
  {
    name: "Bâche sponsor",
    slug: "bache-sponsor",
    type: BACHE,
  },
  {
    name: "Panneau Escape Game",
    slug: "panneau-escape-game",
    type: PANNEAU,
  },
  {
    name: "Flèche toilettes",
    slug: "fleche-toilettes",
    type: PANNEAU,
  },
  {
    name: "24h light",
    slug: "24h-light",
    type: AFFICHE,
  },
];
