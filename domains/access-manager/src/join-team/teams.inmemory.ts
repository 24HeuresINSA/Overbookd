import { Teams, Team } from "./joint-team";

export class InMemoryTeams implements Teams {
  constructor(private teams: Team[] = []) { }

  async exists(team: Team): Promise<boolean> {
    return this.teams.includes(team);
  }
}
