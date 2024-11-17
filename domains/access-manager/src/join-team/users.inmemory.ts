import { Users, Team, Member } from "./join-team";

export class InMemoryUsers implements Users {
  constructor(private membership: Map<Team, Member[]> = new Map()) {}

  it(userId: Member["id"]) {
    return {
      isMemberOf: async (team: Team) => {
        const members = this.membership.get(team);
        return members?.some(({ id }) => id === userId) ?? false;
      },
    };
  }

  addTo(team: Team) {
    return {
      new: async (member: Member) => {
        const previousOrEmpty = this.membership.get(team) ?? [];
        this.membership.set(team, [...previousOrEmpty, member]);
      },
    };
  }

  membersOf(team: Team) {
    return this.membership.get(team) ?? [];
  }
}
