import { FestivalEventError } from "../festival-event.js";
import { FestivalEventIdentifier } from "./festival-event.js";

export class AssignDriveInDraft<
  T extends FestivalEventIdentifier,
> extends FestivalEventError {
  constructor(identifier: T) {
    super(
      `Il n'est pas possible d'attribuer un lieu à une demande de matos dans une ${identifier} en brouillon`,
    );
  }
}

export class InquiryAlreadyExists extends FestivalEventError {
  constructor(gear: string) {
    super(`Une demande de matos existe déjà pour ${gear}`);
  }
}

export class InquiryNotFound extends FestivalEventError {
  constructor(gear: string) {
    super(`Il n'y a aucune demande de matos pour ${gear}`);
  }
}
