import {
  type FestivalActivity,
  type FestivalTask,
  type ReviewStatus,
} from "@overbookd/festival-event";
import {
  A_RELIRE,
  APPROUVEE,
  APPROVED,
  DRAFT,
  IN_REVIEW,
  REFUSED,
  REJECTED,
  REJETEE,
  REVIEWING,
  VALIDATED,
} from "@overbookd/festival-event-constants";

export type ReviewLabel = typeof A_RELIRE | typeof APPROUVEE | typeof REJETEE;

export const reviewStatusLabel = new Map<
  ReviewStatus<"FA"> | ReviewStatus<"FT">,
  ReviewLabel
>([
  [REVIEWING, A_RELIRE],
  [REJECTED, REJETEE],
  [APPROVED, APPROUVEE],
]);

export type FestivalEventStatus =
  | FestivalActivity["status"]
  | FestivalTask["status"];

export function isFestivalActivityStatus(
  status: FestivalEventStatus,
): status is FestivalActivity["status"] {
  return (
    status === DRAFT ||
    status === IN_REVIEW ||
    status === REFUSED ||
    status === VALIDATED
  );
}
