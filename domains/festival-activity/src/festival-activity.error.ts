function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvé`;
}

const TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une créneau existe déjà à ces heures";

const CONTRACTOR_ALREADY_EXISTS_ERROR_MESSAGE = "Ce prestataire existe déjà";

const CONTRACTOR_NOT_FOUND_ERROR_MESSAGE =
  "Ce prestataire n'existe pas dans la fiche activité";

export class FestivalActivityError extends Error {}

export class FestivalActivityNotFound extends FestivalActivityError {
  constructor(id: number) {
    super(buildFestivalActivityNotFoundErrorMessage(id));
  }
}

class NotInDraft extends FestivalActivityError {
  constructor(id: number) {
    super(
      `La fiche activité #${id} n'a pas été passée en demande de relecture. Seules des fiches activités en brouillon le peuvent`,
    );
  }
}

export const Review = {
  NotInDraft,
};

export class TimeWindowAlreadyExists extends FestivalActivityError {
  constructor() {
    super(TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}

export class ContractorAlreadyExists extends FestivalActivityError {
  constructor() {
    super(CONTRACTOR_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}

export class ContractorNotFound extends FestivalActivityError {
  constructor() {
    super(CONTRACTOR_NOT_FOUND_ERROR_MESSAGE);
  }
}
