import type { Created } from "@overbookd/festival-activity";
import type { Event } from "@overbookd/event";

export const FESTIVAL_ACTIVITY_CREATED = "festival-activity-created";

export type FestivalActivityCreatedEvent = Event<
  typeof FESTIVAL_ACTIVITY_CREATED,
  Created
>;

export class FestivalActivity {
  static created(data: Created): FestivalActivityCreatedEvent {
    return { type: FESTIVAL_ACTIVITY_CREATED, data };
  }
}
