import {
  BaseInquiryRequest,
  InquiryRequest,
} from "../../common/inquiry-request";
import { FestivalTask, Validated } from "../festival-task";
import { Volunteer } from "../sections/instructions";
import { Contact } from "../sections/instructions";
import { Mobilization, TeamMobilization } from "../sections/mobilizations";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
} from "../festival-task.error";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
  WithConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts";
import { Mobilizations } from "./sections/mobilizations";
import { Adherent } from "../../common/adherent";
import { DRAFT, IN_REVIEW, REFUSED } from "../../common/status";
import {
  isDraft,
  isInReview,
  isRefused,
  isValidated,
} from "../../festival-event";
import {
  REVIEWING,
  RejectionReviewStatus,
  Reviewer,
  elec,
  humain,
  matos,
} from "../../common/review";
import { APPROVED } from "../../common/action";
import { AlreadyApprovedBy } from "../../common/review.error";
import { Inquiries } from "./sections/inquiries";
import { Instructions } from "./sections/instructions";
import { InReviewSpecification } from "../ask-for-review/in-review-specification";
import { FestivalTaskKeyEvents } from "../festival-task.event";

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
    } & Omit<InReviewWithoutConflicts, Properties>)
  | ({
      [Property in Properties]: FestivalTask[Property];
    } & Omit<RefusedWithoutConflicts, Properties>);

type UpdatableFestivalTask = Exclude<FestivalTask, Validated>;

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

    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

    const general = { ...task.general, ...update };
    const updatedTask = checkValidity({ ...task, general });

    return this.save(updatedTask);
  }

  async updateInstructionsSection(
    taskId: FestivalTask["id"],
    update: UpdateInstructions,
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.canUpdateInstructions(task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.update(update).json;
    const validTask = checkValidity({ ...task, instructions });

    const updatedTask = this.resetApproversReview(
      validTask,
      instigator,
      update,
    );
    return this.save(updatedTask);
  }

  private canUpdateInstructions(
    task: FestivalTask,
  ): task is UpdatableFestivalTask {
    if (isDraft(task) || isRefused(task)) return true;
    if (isValidated(task)) return false;

    return !this.isApprovedBy(humain, task);
  }

  async addContact(
    taskId: FestivalTask["id"],
    contact: Contact,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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
    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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
    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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
    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeVolunteer(volunteerId).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async clearInCharge(taskId: FestivalTask["id"]): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (isValidated(task)) throw new Error();

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

    if (isValidated(task)) throw new Error();
    const isApprovedByHumain = this.isApprovedBy(humain, task);
    const isApprovedByMatos = this.isApprovedBy(matos, task);
    const isApprovedByElec = this.isApprovedBy(elec, task);
    if (isApprovedByHumain || isApprovedByMatos || isApprovedByElec) {
      throw new AlreadyApprovedBy([humain, matos, elec], "FT");
    }

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
    if (isValidated(task)) throw new Error();

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
    if (isValidated(task)) throw new Error();

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

    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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

    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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

    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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

    if (isValidated(task)) throw new Error();
    if (this.isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

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
    if (this.isApprovedBy(matos, task)) {
      throw new AlreadyApprovedBy([matos], "FT");
    }

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

  private isApprovedBy(reviewer: Reviewer<"FT">, task: FestivalTask): boolean {
    if (isDraft(task)) return false;
    switch (reviewer) {
      case humain:
        return task.reviews.humain === APPROVED;
      case matos:
        return task.reviews.matos === APPROVED;
      case elec:
        return task.reviews.elec === APPROVED;
    }
  }

  private resetApproversReview<T extends UpdatableFestivalTask>(
    task: T,
    instigator: Adherent,
    update: UpdateInstructions,
  ): T {
    if (isDraft<FestivalTask>(task) || isInReview<FestivalTask>(task))
      return task;

    const humain = this.resetApproval(task.reviews.humain);
    const matos = this.resetApproval(task.reviews.matos);
    const elec = this.resetApproval(task.reviews.elec);

    const history = [
      ...task.history,
      FestivalTaskKeyEvents.resetReview(instigator, update),
    ];

    return { ...task, reviews: { humain, matos, elec }, history };
  }

  private resetApproval(
    previous: RejectionReviewStatus,
  ): RejectionReviewStatus {
    return previous === APPROVED ? REVIEWING : previous;
  }
}

function checkValidity<
  T extends UpdatedTask<"general" | "mobilizations" | "instructions">,
>(task: T): UpdatableFestivalTask {
  switch (task.status) {
    case DRAFT:
      return task;
    case IN_REVIEW:
    case REFUSED: {
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
