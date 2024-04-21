import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "./volunteer";

export type PlanningEvent = IProvidePeriod & {
  task: string;
};

export type Planning = {
  for(volunteer: Volunteer["id"]): Promise<PlanningEvent[]>;
};

export type Availablilities = {
  for(volunteer: Volunteer["id"]): Promise<IProvidePeriod[]>;
};
