import { IProvidePeriod } from "@overbookd/time";
import { User } from "@overbookd/user";

export type MultiPlanningVolunteerAssignment = IProvidePeriod & {
  id: number;
  name: string;
};

export type MultiPlanningVolunteer = User & {
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: MultiPlanningVolunteerAssignment[];
};
