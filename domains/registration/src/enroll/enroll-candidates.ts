import { Event } from "@overbookd/event";
import { BENEVOLE_CODE, HARD_CODE, SOFT_CODE } from "@overbookd/team-constants";
import { JoinableTeam } from "./joinable-team";

export const CANDIDATE_ENROLLED = "candidate-enrolled" as const;

export type EnrollingCandidates = {
  candidates: Candidate[];
  team: JoinableTeam;
};

export type Candidate = { id: number; name: string };

export type JoinedTeam = JoinableTeam | typeof BENEVOLE_CODE;

export type Memberships = {
  join(teams: [JoinableTeam, typeof BENEVOLE_CODE]): {
    as: (candidates: Candidate[]) => Promise<void>;
  };

  enrolledIn(team: JoinedTeam): {
    among: (candidates: Candidate[]) => Promise<Candidate[]>;
  };
};

type EnrollingCandidate = { candidate: Candidate; team: JoinableTeam };

export type CandidateEnrolledEvent = Event<
  typeof CANDIDATE_ENROLLED,
  EnrollingCandidate
>;

export type Events = {
  publish(event: CandidateEnrolledEvent): void;
};

export class EnrollCandidates {
  constructor(
    private readonly memberships: Memberships,
    private readonly events: Events,
  ) {}

  async apply(enrolling: EnrollingCandidates) {
    await this.checkEnrolledInOtherTeam(enrolling);

    const toEnrollCandidates = await this.retrieveCandidatesToEnroll(enrolling);
    const { team } = enrolling;

    await this.memberships.join([team, BENEVOLE_CODE]).as(toEnrollCandidates);

    this.generateEvents({ candidates: toEnrollCandidates, team });
  }

  private generateEvents({ candidates, team }: EnrollingCandidates) {
    candidates.map((candidate) => {
      const data = { candidate, team };
      this.events.publish({ type: CANDIDATE_ENROLLED, data });
    });
  }

  private async retrieveCandidatesToEnroll(enrolling: EnrollingCandidates) {
    const { team, candidates } = enrolling;

    const enrolledInSameTeam = await this.memberships
      .enrolledIn(team)
      .among(candidates);

    return this.keepNotEnrolled(candidates).among(enrolledInSameTeam);
  }

  private async checkEnrolledInOtherTeam(enrolling: EnrollingCandidates) {
    const { team, candidates } = enrolling;

    const otherTeam = team === HARD_CODE ? SOFT_CODE : HARD_CODE;

    const enrolledInOtherTeam = await this.memberships
      .enrolledIn(otherTeam)
      .among(candidates);

    const noneEnrolledInOtherTeam = enrolledInOtherTeam.length === 0;
    if (noneEnrolledInOtherTeam) return;

    throw new AlreadyEnrolledError(enrolledInOtherTeam);
  }

  private keepNotEnrolled(candidates: Candidate[]) {
    return {
      among: (enrolled: Candidate[]) =>
        candidates.filter((candidate) =>
          enrolled.every(({ id }) => id !== candidate.id),
        ),
    };
  }
}
export class AlreadyEnrolledError extends Error {
  constructor(candidates: Candidate[]) {
    const names = candidates.map(({ name }) => name).join(" and ");
    const message = `${names} est/sont déjà enrollés`;
    super(message);
  }
}
