import { Period } from "@overbookd/period";
import { Borrow } from "../borrow";
import { BorrowNotFound } from "../borrow.error";
import { GearRequest, GearRequests } from "../../gear-request";
import { NotEnoughQuantity } from "../../forms.error";

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
