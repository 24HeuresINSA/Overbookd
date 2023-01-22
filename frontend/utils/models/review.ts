import { Team } from "./team";
import { DisplayedUser } from "./user";

export interface Review {
  User: DisplayedUser;
  Team: Team;
}
