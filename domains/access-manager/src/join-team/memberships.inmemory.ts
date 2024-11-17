import { Member, Memberships, Team } from "./join-team";

export class InMemoryMemberships implements Memberships {
  constructor(private membership: Map<Team, Member[]>) {}

  async exists(team: Team): Promise<boolean> {
    return this.membership.has(team);
  }

  is(member: Member["id"]): { memberOf(team: Team): Promise<boolean> } {
    return {
      memberOf: async (team: Team) => {
        const members = this.membership.get(team);
        return members?.some(({ id }) => id === member) ?? false;
      },
    };
  }

  join(team: Team): { as: (member: Member) => Promise<void> } {
    return {
      as: async (member: Member) => {
        const previousOrEmpty = this.membership.get(team) ?? [];
        this.membership.set(team, [...previousOrEmpty, member]);
      },
    };
  }

  membersOf(team: Team): Member[] {
    return this.membership.get(team) ?? [];
  }
}
