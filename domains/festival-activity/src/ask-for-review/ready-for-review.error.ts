
export const CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE = "La FA n'a pas pu être passée en relecture";
export class ReadyForReviewException extends Error {
  constructor(errors: string[]) {
    const message = `${CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE}\n${errors
      .map((error) => `- ${error}`)
      .join("\n")}`;
    super(message);
  }
}
