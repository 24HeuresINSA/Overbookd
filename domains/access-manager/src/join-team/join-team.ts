import { Event } from "@overbookd/event";
import { TeamNotFound } from "../access-manager.error";

export type Member = { id: number; name: string };

export type Team = string;

export const TEAM_JOINED = "team-joined" as const;

type JoiningTeam = { member: Member; team: Team };

export type TeamJoined = Event<typeof TEAM_JOINED, JoiningTeam>;

export type Events = {
  publish(event: TeamJoined): void;
};

export type Memberships = {
  exists(team: Team): Promise<boolean>;

  is(member: Member["id"]): {
    memberOf(team: Team): Promise<boolean>;
  };

  join(team: Team): { as: (member: Member) => Promise<void> };
};

export class JoinTeam {
  constructor(
    private readonly memberships: Memberships,
    private readonly events: Events,
  ) {}

  async apply({ member, team }: JoiningTeam): Promise<void> {
    const teamExists = await this.memberships.exists(team);
    if (!teamExists) throw new TeamNotFound(team);

    const isAlreadyMember = await this.memberships.is(member.id).memberOf(team);
    if (isAlreadyMember) return;

    await this.memberships.join(team).as(member);
    this.events.publish({ type: TEAM_JOINED, data: { member, team } });
  }
}
