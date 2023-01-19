import { Team } from "./team";
import { DisplayedUser } from "./user";

export interface Review {
  user: DisplayedUser;
  team: Team;
}
