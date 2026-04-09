import type { CatalogGear } from "@overbookd/http";
import type { Gears } from "./gears";

export class InMemoryGears implements Gears {
  constructor(private gears: CatalogGear[]) {}

  find(gearCode: string): Promise<CatalogGear | undefined> {
    return Promise.resolve(this.gears.find((gear) => gear.code === gearCode));
  }
}
