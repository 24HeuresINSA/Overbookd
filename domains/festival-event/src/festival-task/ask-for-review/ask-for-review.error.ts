import { Draft } from "../festival-task.js";
import { ReadyForReviewError } from "../../common/ready-for-review.error.js";
import { InReviewSpecification } from "./in-review-specification.js";

export class AskForReviewError extends ReadyForReviewError {
  constructor(task: Draft) {
    super(InReviewSpecification.generateErrors(task), "FT");
  }
}
