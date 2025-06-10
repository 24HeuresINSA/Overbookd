export const END_BEFORE_START_ERROR_MESSAGE =
  "La date de fin doit être après la date de début";

export const NO_DURATION_ERROR_MESSAGE = "La période doit avoir une durée";

export class PeriodError extends Error {}

export class EndBeforeStart extends PeriodError {
  constructor() {
    super(END_BEFORE_START_ERROR_MESSAGE);
  }
}

export type ErrorMessage =
  | typeof END_BEFORE_START_ERROR_MESSAGE
  | typeof NO_DURATION_ERROR_MESSAGE;
