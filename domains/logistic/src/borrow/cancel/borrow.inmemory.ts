import { Borrow } from "../borrow";
import { BorrowsForCancel } from "./cancel";

export class InMemoryBorrows implements BorrowsForCancel {
  constructor(private borrows: Borrow[] = []) {}

  find(id: Borrow["id"]): Promise<Borrow | undefined> {
    return Promise.resolve(this.borrows.find((borrow) => borrow.id === id));
  }

  remove(id: Borrow["id"]): Promise<void> {
    this.borrows = this.borrows.filter((borrow) => borrow.id !== id);
    return Promise.resolve();
  }

  get all(): Borrow[] {
    return this.borrows;
  }
}
