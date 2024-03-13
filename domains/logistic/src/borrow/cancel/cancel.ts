import { Borrow } from "../borrow";
import { BorrowNotFound } from "../borrow.error";

export type BorrowsForCancel = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  remove(id: Borrow["id"]): Promise<void>;
};

export class CancelBorrow {
  constructor(private readonly borrows: BorrowsForCancel) {}

  async apply(id: Borrow["id"]): Promise<void> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);
    return this.borrows.remove(id);
  }
}
