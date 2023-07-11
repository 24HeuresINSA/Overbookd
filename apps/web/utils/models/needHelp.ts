import { Period } from "@overbookd/period";
import { User, VolunteerTask } from "./user";

export interface Volunteer extends User {
  phone: string;
  teams: string[];
  availabilities: Period[];
  tasks: VolunteerTask[];
}
