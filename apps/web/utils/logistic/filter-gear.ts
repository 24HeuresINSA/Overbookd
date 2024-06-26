import type { CatalogCategory, Team } from "@overbookd/http";

export type FilterGear = {
  name: string;
  category: CatalogCategory | null;
  team: Pick<Team, "name" | "code"> | null;
};
