import { numberGenerator } from "@overbookd/list";
import { FulfilledRegistration } from "./register-form";
import { NewcomerRepository } from "./register-newcomer";
import {
  NewcomerRegistered,
  Membership,
  StaffRegistered,
  VolunteerRegistered,
} from "./newcomer";
import { isStaffRegistered, isVolunteerRegistered } from "./newcomer";

export class InMemoryNewcomerRepository implements NewcomerRepository {
  private idGenerator: Generator<number>;

  constructor(
    private staffs: StaffRegistered[] = [],
    private volunteers: VolunteerRegistered[] = [],
  ) {
    this.idGenerator = numberGenerator(staffs.length + 1);
  }

  isEmailUsed(email: string): Promise<boolean> {
    return Promise.resolve(
      this.staffs.some((registree) => registree.email === email) ||
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
