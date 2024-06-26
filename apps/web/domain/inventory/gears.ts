import type { CatalogGear } from "@overbookd/http";

export type Gears = {
  find(gearName: string): Promise<CatalogGear | undefined>;
};
