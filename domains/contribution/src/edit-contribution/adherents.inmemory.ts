import { Adherent } from "../contribution.js";
import { Adherents } from "./edit-contribution.js";

export class InMemoryAdherents implements Adherents {
  constructor(private readonly adherents: Adherent[]) {}

  find(id: Adherent["id"]): Promise<Adherent | undefined> {
    return Promise.resolve(
      this.adherents.find((adherent) => adherent.id === id),
    );
  }
}
