import { Injectable } from "@nestjs/common";
import { Team, TeamRepository } from "../../types";

@Injectable()
export class InMemoryTeamRepository implements TeamRepository {
  teams: Team[] = [];

  getTeam(code: string): Promise<Team | undefined> {
    return Promise.resolve(this.teams.find((team) => team.code === code));
  }
}
