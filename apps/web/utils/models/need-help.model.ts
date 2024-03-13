import { IProvidePeriod } from "@overbookd/period";
import { VolunteerTask } from "./user.model";
import { User } from "@overbookd/user";

export type Volunteer = User & {
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  tasks: VolunteerTask[];
};
