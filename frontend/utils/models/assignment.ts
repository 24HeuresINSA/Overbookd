import { FT } from "./ft";
import { Timeslot, User } from "./repo";

export interface Assignment {
  name: string;
  user: User;
  FT: FT;
  timeslot: Timeslot;
  by: User;
}
