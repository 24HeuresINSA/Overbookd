import { Borrow } from "../borrow";
import { BorrowsForCreate } from "./create";

export class InMemoryBorrows implements BorrowsForCreate {
  constructor(private borrows: Borrow[] = []) {}

  add(borrow: Borrow): Promise<Borrow> {
    this.borrows = [...this.borrows, borrow];
    return Promise.resolve(borrow);
  }

  get all(): Borrow[] {
    return this.borrows;
  }
}
