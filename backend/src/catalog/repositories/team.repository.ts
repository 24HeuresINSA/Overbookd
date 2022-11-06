import { Injectable } from '@nestjs/common';
import { Team, TeamRepository } from '../interfaces';

@Injectable()
export class InMemoryTeamRepository implements TeamRepository {
  teams: Team[] = [];

  getTeam(slug: string): Promise<Team | undefined> {
    return Promise.resolve(this.teams.find((team) => team.slug === slug));
  }
}
