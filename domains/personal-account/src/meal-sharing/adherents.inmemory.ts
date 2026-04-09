import { Adherent } from "./adherent.js";
import { Adherents } from "./meal-sharing.js";

export class InMemoryAdherents implements Adherents {
  constructor(private readonly adherents: Adherent[]) {}

  find(id: number): Promise<Adherent | undefined> {
    return Promise.resolve(
      this.adherents.find((adherent) => adherent.id === id),
    );
  }
}
