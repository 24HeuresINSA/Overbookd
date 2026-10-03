import type { CatalogGear } from "@overbookd/logistic";

export type Gears = {
  find(gearCode: string): Promise<CatalogGear | undefined>;
};
