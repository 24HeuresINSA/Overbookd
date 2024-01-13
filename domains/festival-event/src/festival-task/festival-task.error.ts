import { FestivalTask } from "./festival-task";

class FestivalTaskError extends Error {}

export class FestivalTaskNotFound extends FestivalTaskError {
  constructor(ftId: FestivalTask["id"]) {
    const message = `La fiche tache #${ftId} n'a pas été trouvé`;
    super(message);
  }
}
