import { numberGenerator } from "@overbookd/list";
import { LoanSheet } from "../loan-sheet.model";

export type LoanSheetsForCreate = {
  add(loanSheet: LoanSheet): Promise<LoanSheet>;
};

export class CreateLoanSheet {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly loanSheets: LoanSheetsForCreate) {}

  for(lender: string): LoanSheet {
    const loanSheet = { id: this.generateId(), lender };
    this.loanSheets.add(loanSheet);
    return loanSheet;
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
