import type { Team } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class TeamRepository {
  private static readonly basePath = "teams";

  static getTeams() {
    return HttpClient.get<Team[]>(this.basePath);
  }

  static getFaReviewers() {
    return HttpClient.get<Team[]>(`${this.basePath}/fa-validators`);
  }

  static getFtReviewers() {
    return HttpClient.get<Team[]>(`${this.basePath}/ft-validators`);
  }

  static createTeam(team: Team) {
    return HttpClient.post<Team>(this.basePath, team);
  }

  static updateTeam(team: Team) {
    return HttpClient.patch<Team>(`${this.basePath}/${team.code}`, team);
  }

  static deleteTeam(teamCode: string) {
    return HttpClient.delete<void>(`${this.basePath}/${teamCode}`);
  }
}
