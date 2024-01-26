import { FestivalTask } from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";

export type StatsPayload =
  | (Omit<Statistics, "status"> & {
      status: Record<FestivalTask["status"], number>;
    })
  | Statistics;
