import { Draft, FestivalTask, InReview } from "../festival-task";
import { Adherent } from "../../common/adherent";
import { FestivalTaskNotFound } from "../festival-task.error";
import { Notifications } from "../../common/notifications";
import { AskForReviewError } from "./ask-for-review.error";
import { InReviewSpecification } from "./in-review-specification";

export type AskForReviewTasks = {
  findById(id: FestivalTask["id"]): Promise<Draft | null>;
  save(task: InReview): Promise<InReview>;
};

type ReviewerStat = {
  adherent: Adherent;
  count: number;
};

export type Reviewers = {
  getAll(): Promise<ReviewerStat[]>;
};

export class InMemoryReviewers implements Reviewers {
  constructor(private readonly stats: ReviewerStat[] = []) {}

  getAll(): Promise<ReviewerStat[]> {
    return Promise.resolve(this.stats);
  }
}

export class AskForReview {
  constructor(
    private readonly tasks: AskForReviewTasks,
    private readonly notifications: Notifications<"FT">,
    private readonly reviewers: Reviewers,
  ) {}

  async from(taskId: FestivalTask["id"], adherent: Adherent) {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!InReviewSpecification.isSatisfiedBy(task)) {
      throw new AskForReviewError(task);
    }

    const reviewer = await this.findReviewer();

    const conversion = InReviewSpecification.convert(task, adherent, reviewer);
    this.notifications.add(conversion.event);
    return this.tasks.save(conversion.task);
  }

  private async findReviewer(): Promise<Adherent> {
    const reviewers = await this.reviewers.getAll();

    const minReviewsCount = Math.min(...reviewers.map(({ count }) => count));
    const reviewer = reviewers.find(({ count }) => count === minReviewsCount);

    if (!reviewer) throw new Error();

    return reviewer.adherent;
  }
}
