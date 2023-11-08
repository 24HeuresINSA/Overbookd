function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvé`;
}

const TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une créneau existe déjà à ces heures";

const CONTRACTOR_NOT_FOUND_ERROR_MESSAGE =
  "Ce prestataire n'existe pas dans la fiche activité";

const ELECTRICITY_SUPPLY_NOT_FOUND_ERROR_MESSAGE =
  "Cette demande d'elec n'existe pas dans la fiche activité";

const ELECTRICITY_SUPPLY_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une demande d'elec similaire existe déjà dans la fiche activité";

const INQUIRY_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une demande de matos existe déjà pour ce matériel";

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

export class ContractorNotFound extends FestivalActivityError {
  constructor() {
    super(CONTRACTOR_NOT_FOUND_ERROR_MESSAGE);
  }
}

export class ElectricitySupplyNotFound extends FestivalActivityError {
  constructor() {
    super(ELECTRICITY_SUPPLY_NOT_FOUND_ERROR_MESSAGE);
  }
}

export class ElectricitySupplyAlreadyExists extends FestivalActivityError {
  constructor() {
    super(ELECTRICITY_SUPPLY_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}

export class InquiryAlreadyExists extends FestivalActivityError {
  constructor() {
    super(INQUIRY_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}
