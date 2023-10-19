export const FESTIVAL_ACTIVITY_NOT_FOUND_ERROR_MESSAGE =
  "La fiche activité n'a pas été trouvée";

class FestivalActivityError extends Error {}

export class NotFound extends FestivalActivityError {
  constructor() {
    super(FESTIVAL_ACTIVITY_NOT_FOUND_ERROR_MESSAGE);
  }
}
