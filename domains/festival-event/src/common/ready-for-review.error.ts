import { FestivalActivityError } from "../festival-activity/festival-activity.error";
import { FestivalEventIdentifier } from "./festival-event";

export const CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE =
  "n'a pas pu être passée en relecture";

export class ReadyForReviewError extends FestivalActivityError {
  constructor(errors: string[], identifier: FestivalEventIdentifier = "FA") {
    const cantMoveToInReview = `❌ La ${identifier} ${CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE}`;
    const errorList = errors.map((error) => `- ${error}`).join("\n");
    const message = `${cantMoveToInReview}\n${errorList}`;
    super(message);
  }
}
