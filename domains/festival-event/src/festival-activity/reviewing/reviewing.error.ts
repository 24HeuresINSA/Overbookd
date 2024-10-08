import { Reviewer } from "../../common/review.js";
import { FestivalActivityError } from "../festival-activity.error.js";

export class InDraft extends FestivalActivityError {
  constructor(festivalActivityId: number) {
    const message = `La FA #${festivalActivityId} est encore en brouillon`;
    super(message);
  }
}
export class AlreadyRejected extends FestivalActivityError {
  constructor(festivalActivityId: number, team: Reviewer<"FA">) {
    const message = `La FA #${festivalActivityId} est refusée par l'équipe ${team}`;
    super(message);
  }
}

export class ShouldLinkCatalogItem extends FestivalActivityError {
  constructor() {
    super(
      "Il faut attribuer des références du catalogue aux demandes de signalétiques avant de valider la FA",
    );
  }
}
