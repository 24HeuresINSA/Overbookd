import type { CatalogCategory, Team } from "@overbookd/http";

export type FilterGear = {
  name: string;
  category?: CatalogCategory;
  team?: Team;
};
