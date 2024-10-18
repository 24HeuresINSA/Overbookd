import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { AlreadyRejected, AlreadyCandidate } from "./candidature.error.js";
import { Candidate, Candidates, Volunteer } from "./candidates.js";

export class ApplyFor {
  constructor(private readonly candidates: Candidates) {}

  async staff({ email }: Volunteer): Promise<void> {
    const edition = Edition.current;

    const isCandidate = await this.candidates.isCandidate(email, edition);
    if (isCandidate) throw new AlreadyCandidate(STAFF);

    const hasRejectedApplication = await this.candidates.hasRejectedApplication(
      email,
      edition,
    );
    if (hasRejectedApplication) throw new AlreadyRejected(STAFF);

    const newCandidate: Candidate = {
      email,
      membership: STAFF,
      edition,
      isRejected: false,
    };
    return this.candidates.add(newCandidate);
  }

  async volunteer({ email }: Volunteer): Promise<void> {
    const edition = Edition.current;

    const isCandidate = await this.candidates.isCandidate(email, edition);
    if (isCandidate) throw new AlreadyCandidate(VOLUNTEER);

    const hasRejectedApplication = await this.candidates.hasRejectedApplication(
      email,
      edition,
    );
    if (hasRejectedApplication) throw new AlreadyRejected(VOLUNTEER);

    const newCandidate: Candidate = {
      email,
      membership: VOLUNTEER,
      edition,
      isRejected: false,
    };
    return this.candidates.add(newCandidate);
  }
}
