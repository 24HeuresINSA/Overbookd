import { SlugifyService } from "@overbookd/slugify";
import { Gears } from "./gears";
import { CatalogGear } from "@overbookd/http";

export class InMemoryGears implements Gears {
  constructor(private gears: CatalogGear[]) {}

  find(gearName: string): Promise<CatalogGear | undefined> {
    return Promise.resolve(
      this.gears.find((gear) => gear.slug === SlugifyService.apply(gearName)),
    );
  }
}
