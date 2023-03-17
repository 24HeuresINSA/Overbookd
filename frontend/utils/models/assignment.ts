import { User } from "./user";

export interface Volunteer extends User {
  charisma: number;
  comment?: string;
  teams: string[];
}
