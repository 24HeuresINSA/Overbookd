import { Team } from "./team";
import { User } from "./user";

export interface Volunteer extends User {
  phone: string;
  teams: Team[];
}
