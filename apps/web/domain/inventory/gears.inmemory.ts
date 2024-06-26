import { SlugifyService } from "@overbookd/slugify";
import type { Gears } from "./gears";
import type { CatalogGear } from "@overbookd/http";

export class InMemoryGears implements Gears {
  constructor(private gears: CatalogGear[]) {}

  find(gearName: string): Promise<CatalogGear | undefined> {
    return Promise.resolve(
      this.gears.find((gear) => gear.slug === SlugifyService.apply(gearName)),
    );
  }
}
