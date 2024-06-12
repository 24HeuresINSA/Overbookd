import { Borrow } from "../borrow.js";
import { BorrowsForInit } from "./init.js";

export class InMemoryBorrows implements BorrowsForInit {
  constructor(private borrows: Borrow[] = []) {}

  add(borrow: Borrow): Promise<Borrow> {
    this.borrows = [...this.borrows, borrow];
    return Promise.resolve(borrow);
  }

  get all(): Borrow[] {
    return this.borrows;
  }
}
