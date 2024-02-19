import type { Event } from "@overbookd/event";
import {
  Adherent,
  FestivalTask as Draft,
  FestivalTaskInReview as InReview,
} from "@overbookd/festival-event";

export const FESTIVAL_TASK_CREATED = "festival-task-created";
export const FESTIVAL_TASK_READY_TO_REVIEW = "festival-task-ready-to-review";

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

export type FestivalTaskCreatedEvent = Event<
  typeof FESTIVAL_TASK_CREATED,
  Created
>;

export type FestivalTaskReadyToReviewEvent = Event<
  typeof FESTIVAL_TASK_READY_TO_REVIEW,
  ReadyToReview
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

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
