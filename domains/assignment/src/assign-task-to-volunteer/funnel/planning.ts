import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "./volunteer";
import { Status } from "@overbookd/festival-event-constants";
import { Period } from "@overbookd/period";

export type Task = { name: string; id: number; status: Status };

export type PlanningEvent = IProvidePeriod & {
  task: Task;
};

export type Planning = {
  for(volunteer: Volunteer["id"]): Promise<PlanningEvent[]>;
};

export type Availabilities = {
  for(volunteer: Volunteer["id"]): Promise<IProvidePeriod[]>;
};

export type Friends = {
  availableDuringWith(
    period: Period,
    volunteer: Volunteer["id"],
  ): Promise<Volunteer[]>;
};
