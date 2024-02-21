import { DRAFT, IN_REVIEW } from "./common/status";
import { FestivalActivity } from "./festival-activity/festival-activity";
import { FestivalTask } from "./festival-task/festival-task";

export type FestivalEvent = FestivalActivity | FestivalTask;

export class FestivalEventError extends Error {}

export function isDraft<T extends FestivalEvent>(
  event: T,
): event is Extract<T, { status: typeof DRAFT }> {
  return event.status === DRAFT;
}

export function isInReview<T extends FestivalEvent>(
  event: T,
): event is Extract<T, { status: typeof IN_REVIEW }> {
  return event.status === IN_REVIEW;
}
