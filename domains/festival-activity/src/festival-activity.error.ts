function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvé`;
}

export const GENERAL_TIME_WINOW_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une créneau existe déjà à ces heures pour cette activité";

export const GENERAL_TIME_WINDOW_NOT_FOUND_ERROR_MESSAGE =
  "Le créneau n'a pas été trouvé";

class FestivalActivityError extends Error {}

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

export class GeneralTimeWindowAlreadyExists extends FestivalActivityError {
  constructor() {
    super(GENERAL_TIME_WINOW_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}

export class GeneralTimeWindowNotFound extends FestivalActivityError {
  constructor() {
    super(GENERAL_TIME_WINDOW_NOT_FOUND_ERROR_MESSAGE);
  }
}
