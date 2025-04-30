import { updateItemToList } from "@overbookd/list";

export type Gear = {
  slug: string;
  name: string;
};

export type GearRequest = Gear & {
  quantity: number;
};

export class GearRequests {
  private constructor(private gears: GearRequest[]) {}

  static init(gears: GearRequest[]): GearRequests {
    return new GearRequests(gears);
  }

  add(gear: GearRequest): GearRequests {
    const existingGearIndex = this.gears.findIndex((g) => g.slug === gear.slug);
    if (existingGearIndex === -1) {
      return new GearRequests([...this.gears, gear]);
    }
    return new GearRequests(
      updateItemToList(this.gears, existingGearIndex, gear),
    );
  }

  remove(slug: GearRequest["slug"]): GearRequests {
    return new GearRequests(this.gears.filter((gear) => gear.slug !== slug));
  }

  get all(): GearRequest[] {
    return this.gears;
  }
}
