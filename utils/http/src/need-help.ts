import { IProvidePeriod } from "@overbookd/period";

export type HelpingVolunteerAssignment = IProvidePeriod & {
  id: number;
  name: string;
};

export type HelpingVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: HelpingVolunteerAssignment[];
};
