import { IProvidePeriod } from "@overbookd/period";
import { GeoLocation } from "@overbookd/geo-location";

export type Volunteer = {
  id: number;
  name: string;
};

export type Assignment = {
  period: IProvidePeriod;
  volunteers: Volunteer[];
};

export type Contact = Volunteer & {
  phone: string;
};

export type AppointmentLocation = {
  name: string;
  geoLocation: GeoLocation | null;
};

export type Task = {
  name: string;
  instructions: string;
  period: IProvidePeriod;
  location: AppointmentLocation;
  assignments: Assignment[];
  contacts: Contact[];
};
