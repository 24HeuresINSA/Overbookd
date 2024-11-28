import type { CatalogCategory } from "@overbookd/http";
import type { Team } from "@overbookd/team";

export type FilterGear = {
  search: string;
  category?: CatalogCategory;
  team?: Team;
};
