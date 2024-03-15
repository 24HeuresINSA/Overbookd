import { Borrow } from "../borrow";

export type BorrowsForCancel = {
  remove(id: Borrow["id"]): Promise<void>;
};

export class CancelBorrow {
  constructor(private readonly borrows: BorrowsForCancel) {}

  async apply(id: Borrow["id"]): Promise<void> {
    return this.borrows.remove(id);
  }
}
