import { Event } from "@overbookd/event";
import { BENEVOLE_CODE, HARD_CODE, SOFT_CODE } from "@overbookd/team-constants";
import { JoinableTeam } from "./joinable-team";
import { IProvidePeriod } from "@overbookd/time";

export const CANDIDATE_ENROLLED = "candidate-enrolled" as const;

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
export type BriefingAvailabilities = {
  add(period: IProvidePeriod): {
    to: (candidateId: Candidate["id"]) => Promise<void>;
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
    private readonly availabilities: BriefingAvailabilities,
  ) {}

  async applyAsHard(candidates: Candidate[]) {
    await this.apply(candidates, HARD_CODE);
  }

  async applyAsSoft(candidates: Candidate[], briefTimeWindow: IProvidePeriod) {
    await this.apply(candidates, SOFT_CODE);
    candidates.map(({ id }) => this.availabilities.add(briefTimeWindow).to(id));
  }

  private async apply(candidates: Candidate[], team: JoinableTeam) {
    await this.checkEnrolledInOtherTeam(candidates, team);

    const toEnrollCandidates = await this.retrieveCandidatesToEnroll(
      candidates,
      team,
    );

    await this.memberships.join([team, BENEVOLE_CODE]).as(toEnrollCandidates);

    this.generateEvents(toEnrollCandidates, team);
  }

  private generateEvents(candidates: Candidate[], team: JoinableTeam) {
    candidates.map((candidate) => {
      const data = { candidate, team };
      this.events.publish({ type: CANDIDATE_ENROLLED, data });
    });
  }

  private async retrieveCandidatesToEnroll(
    candidates: Candidate[],
    team: JoinableTeam,
  ) {
    const enrolledInSameTeam = await this.memberships
      .enrolledIn(team)
      .among(candidates);

    return this.keepNotEnrolled(candidates).among(enrolledInSameTeam);
  }

  private async checkEnrolledInOtherTeam(
    candidates: Candidate[],
    team: JoinableTeam,
  ) {
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
