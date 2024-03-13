import { LoanSheetsForCreate } from "./create";
import { LoanSheet } from "../loan-sheet";

export class InMemoryLoanSheets implements LoanSheetsForCreate {
  constructor(private loanSheets: LoanSheet[] = []) {}

  add(loanSheet: LoanSheet): Promise<LoanSheet> {
    this.loanSheets = [...this.loanSheets, loanSheet];
    return Promise.resolve(loanSheet);
  }

  get all(): LoanSheet[] {
    return this.loanSheets;
  }
}
