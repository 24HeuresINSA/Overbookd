import { Borrow } from "../borrow.js";

export type BorrowsForCancel = {
  remove(id: Borrow["id"]): Promise<void>;
};

export class CancelBorrow {
  constructor(private readonly borrows: BorrowsForCancel) {}

  async apply(id: Borrow["id"]): Promise<void> {
    return this.borrows.remove(id);
  }
}
