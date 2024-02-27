import { numberGenerator } from "@overbookd/list";
import { FulfilledRegistration } from "./register-form";
import { NewcomerRepository } from "./register-newcomer";
import {
  NewcomerRegistered,
  Membership,
  AdherentRegistered,
  VolunteerRegistered,
} from "./newcomer";
import { isAdherentRegistered, isVolunteerRegistered } from "./newcomer";

export class InMemoryNewcomerRepository implements NewcomerRepository {
  private idGenerator: Generator<number>;

  constructor(
    private adherents: AdherentRegistered[] = [],
    private volunteers: VolunteerRegistered[] = [],
  ) {
    this.idGenerator = numberGenerator(adherents.length + 1);
  }

  isEmailUsed(email: string): Promise<boolean> {
    return Promise.resolve(
      this.adherents.some((registree) => registree.email === email) ||
        this.volunteers.some((registree) => registree.email === email),
    );
  }

  save<T extends Membership>(
    fulfilledForm: FulfilledRegistration,
    membership: T,
  ): Promise<NewcomerRegistered<T>> {
    const { password, ...registreePersonalData } = fulfilledForm;
    const registree = {
      ...registreePersonalData,
      id: this.idGenerator.next().value,
      membership,
    };
    if (isAdherentRegistered(registree)) {
      this.adherents = [...this.adherents, registree];
    }
    if (isVolunteerRegistered(registree)) {
      this.volunteers = [...this.volunteers, registree];
    }
    return Promise.resolve(registree);
  }

  get registrees(): NewcomerRegistered<Membership>[] {
    return [...this.adherents, ...this.volunteers];
  }
}
