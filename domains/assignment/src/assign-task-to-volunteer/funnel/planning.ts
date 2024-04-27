import { IProvidePeriod } from "@overbookd/period";
import { Status } from "@overbookd/festival-event-constants";
import { AssignableVolunteer } from "../assignable-volunteer";

export type Task = { name: string; id: number; status: Status };

export type PlanningEvent = IProvidePeriod & {
  task: Task;
};

export type Planning = {
  for(volunteer: AssignableVolunteer["id"]): Promise<PlanningEvent[]>;
};

export type Availabilities = {
  for(volunteer: AssignableVolunteer["id"]): Promise<IProvidePeriod[]>;
};

export type BreakPeriods = {
  for(volunteer: AssignableVolunteer["id"]): Promise<IProvidePeriod[]>;
};

export type Friends = {
  availableDuringWith(
    period: IProvidePeriod,
    volunteer: AssignableVolunteer["id"],
  ): Promise<AssignableVolunteer[]>;
};
