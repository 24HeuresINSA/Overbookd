import { IProvidePeriod } from "@overbookd/period";

export type Volunteer = {
  id: number;
  name: string;
};

export type Assignment = {
  period: IProvidePeriod;
  volunteers: Volunteer[];
};

export type Task = {
  name: string;
  description: string;
  period: IProvidePeriod;
  location: string;
  assignments: Assignment[];
};
