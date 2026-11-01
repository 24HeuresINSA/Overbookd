import { ContributionError } from "../contribution.error.js";

const NOT_FOUND_CONTRIBUTION_ERROR_MESSAGE =
  "La cotisation n'a pas été trouvée";

class EditContributionError extends ContributionError {}

export class NotFoundContribution extends EditContributionError {
  constructor() {
    super(NOT_FOUND_CONTRIBUTION_ERROR_MESSAGE);
  }
}
