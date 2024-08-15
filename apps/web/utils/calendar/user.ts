import type { IProvidePeriod } from "@overbookd/time";

export type CalendarUser = {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string | null;
  teams: string[];
  availabilities: IProvidePeriod[];
};
