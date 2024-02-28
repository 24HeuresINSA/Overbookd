import type { Event } from "@overbookd/event";
import {
  Adherent,
  FestivalTaskDraft as Draft,
  FestivalTaskInReview as InReview,
  FestivalTaskRefused as Refused,
  FestivalTaskReviewable as Reviewable,
} from "@overbookd/festival-event";

export const FESTIVAL_TASK_CREATED = "festival-task-created";
export const FESTIVAL_TASK_READY_TO_REVIEW = "festival-task-ready-to-review";
export const FESTIVAL_TASK_REJECTED = "festival-task-rejected";
export const FESTIVAL_TASK_APPROVED = "festival-task-approved";

export type Created = {
  festivalTask: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type ReadyToReview = {
  festivalTask: InReview;
  by: Adherent["id"];
  at: Date;
  id: InReview["id"];
};

export type Rejected = {
  festivalTask: Refused;
  by: Adherent["id"];
  at: Date;
  id: Refused["id"];
  reason: string;
};

export type Approved = {
  festivalTask: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

export type FestivalTaskCreatedEvent = Event<
  typeof FESTIVAL_TASK_CREATED,
  Created
>;

export type FestivalTaskReadyToReviewEvent = Event<
  typeof FESTIVAL_TASK_READY_TO_REVIEW,
  ReadyToReview
>;

export type FestivalTaskRejectedEvent = Event<
  typeof FESTIVAL_TASK_REJECTED,
  Rejected
>;

export type FestivalTaskApprovedEvent = Event<
  typeof FESTIVAL_TASK_APPROVED,
  Approved
>;

export class FestivalTask {
  static created(
    festivalTask: Draft,
    by: Adherent["id"],
  ): FestivalTaskCreatedEvent {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_CREATED, data };
  }

  static readyToReview(
    festivalTask: InReview,
    by: Adherent["id"],
  ): FestivalTaskReadyToReviewEvent {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_READY_TO_REVIEW, data };
  }

  static rejected(
    festivalTask: Refused,
    by: Adherent["id"],
    reason: string,
  ): FestivalTaskRejectedEvent {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id, reason };
    return { type: FESTIVAL_TASK_REJECTED, data };
  }

  static approved(
    festivalTask: Reviewable,
    by: Adherent["id"],
  ): FestivalTaskApprovedEvent {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_APPROVED, data };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
