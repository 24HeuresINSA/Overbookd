import { FestivalTask } from "../../festival-task";
import { Contact, Volunteer } from "../../sections/instructions";
import { UpdateInstructions } from "../prepare";

export class Instructions {
  private constructor(
    private readonly instructions: FestivalTask["instructions"],
  ) {}
  static build(instructions: FestivalTask["instructions"]) {
    return new Instructions(instructions);
  }

  update({ inCharge, ...form }: UpdateInstructions) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const updatedInCharge = inChargeBuilder.update(inCharge).json;

    const instructions = {
      ...this.instructions,
      ...form,
      inCharge: updatedInCharge,
    };

    return new Instructions(instructions);
  }

  addContact(contact: Contact) {
    const contactsBuilder = Contacts.build(this.instructions.contacts);
    const contacts = contactsBuilder.add(contact).json;

    return new Instructions({ ...this.instructions, contacts });
  }

  removeContact(contactId: Contact["id"]) {
    const contactsBuilder = Contacts.build(this.instructions.contacts);
    const contacts = contactsBuilder.remove(contactId).json;

    return new Instructions({ ...this.instructions, contacts });
  }

  addVolunteer(volunteer: Volunteer) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const inCharge = inChargeBuilder.addVolunteer(volunteer).json;

    return new Instructions({ ...this.instructions, inCharge });
  }

  removeVolunteer(volunteerId: Volunteer["id"]) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const inCharge = inChargeBuilder.removeVolunteer(volunteerId).json;

    return new Instructions({ ...this.instructions, inCharge });
  }

  clear() {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const inCharge = inChargeBuilder.clear().json;

    return new Instructions({ ...this.instructions, inCharge });
  }

  get json(): FestivalTask["instructions"] {
    return { ...this.instructions };
  }
}
class InCharge {
  private constructor(
    private readonly inCharge: FestivalTask["instructions"]["inCharge"],
  ) {}

  static build(inCharge: FestivalTask["instructions"]["inCharge"]) {
    return new InCharge(inCharge);
  }

  update(instruction: UpdateInstructions["inCharge"]) {
    if (instruction === undefined) return this;
    return new InCharge({ ...this.inCharge, instruction });
  }

  addVolunteer(volunteer: Volunteer) {
    const volunteerBuilder = Volunteers.build(this.inCharge.volunteers);
    const volunteers = volunteerBuilder.add(volunteer).json;

    return new InCharge({ ...this.inCharge, volunteers });
  }

  removeVolunteer(volunteerId: Volunteer["id"]) {
    const volunteerBuilder = Volunteers.build(this.inCharge.volunteers);
    const volunteers = volunteerBuilder.remove(volunteerId).json;

    return new InCharge({ ...this.inCharge, volunteers });
  }

  clear() {
    const volunteers = Volunteers.build([]).json;
    const instruction = null;

    return new InCharge({ ...this.inCharge, volunteers, instruction });
  }

  get json(): FestivalTask["instructions"]["inCharge"] {
    return { ...this.inCharge };
  }
}
class Contacts {
  private constructor(private contacts: Contact[]) {}

  static build(contacts: Contact[]) {
    return new Contacts(contacts);
  }

  add(contact: Contact) {
    if (this.has(contact)) return this;

    return new Contacts([...this.contacts, contact]);
  }

  remove(contactId: Contact["id"]) {
    return new Contacts(this.contacts.filter(({ id }) => id !== contactId));
  }

  private has(contact: Contact): boolean {
    return this.contacts.some(({ id }) => id === contact.id);
  }

  get json(): Contact[] {
    return [...this.contacts];
  }
}
class Volunteers {
  private constructor(private volunteers: Volunteer[]) {}

  static build(volunteers: Volunteer[]) {
    return new Volunteers(volunteers);
  }

  add(volunteer: Volunteer) {
    if (this.has(volunteer)) return this;

    return new Volunteers([...this.volunteers, volunteer]);
  }

  remove(volunteerId: Volunteer["id"]) {
    const volunteers = this.volunteers.filter(({ id }) => id !== volunteerId);

    return new Volunteers(volunteers);
  }

  private has(volunteer: Volunteer): boolean {
    return this.volunteers.some(({ id }) => id === volunteer.id);
  }

  get json(): Volunteer[] {
    return [...this.volunteers];
  }
}
