import { LoanSheetNotFound } from "../loan-sheet.error";
import { LoanSheet } from "../loan-sheet.model";

export type LoanSheetsForRemove = {
  find(id: LoanSheet["id"]): Promise<LoanSheet | undefined>;
  remove(id: LoanSheet["id"]): Promise<void>;
};

export class RemoveLoanSheet {
  constructor(private readonly loanSheets: LoanSheetsForRemove) {}

  async apply(id: LoanSheet["id"]): Promise<void> {
    const loanSheet = await this.loanSheets.find(id);
    if (!loanSheet) throw new LoanSheetNotFound(id);
    return this.loanSheets.remove(id);
  }
}
