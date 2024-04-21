export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";
export const VALIDATED = "VALIDATED";
export const REFUSED = "REFUSED";
export const READY_TO_ASSIGN = "READY_TO_ASSIGN";

export type Status =
  | typeof DRAFT
  | typeof IN_REVIEW
  | typeof VALIDATED
  | typeof REFUSED
  | typeof READY_TO_ASSIGN;
