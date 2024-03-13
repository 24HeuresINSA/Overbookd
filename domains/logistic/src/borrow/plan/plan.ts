import { Borrow, GearRequest } from "../borrow";
import { BorrowNotFound } from "../borrow.error";

export type BorrowsForPlan = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  save(borrow: Borrow): Promise<Borrow>;
};

export class PlanBorrow {
  constructor(private readonly borrows: BorrowsForPlan) {}

  async changeLender(id: Borrow["id"], lender: string): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);
    return this.borrows.save({ ...borrow, lender });
  }

  async pickUpGear(id: Borrow["id"], gear: GearRequest): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);

    const gearRequests = GearRequests.init(borrow.gearsToTake);
    const gearsToTake = gearRequests.add(gear).all;
    return this.borrows.save({ ...borrow, gearsToTake });
  }

  async cancelGearToPickUp(
    id: Borrow["id"],
    gearSlug: GearRequest["slug"],
  ): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);

    const gearRequests = GearRequests.init(borrow.gearsToTake);
    const gearsToTake = gearRequests.remove(gearSlug).all;
    return this.borrows.save({ ...borrow, gearsToTake });
  }
}

class GearRequests {
  private constructor(private gears: GearRequest[]) {}

  static init(gears: GearRequest[]): GearRequests {
    return new GearRequests(gears);
  }

  add(gear: GearRequest): GearRequests {
    return new GearRequests([...this.gears, gear]);
  }

  remove(slug: GearRequest["slug"]): GearRequests {
    return new GearRequests(this.gears.filter((gear) => gear.slug !== slug));
  }

  get all(): GearRequest[] {
    return this.gears;
  }
}
