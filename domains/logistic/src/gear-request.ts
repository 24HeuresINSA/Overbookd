import { AlreadyAddedGear } from "./logistic.error";

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
    const existingGear = this.gears.some((g) => g.slug === gear.slug);
    if (existingGear) throw new AlreadyAddedGear(gear.name);
    return new GearRequests([...this.gears, gear]);
  }

  remove(slug: GearRequest["slug"]): GearRequests {
    return new GearRequests(this.gears.filter((gear) => gear.slug !== slug));
  }

  get all(): GearRequest[] {
    return this.gears;
  }
}
