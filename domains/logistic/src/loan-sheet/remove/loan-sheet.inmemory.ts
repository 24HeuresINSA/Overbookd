import { LoanSheet } from "../loan-sheet.model";
import { LoanSheetsForRemove } from "./remove";

export class InMemoryLoanSheets implements LoanSheetsForRemove {
  constructor(private loanSheets: LoanSheet[] = []) {}

  find(id: LoanSheet["id"]): Promise<LoanSheet | undefined> {
    return Promise.resolve(
      this.loanSheets.find((loanSheet) => loanSheet.id === id),
    );
  }

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
