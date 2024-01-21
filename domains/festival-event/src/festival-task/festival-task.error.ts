import { Duration } from "@overbookd/period";
import { FestivalTask, TeamMobilization } from "./festival-task";
import { InquiryRequest } from "../common/inquiry-request";

export class FestivalTaskError extends Error {}

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

export class GearAlreadyRequested extends FestivalTaskError {
  constructor(name: InquiryRequest["name"]) {
    const message = `❌ Une demande de matos existe déjà pour ${name}`;
    super(message);
  }
}

export class TeamAlreadyPartOfMobilization extends FestivalTaskError {
  constructor(team: TeamMobilization["team"]) {
    const message = `❌ L'équipe ${team} est déjà demandée sur le créneau`;
    super(message);
  }
}
