import { FestivalEventError } from "../festival-event.js";

function buildFestivalActivityNotFoundErrorMessage(id: number) {
  return `La fiche activité #${id} n'a pas été trouvée`;
}

const FREE_PASS_MUST_BE_POSITIVE_ERROR_MESSAGE =
  "Le nombre de laissez passer doit être supérieur ou égale à 0";

const TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une créneau existe déjà à ces heures";

const CONTRACTOR_NOT_FOUND_ERROR_MESSAGE =
  "Ce prestataire n'existe pas dans la fiche activité";

const SIGNAGE_NOT_FOUND_ERROR_MESSAGE =
  "Cette signalétique n'existe pas dans la fiche activité";

const SIGNAGE_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une signalétique similaire existe déjà dans la fiche activité";

const ELECTRICITY_SUPPLY_NOT_FOUND_ERROR_MESSAGE =
  "Cette demande d'elec n'existe pas dans la fiche activité";

const ELECTRICITY_SUPPLY_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une demande d'elec similaire existe déjà dans la fiche activité";

const INQUIRY_ALREADY_EXISTS_ERROR_MESSAGE =
  "Une demande de matos existe déjà pour";

const INQUIRY_NOT_FOUND_ERROR_MESSAGE = "n'existe pas dans la fiche activité";

export class FestivalActivityError extends FestivalEventError {}

export class FestivalActivityNotFound extends FestivalActivityError {
  constructor(id: number) {
    super(buildFestivalActivityNotFoundErrorMessage(id));
  }
}

export class TimeWindowAlreadyExists extends FestivalActivityError {
  constructor() {
    super(TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE);
  }
}

export class FreePassMustBePositive extends FestivalActivityError {
  constructor() {
    super(FREE_PASS_MUST_BE_POSITIVE_ERROR_MESSAGE);
  }
}

export class ContractorNotFound extends FestivalActivityError {
  constructor() {
    super(CONTRACTOR_NOT_FOUND_ERROR_MESSAGE);
  }
}

export class SignageNotFound extends FestivalActivityError {
  constructor() {
    super(SIGNAGE_NOT_FOUND_ERROR_MESSAGE);
  }
}

export class SignageAlreadyExists extends FestivalActivityError {
  constructor() {
    super(SIGNAGE_ALREADY_EXISTS_ERROR_MESSAGE);
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
  constructor(gear: string) {
    super(`${INQUIRY_ALREADY_EXISTS_ERROR_MESSAGE} ${gear}`);
  }
}

export class InquiryNotFound extends FestivalActivityError {
  constructor(gear: string) {
    super(`${gear} ${INQUIRY_NOT_FOUND_ERROR_MESSAGE}`);
  }
}
