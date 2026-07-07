import {
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
} from "@overbookd/festival-event-constants";
import { Adherent } from "../../common/adherent.js";
import {
  Draft,
  FestivalActivity,
  FestivalTask,
  InReview,
  Refused,
} from "../festival-task.js";
import { FestivalTaskKeyEvents } from "../festival-task.event.js";
import { AskForReviewError } from "./ask-for-review.error.js";
import {
  InReviewSpecification,
  WithoutStatus,
} from "./in-review-specification.js";

const NO_SUPPLY_REQUEST_TASK_REVIEWS = {
  elec: NOT_ASKING_TO_REVIEW,
  matos: REVIEWING,
  humain: REVIEWING,
} as const;

const TASK_WITH_SUPPLY_REQUEST_REVIEWS = {
  elec: REVIEWING,
  matos: REVIEWING,
  humain: REVIEWING,
} as const;

export class InReviewFestivalTask {
  private constructor(
    private readonly _task: WithoutStatus<InReview>,
    private readonly previousReview?: Refused["reviews"],
  ) {}

  static fromDraft(task: Draft, instigator: Adherent, reviewer: Adherent) {
    if (!InReviewSpecification.isSatisfiedBy(task)) {
      throw new AskForReviewError(task);
    }

    const inReview = {
      ...task,
      history: this.addReadyToReviewEvent(task.history, instigator),
      reviews: this.initReviews(task.festivalActivity),
      reviewer,
    } as const;

    return new InReviewFestivalTask(inReview);
  }

  static fromRefused(task: Refused, instigator: Adherent) {
    const history = this.addReadyToReviewEvent(task.history, instigator);
    const reviews = InReviewFestivalTask.resetReviews(task.reviews);

    const inReview = { ...task, history, reviews } as const;

    return new InReviewFestivalTask(inReview, task.reviews);
  }

  private static initReviews({ hasSupplyRequest }: FestivalActivity) {
    if (hasSupplyRequest) return TASK_WITH_SUPPLY_REQUEST_REVIEWS;

    return NO_SUPPLY_REQUEST_TASK_REVIEWS;
  }

  private static resetReviews(reviews: Refused["reviews"]) {
    return {
      humain: reviews.humain === REJECTED ? REVIEWING : reviews.humain,
      matos: reviews.matos === REJECTED ? REVIEWING : reviews.matos,
      elec: reviews.elec === REJECTED ? REVIEWING : reviews.elec,
    };
  }

  private static addReadyToReviewEvent(
    history: FestivalTask["history"],
    instigator: Adherent,
  ) {
    const readyToReview = FestivalTaskKeyEvents.readyToReview(instigator);
    return [...history, readyToReview];
  }

  get task(): InReview {
    return { ...this._task, status: IN_REVIEW };
  }
}
