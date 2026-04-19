import { IProvidePeriod } from "@overbookd/time";
import { AssignableVolunteer } from "../assignable-volunteer.js";
import { AssignmentIdentifier } from "../assignment.js";
import { TaskCategorizedForPlanning } from "../task.js";

export type PlanningEventTask = Omit<
  TaskCategorizedForPlanning,
  "topPriority" | "inChargeTeam"
>;

type AssignmentIdentifierWithoutTaskId = Omit<AssignmentIdentifier, "taskId">;

export type PlanningEvent = IProvidePeriod &
  Partial<AssignmentIdentifierWithoutTaskId> & {
    task: PlanningEventTask;
  };

export type AssignmentEvent = Required<PlanningEvent>;

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
