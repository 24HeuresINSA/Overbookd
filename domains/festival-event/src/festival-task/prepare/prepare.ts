import { Duration } from "@overbookd/period";
import {
  BaseInquiryRequest,
  InquiryRequest,
} from "../../common/inquiry-request";
import { FestivalTask } from "../festival-task";
import { Volunteer } from "../sections/instructions";
import { Contact } from "../sections/instructions";
import { Mobilization, TeamMobilization } from "../sections/mobilizations";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
  GearAlreadyRequested,
} from "../festival-task.error";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithoutConflicts,
  WithConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts";
import { Mobilizations } from "./sections/mobilizations";
import { Adherent } from "../../common/adherent";
import { InReviewSpecification } from "../ask-for-review/in-review-specification";

export type UpdateGeneral = {
  name?: FestivalTask["general"]["name"];
  administrator?: FestivalTask["general"]["administrator"];
  team?: FestivalTask["general"]["team"];
};

export type UpdateInstructions = {
  appointment?: FestivalTask["instructions"]["appointment"];
  global?: FestivalTask["instructions"]["global"];
  inCharge?: FestivalTask["instructions"]["inCharge"]["instruction"];
};

export type FestivalTasksForPrepare = {
  findById(ftId: FestivalTask["id"]): Promise<WithoutConflicts | null>;
  save(task: WithoutConflicts): Promise<WithoutConflicts>;
};

export type AddMobilization = Omit<
  Mobilization<{ withConflicts: false }>,
  "id"
>;

export type UpdateMobilization = {
  durationSplitInHour?: number | null;
  start?: Date;
  end?: Date;
};

type PublishFeedback = {
  author: Adherent;
  content: string;
};

class PrepareFestivalTaskError extends FestivalTaskError {
  constructor(errors: string[]) {
    const message = errors.map((error) => `❌ ${error}`).join("\n");
    super(message);
  }
}

type UpdatedTask<Properties extends keyof FestivalTask> =
  | ({
      [Property in Properties]: FestivalTask[Property];
    } & Omit<DraftWithoutConflicts, Properties>)
  | ({
      [Property in Properties]: FestivalTask[Property];
    } & Omit<InReviewWithoutConflicts, Properties>);

export class PrepareFestivalTask {
  constructor(
    private readonly festivalTasks: FestivalTasksForPrepare,
    private readonly festivalTaskTranslator: FestivalTaskTranslator,
  ) {}

  async updateGeneralSection(
    taskId: FestivalTask["id"],
    update: UpdateGeneral,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const general = { ...task.general, ...update };
    const updatedTask = checkValidity({ ...task, general });

    return this.save(updatedTask);
  }

  async updateInstructionsSection(
    taskId: FestivalTask["id"],
    update: UpdateInstructions,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.update(update).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async addContact(
    taskId: FestivalTask["id"],
    contact: Contact,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.addContact(contact).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async removeContact(
    taskId: FestivalTask["id"],
    contactId: Contact["id"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeContact(contactId).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async addInChargeVolunteer(
    taskId: FestivalTask["id"],
    volunteer: Volunteer,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.addVolunteer(volunteer).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async removeInChargeVolunteer(
    taskId: FestivalTask["id"],
    volunteerId: Volunteer["id"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeVolunteer(volunteerId).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async clearIncharge(taskId: FestivalTask["id"]): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.clear().json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async addMobilization(
    taskId: FestivalTask["id"],
    mobilization: AddMobilization,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.add(mobilization).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  private async save(toSave: WithoutConflicts): Promise<WithConflicts> {
    const updated = await this.festivalTasks.save(toSave);
    return this.festivalTaskTranslator.translate(updated);
  }

  async removeMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.remove(mobilizationId).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async updateMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    update: UpdateMobilization,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.update(mobilizationId, update).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async addTeamToMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.addTeamTo(mobilizationId, team).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async removeTeamFromMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.removeTeamFrom(mobilizationId, team).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async addVolunteerToMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteer: Volunteer,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.addVolunteerTo(
      mobilizationId,
      volunteer,
    ).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async removeVolunteerFromMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.removeVolunteerFrom(
      mobilizationId,
      volunteerId,
    ).json;
    const updatedTask = checkValidity({ ...task, mobilizations });

    return this.save(updatedTask);
  }

  async addInquiry(
    taskId: FestivalTask["id"],
    inquiry: BaseInquiryRequest,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Inquiries.build(task.inquiries);
    const inquiries = builder.add(inquiry).json;
    return this.save({ ...task, inquiries });
  }

  async removeInquiry(
    taskId: FestivalTask["id"],
    slug: InquiryRequest["slug"],
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    const builder = Inquiries.build(task.inquiries);

    const inquiries = builder.remove(slug).json;
    return this.save({ ...task, inquiries });
  }

  async publishFeedback(
    taskId: FestivalTask["id"],
    { author, content }: PublishFeedback,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const feedback = { author, content, publishedAt: new Date() };
    const feedbacks = [...task.feedbacks, feedback];
    return this.save({ ...task, feedbacks });
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

export type IProvideSplitablePeriod = {
  start: Date;
  end: Date;
  splitDuration: Duration;
};

class Inquiries {
  private constructor(private inquiries: InquiryRequest[]) {}

  static build(inquiries: InquiryRequest[]) {
    return new Inquiries(inquiries);
  }

  add(inquiry: BaseInquiryRequest) {
    if (this.has(inquiry)) throw new GearAlreadyRequested(inquiry.name);

    return new Inquiries([...this.inquiries, inquiry]);
  }

  remove(slug: InquiryRequest["slug"]) {
    const inquiries = this.inquiries.filter((inquiry) => inquiry.slug !== slug);

    return new Inquiries(inquiries);
  }

  private has(inquiry: InquiryRequest): boolean {
    return this.inquiries.some(({ slug }) => slug === inquiry.slug);
  }

  get json(): InquiryRequest[] {
    return [...this.inquiries];
  }
}

function checkValidity<
  T extends UpdatedTask<"general" | "mobilizations" | "instructions">,
>(task: T): FestivalTask {
  switch (task.status) {
    case "DRAFT":
      return task;
    case "IN_REVIEW": {
      if (!InReviewSpecification.isSatisfiedBy(task)) {
        const errors = InReviewSpecification.generateErrors(task);
        throw new PrepareFestivalTaskError(errors);
      }
      return task;
    }
    default:
      throw new FestivalTaskError("Pas encore supporté");
  }
}
