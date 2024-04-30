import { User } from "@overbookd/user";

export type Volunteer = User & {
  assignment: number;
  teams: string[];
};
