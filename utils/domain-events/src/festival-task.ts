import type { Event } from "@overbookd/event";
import {
  Adherent,
  FestivalTaskDraft as Draft,
  FestivalTaskInReview as InReview,
  FestivalTaskRefused as Refused,
  FestivalTaskReviewable as Reviewable,
  FestivalTaskReadyToAssign as ReadyToAssignTask,
} from "@overbookd/festival-event";

export const FESTIVAL_TASK_CREATED = "festival-task-created";
export const FESTIVAL_TASK_READY_TO_REVIEW = "festival-task-ready-to-review";
export const FESTIVAL_TASK_REJECTED = "festival-task-rejected";
export const FESTIVAL_TASK_APPROVED = "festival-task-approved";
export const FESTIVAL_TASK_IGNORED = "festival-task-ignored";
export const FESTIVAL_TASK_READY_TO_ASSIGN = "festival-task-ready-to-assign";

type Created = {
  festivalTask: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

type ReadyToReview = {
  festivalTask: InReview;
  by: Adherent["id"];
  at: Date;
  id: InReview["id"];
};

type Rejected = {
  festivalTask: Refused;
  by: Adherent["id"];
  at: Date;
  id: Refused["id"];
  reason: string;
};

type Approved = {
  festivalTask: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

type Ignored = {
  festivalTask: Reviewable;
  by: Adherent["id"];
  at: Date;
  id: Reviewable["id"];
};

type ReadyToAssign = {
  festivalTask: ReadyToAssignTask;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type FestivalTaskCreated = Event<typeof FESTIVAL_TASK_CREATED, Created>;

export type FestivalTaskReadyToReview = Event<
  typeof FESTIVAL_TASK_READY_TO_REVIEW,
  ReadyToReview
>;

export type FestivalTaskRejected = Event<
  typeof FESTIVAL_TASK_REJECTED,
  Rejected
>;

export type FestivalTaskApproved = Event<
  typeof FESTIVAL_TASK_APPROVED,
  Approved
>;

export type FestivalTaskIgnored = Event<typeof FESTIVAL_TASK_IGNORED, Ignored>;

export type FestivalTaskReadyToAssign = Event<
  typeof FESTIVAL_TASK_READY_TO_ASSIGN,
  ReadyToAssign
>;

export class FestivalTask {
  static created(festivalTask: Draft, by: Adherent["id"]): FestivalTaskCreated {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_CREATED, data };
  }

  static readyToReview(
    festivalTask: InReview,
    by: Adherent["id"],
  ): FestivalTaskReadyToReview {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_READY_TO_REVIEW, data };
  }

  static rejected(
    festivalTask: Refused,
    by: Adherent["id"],
    reason: string,
  ): FestivalTaskRejected {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id, reason };
    return { type: FESTIVAL_TASK_REJECTED, data };
  }

  static approved(
    festivalTask: Reviewable,
    by: Adherent["id"],
  ): FestivalTaskApproved {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_APPROVED, data };
  }

  static ignored(
    festivalTask: Reviewable,
    by: Adherent["id"],
  ): FestivalTaskIgnored {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_IGNORED, data };
  }

  static readyToAssign(
    festivalTask: ReadyToAssignTask,
    by: Adherent["id"],
  ): FestivalTaskReadyToAssign {
    const at = FestivalTask.computeAt();
    const data = { festivalTask, by, at, id: festivalTask.id };
    return { type: FESTIVAL_TASK_READY_TO_ASSIGN, data };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
