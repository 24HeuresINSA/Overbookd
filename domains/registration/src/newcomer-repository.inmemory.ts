import { numberGenerator } from "@overbookd/list";
import { FulfilledRegistration } from "./register-form";
import { NewcomerRepository, Registree } from "./register-newcomer";

export class InMemoryNewcomerRepository implements NewcomerRepository {
  private idGenerator: Generator<number>;

  constructor(private registrees: Registree[] = []) {
    this.idGenerator = numberGenerator(registrees.length + 1);
  }

  isEmailUsed(email: string): Promise<boolean> {
    return Promise.resolve(
      this.registrees.some((registree) => registree.email === email),
    );
  }

  save(fulfilledForm: FulfilledRegistration): Promise<Registree> {
    const { password, ...registreePersonalData } = fulfilledForm;
    const registree = {
      ...registreePersonalData,
      id: this.idGenerator.next().value,
    };
    this.registrees = [...this.registrees, registree];
    return Promise.resolve(registree);
  }
}
