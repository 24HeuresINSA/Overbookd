import { numberGenerator } from "@overbookd/list";
import { Borrow } from "../borrow";

export type BorrowsForCreate = {
  add(borrow: Borrow): Promise<Borrow>;
};

export class CreateBorrow {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly borrows: BorrowsForCreate) {}

  async for(lender: string): Promise<Borrow> {
    const borrow = { id: this.generateId(), lender };
    return this.borrows.add(borrow);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
