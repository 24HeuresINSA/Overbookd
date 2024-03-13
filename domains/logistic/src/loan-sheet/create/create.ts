import { numberGenerator } from "@overbookd/list";
import { LoanSheet } from "../loan-sheet.model";

export type LoanSheetsForCreate = {
  add(loanSheet: LoanSheet): Promise<LoanSheet>;
};

export class CreateLoanSheet {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly loanSheets: LoanSheetsForCreate) {}

  async for(lender: string): Promise<LoanSheet> {
    const loanSheet = { id: this.generateId(), lender };
    await this.loanSheets.add(loanSheet);
    return loanSheet;
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
