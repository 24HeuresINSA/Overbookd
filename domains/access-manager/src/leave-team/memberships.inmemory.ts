import { Memberships, Team, Member } from "./leave-team";

export class InMemoryMemberships implements Memberships {
  constructor(private membership: Map<Team, Member[]> = new Map()) {}

  leave(team: Team): { as: (member: Member) => Promise<void> } {
    return {
      as: async (member: Member) => {
        const currentMembers = this.membersOf(team) ?? [];
        const withoutHim = currentMembers.filter(({ id }) => id !== member.id);
        this.membership.set(team, withoutHim);
      },
    };
  }

  is(member: Member["id"]): { memberOf(team: Team): Promise<boolean> } {
    return {
      memberOf: async (team: Team) => {
        const members = this.membership.get(team);
        return members?.some(({ id }) => id === member) ?? false;
      },
    };
  }

  membersOf(team: Team): Member[] {
    return this.membership.get(team) ?? [];
  }
}
