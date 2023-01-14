export interface StatsPayload {
  teamId: number;
  status: Array<{
    count: number;
    status: string;
  }>;
  total: number;
}
