import { LoanSheetNotFound } from "../loan-sheet.error";
import { LoanSheet } from "../loan-sheet.model";

export type LoanSheetsForUpdate = {
  find(id: LoanSheet["id"]): Promise<LoanSheet | undefined>;
  save(loanSheet: LoanSheet): Promise<LoanSheet>;
};

export class UpdateLoanSheet {
  constructor(private readonly loanSheets: LoanSheetsForUpdate) {}

  async lender(id: LoanSheet["id"], lender: string): Promise<LoanSheet> {
    const loanSheet = await this.loanSheets.find(id);
    if (!loanSheet) throw new LoanSheetNotFound(id);
    return this.loanSheets.save({ id, lender });
  }
}
