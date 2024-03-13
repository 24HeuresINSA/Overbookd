import { Borrow } from "../borrow";
import { BorrowNotFound } from "../borrow.error";

export type BorrowsForUpdate = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  save(borrow: Borrow): Promise<Borrow>;
};

export class UpdateBorrow {
  constructor(private readonly borrows: BorrowsForUpdate) {}

  async lender(id: Borrow["id"], lender: string): Promise<Borrow> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);
    return this.borrows.save({ id, lender });
  }
}
