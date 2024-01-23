import type { Event } from "@overbookd/event";
import { Adherent, FestivalTask as Draft } from "@overbookd/festival-event";

export const FESTIVAL_TASK_CREATED = "festival-task-created";

export type Created = {
  festivalActivity: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type FestivalTaskCreatedEvent = Event<
  typeof FESTIVAL_TASK_CREATED,
  Created
>;

export class FestivalTask {
  static created(
    festivalActivity: Draft,
    by: Adherent["id"],
  ): FestivalTaskCreatedEvent {
    const at = FestivalTask.computeAt();
    const data = { festivalActivity, by, at, id: festivalActivity.id };
    return { type: FESTIVAL_TASK_CREATED, data };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
