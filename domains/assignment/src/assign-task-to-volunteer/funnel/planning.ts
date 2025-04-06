import { IProvidePeriod } from "@overbookd/time";
import { Status } from "@overbookd/festival-event-constants";
import { AssignableVolunteer } from "../assignable-volunteer.js";
import { AssignmentIdentifier } from "../assignment.js";

export type Task = { name: string; id: number; status: Status };

type AssignmentIdentifierWithoutTaskId = Omit<AssignmentIdentifier, "taskId">;

export type PlanningEvent = IProvidePeriod &
  Partial<AssignmentIdentifierWithoutTaskId> & {
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
