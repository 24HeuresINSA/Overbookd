import { IProvidePeriod } from "@overbookd/period";
import { User, VolunteerTask } from "./user.model";

export interface Volunteer extends User {
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  tasks: VolunteerTask[];
}
