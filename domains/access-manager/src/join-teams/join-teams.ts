import { Event } from "@overbookd/event";
import { AccessManagerError } from "../access-manager.error";

export type Member = { id: number; name: string };

export type Team = string;

export const TEAMS_JOINED = "teams-joined" as const;

type JoiningTeams = { member: Member; teams: Team[] };

export class SomeTeamsNotFound extends AccessManagerError {
  constructor(teams: string[]) {
    super(`Certaines des équipes parmis ${teams.join(", ")} sont introuvables`);
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

  async apply({ member, teams }: JoiningTeams): Promise<void> {
    const allTeamsExist = await this.memberships.all(teams).exist();
    if (!allTeamsExist) throw new SomeTeamsNotFound(teams);

    const isAlreadyMember = await this.memberships
      .is(member.id)
      .memberOf(teams);
    if (isAlreadyMember) return;

    await this.memberships.join(teams).as(member);
    this.events.publish({ type: TEAMS_JOINED, data: { member, teams } });
  }
}
