import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { Rejected, AlreadyCandidate } from "./candidature.error.js";
import { Candidate, Candidates, Email } from "./candidates.js";

export class ApplyFor {
  constructor(private readonly candidates: Candidates) {}

  async staff({ email }: Email): Promise<void> {
    const edition = Edition.current;

    const hasRejectedApplication = await this.candidates.isRejected(
      email,
      edition,
      STAFF,
    );
    if (hasRejectedApplication) throw new Rejected(STAFF);

    const isCandidate = await this.candidates.isCandidate(
      email,
      edition,
      STAFF,
    );
    if (isCandidate) throw new AlreadyCandidate(STAFF);

    const newCandidate: Candidate = {
      email,
      membership: STAFF,
      edition,
      isRejected: false,
      candidatedAt: new Date(),
    };
    return this.candidates.add(newCandidate);
  }

  async volunteer({ email }: Email): Promise<void> {
    const edition = Edition.current;

    const hasRejectedApplication = await this.candidates.isRejected(
      email,
      edition,
      VOLUNTEER,
    );
    if (hasRejectedApplication) throw new Rejected(VOLUNTEER);

    const isCandidate = await this.candidates.isCandidate(
      email,
      edition,
      VOLUNTEER,
    );
    if (isCandidate) throw new AlreadyCandidate(VOLUNTEER);

    const newCandidate: Candidate = {
      email,
      membership: VOLUNTEER,
      edition,
      isRejected: false,
      candidatedAt: new Date(),
    };
    return this.candidates.add(newCandidate);
  }
}
