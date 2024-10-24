import { Edition } from "@overbookd/time";
import { Candidates, Email } from "./candidates.js";
import { AlreadyRejected, NotRejected } from "./candidature.error.js";
import { Membership } from "../newcomer.js";

export class RejectMembershipApplication {
  constructor(private readonly candidates: Candidates) {}

  async applyOne({ email }: Email, membership: Membership): Promise<void> {
    const edition = Edition.current;

    const isRejected = await this.candidates.isRejected(
      email,
      edition,
      membership,
    );
    if (isRejected) throw new AlreadyRejected(membership);

    return this.candidates.reject(email, edition, membership);
  }

  async unapplyOne({ email }: Email, membership: Membership): Promise<void> {
    const edition = Edition.current;

    const isRejected = await this.candidates.isRejected(
      email,
      edition,
      membership,
    );
    if (!isRejected) throw new NotRejected(membership);

    return this.candidates.cancelRejection(email, edition, membership);
  }
}
