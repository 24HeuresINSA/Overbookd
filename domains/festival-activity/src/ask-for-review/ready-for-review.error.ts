import { FestivalActivityError } from "../festival-activity.error";

export const CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE =
  "❌ La FA n'a pas pu être passée en relecture";

export class ReadyForReviewException extends FestivalActivityError {
  constructor(errors: string[]) {
    const errorList = errors.map((error) => `- ${error}`).join("\n");
    const message = `${CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE}\n${errorList}`;
    super(message);
  }
}
