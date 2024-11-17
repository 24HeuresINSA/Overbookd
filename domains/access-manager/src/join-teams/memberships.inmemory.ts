import { Member, Memberships, Team } from "./join-teams";

export class InMemoryMemberships implements Memberships {
  constructor(private membership: Map<Team, Member[]>) {}

  all(teams: Team[]): { exist: Promise<boolean> } {
    return {
      exist: Promise.resolve(teams.every((team) => this.membership.has(team))),
    };
  }

  is(member: Member["id"]): { memberOf(teams: Team[]): Promise<boolean> } {
    return {
      memberOf: async (teams: Team[]) => {
        return teams.every((team) => {
          const members = this.membership.get(team);
          return members?.some(({ id }) => id === member) ?? false;
        });
      },
    };
  }

  join(teams: Team[]): { as: (member: Member) => Promise<void> } {
    return {
      as: async (member: Member) => {
        const updatedTuples = teams.map((team): [Team, Member[]] => {
          const previousOrEmpty = this.membership.get(team) ?? [];
          return [team, [...previousOrEmpty, member]];
        });
        const existingTuples = [...this.membership.entries()];
        this.membership = new Map([...existingTuples, ...updatedTuples]);
      },
    };
  }

  membersOf(team: Team): Member[] {
    return this.membership.get(team) ?? [];
  }
}
