import { Contact, FestivalTask, Volunteer } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";

type UpdateGeneral = {
  name?: FestivalTask["general"]["name"];
  administrator?: FestivalTask["general"]["administrator"];
  team?: FestivalTask["general"]["team"];
};

type UpdateInstructions = {
  appointment?: FestivalTask["instructions"]["appointment"];
  global?: FestivalTask["instructions"]["global"];
  inCharge?: FestivalTask["instructions"]["inCharge"]["instruction"];
};

export type FestivalTasksForPrepare = {
  findById(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
  save(task: FestivalTask): Promise<FestivalTask>;
};

export class PrepareFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForPrepare) {}

  async updateGeneralSection(
    taskId: FestivalTask["id"],
    update: UpdateGeneral,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const general = { ...task.general, ...update };
    return this.festivalTasks.save({ ...task, general });
  }

  async updateInstructionsSection(
    taskId: FestivalTask["id"],
    update: UpdateInstructions,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.update(update).json;
    return this.festivalTasks.save({ ...task, instructions });
  }

  async addContact(
    taskId: FestivalTask["id"],
    contact: Contact,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.addContact(contact).json;
    return this.festivalTasks.save({ ...task, instructions });
  }

  async addInchargeVolunteer(
    taskId: FestivalTask["id"],
    volunteer: Volunteer,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.addVolunteer(volunteer).json;
    return this.festivalTasks.save({ ...task, instructions });
  }
}

class Instructions {
  private constructor(
    private readonly instructions: FestivalTask["instructions"],
  ) {}
  static build(instructions: FestivalTask["instructions"]) {
    return new Instructions(instructions);
  }

  update({ inCharge, ...form }: UpdateInstructions) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const updatedInCharge = inChargeBuilder.update(inCharge).json;

    return new Instructions({
      ...this.instructions,
      ...form,
      inCharge: updatedInCharge,
    });
  }

  addContact(contact: Contact) {
    const contactsBuilder = Contacts.build(this.instructions.contacts);
    const contacts = contactsBuilder.add(contact).json;

    return new Instructions({ ...this.instructions, contacts });
  }

  addVolunteer(volunteer: Volunteer) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const inCharge = inChargeBuilder.addVolunteer(volunteer).json;

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

  private has(volunteer: Volunteer): boolean {
    return this.volunteers.some(({ id }) => id === volunteer.id);
  }

  get json(): Volunteer[] {
    return [...this.volunteers];
  }
}
