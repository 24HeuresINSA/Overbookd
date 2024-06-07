import { Injectable } from "@nestjs/common";
import { TeamRepository } from "../catalog-repositories";
import { CategoryOwner } from "@overbookd/http";

@Injectable()
export class InMemoryTeamRepository implements TeamRepository {
  teams: CategoryOwner[] = [];

  getTeam(code: string): Promise<CategoryOwner | undefined> {
    return Promise.resolve(this.teams.find((team) => team.code === code));
  }
}
