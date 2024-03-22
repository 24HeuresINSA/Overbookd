import { Period } from "@overbookd/period";
import { Borrow, GearRequest } from "../borrow";
import {
  AlreadyAddedGear,
  BorrowNotFound,
  NotEnoughQuantity,
} from "../borrow.error";

export type PlanBorrowForm = {
  lender?: Borrow["lender"];
  availableOn?: Borrow["availableOn"];
  unavailableOn?: Borrow["unavailableOn"];
};

export type BorrowsForPlan = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  save(borrow: Borrow): Promise<Borrow>;
};

export class PlanBorrow {
  constructor(private readonly borrows: BorrowsForPlan) {}

  async update(id: Borrow["id"], update: PlanBorrowForm): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);

    const updated = { ...borrow, ...update };
    Period.init({ start: updated.availableOn, end: updated.unavailableOn });

    return this.borrows.save(updated);
  }

  async addGear(id: Borrow["id"], gear: GearRequest): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);

    if (gear.quantity < 1) throw new NotEnoughQuantity();

    const gearRequests = GearRequests.init(borrow.gears);
    const gears = gearRequests.add(gear).all;
    return this.borrows.save({ ...borrow, gears });
  }

  async removeGear(
    id: Borrow["id"],
    gearSlug: GearRequest["slug"],
  ): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);

    const gearRequests = GearRequests.init(borrow.gears);
    const gears = gearRequests.remove(gearSlug).all;
    return this.borrows.save({ ...borrow, gears });
  }
}

class GearRequests {
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
