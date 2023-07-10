export interface StatsPayload {
  teamCode: string;
  status: Array<{
    count: number;
    status: string;
  }>;
  total: number;
}
