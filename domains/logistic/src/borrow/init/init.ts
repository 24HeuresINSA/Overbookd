import { numberGenerator } from "@overbookd/list";
import { Borrow } from "../borrow";
import { AvailableDateAfterUnavailableDate } from "../borrow.error";

type InitBorrowForm = Pick<Borrow, "lender" | "availableOn" | "unavailableOn">;

export type BorrowsForInit = {
  add(borrow: Borrow): Promise<Borrow>;
};

export class InitBorrow {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly borrows: BorrowsForInit) {}

  async apply(form: InitBorrowForm): Promise<Borrow> {
    if (form.availableOn > form.unavailableOn) {
      throw new AvailableDateAfterUnavailableDate();
    }
    const borrow = {
      id: this.generateId(),
      ...form,
      gears: [],
    };
    return this.borrows.add(borrow);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
