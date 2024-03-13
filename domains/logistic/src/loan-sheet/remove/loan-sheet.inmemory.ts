import { LoanSheet } from "../loan-sheet.model";
import { LoanSheetsForRemove } from "./remove";

export class InMemoryLoanSheets implements LoanSheetsForRemove {
  constructor(private loanSheets: LoanSheet[] = []) {}

  remove(id: LoanSheet["id"]): Promise<void> {
    this.loanSheets = this.loanSheets.filter(
      (loanSheet) => loanSheet.id !== id,
    );
    return Promise.resolve();
  }

  get all(): LoanSheet[] {
    return this.loanSheets;
  }
}
