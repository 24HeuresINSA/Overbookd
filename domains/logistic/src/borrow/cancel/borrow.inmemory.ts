import { Borrow } from "../borrow.js";
import { BorrowsForCancel } from "./cancel.js";

export class InMemoryBorrows implements BorrowsForCancel {
  constructor(private borrows: Borrow[] = []) {}

  remove(id: Borrow["id"]): Promise<void> {
    this.borrows = this.borrows.filter((borrow) => borrow.id !== id);
    return Promise.resolve();
  }

  get all(): Borrow[] {
    return this.borrows;
  }
}
