function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvé`;
}

export const TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une créneau existe déjà à ces heures";

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

export class AdherentNotFound extends FestivalActivityError {
  constructor(adherentId: number) {
    super(`L'adhérent #${adherentId} n'a pas été trouvé`);
  }
}
