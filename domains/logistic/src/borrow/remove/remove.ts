import { Borrow } from "../borrow";
import { BorrowNotFound } from "../borrow.error";

export type BorrowsForRemove = {
  find(id: Borrow["id"]): Promise<Borrow | undefined>;
  remove(id: Borrow["id"]): Promise<void>;
};

export class RemoveBorrow {
  constructor(private readonly borrows: BorrowsForRemove) {}

  async apply(id: Borrow["id"]): Promise<void> {
    const borrow = await this.borrows.find(id);
    if (!borrow) throw new BorrowNotFound(id);
    return this.borrows.remove(id);
  }
}
