import { DRAFT, IN_REVIEW, REFUSED } from "@overbookd/festival-event-constants";
import {
  AssignDrive,
  BaseInquiryRequest,
  InquiryRequest,
} from "../../common/inquiry-request.js";
import {
  FestivalTask,
  InReview,
  ReadyToAssign,
  Refused,
  Reviewable,
  Validated,
  isReadyToAssign,
} from "../festival-task.js";
import { Volunteer } from "../sections/instructions.js";
import { Contact } from "../sections/instructions.js";
import { Mobilization, TeamMobilization } from "../sections/mobilizations.js";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
  ForceUpdateError,
} from "../festival-task.error.js";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
  WithConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts.js";
import { Mobilizations } from "./sections/mobilizations.js";
import { Adherent } from "../../common/adherent.js";
import { isDraft, isRefused, isValidated } from "../../festival-event.js";
import {
  REVIEWING,
  RejectionReviewStatus,
  Reviewer,
  elec,
  humain,
  matos,
} from "../../common/review.js";
import { APPROVED } from "../../common/action.js";
import { AlreadyApprovedBy } from "../../common/review.error.js";
import { Inquiries } from "./sections/inquiries.js";
import {
  ForceInstructions,
  InitInCharge,
  Instructions,
} from "./sections/instructions.js";
import { InReviewSpecification } from "../ask-for-review/in-review-specification.js";
import { FestivalTaskKeyEvents } from "../festival-task.event.js";
import {
  readablePeriodFrom,
  readablePeriodFromId,
} from "../../common/time-window.js";
import { AssignDriveInDraft } from "../../common/inquiry-request.error.js";

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
  Mobilization<{ withConflicts: false; withAssignments: false }>,
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
    super(errors.join("\n"));
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

type UpdatableFestivalTask = Exclude<FestivalTask, Validated | ReadyToAssign>;

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

    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non gere");
    }
    if (isApprovedBy(humain, task)) {
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
    if (!this.canUpdateInstructions(task, update)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.update(update).json;
    const validTask = checkValidity({ ...task, instructions });

    const field = update.global
      ? "instructions"
      : "instructions des responsables";
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      `un changement sur le champ ${field}`,
    );
    return this.save(updatedTask);
  }

  async forceInstructions(
    taskId: FestivalTask["id"],
    force: ForceInstructions,
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!isReadyToAssign(task)) {
      throw ForceUpdateError.notReadyToAssign(task.id);
    }
    const instructions = Instructions.forceUpdate(task.instructions, force);
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.forceInstructions(instigator),
    ];

    return this.save({ ...task, instructions, history });
  }

  private canUpdateInstructions(
    task: FestivalTask,
    update: UpdateInstructions,
  ): task is UpdatableFestivalTask {
    const isUpdatingSharedFields =
      update.global !== undefined || update.inCharge !== undefined;

    return isUpdatingSharedFields
      ? this.hasReviewersAllowUpdate(task)
      : !isApprovedBy(humain, task);
  }

  async addContact(
    taskId: FestivalTask["id"],
    contact: Contact,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non gere");
    }
    if (isApprovedBy(humain, task)) {
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
    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non gere");
    }
    if (isApprovedBy(humain, task)) {
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
    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non gere");
    }
    if (isApprovedBy(humain, task)) {
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
    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non géré");
    }
    if (isApprovedBy(humain, task)) {
      throw new AlreadyApprovedBy([humain], "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.removeVolunteer(volunteerId).json;
    const updatedTask = checkValidity({ ...task, instructions });

    return this.save(updatedTask);
  }

  async clearInCharge(
    taskId: FestivalTask["id"],
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.hasReviewersAllowUpdate(task)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.clearInCharge().json;
    const validTask = checkValidity({ ...task, instructions });
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      "la suppression des instructions des responsables",
    );

    return this.save(updatedTask);
  }

  async initInCharge(
    taskId: FestivalTask["id"],
    { volunteers, instruction }: InitInCharge,
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.hasReviewersAllowUpdate(task)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Instructions.build(task.instructions);
    const instructions = builder.initInCharge(volunteers, instruction).json;
    const validTask = checkValidity({ ...task, instructions });
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      "l'initialisation des instructions des responsables",
    );

    return this.save(updatedTask);
  }

  async addMobilization(
    taskId: FestivalTask["id"],
    mobilization: AddMobilization,
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.hasReviewersAllowUpdate(task)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.add(mobilization).json;
    const validTask = checkValidity({ ...task, mobilizations });

    const readablePeriod = readablePeriodFrom(mobilization);
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      `l'ajout d'une mobilisation ${readablePeriod}`,
    );
    return this.save(updatedTask);
  }

  async removeMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.hasReviewersAllowUpdate(task)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.remove(mobilizationId).json;
    const validTask = checkValidity({ ...task, mobilizations });

    const readablePeriod = readablePeriodFromId(mobilizationId);
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      `la suppression de la mobilisation ${readablePeriod}`,
    );
    return this.save(updatedTask);
  }

  async updateMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    update: UpdateMobilization,
    instigator: Adherent,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (!this.hasReviewersAllowUpdate(task)) {
      const approvers = extractApprovers(task);
      throw new AlreadyApprovedBy(approvers, "FT");
    }

    const builder = Mobilizations.build(task.mobilizations);
    const mobilizations = builder.update(mobilizationId, update).json;
    const validTask = checkValidity({ ...task, mobilizations });

    const readablePeriod = readablePeriodFromId(mobilizationId);
    const updatedTask = this.resetApproversReviewOnRefusedTask(
      validTask,
      instigator,
      `un changement sur la mobilisation ${readablePeriod}`,
    );
    return this.save(updatedTask);
  }

  async addTeamToMobilization(
    taskId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non gere");
    }
    if (isApprovedBy(humain, task)) {
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

    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non géré");
    }
    if (isApprovedBy(humain, task)) {
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

    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non géré");
    }
    if (isApprovedBy(humain, task)) {
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

    if (isValidated(task) || isReadyToAssign(task)) {
      throw new FestivalTaskError("Cas non géré");
    }
    if (isApprovedBy(humain, task)) {
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
    if (isApprovedBy(matos, task)) {
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
    if (isApprovedBy(matos, task)) {
      throw new AlreadyApprovedBy([matos], "FT");
    }

    const builder = Inquiries.build(task.inquiries);
    const inquiries = builder.remove(slug).json;

    return this.save({ ...task, inquiries });
  }

  async assignInquiryToDrive(
    taskId: FestivalTask["id"],
    link: AssignDrive,
  ): Promise<WithConflicts> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (isDraft(task)) throw new AssignDriveInDraft("FT");

    const builder = Inquiries.build(task.inquiries);
    const inquiries = builder.assignToDrive(link).json;

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

  private async save(toSave: WithoutConflicts): Promise<WithConflicts> {
    const updated = await this.festivalTasks.save(toSave);
    return this.festivalTaskTranslator.translate(updated);
  }

  private hasReviewersAllowUpdate(
    task: FestivalTask,
  ): task is UpdatableFestivalTask {
    if (isDraft(task) || isRefused(task)) return true;
    if (isValidated(task) || isReadyToAssign(task)) return false;

    return this.areNoneOfTheReviewersApproved(task);
  }

  private areNoneOfTheReviewersApproved(task: Refused | InReview) {
    return (
      !isApprovedBy(humain, task) &&
      !isApprovedBy(matos, task) &&
      !isApprovedBy(elec, task)
    );
  }

  private resetApproversReviewOnRefusedTask<T extends UpdatableFestivalTask>(
    task: T,
    instigator: Adherent,
    reason: string,
  ): T {
    if (!isRefused<FestivalTask>(task)) return task;
    if (this.areNoneOfTheReviewersApproved(task)) return task;

    const humain = this.resetApproval(task.reviews.humain);
    const matos = this.resetApproval(task.reviews.matos);
    const elec = this.resetApproval(task.reviews.elec);

    const history = [
      ...task.history,
      FestivalTaskKeyEvents.resetReview(instigator, reason),
    ];

    return { ...task, reviews: { humain, matos, elec }, history };
  }

  private resetApproval(
    previous: RejectionReviewStatus,
  ): RejectionReviewStatus {
    return previous === APPROVED ? REVIEWING : previous;
  }
}

function isApprovedBy(reviewer: Reviewer<"FT">, task: FestivalTask): boolean {
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

export function extractApprovers(task: Reviewable): Reviewer<"FT">[] {
  const reviewers: Reviewer<"FT">[] = [humain, matos, elec];
  return reviewers.filter((reviewer) => isApprovedBy(reviewer, task));
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
