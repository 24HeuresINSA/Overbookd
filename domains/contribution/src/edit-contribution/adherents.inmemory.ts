import { Adherent } from "../contribution";
import { Adherents } from "./edit-contribution";

export class InMemoryAdherents implements Adherents {
  constructor(private readonly adherents: Adherent[]) {}

  find(id: number): Promise<Adherent | undefined> {
    return Promise.resolve(
      this.adherents.find((adherent) => adherent.id === id),
    );
  }
}
