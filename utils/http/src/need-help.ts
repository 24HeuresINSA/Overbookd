import { IProvidePeriod } from "@overbookd/time";
import { User } from "@overbookd/user";

export type HelpingVolunteerAssignment = IProvidePeriod & {
  id: number;
  name: string;
};

export type HelpingVolunteer = User & {
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: HelpingVolunteerAssignment[];
};
