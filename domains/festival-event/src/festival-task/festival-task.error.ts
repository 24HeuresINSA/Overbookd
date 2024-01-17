import { Duration } from "@overbookd/period";
import { FestivalTask } from "./festival-task";

class FestivalTaskError extends Error {}

export class FestivalTaskNotFound extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    const message = `❌ La fiche tache #${ftId} n'a pas été trouvé`;
    super(message);
  }
}

export class SplitDurationIsNotPeriodDivider extends FestivalTaskError {
  constructor(duration: Duration) {
    const message = `❌ La période n'est pas divisible en ${duration.inHours} heures`;
    super(message);
  }
}

export class MobilizationAlreadyExist extends FestivalTaskError {
  constructor() {
    super("❌ Un autre créneau existe sur cette même période");
  }
}
