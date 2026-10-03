import { CategoryOwner } from "./category.js";
import { CatalogTeams } from "./category-manager.js";

export class InMemoryCatalogTeams implements CatalogTeams {
  constructor(private teams: CategoryOwner[] = []) {}

  getTeam(code: string): Promise<CategoryOwner | undefined> {
    return Promise.resolve(this.teams.find((team) => team.code === code));
  }
}
