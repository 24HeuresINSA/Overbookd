import type { CatalogCategory } from "@overbookd/http";
import type { Team } from "@overbookd/team";

export type FilterGear = {
  name: string;
  category?: CatalogCategory;
  team?: Team;
};
