import { Event } from "@overbookd/event";
import { AccessManagerError } from "../access-manager.error";

export type Member = { id: number; name: string };

export type Team = string;

export const TEAMS_JOINED = "teams-joined" as const;
export const ADMIN = "admin" as const;

type JoiningTeams = { member: Member; teams: Team[] };
type TeamManager = { canManageAdmins: boolean };
type JoiningTeamsRequest = JoiningTeams & { teamManager: TeamManager };

export class SomeTeamsNotFound extends AccessManagerError {
  constructor(teams: string[]) {
    super(`Certaines des équipes parmis ${teams.join(", ")} sont introuvables`);
  }
}

export class AdminAssignmentError extends AccessManagerError {
  constructor() {
    super("Tu ne peux pas gérer l'équipe admin");
  }
}

export type TeamsJoined = Event<typeof TEAMS_JOINED, JoiningTeams>;

export type Events = {
  publish(event: TeamsJoined): void;
};

export type Memberships = {
  all(teams: Team[]): { exist: () => Promise<boolean> };

  is(member: Member["id"]): { memberOf(teams: Team[]): Promise<boolean> };

  join(teams: Team[]): { as: (member: Member) => Promise<void> };
};

export class JoinTeams {
  constructor(
    private readonly memberships: Memberships,
    private readonly events: Events,
  ) {}

  async apply(request: JoiningTeamsRequest): Promise<void> {
    const { member, teams, teamManager } = request;
    this.checkAdminArrival(teams, teamManager);

    const allTeamsExist = await this.memberships.all(teams).exist();
    if (!allTeamsExist) throw new SomeTeamsNotFound(teams);

    const isMember = await this.memberships.is(member.id).memberOf(teams);
    if (isMember) return;

    await this.memberships.join(teams).as(member);
    this.events.publish({ type: TEAMS_JOINED, data: { member, teams } });
  }

  private checkAdminArrival(teams: Team[], teamManager: TeamManager) {
    if (!teams.includes(ADMIN)) return;
    if (teamManager.canManageAdmins) return;
    throw new AdminAssignmentError();
  }
}
