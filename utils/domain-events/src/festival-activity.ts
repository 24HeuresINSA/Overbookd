import type {
  Created,
  ReadyToReview,
  Approved,
} from "@overbookd/festival-activity";
import type { Event } from "@overbookd/event";

export const FESTIVAL_ACTIVITY_CREATED = "festival-activity-created";
export const FESTIVAL_ACTIVITY_READY_TO_REVIEW =
  "festival-activity-ready-to-review";
export const FESTIVAL_ACTIVITY_APPROVED = "festival-activity-approved";

export type FestivalActivityCreatedEvent = Event<
  typeof FESTIVAL_ACTIVITY_CREATED,
  Created
>;

export type FestivalActivityReadyToReviewEvent = Event<
  typeof FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  ReadyToReview
>;

export type FestivalActivityApprovedEvent = Event<
  typeof FESTIVAL_ACTIVITY_APPROVED,
  Approved
>;

export class FestivalActivity {
  static created(data: Created): FestivalActivityCreatedEvent {
    return { type: FESTIVAL_ACTIVITY_CREATED, data };
  }

  static readyToReview(
    data: ReadyToReview,
  ): FestivalActivityReadyToReviewEvent {
    return { type: FESTIVAL_ACTIVITY_READY_TO_REVIEW, data };
  }

  static approved(data: Approved): FestivalActivityApprovedEvent {
    return { type: FESTIVAL_ACTIVITY_APPROVED, data };
  }
}
