import { FestivalTask, InReview } from "../festival-task";
import { Adherent } from "../../common/adherent";
import { FestivalTaskNotFound } from "../festival-task.error";
import { Notifications } from "../../common/notifications";
import { AskForReviewError } from "./ask-for-review.error";
import { InReviewSpecification } from "./in-review-specification";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithoutConflicts,
} from "../volunteer-conflicts";

export type AskForReviewTasks = {
  findById(id: FestivalTask["id"]): Promise<DraftWithoutConflicts | null>;
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
    adherent: Adherent,
  ): Promise<InReviewWithoutConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!InReviewSpecification.isSatisfiedBy(task)) {
      throw new AskForReviewError(task);
    }

    const reviewer = await this.findReviewer();

    const conversion = InReviewSpecification.convert(task, adherent, reviewer);
    this.repositories.notifications.add(conversion.event);

    const saved = await this.tasks.save(conversion.task);
    return this.translator.translate<InReview>(saved);
  }

  private async findReviewer(): Promise<Adherent> {
    const reviewers = await this.repositories.reviewers.getAll();

    const minReviewsCount = Math.min(...reviewers.map(({ count }) => count));
    const reviewer = reviewers.find(({ count }) => count === minReviewsCount);

    if (!reviewer) throw new Error();

    return reviewer.adherent;
  }
}
