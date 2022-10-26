import { Team, TeamRepository } from '../interfaces';

export class InMemoryTeamRepository implements TeamRepository {
  teams: Team[];
  getTeam(slug: string): Promise<Team | undefined> {
    return Promise.resolve(this.teams.find((team) => team.slug === slug));
  }
}
