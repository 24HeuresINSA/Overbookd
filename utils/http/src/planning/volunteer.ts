import { AssignmentEvent } from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/time";
import { UserWithTeams } from "@overbookd/user";
import { PlanningTask } from "./task";

export type VolunteerForPlanningLeaflet = UserWithTeams & {
  assignment: number;
};

export type MultiPlanningVolunteer = UserWithTeams & {
  availabilities: IProvidePeriod[];
  tasks: PlanningTask[];
  assignments: AssignmentEvent[];
};
