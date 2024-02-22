import { Reviewer } from "./review";
import { FA, FestivalEventIdentifier } from "./festival-event";
import { FestivalEventError } from "../festival-event";

export class NotAskingToReview<
  T extends FestivalEventIdentifier,
> extends FestivalEventError {
  constructor(eventId: number, team: Reviewer<T>, identifier: T) {
    const message = `❌ La ${identifier} #${eventId} n'est pas à valider par l'équipe ${team}`;
    super(message);
  }
}
export class CantAskForReview extends FestivalEventError {
  constructor(eventId: number, identifier: FestivalEventIdentifier = FA) {
    const eventName = identifier === FA ? "fiche activité" : "fiche tâche";
    super(
      `La ${eventName} #${eventId} n'a pas été passée en demande de relecture. Seules des ${identifier}s refusées ou en brouillon le peuvent`,
    );
  }
}
