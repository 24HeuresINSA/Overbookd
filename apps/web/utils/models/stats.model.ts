import { FestivalEvent } from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";

export type StatsPayload<T extends FestivalEvent = FestivalEvent> =
  | (Omit<Statistics, "status"> & {
      status: Record<T["status"], number>;
    })
  | Statistics;
