import { Reviewer } from "./review";
import { FestivalEventIdentifier } from "./festival-event";
import { FestivalEventError } from "../festival-event";

export class NotAskingToReview<
  T extends FestivalEventIdentifier,
> extends FestivalEventError {
  constructor(eventId: number, team: Reviewer<T>, identifier: T) {
    const message = `❌ La ${identifier} #${eventId} n'est pas à valider par l'équipe ${team}`;
    super(message);
  }
}
