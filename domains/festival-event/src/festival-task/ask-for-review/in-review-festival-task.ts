import { REJECTED } from "../../common/action";
import { Adherent } from "../../common/adherent";
import { WaitingForReview } from "../../common/notifications";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Reviewer,
  humain,
  matos,
  elec,
} from "../../common/review";
import { IN_REVIEW } from "../../common/status";
import {
  Draft,
  FestivalActivity,
  FestivalTask,
  InReview,
  Refused,
} from "../festival-task";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import { AskForReviewError } from "./ask-for-review.error";
import {
  InReviewSpecification,
  WithoutStatus,
} from "./in-review-specification";

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

const COMMON_REVIEWERS: Reviewer<"FT">[] = [humain, matos];
const SUPPLY_REQUEST_REVIEWERS: Reviewer<"FT">[] = [...COMMON_REVIEWERS, elec];

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
      reviews: this.resetReviewsFromDraft(task.festivalActivity),
      reviewer,
    } as const;

    return new InReviewFestivalTask(inReview);
  }

  static fromRefused(task: Refused, instigator: Adherent) {
    const history = this.addReadyToReviewEvent(task.history, instigator);
    const reviews = InReviewFestivalTask.resetReviewsFromRefused(task.reviews);

    const inReview = { ...task, history, reviews } as const;

    return new InReviewFestivalTask(inReview, task.reviews);
  }

  private static resetReviewsFromDraft({ hasSupplyRequest }: FestivalActivity) {
    if (hasSupplyRequest) return TASK_WITH_SUPPLY_REQUEST_REVIEWS;

    return NO_SUPPLY_REQUEST_TASK_REVIEWS;
  }

  private static resetReviewsFromRefused(reviews: Refused["reviews"]) {
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

  get event(): WaitingForReview<"FT"> {
    const reviewers = this.reviewers;

    return { id: this._task.id, name: this._task.general.name, reviewers };
  }

  private get reviewers() {
    const { hasSupplyRequest } = this._task.festivalActivity;
    if (!this.previousReview) {
      return hasSupplyRequest ? SUPPLY_REQUEST_REVIEWERS : COMMON_REVIEWERS;
    }

    return SUPPLY_REQUEST_REVIEWERS.filter((reviewer) =>
      this.hasRefused(reviewer),
    );
  }

  private hasRefused(reviewer: Reviewer<"FT">) {
    switch (reviewer) {
      case humain:
        return this.previousReview?.humain === REJECTED;
      case matos:
        return this.previousReview?.matos === REJECTED;
      case elec:
        return this.previousReview?.elec === REJECTED;
    }
  }

  get task(): InReview {
    return { ...this._task, status: IN_REVIEW };
  }
}
