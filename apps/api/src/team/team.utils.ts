import { ForbiddenException } from "@nestjs/common";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { DatabaseTeamCode } from "../user/user.model";

export function checkMembership(user: RequestHydratedUser, team: string) {
  if (!user.isMemberOf(team)) {
    const notMember = `Tu n'es pas membre de l'équipe ${team}`;
    throw new ForbiddenException(notMember);
  }
}

export function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
