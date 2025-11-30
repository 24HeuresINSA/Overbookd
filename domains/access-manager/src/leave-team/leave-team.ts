import { Event } from "@overbookd/event";
import { AccessManagerError } from "../access-manager.error";
import { ADMIN } from "@overbookd/team-constants";

export class AdminUnassignmentError extends AccessManagerError {
  constructor() {
    super("Tu ne peux pas gérer l'équipe admin");
  }
}

export type Member = { id: number; name: string };
export type Team = string;
type LeavingTeam = { member: Member; team: Team };
type TeamManager = { canManageAdmins: boolean };
type LeavingTeamRequest = LeavingTeam & { teamManager: TeamManager };

export const TEAM_LEFT = "team-left" as const;
export type TeamLeft = Event<typeof TEAM_LEFT, LeavingTeam>;

export type Events = {
  publish(event: TeamLeft): void;
};

export type Memberships = {
  leave(team: Team): { as: (member: Member) => Promise<void> };

  is(member: Member["id"]): { memberOf(team: Team): Promise<boolean> };
};

export class LeaveTeam {
  constructor(
    private readonly memberships: Memberships,
    private readonly events: Events,
  ) {}

  async apply(request: LeavingTeamRequest): Promise<void> {
    const { team, member, teamManager } = request;
    this.checkAdminLeave(team, teamManager);

    const isMember = await this.memberships.is(member.id).memberOf(team);
    if (!isMember) return;

    this.memberships.leave(team).as(member);
    this.events.publish({ type: TEAM_LEFT, data: { member, team } });
  }

  private checkAdminLeave(team: string, teamManager: TeamManager) {
    if (team !== ADMIN) return;
    if (teamManager.canManageAdmins) return;
    throw new AdminUnassignmentError();
  }
}
