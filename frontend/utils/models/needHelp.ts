import { User } from "./user";

export interface Volunteer extends User {
  phone: string;
  teams: string[];
}
