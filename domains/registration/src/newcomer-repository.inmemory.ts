import { numberGenerator } from "@overbookd/list";
import { BaseFulfilledRegistration } from "./register-form/fulfilled-registration.js";
import { NewcomerRepository } from "./register-newcomer.js";
import {
  NewcomerRegistered,
  Membership,
  StaffRegistered,
  VolunteerRegistered,
} from "./newcomer.js";
import { isStaffRegistered, isVolunteerRegistered } from "./newcomer.js";

export class InMemoryNewcomerRepository implements NewcomerRepository {
  private idGenerator: Generator<number>;

  constructor(
    private staffs: StaffRegistered[] = [],
    private volunteers: VolunteerRegistered[] = [],
  ) {
    this.idGenerator = numberGenerator(staffs.length + 1);
  }

  save<T extends Membership>(
    fulfilledForm: BaseFulfilledRegistration,
    membership: T,
  ): Promise<NewcomerRegistered<T>> {
    const registree = {
      ...fulfilledForm,
      id: this.idGenerator.next().value,
      membership,
    };
    if (isStaffRegistered(registree)) {
      this.staffs = [...this.staffs, registree];
    }
    if (isVolunteerRegistered(registree)) {
      this.volunteers = [...this.volunteers, registree];
    }
    return Promise.resolve(registree);
  }

  get registrees(): NewcomerRegistered<Membership>[] {
    return [...this.staffs, ...this.volunteers];
  }
}
