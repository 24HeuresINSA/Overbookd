import { FestivalEventError } from "../festival-event";
import { FestivalEventIdentifier } from "./festival-event";

export class AssignDriveInDraft<
  T extends FestivalEventIdentifier,
> extends FestivalEventError {
  constructor(identifier: T) {
    super(
      `❌ Il n'est pas possible d'attribuer un lieu à une demande de matos dans une ${identifier} en brouillon`,
    );
  }
}
