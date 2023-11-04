import { Adherent } from "../festival-activity";
import { Adherents } from "./prepare-festival-activity";

export class InMemoryAdherents implements Adherents {
  constructor(private adherents: Adherent[] = []) {}

  find(id: number): Promise<Adherent | null> {
    const adherent = this.adherents.find((adherent) => adherent.id === id);
    return Promise.resolve(adherent ?? null);
  }
}
