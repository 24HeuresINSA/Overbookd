function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvé`;
}

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
