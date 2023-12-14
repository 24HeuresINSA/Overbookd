import type { Event } from "@overbookd/event";
import {
  Adherent,
  Draft,
  Refused,
  Reviewable,
} from "@overbookd/festival-activity";

export const FESTIVAL_ACTIVITY_CREATED = "festival-activity-created";
export const FESTIVAL_ACTIVITY_READY_TO_REVIEW =
  "festival-activity-ready-to-review";
export const FESTIVAL_ACTIVITY_APPROVED = "festival-activity-approved";
export const FESTIVAL_ACTIVITY_REJECTED = "festival-activity-rejected";

export type Created = {
  festivalActivity: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type ReadyToReview = {
  festivalActivity: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

export type Approved = {
  festivalActivity: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

export type Rejected = {
  festivalActivity: Refused;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
  reason: string;
};

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

export type FestivalActivityRejectedEvent = Event<
  typeof FESTIVAL_ACTIVITY_REJECTED,
  Rejected
>;

export class FestivalActivity {
  static created(
    festivalActivity: Draft,
    by: Adherent["id"],
  ): FestivalActivityCreatedEvent {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_CREATED, data };
  }

  static readyToReview(
    festivalActivity: Reviewable,
    by: Adherent["id"],
  ): FestivalActivityReadyToReviewEvent {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_READY_TO_REVIEW, data };
  }

  static approved(
    festivalActivity: Reviewable,
    by: Adherent["id"],
  ): FestivalActivityApprovedEvent {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_APPROVED, data };
  }

  static rejected(
    festivalActivity: Refused,
    by: Adherent["id"],
    reason: string,
  ): FestivalActivityRejectedEvent {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id, reason };
    return { type: FESTIVAL_ACTIVITY_REJECTED, data };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
