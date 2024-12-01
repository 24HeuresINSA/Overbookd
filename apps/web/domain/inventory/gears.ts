import type { CatalogGear } from "@overbookd/http";

export type Gears = {
  find(gearCode: string): Promise<CatalogGear | undefined>;
};
