import { FestivalTask } from "../festival-task";
import { ReadyForReviewError } from "../../common/ready-for-review.error";
import { InReviewSpecification } from "./in-review-specification";

export class AskForReviewError extends ReadyForReviewError {
  constructor(task: FestivalTask) {
    super(InReviewSpecification.generateErrors(task), "FT");
  }
}
