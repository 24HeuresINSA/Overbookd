import { IProvidePeriod } from "@overbookd/period";

export type CalendarUser = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string | null;
  teams: string[];
  availabilities: IProvidePeriod[];
};
