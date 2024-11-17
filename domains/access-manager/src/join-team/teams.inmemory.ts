import { Teams, Team } from "./join-team";

export class InMemoryTeams implements Teams {
  constructor(private teams: Team[] = []) {}

  async exists(team: Team): Promise<boolean> {
    return this.teams.includes(team);
  }
}
