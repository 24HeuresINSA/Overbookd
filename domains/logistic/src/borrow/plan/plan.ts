import { Borrow } from "../borrow";
import { BorrowNotFound } from "../borrow.error";

export type BorrowsForPlan = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  save(borrow: Borrow): Promise<Borrow>;
};

export class PlanBorrow {
  constructor(private readonly borrows: BorrowsForPlan) {}

  async lender(id: Borrow["id"], lender: string): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);
    return this.borrows.save({ id, lender });
  }
}
