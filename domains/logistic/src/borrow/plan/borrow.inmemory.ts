import { Borrow } from "../borrow";
import { BorrowsForPlan } from "./plan";

export class InMemoryBorrows implements BorrowsForPlan {
  constructor(private borrows: Borrow[] = []) {}

  find(id: Borrow["id"]): Promise<Borrow | undefined> {
    return Promise.resolve(this.borrows.find((borrow) => borrow.id === id));
  }

  save(update: Borrow): Promise<Borrow> {
    this.borrows = this.borrows.map((borrow) =>
      borrow.id === update.id ? update : borrow,
    );
    return Promise.resolve(update);
  }

  get all(): Borrow[] {
    return this.borrows;
  }
}
