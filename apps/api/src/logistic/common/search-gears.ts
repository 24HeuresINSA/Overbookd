import { CatalogGear, GearSearchOptions } from "@overbookd/logistic";

export type SearchGears = {
  search(searchOptions: GearSearchOptions): Promise<CatalogGear[]>;
};
