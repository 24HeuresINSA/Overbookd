import { Duration } from "@overbookd/time";
import { FestivalTask } from "./festival-task.js";
import { FestivalEventError } from "../festival-event.js";

export class FestivalTaskError extends FestivalEventError {}

export class FestivalTaskNotFound extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    const message = `La fiche tâche #${ftId} n'a pas été trouvée`;
    super(message);
  }
}

export class CannotIgnoreFestivalTask extends FestivalTaskError {
  constructor() {
    super("Tu ne peux pas ignorer une fiche tâche");
  }
}

export class CannotIgnoreFestivalTaskWithInquiryRequests extends FestivalTaskError {
  constructor() {
    super(
      "La log matos ne peux pas ignorer une fiche tâche ayant des demandes de matos",
    );
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
  static isDraft(ftId: FestivalTask["id"]) {
    const isDraft = `La fiche tâche #${ftId} est en brouillon`;
    return new ForceUpdateError(isDraft);
  }
  static noApprovals(ftId: FestivalTask["id"]) {
    const noApprovals = `La fiche tâche #${ftId} n'a aucune approbation`;
    return new ForceUpdateError(noApprovals);
  }
}

export class RemoveReadyToAssignError extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    const message = `Impossible de supprimer la fiche tâche #${ftId} car elle est déjà en cours d'affectation`;
    super(message);
  }
}
