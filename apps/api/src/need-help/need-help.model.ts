import { IProvidePeriod } from "@overbookd/period";
import { VolunteerTask } from "../user/user.model";

export type Volunteer = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  tasks: VolunteerTask[];
};
