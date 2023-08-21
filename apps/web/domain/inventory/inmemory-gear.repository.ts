import { Gear } from "~/utils/models/catalog.model";
import { SlugifyService } from "../common/slugify.service";
import { GearRepository } from "./gear.repository";

export class InMemoryGearRepository implements GearRepository {
  constructor(private gears: Gear[]) {}

  find(gearName: string): Promise<Gear | undefined> {
    return Promise.resolve(
      this.gears.find((gear) => gear.slug === SlugifyService.apply(gearName))
    );
  }
}
