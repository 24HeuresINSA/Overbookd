import { Draft, FestivalTask, InReview, Refused } from "../festival-task";
import { Adherent } from "../../common/adherent";
import { FestivalTaskNotFound } from "../festival-task.error";
import { Notifications } from "../../common/notifications";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
} from "../volunteer-conflicts";
import { InReviewFestivalTask } from "./in-review-specification";
import { isDraft, isRefused } from "../../festival-event";
import { CantAskForReview } from "../../common/review.error";

export type AskForReviewTasks = {
  findById(
    id: FestivalTask["id"],
  ): Promise<DraftWithoutConflicts | RefusedWithoutConflicts | null>;
  save(task: InReview): Promise<InReview>;
};

export type ReviewerStat = {
  adherent: Adherent;
  count: number;
};

export type Reviewers = {
  getAll(): Promise<ReviewerStat[]>;
};

type Repositories = {
  notifications: Notifications<"FT">;
  reviewers: Reviewers;
};

export class AskForReview {
  constructor(
    private readonly tasks: AskForReviewTasks,
    private readonly repositories: Repositories,
    private readonly translator: FestivalTaskTranslator,
  ) {}

  async from(
    taskId: FestivalTask["id"],
    instigator: Adherent,
  ): Promise<InReviewWithoutConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!isDraft(task) && !isRefused(task)) {
      throw new CantAskForReview(taskId);
    }

    const inReview = await this.convertInReview(task, instigator);

    this.repositories.notifications.add(inReview.event);

    const saved = await this.tasks.save(inReview.task);
    return this.translator.translate<InReview>(saved);
  }

  private async convertInReview(task: Draft | Refused, instigator: Adherent) {
    if (isDraft(task)) {
      const reviewer = await this.findReviewer();
      return InReviewFestivalTask.fromDraft(task, instigator, reviewer);
    }

    return InReviewFestivalTask.fromRefused(task, instigator);
  }

  private async findReviewer(): Promise<Adherent> {
    const reviewers = await this.repositories.reviewers.getAll();

    const minReviewsCount = Math.min(...reviewers.map(({ count }) => count));
    const reviewer = reviewers.find(({ count }) => count === minReviewsCount);

    if (!reviewer) throw new Error();

    return reviewer.adherent;
  }
}
