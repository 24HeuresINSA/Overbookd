import { FestivalTask } from "../festival-task";
import { NOT_ASKING_TO_REVIEW, Rejection } from "../../common/review";
import { REJECTED } from "../../common/action";
import { REFUSED } from "../../common/status";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  FestivalTaskTranslator,
  RefusedWithConflicts,
  RefusedWithoutConflicts,
  ReviewableWithoutConflicts,
} from "../volunteer-conflicts";
import { FestivalTaskNotFound } from "../festival-task.error";
import { NotAskingToReview } from "../../common/review.error";

export type FestivalTasksForReview = {
  findById(
    ftId: FestivalTask["id"],
  ): Promise<ReviewableWithoutConflicts | null>;

  save<T extends ReviewableWithoutConflicts>(task: T): Promise<T>;
};

class Reject {
  static from(
    task: ReviewableWithoutConflicts,
    rejection: Rejection<"FT">,
  ): RefusedWithoutConflicts {
    const reviews = {
      ...task.reviews,
      [rejection.team]: REJECTED,
    };
    const status = REFUSED;
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.rejected(rejection.rejector, rejection.reason),
    ];
    return { ...task, reviews, status, history };
  }
}

export class Review {
  constructor(
    private readonly tasks: FestivalTasksForReview,
    private readonly translator: FestivalTaskTranslator,
  ) {}

  async reject(
    taskId: FestivalTask["id"],
    rejection: Rejection<"FT">,
  ): Promise<RefusedWithConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (task.reviews[rejection.team] === NOT_ASKING_TO_REVIEW) {
      throw new NotAskingToReview(task.id, rejection.team, "FT");
    }

    const rejected = await this.tasks.save(Reject.from(task, rejection));
    return this.translator.translate(rejected);
  }
}
