import { Reviewer } from "../../common/review";
import { FestivalActivityError } from "../festival-activity.error";

export class InDraft extends FestivalActivityError {
  constructor(festivalActivityId: number) {
    const message = `❌ La FA #${festivalActivityId} est encore en brouillon`;
    super(message);
  }
}
export class AlreadyApproved extends FestivalActivityError {
  constructor(festivalActivityId: number, team: Reviewer<"FA">) {
    const message = `❌ La FA #${festivalActivityId} est validée par l'équipe ${team}`;
    super(message);
  }
}

export class AlreadyRejected extends FestivalActivityError {
  constructor(festivalActivityId: number, team: Reviewer<"FA">) {
    const message = `❌ La FA #${festivalActivityId} est refusée par l'équipe ${team}`;
    super(message);
  }
}

export class ShouldAssignDrive extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il faut attribuer des lieux de retrait aux demandes de matos avant de valider la FA",
    );
  }
}

export class ShouldLinkCatalogItem extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il faut attribuer des références du catalogue aux demandes de signalétiques avant de valider la FA",
    );
  }
}
