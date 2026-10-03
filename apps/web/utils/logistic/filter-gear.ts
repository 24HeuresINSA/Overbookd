import type { CatalogCategory } from "@overbookd/logistic";
import type { Team } from "@overbookd/team";

export type FilterGear = {
  search: string;
  category?: CatalogCategory;
  team?: Team;
};
