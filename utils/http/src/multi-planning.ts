import { IProvidePeriod } from "@overbookd/time";

export type MultiPlanningVolunteerAssignment = IProvidePeriod & {
  id: number;
  name: string;
};

export type MultiPlanningVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: MultiPlanningVolunteerAssignment[];
};
