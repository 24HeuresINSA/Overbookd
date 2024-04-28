import { IProvidePeriod } from "@overbookd/period";

export type Volunteer = {
  id: number;
  name: string;
};

export type Assignment = {
  period: IProvidePeriod;
  volunteers: Volunteer[];
};

export type Contact = {
  name: string;
  phone: string;
};

export type Task = {
  name: string;
  instructions: string;
  period: IProvidePeriod;
  location: string;
  assignments: Assignment[];
  contacts: Contact[];
};
