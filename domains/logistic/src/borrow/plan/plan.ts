import { Period } from "@overbookd/time";
import { Borrow } from "../borrow.js";
import { BorrowNotFound, NoDuration } from "../borrow.error.js";
import { GearRequest, GearRequests } from "../../gear-request.js";
import { NotEnoughQuantity } from "../../logistic.error.js";

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
    const period = Period.init({
      start: updated.availableOn,
      end: updated.unavailableOn,
    });
    if (!period.hasDuration) throw new NoDuration();

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
