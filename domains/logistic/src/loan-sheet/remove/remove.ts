import { LoanSheet } from "../loan-sheet.model";

export type LoanSheetsForRemove = {
  remove(id: LoanSheet["id"]): Promise<void>;
};

export class RemoveLoanSheet {
  constructor(private readonly loanSheets: LoanSheetsForRemove) {}

  async apply(id: LoanSheet["id"]): Promise<void> {
    return this.loanSheets.remove(id);
  }
}
