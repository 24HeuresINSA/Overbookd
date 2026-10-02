import { TeamRepository } from "./catalog-repositories.js";
import { CategoryOwner } from "../category.js";

export class InMemoryTeamRepository implements TeamRepository {
  constructor(private teams: CategoryOwner[] = []) {}

  getTeam(code: string): Promise<CategoryOwner | undefined> {
    return Promise.resolve(this.teams.find((team) => team.code === code));
  }
}
