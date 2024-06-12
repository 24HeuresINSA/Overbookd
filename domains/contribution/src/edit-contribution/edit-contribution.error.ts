import { ContributionError } from "../contribution.error.js";

const NOT_FOUND_CONTRIBUTION_ERROR_MESSAGE =
  "La cotisation n'a pas été trouvée";

class EditAmountError extends ContributionError {}

export class NotFoundContribution extends EditAmountError {
  constructor() {
    super(NOT_FOUND_CONTRIBUTION_ERROR_MESSAGE);
  }
}
