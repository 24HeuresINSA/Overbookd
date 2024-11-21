import { BENEVOLE_CODE } from "@overbookd/team-constants";
import { Memberships, JoinedTeam, Candidate } from "./enroll-candidates";
import { JoinableTeam } from "./joinable-team";

export class InMemoryMemberships implements Memberships {
  constructor(
    private readonly memberships: Map<JoinedTeam, Candidate[]> = new Map(),
  ) {}

  join(teams: [JoinableTeam, typeof BENEVOLE_CODE]): {
    as: (candidates: Candidate[]) => Promise<void>;
  } {
    return {
      as: async (candidates: Candidate[]) => {
        const [team, volunteer] = teams;
        this.upsert(team, candidates);
        this.upsert(volunteer, candidates);
      },
    };
  }

  enrolledIn(team: JoinedTeam): {
    among: (candidates: Candidate[]) => Promise<Candidate[]>;
  } {
    return {
      among: async (candidates: Candidate[]) => {
        const enrolledCandidates = this.memberships.get(team) ?? [];
        return candidates.filter((candidate) =>
          enrolledCandidates.some(({ id }) => id === candidate.id),
        );
      },
    };
  }

  private upsert(team: JoinedTeam, candidates: Candidate[]) {
    const previousMembers = this.memberships.get(team) ?? [];
    this.memberships.set(team, [...previousMembers, ...candidates]);
  }

  membersOf(team: JoinedTeam): Candidate[] {
    return this.memberships.get(team) ?? [];
  }
}
