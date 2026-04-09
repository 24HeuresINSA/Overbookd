import { Injectable } from "@nestjs/common";
import { CategoryOwner } from "@overbookd/http";
import { TeamRepository } from "../catalog-repositories";

@Injectable()
export class InMemoryTeamRepository implements TeamRepository {
  teams: CategoryOwner[] = [];

  getTeam(code: string): Promise<CategoryOwner | undefined> {
    return Promise.resolve(this.teams.find((team) => team.code === code));
  }
}
