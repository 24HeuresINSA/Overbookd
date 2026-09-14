import { Edition } from "@overbookd/time";
import { Candidate, Candidates } from "./candidates.js";
import { AlreadyRejected, NotRejected } from "./candidature.error.js";
import { Membership } from "../newcomer.js";

export class RejectMembershipApplication {
  constructor(private readonly candidates: Candidates) {}

  async applyOne(id: Candidate["id"], membership: Membership): Promise<void> {
    const edition = Edition.current;

    const isRejected = await this.candidates.isRejected(
      id,
      edition,
      membership,
    );
    if (isRejected) throw new AlreadyRejected(membership);

    return this.candidates.reject(id, edition, membership);
  }

  async unapplyOne(id: Candidate["id"], membership: Membership): Promise<void> {
    const edition = Edition.current;

    const isRejected = await this.candidates.isRejected(
      id,
      edition,
      membership,
    );
    if (!isRejected) throw new NotRejected(membership);

    return this.candidates.cancelRejection(id, edition, membership);
  }
}
