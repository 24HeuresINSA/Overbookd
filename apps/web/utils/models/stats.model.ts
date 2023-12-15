import { FtStatus } from "./ft.model";
import { Statistics } from "@overbookd/http";

export type StatsPayload =
  | (Omit<Statistics, "status"> & {
      status: Record<FtStatus, number>;
    })
  | Statistics;
