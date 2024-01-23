import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import {
  BaseInquiryRequest,
  InquiryRequest,
} from "../../common/inquiry-request";
import {
  Contact,
  FestivalTask,
  Mobilization,
  TeamMobilization,
  Volunteer,
} from "../festival-task";
import {
  FestivalTaskNotFound,
  GearAlreadyRequested,
  MobilizationAlreadyExist,
  SplitDurationIsNotPeriodDivider,
  TeamAlreadyPartOfMobilization,
} from "../festival-task.error";
import { updateItemToList } from "@overbookd/list";
import { Adherent } from "../../common/adherent";

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
  findById(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
  save(task: FestivalTask): Promise<FestivalTask>;
};

export type AddMobilization = Omit<Mobilization, "id">;

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

  async removeContact(
    taskId: FestivalTask["id"],
    contactId: Contact["id"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeContact(contactId).json;
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

  async removeInchargeVolunteer(
    taskId: FestivalTask["id"],
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeVolunteer(volunteerId).json;
    return this.festivalTasks.save({ ...task, instructions });
  }

  async addMobilization(
    taskId: FestivalTask["id"],
    mobilization: AddMobilization,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.add(mobilization).json;
    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async removeMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.remove(mobilizationId).json;
    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async addTeamToMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.addTeamTo(mobilizationId, team).json;

    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async removeTeamFromMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.removeTeamFrom(mobilizationId, team).json;

    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async addVolunteerToMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteer: Volunteer,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.addVolunteerTo(
      mobilizationId,
      volunteer,
    ).json;

    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async removeVolunteerFromMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Adherent["id"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.removeVolunteerFrom(
      mobilizationId,
      volunteerId,
    ).json;

    return this.festivalTasks.save({ ...task, mobilizations });
  }

  async addInquiry(
    taskId: FestivalTask["id"],
    inquiry: BaseInquiryRequest,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Inquiries.build(task.inquiries);
    const inquiries = builder.add(inquiry).json;
    return this.festivalTasks.save({ ...task, inquiries: inquiries });
  }

  async removeInquiry(
    taskId: FestivalTask["id"],
    slug: InquiryRequest["slug"],
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    const builder = Inquiries.build(task.inquiries);

    const inquiries = builder.remove(slug).json;
    return this.festivalTasks.save({ ...task, inquiries: inquiries });
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

type ListItem<T> = {
  index: number;
  value?: T;
};

class Mobilizations {
  private constructor(private readonly mobilizations: Mobilization[]) {}

  static build(mobilizations: Mobilization[]) {
    return new Mobilizations(mobilizations);
  }

  add(form: AddMobilization): Mobilizations {
    const mobilization = MobilizationFactory.init(form).json;

    if (this.has(mobilization)) throw new MobilizationAlreadyExist();

    return new Mobilizations([...this.mobilizations, mobilization]);
  }

  remove(mobilizationId: Mobilization["id"]) {
    return new Mobilizations(
      this.mobilizations.filter(({ id }) => id !== mobilizationId),
    );
  }

  addTeamTo(mobilizationId: Mobilization["id"], team: TeamMobilization) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.addTeam(team).json,
    );

    return new Mobilizations(mobilizations);
  }

  removeTeamFrom(
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.removeTeam(team).json,
    );

    return new Mobilizations(mobilizations);
  }

  addVolunteerTo(mobilizationId: Mobilization["id"], volunteer: Adherent) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.addVolunteer(volunteer).json,
    );

    return new Mobilizations(mobilizations);
  }

  removeVolunteerFrom(
    mobilizationId: Mobilization["id"],
    volunteerId: Adherent["id"],
  ) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.removeVolunteer(volunteerId).json,
    );

    return new Mobilizations(mobilizations);
  }

  private retrieveMobilization(id: Mobilization["id"]): ListItem<Mobilization> {
    const index = this.mobilizations.findIndex(
      ({ id: currentId }) => currentId === id,
    );
    const value = this.mobilizations.at(index);

    return { index, value };
  }

  private has(mobilization: Mobilization) {
    return this.mobilizations.some(({ id }) => id === mobilization.id);
  }

  get json(): Mobilization[] {
    return [...this.mobilizations];
  }
}

class MobilizationFactory {
  private constructor(private readonly mobilization: Mobilization) {}

  static init(form: AddMobilization): MobilizationFactory {
    const { durationSplitInHour, teams, volunteers, ...period } = form;
    this.checkPeriod(durationSplitInHour, period);
    const id = this.generateId(period);

    return new MobilizationFactory({ ...form, id });
  }

  static build(mobilization: Mobilization) {
    return new MobilizationFactory(mobilization);
  }

  private static checkPeriod(
    durationSplitInHour: Mobilization["durationSplitInHour"],
    period: IProvidePeriod,
  ) {
    if (!durationSplitInHour) {
      return Period.init(period);
    }
    const splitDuration = Duration.hours(durationSplitInHour);
    return SplitablePeriod.checkValidity({ ...period, splitDuration });
  }

  private static generateId(period: IProvidePeriod): Mobilization["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }

  addTeam(team: TeamMobilization) {
    if (this.hasTeam(team)) throw new TeamAlreadyPartOfMobilization(team.team);

    const teams = [...this.mobilization.teams, team];

    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  removeTeam(team: TeamMobilization["team"]) {
    const teams = this.mobilization.teams.filter((t) => t.team !== team);

    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  private hasTeam({ team }: TeamMobilization) {
    return this.mobilization.teams.some((request) => request.team === team);
  }

  addVolunteer(volunteer: Adherent) {
    if (this.hasVolunteer(volunteer)) return this;

    const volunteers = [...this.mobilization.volunteers, volunteer];

    return new MobilizationFactory({ ...this.mobilization, volunteers });
  }

  removeVolunteer(volunteerId: Adherent["id"]) {
    const volunteers = this.mobilization.volunteers.filter(
      ({ id }) => id !== volunteerId,
    );

    return new MobilizationFactory({ ...this.mobilization, volunteers });
  }

  private hasVolunteer(volunteer: Adherent) {
    return this.mobilization.volunteers.some(({ id }) => id === volunteer.id);
  }

  get json(): Mobilization {
    return this.mobilization;
  }
}

type IProvideSplitablePeriod = {
  start: Date;
  end: Date;
  splitDuration: Duration;
};

class SplitablePeriod {
  static checkValidity({ start, end, splitDuration }: IProvideSplitablePeriod) {
    const period = Period.init({ start, end });
    if (!period.duration.canBeDividedBy(splitDuration)) {
      throw new SplitDurationIsNotPeriodDivider(splitDuration);
    }
    return;
  }
}

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
