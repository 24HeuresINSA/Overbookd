import { Duration } from "@overbookd/time";
import { FestivalTask } from "./festival-task.js";
import { InquiryRequest } from "../common/inquiry-request.js";
import { FestivalEventError } from "../festival-event.js";
import { Reviewer } from "../common/review.js";

export class FestivalTaskError extends FestivalEventError {}

export class FestivalTaskNotFound extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    const message = `La fiche tâche #${ftId} n'a pas été trouvée`;
    super(message);
  }
}

export class CannotIgnoreFestivalTask extends FestivalTaskError {
  constructor() {
    super("Seul.e le.a log elec peut ignorer une fiche tâche");
  }
}

export class AlreadyIgnoredFestivalTask extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"], team: Reviewer<"FT">) {
    const message = `La fiche tâche #${ftId} est déjà ignorée pour ${team}`;
    super(message);
  }
}

export class SplitDurationIsNotPeriodDivider extends FestivalTaskError {
  constructor(duration: Duration) {
    const message = `La période n'est pas divisible en ${duration.inHours} heures`;
    super(message);
  }
}

export class MobilizationAlreadyExist extends FestivalTaskError {
  constructor() {
    super("Un autre créneau existe sur cette même période");
  }
}

export class MobilizationNotFound extends FestivalTaskError {
  constructor() {
    super("Il n'y a pas de mobilisation correspondante");
  }
}

export class GearAlreadyRequested extends FestivalTaskError {
  constructor(name: InquiryRequest["name"]) {
    const message = `Une demande de matos existe déjà pour ${name}`;
    super(message);
  }
}

export class FestivalTaskNotValidated extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    super(`La fiche tâche #${ftId} n'est pas encore validée`);
  }
}

const CANT_START_ASSIGNMENT_ERROR_MESSAGE =
  "Impossible de démarrer l'affectation pour cette FT.";

const AT_LEAST_ONE_VOLUNTEER_IS_NOT_AVAILABLE =
  "Au moins un des bénévoles n'est pas disponible.";

export class ReadyToAssignError extends FestivalTaskError {
  constructor() {
    const message = `${CANT_START_ASSIGNMENT_ERROR_MESSAGE}\n- ${AT_LEAST_ONE_VOLUNTEER_IS_NOT_AVAILABLE}`;
    super(message);
  }
}

export class ForceUpdateError extends FestivalTaskError {
  static notReadyToAssign(ftId: FestivalTask["id"]) {
    const notReadyToAssign = `La ft #${ftId} n'est pas en affectation`;
    return new ForceUpdateError(notReadyToAssign);
  }
}
