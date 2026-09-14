import { Edition } from "@overbookd/time";
import { Candidate, Candidates } from "./candidates.js";
import { AlreadyCandidateForMembership } from "./candidature.error.js";
import { Membership } from "../newcomer.js";

export class SwitchMembershipApplication {
  constructor(private readonly candidates: Candidates) {}

  async applyOne(
    id: Candidate["id"],
    membership: Membership,
    newMembership: Membership,
  ): Promise<void> {
    const edition = Edition.current;

    const isCandidate = await this.candidates.isCandidate(
      id,
      edition,
      newMembership,
    );
    if (isCandidate) throw new AlreadyCandidateForMembership(newMembership);

    return this.candidates.switchApplicationMembership(id, edition, membership, newMembership);
  }
}
