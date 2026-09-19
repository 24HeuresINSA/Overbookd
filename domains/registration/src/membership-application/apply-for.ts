import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { AlreadyCandidate } from "./candidature.error.js";
import { Candidate, Candidates } from "./candidates.js";

export class ApplyFor {
  constructor(private readonly candidates: Candidates) {}

  async staff(id: Candidate["id"]): Promise<void> {
    const edition = Edition.current;

    const isCandidate = await this.candidates.isCandidate(id, edition, STAFF);
    if (isCandidate) throw new AlreadyCandidate(STAFF);

    const newCandidate: Candidate = {
      id,
      membership: STAFF,
      edition,
      isRejected: false,
      candidatedAt: new Date(),
    };
    return this.candidates.add(newCandidate);
  }

  async volunteer(id: Candidate["id"]): Promise<void> {
    const edition = Edition.current;

    const isCandidate = await this.candidates.isCandidate(
      id,
      edition,
      VOLUNTEER,
    );
    if (isCandidate) throw new AlreadyCandidate(VOLUNTEER);

    const newCandidate: Candidate = {
      id,
      membership: VOLUNTEER,
      edition,
      isRejected: false,
      candidatedAt: new Date(),
    };
    return this.candidates.add(newCandidate);
  }
}
