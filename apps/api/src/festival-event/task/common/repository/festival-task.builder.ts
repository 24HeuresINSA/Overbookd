import {
  DRAFT,
  FestivalTask,
  PreviewFestivalTask,
  PreviewFestivalTaskDraft,
  Contact,
  Volunteer,
  FestivalTaskWithoutConflicts,
  DraftWithoutConflicts,
  IN_REVIEW,
  ReviewStatus,
  Reviewer,
  NOT_ASKING_TO_REVIEW,
  humain,
  elec,
  matos,
  Adherent,
  InReviewSpecification,
  REFUSED,
  isRefusedReviews,
  ReviewableWithoutConflicts,
  PreviewFestivalTaskReviewable,
  VALIDATED,
  isValidatedReviews,
} from "@overbookd/festival-event";
import { DatabaseFestivalActivity } from "./festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity.builder";
import { DatabaseEvent } from "./event.query";
import { DatabaseMobilization } from "./mobilization.query";
import { DatabaseInquiryRequest } from "./inquiry.query";

type VisualizeFestivalTask<
  Task extends FestivalTaskWithoutConflicts = FestivalTaskWithoutConflicts,
  Preview extends PreviewFestivalTask = PreviewFestivalTask,
> = {
  preview: Preview;
  festivalTask: Task;
};

type DatabaseReview = {
  team: Reviewer<"FT">;
  status: ReviewStatus;
};

type FestivalTaskWithoutStatus = Omit<FestivalTaskWithoutConflicts, "status">;

type DatabaseFestivalTask = {
  id: FestivalTask["id"];
  status: FestivalTask["status"];
  name: FestivalTask["general"]["name"];
  teamCode: FestivalTask["general"]["team"];
  administrator: FestivalTask["general"]["administrator"];
  appointment: FestivalTask["instructions"]["appointment"];
  festivalActivity: DatabaseFestivalActivity;
  contacts: { contact: Contact }[];
  globalInstruction: FestivalTask["instructions"]["global"];
  inChargeInstruction: FestivalTask["instructions"]["inCharge"]["instruction"];
  inChargeVolunteers: { volunteer: Volunteer }[];
  mobilizations: DatabaseMobilization[];
  inquiries: DatabaseInquiryRequest[];
  feedbacks: FestivalTask["feedbacks"];
  events: DatabaseEvent[];
  reviews: DatabaseReview[];
  reviewer: Adherent | null;
};

export class FestivalTaskBuilder<T extends FestivalTaskWithoutConflicts> {
  constructor(protected readonly task: T) {}

  static fromDatabase(taskData: DatabaseFestivalTask): VisualizeFestivalTask {
    const taskWithoutStatus = this.buildTaskWithoutStatus(taskData);
    switch (taskData.status) {
      case DRAFT:
        return DraftBuilder.init(taskWithoutStatus);
      case IN_REVIEW:
      case REFUSED:
      case VALIDATED:
        return ReviewableBuilder.init(taskWithoutStatus);
    }
  }

  protected static buildTaskWithoutStatus(taskData: DatabaseFestivalTask) {
    return {
      id: taskData.id,
      reviews: this.formatReviews(taskData.reviews),
      reviewer: this.formatReviewer(taskData.reviewer),
      general: {
        name: taskData.name,
        administrator: taskData.administrator,
        team: taskData.teamCode,
      },
      instructions: {
        appointment: taskData.appointment,
        contacts: taskData.contacts.map(({ contact }) => contact),
        global: taskData.globalInstruction,
        inCharge: {
          volunteers: taskData.inChargeVolunteers.map(
            ({ volunteer }) => volunteer,
          ),
          instruction: taskData.inChargeInstruction,
        },
      },
      festivalActivity: FestivalActivityBuilder.fromDatabase(
        taskData.festivalActivity,
      ),
      mobilizations: this.buildMobilizations(taskData.mobilizations),
      inquiries: this.buildInquiries(taskData.inquiries),
      feedbacks: taskData.feedbacks,
      history: this.buildHistory(taskData.events),
    };
  }

  private static buildMobilizations(mobilizations: DatabaseMobilization[]) {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      volunteers: mobilization.volunteers.map(({ volunteer }) => volunteer),
      teams: mobilization.teams.map((team) => ({
        count: team.count,
        team: team.teamCode,
      })),
    }));
  }

  private static buildInquiries(inquiries: DatabaseInquiryRequest[]) {
    return inquiries.map((inquiry) => ({
      ...inquiry,
      name: inquiry.catalogItem.name,
    }));
  }

  private static buildHistory(events: DatabaseEvent[]) {
    return events.map((event) => ({
      action: event.event,
      by: event.instigator,
      at: event.at,
      description: event.context,
    }));
  }

  private static formatReviews(reviews: DatabaseReview[]) {
    if (reviews.length === 0) return {};
    return {
      humain: this.findReviewStatusByTeam(reviews, humain),
      elec: this.findReviewStatusByTeam(reviews, elec),
      matos: this.findReviewStatusByTeam(reviews, matos),
    };
  }

  private static findReviewStatusByTeam(
    reviews: DatabaseReview[],
    reviewer: Reviewer<"FT">,
  ): ReviewStatus {
    const review = reviews.find((review) => review.team === reviewer);
    return review?.status ?? NOT_ASKING_TO_REVIEW;
  }

  private static formatReviewer(reviewer: Adherent | null) {
    return reviewer === null ? {} : { reviewer };
  }
}

export class DraftBuilder
  extends FestivalTaskBuilder<DraftWithoutConflicts>
  implements VisualizeFestivalTask<DraftWithoutConflicts>
{
  static init(taskWithoutStatus: FestivalTaskWithoutStatus) {
    return new DraftBuilder({ ...taskWithoutStatus, status: DRAFT });
  }

  static fromDatabase(
    taskData: DatabaseFestivalTask,
  ): VisualizeFestivalTask<DraftWithoutConflicts> {
    const taskWithoutStatus = this.buildTaskWithoutStatus(taskData);
    return this.init(taskWithoutStatus);
  }

  get preview(): PreviewFestivalTaskDraft {
    return {
      id: this.task.id,
      name: this.task.general.name,
      status: this.task.status,
      administrator: this.task.general.administrator,
      team: this.task.general.team,
    };
  }

  get festivalTask(): DraftWithoutConflicts {
    return this.task;
  }
}

export class ReviewableBuilder<T extends ReviewableWithoutConflicts>
  extends FestivalTaskBuilder<T>
  implements VisualizeFestivalTask<T, PreviewFestivalTaskReviewable>
{
  static init(taskWithoutStatus: FestivalTaskWithoutStatus) {
    if (!InReviewSpecification.isSatisfiedBy(taskWithoutStatus)) {
      return DraftBuilder.init(taskWithoutStatus);
    }
    const { reviews } = taskWithoutStatus;

    if (isRefusedReviews(reviews)) {
      return new ReviewableBuilder({
        ...taskWithoutStatus,
        status: REFUSED,
        reviews,
      });
    }

    if (isValidatedReviews(reviews)) {
      return new ReviewableBuilder({
        ...taskWithoutStatus,
        status: VALIDATED,
        reviews,
      });
    }

    return new ReviewableBuilder({
      ...taskWithoutStatus,
      status: IN_REVIEW,
      reviews,
    });
  }

  get preview(): PreviewFestivalTaskReviewable {
    const base = {
      id: this.task.id,
      name: this.task.general.name,
      status: this.task.status,
      administrator: this.task.general.administrator,
      team: this.task.general.team,
    };
    const { reviews } = this.task;

    if (isRefusedReviews(reviews)) {
      return { ...base, reviews, status: REFUSED };
    }

    return { ...base, status: IN_REVIEW, reviews };
  }

  get festivalTask(): T {
    return this.task;
  }
}
