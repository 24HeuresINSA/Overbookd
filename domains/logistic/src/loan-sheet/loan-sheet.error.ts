import { LoanSheet } from "./loan-sheet.model";

export class LoanSheetError extends Error {}

export class LoanSheetNotFound extends LoanSheetError {
  constructor(id: LoanSheet["id"]) {
    const message = `❌ La fiche emprunt #${id} n'a pas été trouvée`;
    super(message);
  }
}
