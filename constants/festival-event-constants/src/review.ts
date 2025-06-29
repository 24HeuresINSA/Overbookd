import { APPROVED, REJECTED } from "./action";

export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";
export const WILL_NOT_REVIEW = "WILL_NOT_REVIEW";

export type Review =
  | typeof APPROVED
  | typeof REJECTED
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof WILL_NOT_REVIEW;

export const A_RELIRE = "À relire";
export const REJETEE = "Rejetée";
export const APPROUVEE = "Approuvée";
export const PAS_DE_RELECTURE = "Pas de relecture";
export const NE_VA_PAS_RELIRE = "Ne va pas relire";

export type ReviewLabel =
  | typeof A_RELIRE
  | typeof REJETEE
  | typeof APPROUVEE
  | typeof PAS_DE_RELECTURE
  | typeof NE_VA_PAS_RELIRE;

export const reviewLabels = new Map<Review, ReviewLabel>([
  [REVIEWING, A_RELIRE],
  [APPROVED, APPROUVEE],
  [REJECTED, REJETEE],
  [NOT_ASKING_TO_REVIEW, PAS_DE_RELECTURE],
  [WILL_NOT_REVIEW, NE_VA_PAS_RELIRE],
]);
