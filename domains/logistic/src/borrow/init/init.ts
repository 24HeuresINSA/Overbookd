import { numberGenerator } from "@overbookd/list";
import { Borrow } from "../borrow.js";
import { Period } from "@overbookd/period";

export type InitBorrowForm = Pick<
  Borrow,
  "lender" | "availableOn" | "unavailableOn"
>;

export type BorrowsForInit = {
  add(borrow: Borrow): Promise<Borrow>;
};

export class InitBorrow {
  private idGenerator: Generator<number>;

  constructor(
    private readonly borrows: BorrowsForInit,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId);
  }

  async apply(form: InitBorrowForm): Promise<Borrow> {
    Period.init({ start: form.availableOn, end: form.unavailableOn });
    const borrow = {
      ...form,
      id: this.generateId(),
      gears: [],
    };
    return this.borrows.add(borrow);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
