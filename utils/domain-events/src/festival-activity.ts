import type { Event } from "@overbookd/event";
import {
  Adherent,
  Draft,
  Refused,
  Reviewable,
} from "@overbookd/festival-event";

export const FESTIVAL_ACTIVITY_CREATED = "festival-activity-created";
export const FESTIVAL_ACTIVITY_READY_TO_REVIEW =
  "festival-activity-ready-to-review";
export const FESTIVAL_ACTIVITY_APPROVED = "festival-activity-approved";
export const FESTIVAL_ACTIVITY_REJECTED = "festival-activity-rejected";

type Created = {
  festivalActivity: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

type ReadyToReview = {
  festivalActivity: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

type Approved = {
  festivalActivity: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

type Rejected = {
  festivalActivity: Refused;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
  reason: string;
};

export type FestivalActivityCreated = Event<
  typeof FESTIVAL_ACTIVITY_CREATED,
  Created
>;

export type FestivalActivityReadyToReview = Event<
  typeof FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  ReadyToReview
>;

export type FestivalActivityApproved = Event<
  typeof FESTIVAL_ACTIVITY_APPROVED,
  Approved
>;

export type FestivalActivityRejected = Event<
  typeof FESTIVAL_ACTIVITY_REJECTED,
  Rejected
>;

export class FestivalActivity {
  static created(
    festivalActivity: Draft,
    by: Adherent["id"],
  ): FestivalActivityCreated {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_CREATED, data };
  }

  static readyToReview(
    festivalActivity: Reviewable,
    by: Adherent["id"],
  ): FestivalActivityReadyToReview {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_READY_TO_REVIEW, data };
  }

  static approved(
    festivalActivity: Reviewable,
    by: Adherent["id"],
  ): FestivalActivityApproved {
    const at = FestivalActivity.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_ACTIVITY_APPROVED, data };
  }

  static rejected(
    festivalActivity: Refused,
    by: Adherent["id"],
    reason: string,
  ): FestivalActivityRejected {
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
