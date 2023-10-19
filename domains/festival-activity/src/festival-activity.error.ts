function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité festival #${id} n'a pas été trouvé`;
}

class FestivalActivityError extends Error {}

export class FestivalActivityNotFound extends FestivalActivityError {
  constructor(id: number) {
    super(buildFestivalActivityNotFoundErrorMessage(id));
  }
}
