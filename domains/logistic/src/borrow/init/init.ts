import { numberGenerator } from "@overbookd/list";
import { Borrow } from "../borrow";
import { Period } from "@overbookd/period";

export type InitBorrowForm = Pick<
  Borrow,
  "lender" | "availableOn" | "unavailableOn"
>;

export type BorrowsForInit = {
  add(borrow: Borrow): Promise<Borrow>;
};

export class InitBorrow {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly borrows: BorrowsForInit) {}

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
