import type { Event } from "@overbookd/event";
import {
  Adherent,
  FestivalTaskDraft as Draft,
} from "@overbookd/festival-event";

export const FESTIVAL_TASK_CREATED = "festival-task-created";

export type CreatedFestivalTask = {
  festivalTask: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type FestivalTaskCreatedEvent = Event<
  typeof FESTIVAL_TASK_CREATED,
  CreatedFestivalTask
>;

export class FestivalTask {
  static created(
    festivalTask: Draft,
    by: Adherent["id"],
  ): FestivalTaskCreatedEvent {
    const at = FestivalTask.computeAt();
    const data = {
      festivalTask,
      by,
      at,
      id: festivalTask.id,
    };
    return { type: FESTIVAL_TASK_CREATED, data };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
