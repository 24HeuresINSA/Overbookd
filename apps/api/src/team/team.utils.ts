import { ForbiddenException } from "@nestjs/common";
import { ADMIN } from "@overbookd/team-constants";
import { MANAGE_ADMINS } from "@overbookd/permission";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { DatabaseTeamCode } from "../user/user.model";

export function canManageAdmins(teams: string[], author: RequestHydratedUser) {
  return !teams.includes(ADMIN) || author.can(MANAGE_ADMINS);
}

export function checkMembership(user: RequestHydratedUser, team: string) {
  if (!user.isMemberOf(team)) {
    const notMember = `Tu n'es pas membre de l'équipe ${team}`;
    throw new ForbiddenException(notMember);
  }
}

export function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
