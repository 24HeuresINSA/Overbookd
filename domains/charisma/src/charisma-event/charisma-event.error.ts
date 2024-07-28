import { User } from "@overbookd/user";

export class CharismaEventError extends Error {}

const INVALID_NAME_ERROR_MESSAGE = "Le nom de l'événement n'est pas valide";

const INSUFFICIENT_CHARISMA_PER_HOUR_ERROR_MESSAGE =
  "Le charisme par heure doit être positif";
const INTEGER_CHARISMA_PER_HOUR_ERROR_MESSAGE =
  "Le charisme par heure doit être un entier";

const NO_PARTICIPANT_ERROR_MESSAGE = "Aucun participant n'est renseigné";
const INVALID_PARTICIPANT_HOURS_ERROR_MESSAGE =
  "Les heures de participation doivent être positives";
const SAME_PARTICIPANT_MULTIPLE_TIMES_ERROR_MESSAGE =
  "Un participant ne peut pas participer plusieurs fois à un évènement. Il n'est pas encore possible de se dédoubler";
const ALREADY_EXISTS_ERROR_MESSAGE = "participe(nt) déjà à cet évènement";

export class InvalidName extends CharismaEventError {
  constructor() {
    super(INVALID_NAME_ERROR_MESSAGE);
  }
}

export class InsufficientCharismaPerHour extends CharismaEventError {
  constructor() {
    super(INSUFFICIENT_CHARISMA_PER_HOUR_ERROR_MESSAGE);
  }
}
export class IntegerCharismaPerHour extends CharismaEventError {
  constructor() {
    super(INTEGER_CHARISMA_PER_HOUR_ERROR_MESSAGE);
  }
}

export class NoParticipant extends CharismaEventError {
  constructor() {
    super(NO_PARTICIPANT_ERROR_MESSAGE);
  }
}
export class InvalidParticipantHours extends CharismaEventError {
  constructor() {
    super(INVALID_PARTICIPANT_HOURS_ERROR_MESSAGE);
  }
}
export class SameParticipantMultipleTimes extends CharismaEventError {
  constructor() {
    super(SAME_PARTICIPANT_MULTIPLE_TIMES_ERROR_MESSAGE);
  }
}
export class AlreadyExists extends CharismaEventError {
  constructor(participants: User[]) {
    const formattedParticipants = participants
      .map(({ firstname, lastname }) => `${firstname} ${lastname}`)
      .join(", ");
    super(`${formattedParticipants} ${ALREADY_EXISTS_ERROR_MESSAGE}`);
  }
}
