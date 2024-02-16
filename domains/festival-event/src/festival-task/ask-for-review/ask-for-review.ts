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

export class AskForReview {
  constructor(
    private readonly tasks: AskForReviewTasks,
    private readonly notifications: Notifications<"FT">,
  ) {}

  async from(taskId: FestivalTask["id"], adherent: Adherent) {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!InReviewSpecification.isSatisfiedBy(task)) {
      throw new AskForReviewError(task);
    }

    const conversion = InReviewSpecification.convert(task, adherent);
    this.notifications.add(conversion.event);
    return this.tasks.save(conversion.task);
  }
}
