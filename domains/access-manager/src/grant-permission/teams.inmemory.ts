import { updateItemToList } from "@overbookd/list";
import { Teams, Team } from "./grant-permission";

export class InMemoryTeams implements Teams {
  constructor(private teams: readonly Team[] = []) {}

  async find(code: Team["code"]): Promise<Team | undefined> {
    return this.teams.find((team) => team.code === code);
  }

  save(team: Team): Promise<Team> {
    const teamIndex = this.teams.findIndex(({ code }) => code === team.code);
    if (teamIndex === -1) return Promise.reject(new Error("Team not found"));
    this.teams = updateItemToList(this.teams, teamIndex, team);
    return Promise.resolve(team);
  }

  get all(): readonly Team[] {
    return this.teams;
  }
}
