import {
  APPROVED,
  REJECTED,
  REVIEWING,
  ReviewStatus,
} from "@overbookd/festival-event";

const A_RELIRE = "À relire";
const APPROUVEE = "Approuvée";
const REJETEE = "Rejetée";

export type ReviewLabel = typeof A_RELIRE | typeof APPROUVEE | typeof REJETEE;

export const reviewStatusLabel = new Map<ReviewStatus, ReviewLabel>([
  [REVIEWING, A_RELIRE],
  [APPROVED, APPROUVEE],
  [REJECTED, REJETEE],
]);
