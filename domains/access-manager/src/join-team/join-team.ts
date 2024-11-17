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

export type Users = {
  it(userId: Member["id"]): {
    isMemberOf(team: Team): Promise<boolean>;
  };

  addTo(team: Team): { new: (member: Member) => Promise<void> };
};

export type Teams = {
  exists(team: Team): Promise<boolean>;
};

export class JoinTeam {
  constructor(
    private readonly users: Users,
    private readonly teams: Teams,
    private readonly events: Events,
  ) {}

  async apply({ member, team }: JoiningTeam): Promise<void> {
    const teamExists = await this.teams.exists(team);
    if (!teamExists) throw new TeamNotFound(team);

    const isAlreadyMember = await this.users.it(member.id).isMemberOf(team);
    if (isAlreadyMember) return;

    await this.users.addTo(team).new(member);
    this.events.publish({ type: TEAM_JOINED, data: { member, team } });
  }
}
