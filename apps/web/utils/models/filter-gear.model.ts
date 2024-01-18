import { Category } from "./catalog.model";
import { Team } from "./team.model";

export interface FilterGear {
  name: string;
  category: Category | null;
  team: Pick<Team, "name" | "code"> | null;
}
