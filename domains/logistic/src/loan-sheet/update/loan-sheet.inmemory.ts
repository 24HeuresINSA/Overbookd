import { LoanSheet } from "../loan-sheet.model";
import { LoanSheetsForUpdate } from "./update";

export class InMemoryLoanSheets implements LoanSheetsForUpdate {
  constructor(private loanSheets: LoanSheet[] = []) {}

  find(id: LoanSheet["id"]): Promise<LoanSheet | undefined> {
    return Promise.resolve(
      this.loanSheets.find((loanSheet) => loanSheet.id === id),
    );
  }

  save(loanSheet: LoanSheet): Promise<LoanSheet> {
    this.loanSheets = this.loanSheets.map((ls) =>
      ls.id === loanSheet.id ? loanSheet : ls,
    );
    return Promise.resolve(loanSheet);
  }

  get all(): LoanSheet[] {
    return this.loanSheets;
  }
}
