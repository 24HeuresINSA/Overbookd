import { FaStatus } from "./fa.model";
import { FtStatus } from "./ft.model";

export interface StatsPayload {
  teamCode: string;
  status: Record<FaStatus | FtStatus, number>;
  total: number;
}
