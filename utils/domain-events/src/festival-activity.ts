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

export class FestivalActivityEvents {
  static created(festivalActivity: Draft, by: Adherent["id"]): Created {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  static readyToReview(
    festivalActivity: Reviewable,
    by: Adherent["id"],
  ): ReadyToReview {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  static approved(festivalActivity: Reviewable, by: Adherent["id"]): Approved {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  static rejected(
    festivalActivity: Refused,
    by: Adherent["id"],
    reason: string,
  ): Rejected {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id, reason };
  }

  static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}

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

  static rejected(data: Rejected): FestivalActivityRejectedEvent {
    return { type: FESTIVAL_ACTIVITY_REJECTED, data };
  }
}
