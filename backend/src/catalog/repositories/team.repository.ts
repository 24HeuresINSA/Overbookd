import { Team, TeamRepository } from '../interfaces';

export class InMemoryTeamRepository implements TeamRepository {
  teams: Team[];
  getTeam(id: number): Promise<Team | undefined> {
    return Promise.resolve(this.teams.find((team) => team.id === id));
  }
}
