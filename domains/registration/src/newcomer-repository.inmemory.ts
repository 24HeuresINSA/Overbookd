import { numberGenerator } from "@overbookd/list";
import { BaseFulfilledRegistration } from "./register-form/fulfilled-registration.js";
import { NewcomerRepository } from "./register-newcomer.js";
import { Registree } from "./newcomer.js";

export class InMemoryNewcomerRepository implements NewcomerRepository {
  private idGenerator: Generator<number>;

  constructor(readonly registrees: Registree[] = []) {
    this.idGenerator = numberGenerator(registrees.length + 1);
  }

  save(fulfilledForm: BaseFulfilledRegistration): Promise<Registree> {
    const registree = {
      ...fulfilledForm,
      id: this.idGenerator.next().value,
    };
    this.registrees.push(registree);
    return Promise.resolve(registree);
  }
}
